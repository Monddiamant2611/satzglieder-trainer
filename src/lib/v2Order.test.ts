import { enforceV2, reorderNonVerbs } from './v2Order'

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg)
}

// Original: [0=A, 1=V, 2=B, 3=C]
const verbs = [1]

assert(
  JSON.stringify(enforceV2([2, 0, 1, 3], verbs)) === JSON.stringify([2, 1, 0, 3]),
  'enforceV2 puts verb at position 2',
)

assert(
  JSON.stringify(reorderNonVerbs([0, 1, 2, 3], verbs, 3, 0)) ===
    JSON.stringify([3, 1, 0, 2]),
  'move C before A → C V A B',
)

assert(
  JSON.stringify(reorderNonVerbs([0, 1, 2, 3], verbs, 1, 0)) ===
    JSON.stringify([0, 1, 2, 3]),
  'dragging verb is a no-op in reorderNonVerbs',
)

// Multi-part verb [0, 1=V, 2=refl, 3, 4]
const verbs2 = [1, 2]
assert(
  JSON.stringify(enforceV2([4, 0, 1, 2, 3], verbs2)) ===
    JSON.stringify([4, 1, 2, 0, 3]),
  'multipart verb cluster stays together at V2',
)

console.log('v2Order tests OK')
