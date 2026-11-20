/** Standalone practice: Das finite Verb (within Prädikat training) */

export type FiniteVerbExercise =
  | {
      id: string
      kind: 'mark_verbs'
      sentence: string
      targets: string[]
      prompt: string
    }
  | {
      id: string
      kind: 'mark_finite'
      sentence: string
      targets: string[]
      prompt: string
    }
  | {
      id: string
      kind: 'mark_predicate'
      sentence: string
      targets: string[]
      prompt: string
    }
  | {
      id: string
      kind: 'choice'
      sentence: string
      prompt: string
      choices: { id: string; label: string }[]
      correctId: string
    }

export const FINITE_VERB_EXERCISES: FiniteVerbExercise[] = [
  {
    id: 'fv01',
    kind: 'mark_verbs',
    sentence: 'Mia hat das Buch gelesen.',
    targets: ['hat', 'gelesen'],
    prompt: 'Markiere alle Verbformen im Satz.',
  },
  {
    id: 'fv02',
    kind: 'mark_finite',
    sentence: 'Mia hat das Buch gelesen.',
    targets: ['hat'],
    prompt: 'Markiere nur das finite Verb (die gebeugte Form).',
  },
  {
    id: 'fv03',
    kind: 'choice',
    sentence: 'Mia hat das Buch gelesen.',
    prompt: 'Welche Form ist finit?',
    choices: [
      { id: 'hat', label: 'hat' },
      { id: 'gelesen', label: 'gelesen' },
      { id: 'buch', label: 'Buch' },
    ],
    correctId: 'hat',
  },
  {
    id: 'fv04',
    kind: 'mark_predicate',
    sentence: 'Der Hund schläft im Körbchen.',
    targets: ['schläft'],
    prompt: 'Markiere das einteilige Prädikat (finites Verb allein).',
  },
  {
    id: 'fv05',
    kind: 'mark_predicate',
    sentence: 'Mia hat gelesen.',
    targets: ['hat', 'gelesen'],
    prompt: 'Markiere das gesamte mehrteilige Prädikat.',
  },
  {
    id: 'fv06',
    kind: 'choice',
    sentence: 'Lena räumt ihr Zimmer auf.',
    prompt: 'Was ist das finite Verb?',
    choices: [
      { id: 'raeumt', label: 'räumt' },
      { id: 'auf', label: 'auf' },
      { id: 'zimmer', label: 'Zimmer' },
    ],
    correctId: 'raeumt',
  },
  {
    id: 'fv07',
    kind: 'choice',
    sentence: 'Hat Mia das Buch gelesen?',
    prompt: 'Welche Verbstellung hat das finite Verb „Hat“?',
    choices: [
      { id: 'verberst', label: 'Verberststellung' },
      { id: 'verbzweit', label: 'Verbzweitstellung' },
      { id: 'verbletzt', label: 'Verbletztstellung' },
    ],
    correctId: 'verberst',
  },
  {
    id: 'fv08',
    kind: 'mark_finite',
    sentence: '… weil Mia das Buch gelesen hat.',
    targets: ['hat'],
    prompt: 'Markiere das finite Verb (Nebensatz).',
  },
  {
    id: 'fv09',
    kind: 'mark_predicate',
    sentence: 'Ben schreibt die Aufgabe sorgfältig auf.',
    targets: ['schreibt', 'auf'],
    prompt: 'Markiere das gesamte Prädikat (finit + Partikel).',
  },
  {
    id: 'fv10',
    kind: 'choice',
    sentence: 'Am Abend hat Lena das Zimmer aufgeräumt.',
    prompt: 'Welche Verbstellung hat das Finitum „hat“?',
    choices: [
      { id: 'verberst', label: 'Verberststellung' },
      { id: 'verbzweit', label: 'Verbzweitstellung' },
      { id: 'verbletzt', label: 'Verbletztstellung' },
    ],
    correctId: 'verbzweit',
  },
]
