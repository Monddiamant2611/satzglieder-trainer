import { useMemo, useRef, useState } from 'react'
import { TRAIN_AREAS, type AreaId } from '../data/areas'
import { getTutorial } from '../data/tutorials'
import { TaskRenderer } from '../components/TaskRenderer'
import { TrainerProgress } from '../components/TrainerProgress'
import { AreaTutorial } from '../components/AreaTutorial'
import { RuleRefresh } from '../components/RuleRefresh'
import { buildRound, noteCorrectItem, noteWrongItem, taskLabel } from '../lib/session'
import {
  bumpRoundStarted,
  isTutorialComplete,
  markTutorialComplete,
  roundsStartedCount,
  type ProgressState,
} from '../lib/progress'

type Props = {
  areaId: AreaId
  progress: ProgressState
  forceTutorial?: boolean
  onProgress: (p: ProgressState) => void
  onComplete: (
    correct: number,
    total: number,
    byType: Record<string, { correct: number; total: number }>,
  ) => void
  onAbort: () => void
}

type Phase = 'tutorial' | 'refresh' | 'train'

export function SessionPage({
  areaId,
  progress,
  forceTutorial,
  onProgress,
  onComplete,
  onAbort,
}: Props) {
  const area = TRAIN_AREAS.find((a) => a.id === areaId)!
  const tutorial = getTutorial(areaId)
  const tutDone = isTutorialComplete(progress, areaId)
  const priorRounds = roundsStartedCount(progress, areaId)

  const initialPhase: Phase = forceTutorial || !tutDone ? 'tutorial' : priorRounds > 0 ? 'refresh' : 'train'

  const [phase, setPhase] = useState<Phase>(initialPhase)
  const items = useMemo(() => buildRound(areaId), [areaId])
  const [index, setIndex] = useState(0)
  const resultsRef = useRef<{ ok: boolean; type: string }[]>([])
  const [awaitingNext, setAwaitingNext] = useState(false)
  const roundCounted = useRef(false)

  const startTrain = () => {
    if (!roundCounted.current) {
      onProgress(bumpRoundStarted(areaId))
      roundCounted.current = true
    }
    setPhase('train')
  }

  if (phase === 'tutorial') {
    return (
      <AreaTutorial
        tutorial={tutorial}
        onExit={onAbort}
        onFinished={() => {
          onProgress(markTutorialComplete(areaId))
          startTrain()
        }}
      />
    )
  }

  if (phase === 'refresh') {
    return (
      <RuleRefresh
        tutorial={tutorial}
        onContinue={startTrain}
        onSkip={startTrain}
        onOpenTutorial={() => setPhase('tutorial')}
      />
    )
  }

  const item = items[index]

  const handleResult = (ok: boolean) => {
    resultsRef.current[index] = { ok, type: item.type }
    const raw = item.data as { id?: string; word?: string; class?: string }
    const id =
      raw.id ??
      (raw.word && raw.class ? `wordclass:${raw.word}:${raw.class}` : undefined)
    if (ok) noteCorrectItem(id)
    else noteWrongItem(id)
    setAwaitingNext(true)
  }

  const summarize = () => {
    const rows = resultsRef.current.filter(Boolean)
    const correct = rows.filter((r) => r.ok).length
    const byType: Record<string, { correct: number; total: number }> = {}
    for (const r of rows) {
      const cur = byType[r.type] ?? { correct: 0, total: 0 }
      byType[r.type] = {
        correct: cur.correct + (r.ok ? 1 : 0),
        total: cur.total + 1,
      }
    }
    onComplete(correct, items.length, byType)
  }

  if (!item) {
    return (
      <div className="empty-state">
        <p>Keine Aufgaben in diesem Bereich.</p>
        <button type="button" className="secondary-button" onClick={onAbort}>
          Zurück
        </button>
      </div>
    )
  }

  return (
    <div className="content-task">
      <div className="exercise-card">
        <div className="exercise-top">
          <p className="eyebrow">
            {area.number}. {area.title}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button type="button" className="overview-link" onClick={() => setPhase('tutorial')}>
              Tutorial
            </button>
            <button type="button" className="overview-link" onClick={onAbort}>
              Runde beenden
            </button>
          </div>
        </div>
        <TrainerProgress
          current={index}
          total={items.length}
          accent={area.accent === 'orange' ? 'sage' : area.accent}
        />
        <div className="exercise-header">
          <p className="task-kicker">{taskLabel(item)}</p>
          <h2>{area.title}</h2>
        </div>
        <div className="exercise-input">
          <TaskRenderer key={`${areaId}-${index}`} item={item} onResult={handleResult} />
        </div>
        {awaitingNext ? (
          <div className="exercise-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                if (index >= items.length - 1) summarize()
                else {
                  setIndex(index + 1)
                  setAwaitingNext(false)
                }
              }}
            >
              {index >= items.length - 1 ? 'Zur Auswertung' : 'Nächste Aufgabe'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
