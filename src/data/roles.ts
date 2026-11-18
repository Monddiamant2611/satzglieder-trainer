export type RoleId =
  | 'subject'
  | 'predicate'
  | 'object_dative'
  | 'object_accusative'
  | 'adverbial_temporal'
  | 'adverbial_lokal'
  | 'adverbial_kausal'
  | 'adverbial_modal'

export const ROLE_META: Record<
  RoleId,
  { label: string; short: string; color: string; bg: string; deep: string }
> = {
  subject: {
    label: 'Subjekt',
    short: 'Wer oder was?',
    color: 'var(--sky)',
    bg: 'var(--sky-bg)',
    deep: 'var(--sky-deep)',
  },
  predicate: {
    label: 'Prädikat',
    short: 'Was geschieht?',
    color: 'var(--accent)',
    bg: 'var(--warn-bg)',
    deep: 'var(--accent-deep)',
  },
  object_dative: {
    label: 'Dativobjekt',
    short: 'Wem?',
    color: 'var(--violet)',
    bg: 'var(--violet-bg)',
    deep: 'var(--violet-deep)',
  },
  object_accusative: {
    label: 'Akkusativobjekt',
    short: 'Wen oder was?',
    color: 'var(--rose)',
    bg: 'var(--rose-bg)',
    deep: 'var(--rose-deep)',
  },
  adverbial_temporal: {
    label: 'temporal',
    short: 'Wann?',
    color: 'var(--sage)',
    bg: 'var(--sage-bg)',
    deep: 'var(--sage-deep)',
  },
  adverbial_lokal: {
    label: 'lokal',
    short: 'Wo?',
    color: '#5a8f9a',
    bg: '#e3f0f2',
    deep: '#2f5c66',
  },
  adverbial_kausal: {
    label: 'kausal',
    short: 'Warum?',
    color: '#b07a3a',
    bg: '#f4eadc',
    deep: '#7a4e1f',
  },
  adverbial_modal: {
    label: 'modal',
    short: 'Wie?',
    color: 'var(--violet)',
    bg: '#f0ebf6',
    deep: 'var(--violet-deep)',
  },
}

export const ADVERBIAL_LABELS: Record<string, string> = {
  temporal: 'temporal (Wann?)',
  lokal: 'lokal (Wo / Wohin?)',
  kausal: 'kausal (Warum?)',
  modal: 'modal (Wie?)',
}

export function roleFromAdverbial(role: string): RoleId {
  return `adverbial_${role}` as RoleId
}
