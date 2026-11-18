import { TRAIN_AREAS, type AreaId } from '../data/areas'
import { areaPercent, type ProgressState } from '../lib/progress'

type Props = {
  progress: ProgressState
  onStart: (id: AreaId) => void
  onBack: () => void
}

export function TrainPathPage({ progress, onStart, onBack }: Props) {
  return (
    <div className="path-page">
      <header className="page-header">
        <p className="eyebrow">Trainieren</p>
        <h1>Übungsbereiche</h1>
        <p>Wähle einen Bereich. Gemischtes Training enthält auch Fehlerfinden und Wortarten.</p>
      </header>
      <div className="path-actions">
        <button type="button" className="ghost-button" onClick={onBack}>
          Zur Startseite
        </button>
      </div>
      <div className="path-grid module-grid">
        {TRAIN_AREAS.map((a) => {
          const pct = areaPercent(progress.areas[a.id])
          return (
            <article key={a.id} className="path-card module-card">
              <div className={`path-number accent-${a.accent}`}>{a.number}</div>
              <div className="path-card-body">
                <h3>{a.title}</h3>
                <p>{a.blurb}</p>
                {pct !== null ? (
                  <span className="status-chip">Zuletzt {pct} % richtig</span>
                ) : (
                  <span className="lock-hint">Noch nicht trainiert</span>
                )}
                <button type="button" className="primary-button" onClick={() => onStart(a.id)}>
                  Runde starten
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
