import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { sentencesEqual } from '../lib/tokenize'
import { enforceV2, isVerbGroup, reorderNonVerbs } from '../lib/v2Order'
import { FeedbackPanel } from './FeedbackPanel'

type Props = {
  groups: string[]
  verbIndexes: number[]
  validSentences: string[]
  prompt: string
  soft?: boolean
  onResult: (ok: boolean) => void
  explainCorrect: string
  explainWrong: string
  acceptOriginal?: boolean
  originalSentence?: string
}

function buildSentence(parts: string[]): string {
  const words = parts.join(' ')
  return words.endsWith('.') ? words : `${words}.`
}

type ChipProps = {
  id: number
  label: string
  isVerb: boolean
  disabled: boolean
  selected: boolean
  showInsertBefore: boolean
  onSelect: () => void
}

function SortableChip({
  id,
  label,
  isVerb,
  disabled,
  selected,
  showInsertBefore,
  onSelect,
}: ChipProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: disabled || isVerb,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`dnd-chip-wrap ${showInsertBefore ? 'dnd-insert-before' : ''}`}
    >
      <div
        className={[
          'sort-card',
          'dnd-chip',
          isVerb ? 'paired dnd-chip--verb' : 'dnd-chip--movable',
          selected ? 'active' : '',
          isDragging ? 'dnd-chip--dragging' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {!isVerb && !disabled ? (
          <button
            type="button"
            className="dnd-handle"
            aria-label={`Ziehen: ${label}`}
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </button>
        ) : (
          <span className="dnd-handle dnd-handle--locked" aria-hidden>
            🔒
          </span>
        )}
        <button
          type="button"
          className="dnd-chip-label"
          onClick={onSelect}
          disabled={disabled || isVerb}
          aria-pressed={selected}
        >
          {label}
        </button>
      </div>
      {isVerb ? <span className="dnd-verb-tag">Verb · Pos. 2</span> : null}
    </li>
  )
}

function OverlayChip({ label }: { label: string }) {
  return (
    <div className="sort-card dnd-chip dnd-chip--movable dnd-chip--overlay">
      <span className="dnd-handle">⋮⋮</span>
      <span className="dnd-chip-label">{label}</span>
    </div>
  )
}

