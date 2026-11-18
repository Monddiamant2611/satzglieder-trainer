import { TRAIN_AREAS } from '../data/areas'
import { FOUNDATION_TOTAL } from '../data/foundations'
import { areaPercent, type ProgressState } from '../lib/progress'

type Props = {
  progress: ProgressState
  onBack: () => void
}

export function ProgressPage({ progress, onBack }: Props) {
  return (
    <div className="progress-page">
      <header className="page-header">
        <p className="eyebrow">Übersicht</p>
        <h1>Fortschritt</h1>
        <p>Grundlagen ohne Punkte · Training nach Kompetenz.</p>
      </header>
      <button type="button" className="ghost-button" onClick={onBack}>
        Zurück
      </button>

      <section className="home-card foundations-progress-card" style={{ marginTop: 16 }}>
        <h2>Grundlagen</h2>
        <p>
          {progress.foundationsCompleted
            ? `Abgeschlossen (${FOUNDATION_TOTAL}/${FOUNDATION_TOTAL})`
            : `Schritt ${Math.min(progress.foundationsStep, FOUNDATION_TOTAL)} von ${FOUNDATION_TOTAL}`}
        </p>
        <div className="progress-bar accent-sage">
          <span
            style={{
              width: `${Math.round(
                (Math.min(progress.foundationsStep, FOUNDATION_TOTAL) / FOUNDATION_TOTAL) * 100,
              )}%`,
            }}
          />
        </div>
      </section>

      <div className="module-grid" style={{ marginTop: 24 }}>
        {TRAIN_AREAS.map((a) => {
          const stats = progress.areas[a.id]
          const pct = areaPercent(stats)
          return (
            <article key={a.id} className="module-card learning-card">
              <h3>
                {a.number}. {a.title}
              </h3>
              <p className="home-stat-value">{pct === null ? 'Noch offen' : `${pct} %`}</p>
              <div className={`progress-bar accent-${a.accent === 'orange' ? 'sage' : a.accent}`}>
                <span style={{ width: `${pct ?? 0}%` }} />
              </div>
              {stats ? (
                <p className="muted-note">
                  {stats.correct}/{stats.attempts} richtig insgesamt
                </p>
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}
