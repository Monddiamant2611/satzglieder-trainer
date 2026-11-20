/** Keep finite-verb cluster in second Satzglied position (V2). */
export function enforceV2(order: number[], verbIndexes: number[]): number[] {
  const verbSet = new Set(verbIndexes)
  const verbs = verbIndexes.filter((id) => order.includes(id))
  const nonVerbs = order.filter((id) => !verbSet.has(id))
  if (nonVerbs.length === 0) return [...verbs]
  const [first, ...rest] = nonVerbs
  return [first, ...verbs, ...rest]
}

export function isVerbGroup(groupId: number, verbIndexes: number[]): boolean {
  return verbIndexes.includes(groupId)
}

/** Intended non-verb order after moving activeId before overId in the current display order. */
export function reorderNonVerbs(
  order: number[],
  verbIndexes: number[],
  activeId: number,
  overId: number,
): number[] {
  const verbSet = new Set(verbIndexes)
  if (verbSet.has(activeId)) return order
  const nonVerbs = order.filter((id) => !verbSet.has(id))
  const from = nonVerbs.indexOf(activeId)
  if (from < 0) return order

  let to: number
  if (verbSet.has(overId)) {
    // Dropping onto/near the verb cluster → treat as Vorfeld (index 0) or right after verbs
    const verbPos = order.indexOf(overId)
    const activePos = order.indexOf(activeId)
    to = activePos < verbPos ? 0 : Math.min(1, nonVerbs.length - 1)
  } else {
    to = nonVerbs.indexOf(overId)
  }
  if (to < 0 || from === to) return enforceV2(order, verbIndexes)

  const next = [...nonVerbs]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  const verbs = verbIndexes.filter((id) => order.includes(id))
  if (next.length === 0) return [...verbs]
  const [first, ...rest] = next
  return [first, ...verbs, ...rest]
}
