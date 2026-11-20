import { useMemo, useState } from 'react'
import type { RoleId } from '../data/roles'
import { FeedbackPanel } from './FeedbackPanel'
import { WordToken } from './WordToken'

export type Constituent = {
  text: string
  start: number
  end: number
  role: RoleId
  tokenIndexes?: number[]
}

type Props = {
  sentence: string
  tokens: string[]
  constituents: Constituent[]
  predicateParts: number[]
  onResult: (ok: boolean) => void
}

const STEPS: { key: string; title: string; roles: RoleId[]; prompt: string }[] = [
  {
    key: 'pred',
    title: 'Prädikat',
    roles: ['predicate'],
    prompt: 'Markiere alle Teile des Prädikats.',
  },
  {
    key: 'subj',
    title: 'Subjekt',
    roles: ['subject'],
    prompt: 'Markiere das Subjekt (Wer oder was?).',
  },
  {
    key: 'obj',
    title: 'Objekte',
    roles: ['object_dative', 'object_accusative'],
    prompt: 'Markiere Dativ- und/oder Akkusativobjekt, falls vorhanden.',
  },
  {
    key: 'adv',
    title: 'Adverbiale',
    roles: [
      'adverbial_temporal',
      'adverbial_lokal',
      'adverbial_kausal',
      'adverbial_modal',
    ],
    prompt: 'Markiere adverbiale Bestimmungen (Wann/Wo/Warum/Wie).',
  },
]

function indexesForConstituent(c: Constituent): number[] {
  if (c.tokenIndexes?.length) return c.tokenIndexes
  const out: number[] = []
  for (let i = c.start; i <= c.end; i++) out.push(i)
  return out
}

export function FullAnalysisTask({
  sentence,
  tokens,
  constituents,
  predicateParts,
  onResult,
}: Props) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [stepOk, setStepOk] = useState<(boolean | null)[]>(() => STEPS.map(() => null))
  const [finished, setFinished] = useState(false)

  const current = STEPS[step]
  const targetIndexes = useMemo(() => {
    const set = new Set<number>()
    for (const c of constituents) {
      if (current.roles.includes(c.role)) {
        indexesForConstituent(c).forEach((i) => set.add(i))
      }
    }
    if (current.key === 'pred') predicateParts.forEach((i) => set.add(i))
    return [...set].sort((a, b) => a - b)
  }, [constituents, current, predicateParts])

  const toggle = (i: number) => {
    if (stepOk[step] !== null) return
    setSelected((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i].sort((a, b) => a - b),
    )
  }

  const checkStep = () => {
    const a = new Set(selected)
    const b = new Set(targetIndexes)
    const match = a.size === b.size && [...a].every((x) => b.has(x))
    const next = [...stepOk]
    next[step] = match
    setStepOk(next)
  }

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      setSelected([])
    } else {
      const allOk = stepOk.every((v) => v === true)
      setFinished(true)
      onResult(!!allOk)
    }
  }

  if (finished) {
    const allOk = stepOk.every((v) => v === true)
    return (
      <div className="analysis-steps">
        <FeedbackPanel
          variant={allOk ? 'correct' : 'wrong'}
          title={allOk ? 'Analyse vollständig!' : 'Analyse beendet'}
        >
          {allOk
            ? 'Alle Schritte waren richtig.'
            : 'Mindestens ein Schritt stimmte nicht – übe die Reihenfolge: Prädikat → Subjekt → Objekte → Adverbiale.'}
        </FeedbackPanel>
        <ul className="practice-hint-list" style={{ marginTop: 12 }}>
          {STEPS.map((s, i) => (
            <li key={s.key}>
              {s.title}: {stepOk[i] ? 'richtig' : 'noch üben'}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const checked = stepOk[step] !== null
  const ok = stepOk[step] === true

  return (
    <div className="analysis-steps">
      <p className="analysis-step-progress">
        Schritt {step + 1} von {STEPS.length}: {current.title}
      </p>
      <p className="instruction-note">{current.prompt}</p>
      <p className="muted-note">{sentence}</p>
      <div className="token-sentence">
        {tokens.map((t, i) => (
          <WordToken
            key={i}
            text={t}
            selected={selected.includes(i)}
            disabled={checked}
            onClick={() => toggle(i)}
          />
        ))}
      </div>
      <div className="exercise-actions">
        {!checked ? (
          <button
            type="button"
            className="primary-button"
            onClick={checkStep}
            disabled={targetIndexes.length > 0 && selected.length === 0}
          >
            Schritt prüfen
          </button>
        ) : (
          <button type="button" className="primary-button" onClick={goNext}>
            {step < STEPS.length - 1 ? 'Weiter' : 'Auswertung'}
          </button>
        )}
        {!checked && targetIndexes.length === 0 ? (
          <button type="button" className="secondary-button" onClick={checkStep}>
            Keines vorhanden
          </button>
        ) : null}
      </div>
      {checked ? (
        <FeedbackPanel variant={ok ? 'correct' : 'wrong'} title={ok ? 'Stimmt!' : 'Noch nicht'}>
          {ok
            ? 'Weiter zum nächsten Schritt.'
            : 'Prüfe die Frage dieses Schritts noch einmal und markiere die ganze Gruppe.'}
        </FeedbackPanel>
      ) : null}
    </div>
  )
}
