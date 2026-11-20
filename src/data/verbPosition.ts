/** Fachbegriffe: Verbstellung (Klasse 6) */

export type VerbPositionId = 'verberst' | 'verbzweit' | 'verbletzt'

export const VERB_POSITION_META: Record<
  VerbPositionId,
  { term: string; short: string; definition: string; tip: string }
> = {
  verberst: {
    term: 'Verberststellung',
    short: 'Verb an Position 1',
    definition:
      'Das finite Verb steht an erster Stelle im Satz. Typisch für Entscheidungsfragen und Aufforderungen.',
    tip: 'Frage oder Aufforderung: Das Verb kommt zuerst.',
  },
  verbzweit: {
    term: 'Verbzweitstellung',
    short: 'Verb an Position 2',
    definition:
      'Das finite Verb steht an zweiter Stelle (nach dem ersten Satzglied). Typisch für Aussagesätze und Ergänzungsfragen im Hauptsatz.',
    tip: 'Aussagesatz: Ein Satzglied vorne, dann das finite Verb (V2).',
  },
  verbletzt: {
    term: 'Verbletztstellung',
    short: 'Verb am Satzende',
    definition:
      'Das finite Verb steht am Ende. Typisch für Nebensätze (z. B. mit weil, dass, als).',
    tip: 'Nebensatz: Das finite Verb wandert ans Ende.',
  },
}

export const VERB_POSITION_CHOICES = (
  Object.keys(VERB_POSITION_META) as VerbPositionId[]
).map((id) => ({
  id,
  label: VERB_POSITION_META[id].term,
}))

export type VerbPositionItem = {
  id: string
  sentence: string
  position: VerbPositionId
  /** Optional note for tutorials only (not shown in scored feedback as solution dump). */
  note?: string
  multipart?: boolean
  clause?: 'haupt' | 'neben' | 'frage' | 'aufforderung'
}

/** Grounded recognition items — verb position only, no invented Satzglied analyses. */
export const VERB_POSITION_POOL: VerbPositionItem[] = [
  {
    id: 'vp01',
    sentence: 'Der Hund schläft im Körbchen.',
    position: 'verbzweit',
    clause: 'haupt',
    note: 'Aussagesatz: Subjekt vorne, finite Verbform an Position 2 → Verbzweitstellung.',
  },
  {
    id: 'vp02',
    sentence: 'Am Nachmittag schläft der Hund im Körbchen.',
    position: 'verbzweit',
    clause: 'haupt',
    note: 'Nach der Umsstellung bleibt Verbzweitstellung: erstes Satzglied + finites Verb.',
  },
  {
    id: 'vp03',
    sentence: 'Mia liest nach dem Unterricht ein Buch.',
    position: 'verbzweit',
    clause: 'haupt',
  },
  {
    id: 'vp04',
    sentence: 'Schläft der Hund im Körbchen?',
    position: 'verberst',
    clause: 'frage',
    note: 'Entscheidungsfrage: finites Verb zuerst → Verberststellung.',
  },
  {
    id: 'vp05',
    sentence: 'Hat Mia das Buch gelesen?',
    position: 'verberst',
    clause: 'frage',
    multipart: true,
    note: 'Mehrteiliges Prädikat: finites „Hat“ in Verberststellung, „gelesen“ bildet mit dem Hilfsverb die Satzklammer.',
  },
  {
    id: 'vp06',
    sentence: 'Komm sofort her!',
    position: 'verberst',
    clause: 'aufforderung',
  },
  {
    id: 'vp07',
    sentence: '… weil der Hund im Körbchen schläft.',
    position: 'verbletzt',
    clause: 'neben',
    note: 'Nebensatz mit „weil“: finites Verb am Ende → Verbletztstellung.',
  },
  {
    id: 'vp08',
    sentence: '… dass Mia das Buch gelesen hat.',
    position: 'verbletzt',
    clause: 'neben',
    multipart: true,
    note: 'Nebensatz: Partizip + Hilfsverb am Ende (Satzklammer im Nebensatz) → Verbletztstellung des Finitums.',
  },
  {
    id: 'vp09',
    sentence: '… als Lena ihr Zimmer aufgeräumt hat.',
    position: 'verbletzt',
    clause: 'neben',
    multipart: true,
  },
  {
    id: 'vp10',
    sentence: 'Lena hat ihr Zimmer aufgeräumt.',
    position: 'verbzweit',
    clause: 'haupt',
    multipart: true,
    note: 'Hauptsatz: „hat“ in Verbzweitstellung, „aufgeräumt“ am Ende → Satzklammer.',
  },
  {
    id: 'vp11',
    sentence: 'Räumt Lena nach dem Essen auf?',
    position: 'verberst',
    clause: 'frage',
    multipart: true,
  },
  {
    id: 'vp12',
    sentence: '… obwohl Ben die Aufgabe gelöst hat.',
    position: 'verbletzt',
    clause: 'neben',
    multipart: true,
  },
]

/** Move-linked items: DnD then name Verbzweitstellung (Hauptsatz). */
export type VerbPositionMoveItem = {
  id: string
  groups: string[]
  verbIndexes: number[]
  valid: string[]
  originalSentence: string
}

export const VERB_POSITION_MOVE_POOL: VerbPositionMoveItem[] = [
  {
    id: 'vpm01',
    groups: ['Der Hund', 'schläft', 'am Nachmittag', 'im Körbchen'],
    verbIndexes: [1],
    originalSentence: 'Der Hund schläft am Nachmittag im Körbchen.',
    valid: [
      'Am Nachmittag schläft der Hund im Körbchen.',
      'Im Körbchen schläft der Hund am Nachmittag.',
      'Der Hund schläft am Nachmittag im Körbchen.',
    ],
  },
  {
    id: 'vpm02',
    groups: ['Mia', 'liest', 'nach dem Unterricht', 'ein Buch'],
    verbIndexes: [1],
    originalSentence: 'Mia liest nach dem Unterricht ein Buch.',
    valid: [
      'Nach dem Unterricht liest Mia ein Buch.',
      'Ein Buch liest Mia nach dem Unterricht.',
      'Mia liest nach dem Unterricht ein Buch.',
    ],
  },
  {
    id: 'vpm03',
    groups: ['Lena', 'hat', 'ihr Zimmer', 'aufgeräumt'],
    verbIndexes: [1],
    originalSentence: 'Lena hat ihr Zimmer aufgeräumt.',
    valid: [
      'Ihr Zimmer hat Lena aufgeräumt.',
      'Lena hat ihr Zimmer aufgeräumt.',
    ],
  },
]
