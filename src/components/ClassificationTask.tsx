import { useState } from 'react'
import { FeedbackPanel } from './FeedbackPanel'

type Choice = { id: string; label: string }

type Props = {
  prompt: string
  sentence?: string
  highlight?: string
  choices: Choice[]
  correctId: string
  soft?: boolean
  onResult: (ok: boolean) => void
  explainCorrect: string
  explainWrong: string
}

export function ClassificationTask({
  prompt,
  sentence,
  highlight,
  choices,
  correctId,
  soft,
  onResult,
  explainCorrect,
  explainWrong,
}: Props) {
  const [picked, setPicked] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const ok = picked === correctId

  const check = () => {
    if (!picked) return
    setChecked(true)
    onResult(picked === correctId)
  }

  return (
    <div className="compare-panel">
      <p className="instruction-note">{prompt}</p>
      {sentence ? (
        <p className="prompt-sentence">
          {highlight
            ? sentence.split(highlight).reduce<React.ReactNode[]>((acc, part, i, arr) => {
                acc.push(part)
                if (i < arr.length - 1) {
                  acc.push(
                    <mark
                      key={i}
                      style={{
                        background: 'var(--sage-bg)',
                        padding: '0 .15em',
                        borderRadius: 4,
                      }}
                    >
                      {highlight}
                    </mark>,
                  )
                }
                return acc
              }, [])
            : sentence}
        </p>
      ) : null}

      <div className="choice-list" role="listbox" aria-label="Auswahl">
        {choices.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`choice-option ${picked === c.id ? 'selected' : ''} ${
              checked && c.id === correctId ? 'solution' : ''
            }`}
            onClick={() => !checked && setPicked(c.id)}
            disabled={checked}
          >
            <span className="choice-radio" aria-hidden />
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <div className="exercise-actions">
        {!checked ? (
          <button type="button" className="primary-button" disabled={!picked} onClick={check}>
            Prüfen
          </button>
        ) : null}
      </div>

      {checked ? (
        <FeedbackPanel
          variant={ok ? 'correct' : soft ? 'soft' : 'wrong'}
          title={ok ? 'Richtig!' : soft ? 'Schau nochmal' : 'Leider nein'}
        >
          {ok ? explainCorrect : explainWrong}
        </FeedbackPanel>
      ) : null}
    </div>
  )
}
