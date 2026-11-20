import { useState } from 'react'
import type { AreaTutorial as AreaTutorialData } from '../data/tutorials'
import { TutorialExercise } from './TutorialExercise'

type Props = {
  tutorial: AreaTutorialData
  onFinished: () => void
  onExit: () => void
}

export function AreaTutorial({ tutorial, onFinished, onExit }: Props) {
  const steps = tutorial.steps
  const [stepIndex, setStepIndex] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [passed, setPassed] = useState(false)
  const [answeredWrong, setAnsweredWrong] = useState(false)

  const step = steps[stepIndex]
  const total = steps.length
  const last = stepIndex >= total - 1
  const progressPct = Math.round(((stepIndex + (passed ? 1 : 0)) / total) * 100)

  const goTo = (i: number) => {
    setStepIndex(i)
    setAttempt((a) => a + 1)
    setPassed(false)
    setAnsweredWrong(false)
  }

  const replay = () => goTo(0)

  if (!step) return null

  return (
    <div className="content-knowledge tutorial-flow">
      <div className="exercise-top">
        <p className="eyebrow">Tutorial · {tutorial.title}</p>
        <button type="button" className="overview-link" onClick={onExit}>
          Schließen
        </button>
      </div>

      <div className="tutorial-progress" aria-label="Fortschritt">
        <div className="tutorial-progress-track">
          <div className="tutorial-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="muted-note tutorial-progress-label">
          Schritt {stepIndex + 1} von {total}
        </p>
        <ol className="tutorial-dots" aria-hidden>
          {steps.map((s, i) => (
            <li
              key={s.id}
              className={
                i < stepIndex ? 'done' : i === stepIndex ? (passed ? 'done' : 'current') : ''
              }
            />
          ))}
        </ol>
      </div>

      <div className="learning-card learning-card--roomy" style={{ marginTop: 12 }}>
        <p className="task-kicker">Schritt {stepIndex + 1}</p>
        <h1 style={{ fontSize: 'var(--fs-h2)', marginBottom: 8 }}>{step.title}</h1>

        <p className="intro-lead" style={{ marginBottom: 14 }}>
          {step.explanation}
        </p>

        <div className="merke-card" style={{ marginBottom: 16 }}>
          <p className="merke-label">Beispiel</p>
          <p className="prompt-sentence" style={{ margin: '0.35rem 0' }}>
            {step.example.sentence}
          </p>
          <p className="merke-text">{step.example.note}</p>
        </div>

        <div className="tutorial-exercise-block">
          <TutorialExercise
            exercise={step.exercise}
            exerciseKey={`${step.id}-${attempt}`}
            feedbackCorrect={step.feedbackCorrect}
            feedbackWrong={step.feedbackWrong}
            onResult={(ok) => {
              if (ok) {
                setPassed(true)
                setAnsweredWrong(false)
              } else {
                setPassed(false)
                setAnsweredWrong(true)
              }
            }}
          />
        </div>

        {answeredWrong && !passed ? (
          <div className="intro-actions" style={{ marginTop: 12 }}>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setAttempt((a) => a + 1)
                setAnsweredWrong(false)
              }}
            >
              Noch einmal versuchen
            </button>
          </div>
        ) : null}

        <div className="intro-actions tutorial-nav" style={{ marginTop: 20 }}>
          <button
            type="button"
            className="ghost-button"
            onClick={replay}
            disabled={stepIndex === 0 && !passed && !answeredWrong}
          >
            Von vorn
          </button>
          {stepIndex > 0 ? (
            <button
              type="button"
              className="secondary-button"
              onClick={() => goTo(stepIndex - 1)}
            >
              Zurück
            </button>
          ) : null}
          <button
            type="button"
            className="primary-button"
            disabled={!passed}
            onClick={() => {
              if (last) onFinished()
              else goTo(stepIndex + 1)
            }}
          >
            {last ? 'Tutorial fertig · Training starten' : 'Weiter'}
          </button>
        </div>

        {!passed ? (
          <p className="muted-note" style={{ marginTop: 10 }}>
            Löse die Mini-Übung, um den nächsten Schritt freizuschalten.
          </p>
        ) : null}
      </div>
    </div>
  )
}
