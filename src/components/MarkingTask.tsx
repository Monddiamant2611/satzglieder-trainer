import { useMemo, useState } from 'react'
import { findPhraseSpan } from '../lib/tokenize'
import { SentenceDisplay } from './SentenceDisplay'
import { FeedbackPanel } from './FeedbackPanel'

type Props = {
  sentence: string
  targetPhrases: string[]
  targetIndexes?: number[]
  prompt: string
  soft?: boolean
  onResult: (ok: boolean) => void
  explainCorrect: string
  explainWrong: string
}

function indexesForPhrases(sentence: string, phrases: string[]): number[] {
  const set = new Set<number>()
  for (const p of phrases) {
    const span = findPhraseSpan(sentence, p)
    if (span) span.wordIndexes.forEach((i) => set.add(i))
  }
  return [...set].sort((a, b) => a - b)
}

export function MarkingTask({
  sentence,
  targetPhrases,
  targetIndexes,
  prompt,
  soft,
  onResult,
  explainCorrect,
  explainWrong,
}: Props) {
  const targets = useMemo(
    () => targetIndexes ?? indexesForPhrases(sentence, targetPhrases),
    [sentence, targetPhrases, targetIndexes],
  )
  const [selected, setSelected] = useState<number[]>([])
  const [checked, setChecked] = useState(false)
  const [ok, setOk] = useState(false)

  const toggle = (i: number) => {
    if (checked) return
    setSelected((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i].sort((a, b) => a - b),
    )
  }

  const check = () => {
    const a = new Set(selected)
    const b = new Set(targets)
    const match = a.size === b.size && [...a].every((x) => b.has(x))
    setOk(match)
    setChecked(true)
    onResult(match)
  }

  return (
    <div className="token-mark">
      <p className="instruction-note">{prompt}</p>
      <SentenceDisplay
        sentence={sentence}
        selectedIndexes={selected}
        interactive
        onToggle={toggle}
        disabled={checked}
      />
      <div className="exercise-actions">
        {!checked ? (
          <>
            <button
              type="button"
              className="primary-button"
              onClick={check}
              disabled={!selected.length}
            >
              Prüfen
            </button>
            <button
              type="button"
              className="ghost-button reset-inline"
              onClick={() => setSelected([])}
            >
              Zurücksetzen
            </button>
          </>
        ) : null}
      </div>
      {checked ? (
        <FeedbackPanel
          variant={ok ? 'correct' : soft ? 'soft' : 'wrong'}
          title={ok ? 'Stimmt!' : soft ? 'Noch nicht' : 'Nicht ganz'}
        >
          {ok ? explainCorrect : explainWrong}
        </FeedbackPanel>
      ) : null}
    </div>
  )
}
