export type AreaId =
  | 'boundary'
  | 'move'
  | 'predicate'
  | 'subject'
  | 'accusative'
  | 'dative'
  | 'both_objects'
  | 'adverbial'
  | 'full_analysis'
  | 'mixed'
  | 'error_analysis'
  | 'wordclass'

export type AreaConfig = {
  id: AreaId
  number: number
  title: string
  blurb: string
  poolKey?: keyof typeof import('./pools.json')
  competency: string
  accent: 'sage' | 'sky' | 'rose' | 'violet' | 'orange'
}

export const TRAIN_AREAS: AreaConfig[] = [
  {
    id: 'boundary',
    number: 1,
    title: 'Satzglieder erkennen',
    blurb: 'Finde die Grenzen der Satzglieder.',
    poolKey: 'boundary',
    competency: 'boundaries',
    accent: 'sage',
  },
  {
    id: 'move',
    number: 2,
    title: 'Verschiebeprobe',
    blurb: 'Verschiebe Satzglieder und prüfe, was zusammengehört.',
    poolKey: 'move',
    competency: 'move-test',
    accent: 'sky',
  },
  {
    id: 'predicate',
    number: 3,
    title: 'Prädikat',
    blurb: 'Markiere das Prädikat – auch mehrteilig.',
    poolKey: 'predicate',
    competency: 'predicate',
    accent: 'orange',
  },
  {
    id: 'subject',
    number: 4,
    title: 'Subjekt',
    blurb: 'Finde, wer oder was etwas tut.',
    poolKey: 'subject',
    competency: 'subject',
    accent: 'sky',
  },
  {
    id: 'accusative',
    number: 5,
    title: 'Akkusativobjekt',
    blurb: 'Wen oder was? Markiere das Akkusativobjekt.',
    poolKey: 'accusative',
    competency: 'object-accusative',
    accent: 'rose',
  },
  {
    id: 'dative',
    number: 6,
    title: 'Dativobjekt',
    blurb: 'Wem? Markiere das Dativobjekt.',
    poolKey: 'dative',
    competency: 'object-dative',
    accent: 'violet',
  },
  {
    id: 'both_objects',
    number: 7,
    title: 'Objekte unterscheiden',
    blurb: 'Trenne Dativ- und Akkusativobjekt.',
    poolKey: 'both_objects',
    competency: 'objects-both',
    accent: 'rose',
  },
  {
    id: 'adverbial',
    number: 8,
    title: 'Adverbiale Bestimmungen',
    blurb: 'Wann, wo, warum oder wie?',
    poolKey: 'adverbial',
    competency: 'adverbial',
    accent: 'sage',
  },
  {
    id: 'full_analysis',
    number: 9,
    title: 'Ganze Sätze analysieren',
    blurb: 'Schritt für Schritt den ganzen Satz bestimmen.',
    poolKey: 'full_analysis',
    competency: 'full-analysis',
    accent: 'violet',
  },
  {
    id: 'mixed',
    number: 10,
    title: 'Gemischtes Training',
    blurb: 'Alles gemischt – inklusive Fehlerfinden und Wortarten.',
    competency: 'mixed',
    accent: 'orange',
  },
]

export const ROUND_SIZE = 8
