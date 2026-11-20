import { AREA_TUTORIALS, getTutorial } from './tutorials'
import { TRAIN_AREAS } from './areas'

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length
}

for (const area of TRAIN_AREAS) {
  const t = getTutorial(area.id)
  assert(!!t, `tutorial missing for ${area.id}`)
  assert(t.steps.length >= 5, `${area.id} needs ≥5 steps (has ${t.steps.length})`)
  assert(t.refreshBullets.length >= 2, `${area.id} refresh bullets`)
  for (const step of t.steps) {
    const wc = wordCount(step.explanation)
    assert(wc >= 35 && wc <= 75, `${area.id}/${step.id} explanation words=${wc}`)
    assert(!!step.example.sentence, `${step.id} example`)
    assert(!!step.exercise.kind, `${step.id} exercise`)
    assert(!/Lösung:|richtige Antwort|korrekt ist „/i.test(step.feedbackWrong), `${step.id} wrong feedback reveals`)
  }
}

const move = AREA_TUTORIALS.move
assert(move.steps.length >= 7, 'move has ≥7 steps')
assert(move.steps[0].id === 'm1', 'move step1 recognize')
assert(move.steps[1].exercise.kind === 'move', 'move step2 DnD')
assert(
  move.steps.slice(2, 5).every((s) => s.exercise.kind === 'choice'),
  'move steps 3–5 verb positions',
)
assert(move.steps[5].title.toLowerCase().includes('vergleich'), 'move compare step')
assert(move.steps[6].exercise.kind === 'move', 'move apply step')

const pred = AREA_TUTORIALS.predicate
assert(pred.title === 'Das finite Verb', 'predicate tutorial title')
assert(pred.steps.length === 7, 'predicate has 7 finite-verb steps')
assert(pred.steps.map((s) => s.id).join(',') === 'p1,p2,p3,p4,p5,p6,p7', 'predicate step ids')

assert(Object.keys(AREA_TUTORIALS).length === 10, 'exactly 10 area tutorials')

console.log('tutorials.test.ts OK')
