import { TRAIN_AREAS, type AreaId } from '../data/areas'

type Props = {
  areaId: AreaId
  correct: number
  total: number
  byType: Record<string, { correct: number; total: number }>
  onAgain: () => void
  onTrainPath: () => void
  onHome: () => void
}

const TYPE_LABELS: Record<string, string> = {
  boundary: 'Satzglieder erkennen',
  move: 'Verschiebeprobe',
  predicate: 'Prädikat',
  subject: 'Subjekt',
  accusative: 'Akkusativobjekt',
  dative: 'Dativobjekt',
  both_objects: 'Objekte',
  adverbial: 'Adverbiale',
  full_analysis: 'Satzanalyse',
  wordclass: 'Wortart',
  error_analysis: 'Fehler finden',
}

export function CompletionPage({
  areaId,
  correct,
  total,
  byType,
  onAgain,
  onTrainPath,
  onHome,
}: Props) {
  const area = TRAIN_AREAS.find((a) => a.id === areaId)!
  const pct = total ? Math.round((correct / total) * 100) : 0

  return (
    <div className="content-completion">
      <div className="session-completion-card">
        <p className="eyebrow">Runde beendet</p>
        <h2>
          {area.title}: {pct} % richtig
        </h2>
        <p>
          {correct} von {total} Aufgaben gelöst.
        </p>
        <div className="completion-strip">
          <span>{correct} richtig</span>
          <span>{total - correct} noch üben</span>
        </div>

        <div className="completion-columns">
          <div className="completion-block">
            <h3>Nach Kompetenz</h3>
            <ul className="completion-stats">
              {Object.entries(byType).map(([type, s]) => (
                <li key={type}>
                  {TYPE_LABELS[type] ?? type}: {s.correct}/{s.total}
                </li>
              ))}
            </ul>
          </div>
          <div className="completion-block recommend-card">
            <p className="recommend-title">Tipp</p>
            <p className="muted-note">
              {pct >= 80
                ? 'Stark! Probiere den nächsten Bereich oder Gemischtes Training.'
                : 'Wiederhole diesen Bereich oder schau noch einmal in die Grundlagen.'}
            </p>
          </div>
        </div>

        <div className="home-card-actions">
          <button type="button" className="primary-button" onClick={onAgain}>
            Nochmal diese Runde
          </button>
          <button type="button" className="secondary-button" onClick={onTrainPath}>
            Andere Bereiche
          </button>
          <button type="button" className="ghost-button completion-home" onClick={onHome}>
            Startseite
          </button>
        </div>
      </div>
    </div>
  )
}
