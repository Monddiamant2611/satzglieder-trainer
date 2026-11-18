import { useMemo, useRef, useState } from 'react'
import { TRAIN_AREAS, type AreaId } from '../data/areas'
import { TaskRenderer } from '../components/TaskRenderer'
import { TrainerProgress } from '../components/TrainerProgress'
import { buildRound, taskLabel } from '../lib/session'

type Props = {
  areaId: AreaId
  onComplete: (
    correct: number,
    total: number,
    byType: Record<string, { correct: number; total: number }>,
  ) => void
  onAbort: () => void
}

export function SessionPage({ areaId, onComplete, onAbort }: Props) {
  const area = TRAIN_AREAS.find((a) => a.id === areaId)!
  const items = useMemo(() => buildRound(areaId), [areaId])
  const [index, setIndex] = useState(0)
  const resultsRef = useRef<{ ok: boolean; type: string }[]>([])
  const [awaitingNext, setAwaitingNext] = useState(false)

  const item = items[index]

  const handleResult = (ok: boolean) => {
    resultsRef.current[index] = { ok, type: item.type }
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
          <button type="button" className="overview-link" onClick={onAbort}>
            Runde beenden
          </button>
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
