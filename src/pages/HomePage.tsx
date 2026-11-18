import { TRAIN_AREAS } from '../data/areas'
import { FOUNDATION_TOTAL } from '../data/foundations'
import { areaPercent, type ProgressState } from '../lib/progress'

type Props = {
  progress: ProgressState
  onStartFoundations: () => void
  onOpenTrain: () => void
  onOpenProgress: () => void
  onStartArea: (id: (typeof TRAIN_AREAS)[number]['id']) => void
}

export function HomePage({
  progress,
  onStartFoundations,
  onOpenTrain,
  onOpenProgress,
  onStartArea,
}: Props) {
  const step = Math.min(progress.foundationsStep, FOUNDATION_TOTAL)

  return (
    <div className="home-page">
      <header className="home-header page-header">
        <p className="eyebrow">Klasse 6 · Deutsch</p>
        <h1>Satzglieder-Trainer</h1>
        <p>Lerne Satzglieder kennen und trainiere Grenzen, Proben und Bestimmungen.</p>
      </header>

      <section className="home-hero-card home-card accent-orange">
        <p className="eyebrow">Level 0</p>
        <h2>Grundlagen kennenlernen</h2>
        <p>
          Starte hier, wenn Satzglieder für dich noch neu sind. Du darfst ausprobieren – es gibt
          keine Punkte.
        </p>
        <p className="home-points">
          {progress.foundationsCompleted
            ? 'Grundlagen abgeschlossen – jederzeit wiederholbar'
            : step > 0
              ? `Fortschritt: Schritt ${step} von ${FOUNDATION_TOTAL}`
              : `10 Module · Schritt-Zähler ohne Punkte`}
        </p>
        <div className="home-card-actions">
          <button type="button" className="primary-button" onClick={onStartFoundations}>
            {step > 0 && !progress.foundationsCompleted ? 'Weiterlernen' : "Los geht's"}
          </button>
        </div>
      </section>

      <section className="home-card">
        <h2>Trainieren</h2>
        <p>Gezielte Übungen mit Auswertung nach Kompetenz.</p>
        <div className="home-quick">
          {TRAIN_AREAS.slice(0, 3).map((a) => (
            <button
              key={a.id}
              type="button"
              className="home-quick-card"
              onClick={() => onStartArea(a.id)}
            >
              <strong>
                {a.number}. {a.title}
              </strong>
              <span>{a.blurb}</span>
            </button>
          ))}
        </div>
        <div className="home-card-actions">
          <button type="button" className="secondary-button" onClick={onOpenTrain}>
            Alle Übungsbereiche
          </button>
          <button type="button" className="ghost-button" onClick={onOpenProgress}>
            Fortschritt
          </button>
        </div>
      </section>

      <section className="home-progress-card home-card">
        <h2>Kurzstand</h2>
        <div className="home-progress-grid">
          {(['boundary', 'predicate', 'adverbial'] as const).map((id, i) => {
            const area = TRAIN_AREAS.find((a) => a.id === id)!
            const pct = areaPercent(progress.areas[id])
            const accent = (['sage', 'sky', 'rose'] as const)[i]
            return (
              <div key={id} className={`home-progress-item accent-${accent}`}>
                <h2>{area.title}</h2>
                <p className="home-stat-value">{pct === null ? '—' : `${pct} %`}</p>
                <div className={`progress-bar accent-${accent}`}>
                  <span style={{ width: `${pct ?? 0}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
