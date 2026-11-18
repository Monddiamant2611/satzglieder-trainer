type Props = {
  current: number
  total: number
  label?: string
  accent?: 'sage' | 'sky' | 'rose' | 'violet'
}

export function TrainerProgress({ current, total, label, accent = 'sage' }: Props) {
  const pct = total ? Math.round((current / total) * 100) : 0
  return (
    <div>
      <p className="session-progress">
        {label ?? `Aufgabe ${Math.min(current + 1, total)} von ${total}`}
      </p>
      <div className={`progress-bar accent-${accent}`} aria-hidden>
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
