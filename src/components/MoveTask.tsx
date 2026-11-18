import { useMemo, useState } from 'react'
import { sentencesEqual } from '../lib/tokenize'
import { FeedbackPanel } from './FeedbackPanel'

type Props = {
  groups: string[]
  verbIndexes: number[]
  validSentences: string[]
  prompt: string
  soft?: boolean
  onResult: (ok: boolean) => void
  explainCorrect: string
  explainWrong: string
  acceptOriginal?: boolean
  originalSentence?: string
}

function buildSentence(order: string[]): string {
  const words = order.join(' ')
  return words.endsWith('.') ? words : `${words}.`
}

export function MoveTask({
  groups,
  verbIndexes,
  validSentences,
  prompt,
  soft,
  onResult,
  explainCorrect,
  explainWrong,
  acceptOriginal = true,
  originalSentence,
}: Props) {
  const [order, setOrder] = useState(() => groups.map((_, i) => i))
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [ok, setOk] = useState(false)

  const verbSet = useMemo(() => new Set(verbIndexes), [verbIndexes])

  const currentGroups = order.map((i) => groups[i])
  const sentence = buildSentence(currentGroups)

  const moveToFront = (orderIndex: number) => {
    if (checked) return
    const groupId = order[orderIndex]
    if (verbSet.has(groupId)) return
    const without = order.filter((_, i) => i !== orderIndex)
    const verbs = without.filter((id) => verbSet.has(id))
    const rest = without.filter((id) => !verbSet.has(id))
    setOrder([groupId, ...verbs, ...rest])
    setPicked(null)
  }

  const selectBank = (orderIndex: number) => {
    if (checked) return
    const groupId = order[orderIndex]
    if (verbSet.has(groupId)) {
      setPicked(null)
      return
    }
    setPicked(picked === orderIndex ? null : orderIndex)
  }

  const check = () => {
    const candidates = [
      ...validSentences,
      ...(acceptOriginal && originalSentence ? [originalSentence] : []),
    ]
    const match = candidates.some((v) => sentencesEqual(v, sentence))
    setOk(match)
    setChecked(true)
    onResult(match)
  }

  const reset = () => {
    setOrder(groups.map((_, i) => i))
    setPicked(null)
    setChecked(false)
    setOk(false)
  }

  return (
    <div className="chunk-order">
      <p className="instruction-note">{prompt}</p>
      <p className="muted-note">
        Tippe ein Satzglied an (nicht das Verb) und dann „An den Anfang“. Alles funktioniert per
        Tippen.
      </p>

      <div className="order-label">Aktueller Satz</div>
      <div className="sentence-row order-sentence">
        <ul className="chunk-row">
          {currentGroups.map((g, i) => (
            <li key={`${g}-${i}`}>
              <button
                type="button"
                className={`sort-card ${picked === i ? 'active' : ''} ${
                  verbSet.has(order[i]) ? 'paired' : ''
                }`}
                onClick={() => selectBank(i)}
                disabled={checked}
              >
                {g}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="chunk-controls">
        <button
          type="button"
          className="secondary-button"
          disabled={checked || picked === null}
          onClick={() => picked !== null && moveToFront(picked)}
        >
          An den Anfang
        </button>
        <button type="button" className="ghost-button" disabled={checked} onClick={reset}>
          Ausgangssatz
        </button>
      </div>

      <div className="exercise-actions">
        {!checked ? (
          <button type="button" className="primary-button" onClick={check}>
            Prüfen
          </button>
        ) : (
          <button type="button" className="secondary-button" onClick={reset}>
            Nochmal verschieben
          </button>
        )}
      </div>

      {checked ? (
        <FeedbackPanel
          variant={ok ? 'correct' : soft ? 'soft' : 'wrong'}
          title={ok ? 'Gute Umsstellung!' : soft ? 'Probiere weiter' : 'So nicht'}
        >
          {ok ? explainCorrect : explainWrong}
          {!ok ? (
            <p className="muted-note" style={{ marginTop: 8 }}>
              Möglich z. B.: {validSentences[0]}
            </p>
          ) : null}
        </FeedbackPanel>
      ) : null}
    </div>
  )
}
