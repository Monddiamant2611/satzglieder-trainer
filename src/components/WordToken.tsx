type Props = {
  text: string
  selected?: boolean
  solution?: boolean
  wrong?: boolean
  missed?: boolean
  disabled?: boolean
  roleStyle?: { bg: string; deep: string } | null
  onClick?: () => void
  as?: 'button' | 'span'
}

export function WordToken({
  text,
  selected,
  solution,
  wrong,
  missed,
  disabled,
  roleStyle,
  onClick,
  as = 'button',
}: Props) {
  const className = [
    'token-chip',
    selected ? 'selected' : '',
    solution ? 'solution' : '',
    wrong ? 'mismatch' : '',
    missed ? 'missed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const style = roleStyle
    ? {
        background: roleStyle.bg,
        borderColor: roleStyle.deep,
        borderWidth: 2,
        borderStyle: 'solid' as const,
      }
    : undefined

  if (as === 'span' || !onClick) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    )
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      {text}
    </button>
  )
}
