type Props = {
  variant: 'hint' | 'correct' | 'wrong' | 'soft'
  level?: 1 | 2 | 3 | 4
  title?: string
  children: React.ReactNode
}

export function FeedbackPanel({ variant, level = 1, title, children }: Props) {
  if (variant === 'hint' || variant === 'soft') {
    return (
      <div className={`hint-banner hint-level-${level}`} role="status">
        {title ? <span className="hint-label">{title}</span> : null}
        <div>{children}</div>
      </div>
    )
  }
  return (
    <div
      className={`feedback-banner ${variant === 'correct' ? 'correct' : 'wrong'}`}
      role="status"
    >
      {title ? <span className="feedback-status">{title}</span> : null}
      <div>{children}</div>
    </div>
  )
}
