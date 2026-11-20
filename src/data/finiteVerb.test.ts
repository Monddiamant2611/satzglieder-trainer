import { FINITE_VERB_EXERCISES } from './finiteVerb'
import { findPhraseSpan } from '../lib/tokenize'
import { buildRound, taskLabel } from '../lib/session'

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

assert(FINITE_VERB_EXERCISES.length >= 8, `need ≥8 exercises (have ${FINITE_VERB_EXERCISES.length})`)

for (const ex of FINITE_VERB_EXERCISES) {
  if (ex.kind === 'choice') {
    assert(ex.choices.some((c) => c.id === ex.correctId), `${ex.id} correctId in choices`)
    continue
  }
  for (const t of ex.targets) {
    assert(!!findPhraseSpan(ex.sentence, t), `${ex.id} target „${t}“ in sentence`)
  }
}

const round = buildRound('predicate')
assert(round.length === 8, `predicate round size ${round.length}`)
assert(
  round.filter((t) => t.type === 'finite_verb').length >= 3,
  'predicate round includes finite_verb tasks',
)
assert(
  round.some((t) => t.type === 'predicate'),
  'predicate round keeps classic predicate marks',
)
assert(taskLabel({ type: 'finite_verb', data: FINITE_VERB_EXERCISES[0] }) === 'Das finite Verb', 'label')

console.log('finiteVerb.test.ts OK')
