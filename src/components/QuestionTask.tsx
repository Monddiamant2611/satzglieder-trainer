import { useState } from 'react'
import { normalize } from '../lib/tokenize'
import { FeedbackPanel } from './FeedbackPanel'

type Item = { question: string; answer: string }

type Props = {
  prompt: string
  sentence: string
  items: Item[]
  soft?: boolean
  onResult: (ok: boolean) => void
  explainCorrect: string
  explainWrong: string
}

export function QuestionTask({
  prompt,
  sentence,
  items,
  soft,
  onResult,
  explainCorrect,
  explainWrong,
}: Props) {
  const [answers, setAnswers] = useState<string[]>(() => items.map(() => ''))
  const [checked, setChecked] = useState(false)
  const [ok, setOk] = useState(false)

  const check = () => {
    const match = items.every((it, i) => normalize(answers[i]) === normalize(it.answer))
    setOk(match)
    setChecked(true)
    onResult(match)
  }

  return (
    <div className="analysis-steps">
      <p className="instruction-note">{prompt}</p>
      <p className="prompt-sentence">{sentence}</p>
      <div className="foundations-check">
        {items.map((it, i) => (
          <label key={it.question} className="foundations-check-item">
            <span className="order-label">{it.question}</span>
            <input
              className="slot-input"
              style={{ maxWidth: '100%', width: '100%' }}
              value={answers[i]}
              disabled={checked}
              onChange={(e) => {
                const next = [...answers]
                next[i] = e.target.value
                setAnswers(next)
              }}
              placeholder="Antwort tippen…"
            />
            {checked ? (
              <span className="muted-note">
                {normalize(answers[i]) === normalize(it.answer) ? 'richtig' : 'noch nicht'}
              </span>
            ) : null}
          </label>
        ))}
      </div>
      <div className="exercise-actions">
        {!checked ? (
          <button
            type="button"
            className="primary-button"
            onClick={check}
            disabled={answers.some((a) => !a.trim())}
          >
            Prüfen
          </button>
        ) : null}
      </div>
      {checked ? (
        <FeedbackPanel
          variant={ok ? 'correct' : soft ? 'soft' : 'wrong'}
          title={ok ? 'Alles richtig!' : soft ? 'Fast' : 'Noch nicht'}
        >
          {ok ? explainCorrect : explainWrong}
        </FeedbackPanel>
      ) : null}
    </div>
  )
}
