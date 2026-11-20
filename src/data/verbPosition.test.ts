import {
  VERB_POSITION_CHOICES,
  VERB_POSITION_META,
  VERB_POSITION_MOVE_POOL,
  VERB_POSITION_POOL,
} from './verbPosition'

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

assert(
  VERB_POSITION_META.verberst.term === 'Verberststellung',
  'Verberststellung term',
)
assert(
  VERB_POSITION_META.verbzweit.term === 'Verbzweitstellung',
  'Verbzweitstellung term',
)
assert(
  VERB_POSITION_META.verbletzt.term === 'Verbletztstellung',
  'Verbletztstellung term',
)

assert(VERB_POSITION_CHOICES.length === 3, 'three Fachbegriffe')
assert(
  VERB_POSITION_POOL.some((p) => p.position === 'verberst'),
  'pool has Verberststellung',
)
assert(
  VERB_POSITION_POOL.some((p) => p.position === 'verbzweit'),
  'pool has Verbzweitstellung',
)
assert(
  VERB_POSITION_POOL.some((p) => p.position === 'verbletzt'),
  'pool has Verbletztstellung',
)
assert(
  VERB_POSITION_POOL.some((p) => p.multipart && p.clause === 'haupt'),
  'multipart Hauptsatz (Satzklammer)',
)
assert(
  VERB_POSITION_POOL.some((p) => p.multipart && p.clause === 'neben'),
  'multipart Nebensatz',
)

for (const item of VERB_POSITION_MOVE_POOL) {
  assert(item.valid.length >= 2, `${item.id} has valid variants`)
  assert(item.verbIndexes.length >= 1, `${item.id} has verb index`)
  assert(
    item.valid.every((s) => !/\bPosition\s*[123]\b/i.test(s)),
    `${item.id} valid sentences without position markers`,
  )
}

for (const item of VERB_POSITION_POOL) {
  assert(
    !/\[[123]\]|Position\s*[123]/.test(item.sentence),
    `${item.id} sentence has no position markers`,
  )
}

console.log('verbPosition.test.ts OK')