export function MoveTask({
  groups,
  verbIndexes,
  validSentences,
  prompt,
  soft,
  onResult,
  explainCorrect,
  explainWrong,
  acceptOriginal = true,
  originalSentence,
}: Props) {
  const [order, setOrder] = useState(() => groups.map((_, i) => i))
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [ok, setOk] = useState(false)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [overId, setOverId] = useState<number | null>(null)
  const [blockHint, setBlockHint] = useState<string | null>(null)

  const verbSet = useMemo(() => new Set(verbIndexes), [verbIndexes])
  const currentGroups = order.map((i) => groups[i])
  const sentence = buildSentence(currentGroups)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const moveToFront = (orderIndex: number) => {
    if (checked) return
    const groupId = order[orderIndex]
    if (verbSet.has(groupId)) {
      setBlockHint('Das finite Verb bleibt an Position 2 und kann nicht nach vorn.')
      return
    }
    const without = order.filter((_, i) => i !== orderIndex)
    const verbs = verbIndexes.filter((id) => without.includes(id) || id === groupId)
    const rest = without.filter((id) => !verbSet.has(id))
    setOrder(enforceV2([groupId, ...verbs, ...rest], verbIndexes))
    setPicked(null)
    setBlockHint(null)
  }

  const selectBank = (orderIndex: number) => {
    if (checked) return
    const groupId = order[orderIndex]
    if (verbSet.has(groupId)) {
      setPicked(null)
      setBlockHint('Das finite Verb bleibt an Position 2.')
      return
    }
    setBlockHint(null)
    setPicked(picked === orderIndex ? null : orderIndex)
  }

  const onDragStart = (event: DragStartEvent) => {
    if (checked) return
    const id = Number(event.active.id)
    if (isVerbGroup(id, verbIndexes)) {
      setBlockHint('Das finite Verb bleibt an Position 2 und lässt sich nicht verschieben.')
      setActiveId(null)
      return
    }
    setActiveId(id)
    setBlockHint(null)
    setPicked(null)
  }

  const onDragOver = (event: DragOverEvent) => {
    const over = event.over?.id
    setOverId(over == null ? null : Number(over))
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setOverId(null)
    if (checked || !over) return
    const a = Number(active.id)
    const o = Number(over.id)
    if (isVerbGroup(a, verbIndexes)) {
      setBlockHint('Das finite Verb bleibt an Position 2 und lässt sich nicht verschieben.')
      return
    }
    if (a === o) return
    setOrder((prev) => reorderNonVerbs(prev, verbIndexes, a, o))
  }

  const onDragCancel = () => {
    setActiveId(null)
    setOverId(null)
  }

  const check = () => {
    const candidates = [
      ...validSentences,
      ...(acceptOriginal && originalSentence ? [originalSentence] : []),
    ]
    const match = candidates.some((v) => sentencesEqual(v, buildSentence(order.map((i) => groups[i]))))
    setOk(match)
    setChecked(true)
    onResult(match)
  }

  const reset = () => {
    setOrder(groups.map((_, i) => i))
    setPicked(null)
    setChecked(false)
    setOk(false)
    setBlockHint(null)
    setActiveId(null)
    setOverId(null)
  }

  const activeLabel = activeId != null ? groups[activeId] : null

  return (
    <div className="chunk-order">
      <p className="instruction-note">{prompt}</p>
      <p className="muted-note">
        Ziehe Satzglieder an die gewünschte Stelle (Maus oder Finger). Das finite Verb bleibt an
        Position 2. Alternativ: auswählen und „An den Anfang“, oder Tastatur (Tab + Leertaste /
        Pfeiltasten).
      </p>

      <div className="order-label">Aktueller Satz</div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <SortableContext items={order} strategy={horizontalListSortingStrategy}>
          <div className="sentence-row order-sentence dnd-sentence">
            <ul className="chunk-row dnd-row" aria-label="Satzglieder verschieben">
              {order.map((groupId, i) => (
                <SortableChip
                  key={`${groupId}-${groups[groupId]}`}
                  id={groupId}
                  label={groups[groupId]}
                  isVerb={verbSet.has(groupId)}
                  disabled={checked}
                  selected={picked === i}
                  showInsertBefore={
                    activeId != null &&
                    overId === groupId &&
                    activeId !== groupId &&
                    !verbSet.has(groupId)
                  }
                  onSelect={() => selectBank(i)}
                />
              ))}
            </ul>
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
          {activeLabel ? <OverlayChip label={activeLabel} /> : null}
        </DragOverlay>
      </DndContext>

      {blockHint ? (
        <FeedbackPanel variant="hint" level={2} title="Hinweis">
          {blockHint}
        </FeedbackPanel>
      ) : null}

      <div className="chunk-controls">
        <button
          type="button"
          className="secondary-button"
          disabled={checked || picked === null}
          onClick={() => picked !== null && moveToFront(picked)}
        >
          An den Anfang
        </button>
        <button type="button" className="ghost-button" disabled={checked} onClick={reset}>
          Ausgangssatz
        </button>
      </div>

      <p className="muted-note" aria-live="polite">
        Vorschau: {sentence}
      </p>

      <div className="exercise-actions">
        {!checked ? (
          <button type="button" className="primary-button" onClick={check}>
            Prüfen
          </button>
        ) : (
          <button type="button" className="secondary-button" onClick={reset}>
            Nochmal verschieben
          </button>
        )}
      </div>

      {checked ? (
        <FeedbackPanel
          variant={ok ? 'correct' : soft ? 'soft' : 'wrong'}
          title={ok ? 'Gute Umsstellung!' : soft ? 'Probiere weiter' : 'So nicht'}
        >
          {ok ? explainCorrect : explainWrong}
          {!ok ? (
            <p className="muted-note" style={{ marginTop: 8 }}>
              Möglich z. B.: {validSentences[0]}
            </p>
          ) : null}
        </FeedbackPanel>
      ) : null}
    </div>
  )
}
