import { useState } from 'react'
import type { AreaTutorial } from '../data/tutorials'

type Props = {
  tutorial: AreaTutorial
  onFinished: () => void
  onExit: () => void
}

const PHASE_LABEL: Record<string, string> = {
  wissen: 'Phase 1 · Wissen auffrischen',
  gemeinsam: 'Phase 2 · Gemeinsam ausprobieren',
  selbst: 'Phase 3 · Selbstständig trainieren',
}

export function AreaTutorial({ tutorial, onFinished, onExit }: Props) {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const phase = tutorial.phases[phaseIndex]
  const last = phaseIndex >= tutorial.phases.length - 1

  return (
    <div className="content-knowledge">
      <div className="exercise-top">
        <p className="eyebrow">Tutorial · {tutorial.title}</p>
        <button type="button" className="overview-link" onClick={onExit}>
          Schließen
        </button>
      </div>
      <div className="learning-card learning-card--roomy" style={{ marginTop: 12 }}>
        <p className="task-kicker">{PHASE_LABEL[phase.id]}</p>
        <h1 style={{ fontSize: 'var(--fs-h2)', marginBottom: 8 }}>{phase.title}</h1>
        <p className="intro-lead" style={{ marginBottom: 16 }}>
          <strong>Lernziel:</strong> {tutorial.goal}
        </p>

        {phase.sections.map((s) => (
          <section key={s.heading} style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 6 }}>{s.heading}</h3>
            <ul className="practice-hint-list">
              {s.body.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))}

        {phase.example ? (
          <div className="merke-card" style={{ marginTop: 8 }}>
            <p className="merke-label">Beispiel</p>
            <p className="prompt-sentence" style={{ margin: '0.35rem 0' }}>
              {phase.example.sentence}
            </p>
            <p className="merke-text">{phase.example.note}</p>
          </div>
        ) : null}

        <div className="intro-actions" style={{ marginTop: 20 }}>
          {phaseIndex > 0 ? (
            <button
              type="button"
              className="secondary-button"
              onClick={() => setPhaseIndex((i) => i - 1)}
            >
              Zurück
            </button>
          ) : null}
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              if (last) onFinished()
              else setPhaseIndex((i) => i + 1)
            }}
          >
            {last ? 'Tutorial abschließen & trainieren' : 'Weiter'}
          </button>
        </div>
      </div>
    </div>
  )
}
