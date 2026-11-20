import { buildRound, taskLabel } from './session'

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

const moveRound = buildRound('move')
assert(moveRound.length === 8, `move round size ${moveRound.length}`)
assert(
  moveRound.some((t) => t.type === 'verb_position'),
  'move round includes verb_position',
)
assert(
  moveRound.some((t) => t.type === 'verb_position_move'),
  'move round includes verb_position_move',
)
assert(moveRound.some((t) => t.type === 'move'), 'move round keeps classic move')

const mixed = buildRound('mixed')
assert(mixed.length === 8, `mixed round size ${mixed.length}`)
assert(
  mixed.some((t) => t.type === 'verb_position' || t.type === 'verb_position_move'),
  'mixed includes verb-position tasks',
)

assert(taskLabel({ type: 'verb_position', data: moveRound.find((t) => t.type === 'verb_position')!.data as never }) === 'Verbstellung', 'label classify')
assert(
  taskLabel({
    type: 'verb_position_move',
    data: moveRound.find((t) => t.type === 'verb_position_move')!.data as never,
  }) === 'Umsstellung + Verbstellung',
  'label move+label',
)

console.log('session.verbPosition.test.ts OK')
