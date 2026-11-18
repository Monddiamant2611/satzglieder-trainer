import type { RoleId } from '../data/roles'

export type BoundaryItem = {
  id: string
  sentence: string
  groups: string[]
  predicateParts?: string[]
  difficulty: number
}

export type MoveItem = {
  id: string
  sentence: string
  valid: string[]
}

export type PredicateItem = {
  id: string
  sentence: string
  parts: string[]
  d: number
}

export type SubjectItem = {
  id: string
  sentence: string
  subject: string
  predicate: string
}

export type ObjectItem = {
  id: string
  sentence: string
  obj: string
}

export type BothObjectsItem = {
  id: string
  sentence: string
  dative: string
  accusative: string
}

export type AdverbialItem = {
  id: string
  sentence: string
  target: string
  role: 'temporal' | 'lokal' | 'kausal' | 'modal'
}

export type WordclassItem = {
  word: string
  class: string
}

export type ErrorAnalysisItem = {
  id: string
  sentence: string
  analysis: {
    text: string
    shown: string
    correct?: string
    wrong: boolean
  }[]
}

export type FullAnalysisItem = {
  id: string
  sentence: string
  tokens: string[]
  constituents: {
    text: string
    start: number
    end: number
    role: RoleId
    tokenIndexes?: number[]
  }[]
  predicateParts: number[]
  difficulty: number
  tags: string[]
}

export type Pools = {
  boundary: BoundaryItem[]
  move: MoveItem[]
  predicate: PredicateItem[]
  subject: SubjectItem[]
  accusative: ObjectItem[]
  dative: ObjectItem[]
  both_objects: BothObjectsItem[]
  adverbial: AdverbialItem[]
  wordclass: WordclassItem[]
  error_analysis: ErrorAnalysisItem[]
  full_analysis: FullAnalysisItem[]
}
