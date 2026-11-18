import { useMemo, useState } from 'react'
import { tokenize, isPunctuation, normalize, wordsOnly } from '../lib/tokenize'
import { FeedbackPanel } from './FeedbackPanel'

type Props = {
  sentence: string
  groups: string[]
  prompt: string
  soft?: boolean
  onResult: (ok: boolean) => void
  explainCorrect: string
  explainWrong: string
}

/**
 * Boundary task: tap words to place/remove split markers between them.
 * Groups are contiguous word spans that must match the solution.
 */
export function SentenceSplitter({
  sentence,
  groups,
  prompt,
  soft,
  onResult,
  explainCorrect,
  explainWrong,
}: Props) {
  const tokens = useMemo(() => tokenize(sentence), [sentence])
  const wordPositions = useMemo(
    () => tokens.map((t, i) => (!isPunctuation(t) ? i : -1)).filter((i) => i >= 0),
    [tokens],
  )
  const wordCount = wordPositions.length

  // splitsAfter[i] = true means boundary after word i (0..wordCount-2)
  const [splitsAfter, setSplitsAfter] = useState<boolean[]>(() =>
    Array.from({ length: Math.max(0, wordCount - 1) }, () => false),
  )
  const [checked, setChecked] = useState(false)
  const [ok, setOk] = useState(false)

  const solutionSplits = useMemo(() => {
    const flags = Array.from({ length: Math.max(0, wordCount - 1) }, () => false)
    let cursor = 0
    for (let g = 0; g < groups.length - 1; g++) {
      const len = wordsOnly(tokenize(groups[g])).length
      cursor += len
      if (cursor - 1 < flags.length) flags[cursor - 1] = true
    }
    return flags
  }, [groups, wordCount])

  const toggleSplit = (afterWord: number) => {
    if (checked) return
    setSplitsAfter((prev) => {
      const next = [...prev]
      next[afterWord] = !next[afterWord]
      return next
    })
  }

  const derivedGroups = () => {
    const words = wordPositions.map((i) => tokens[i])
    const out: string[] = []
    let buf: string[] = []
    for (let i = 0; i < words.length; i++) {
      buf.push(words[i])
      if (i < splitsAfter.length && splitsAfter[i]) {
        out.push(buf.join(' '))
        buf = []
      }
    }
    if (buf.length) out.push(buf.join(' '))
    return out
  }

  const check = () => {
    const mine = derivedGroups().map((g) => normalize(g))
    const target = groups.map((g) => normalize(g))
    const match =
      mine.length === target.length && mine.every((g, i) => g === target[i])
    setOk(match)
    setChecked(true)
    onResult(match)
  }

  return (
    <div className="chunk-order">
      <p className="instruction-note">{prompt}</p>
      <p className="muted-note">
        Tippe auf die Lücke zwischen Wörtern, um eine Grenze zu setzen oder zu entfernen.
      </p>

      <div className="token-sentence" style={{ gap: 4 }}>
        {wordPositions.map((ti, wi) => (
          <span key={ti} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span className="token-chip" style={{ cursor: 'default' }}>
              {tokens[ti]}
            </span>
            {wi < wordCount - 1 ? (
              <button
                type="button"
                className="ghost-button"
                style={{
                  minWidth: 28,
                  minHeight: 44,
                  padding: '0 4px',
                  fontWeight: 700,
                  color: splitsAfter[wi] || (checked && solutionSplits[wi])
                    ? 'var(--accent-deep)'
                    : 'var(--line-strong)',
                  border: splitsAfter[wi]
                    ? '2px solid var(--accent)'
                    : '1px dashed var(--line-strong)',
                  borderRadius: 8,
                  background: splitsAfter[wi] ? 'var(--warn-bg)' : 'transparent',
                }}
                aria-label={`Grenze nach „${tokens[ti]}“`}
                disabled={checked}
                onClick={() => toggleSplit(wi)}
              >
                {splitsAfter[wi] ? '|' : '·'}
              </button>
            ) : null}
          </span>
        ))}
      </div>

      <div className="exercise-actions">
        {!checked ? (
          <>
            <button type="button" className="primary-button" onClick={check}>
              Prüfen
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={() =>
                setSplitsAfter(Array.from({ length: wordCount - 1 }, () => false))
              }
            >
              Zurücksetzen
            </button>
          </>
        ) : null}
      </div>

      {checked ? (
        <FeedbackPanel
          variant={ok ? 'correct' : soft ? 'soft' : 'wrong'}
          title={ok ? 'Grenzen stimmen!' : soft ? 'Schau die Gruppen an' : 'Andere Grenzen'}
        >
          {ok ? explainCorrect : explainWrong}
          {!ok ? (
            <p className="muted-note" style={{ marginTop: 8 }}>
              Lösung: {groups.join(' | ')}
            </p>
          ) : null}
        </FeedbackPanel>
      ) : null}
    </div>
  )
}
