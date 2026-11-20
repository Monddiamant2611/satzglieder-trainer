import type { AreaTutorial } from '../data/tutorials'
import { VerbPositionCards } from './VerbPositionCards'

type Props = {
  tutorial: AreaTutorial
  onContinue: () => void
  onOpenTutorial: () => void
  onSkip: () => void
}

export function RuleRefresh({ tutorial, onContinue, onOpenTutorial, onSkip }: Props) {
  return (
    <div className="content-task">
      <div className="exercise-card">
        <p className="eyebrow">Kurz auffrischen</p>
        <h2>{tutorial.title}</h2>
        <p className="instruction-note">{tutorial.goal}</p>
        <ul className="practice-hint-list">
          {tutorial.refreshBullets.map((b) => (
            <li key={b}>
              <strong>{b}</strong>
            </li>
          ))}
        </ul>
        {tutorial.showVerbPositions ? (
          <div style={{ marginTop: 12, marginBottom: 8 }}>
            <VerbPositionCards compact />
          </div>
        ) : null}
        <div className="exercise-actions">
          <button type="button" className="primary-button" onClick={onContinue}>
            Runde starten
          </button>
          <button type="button" className="secondary-button" onClick={onSkip}>
            Überspringen
          </button>
          <button type="button" className="ghost-button" onClick={onOpenTutorial}>
            Ganzes Tutorial öffnen
          </button>
        </div>
      </div>
    </div>
  )
}
