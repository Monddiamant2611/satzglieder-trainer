import { ROLE_META, type RoleId } from '../data/roles'

type Props = {
  text: string
  role?: RoleId | null
  selected?: boolean
  showRole?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function ConstituentToken({
  text,
  role,
  selected,
  showRole,
  onClick,
  disabled,
}: Props) {
  const meta = role ? ROLE_META[role] : null
  const style = meta
    ? {
        background: meta.bg,
        borderColor: meta.deep,
        borderWidth: 2,
        borderStyle: 'solid' as const,
      }
    : undefined

  return (
    <button
      type="button"
      className={`sort-card ${selected ? 'active' : ''} ${meta ? 'role-chip' : ''}`}
      style={style}
      onClick={onClick}
      disabled={disabled || !onClick}
      aria-pressed={selected}
    >
      <span>{text}</span>
      {showRole && meta ? (
        <small className="role-chip-label">{meta.label}</small>
      ) : null}
    </button>
  )
}
