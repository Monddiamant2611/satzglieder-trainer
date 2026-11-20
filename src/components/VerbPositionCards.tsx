import { VERB_POSITION_META, type VerbPositionId } from '../data/verbPosition'

const ORDER: VerbPositionId[] = ['verberst', 'verbzweit', 'verbletzt']

type Props = {
  /** Compact list for refresh screens */
  compact?: boolean
}

export function VerbPositionCards({ compact }: Props) {
  return (
    <div className={compact ? 'verb-pos-grid verb-pos-grid--compact' : 'verb-pos-grid'}>
      {ORDER.map((id) => {
        const m = VERB_POSITION_META[id]
        return (
          <article key={id} className="merke-card verb-pos-card">
            <p className="merke-label">{m.term}</p>
            <p className="merke-text" style={{ marginBottom: compact ? 0 : 8 }}>
              <strong>{m.short}.</strong> {compact ? m.tip : m.definition}
            </p>
            {!compact ? <p className="muted-note">{m.tip}</p> : null}
          </article>
        )
      })}
    </div>
  )
}
