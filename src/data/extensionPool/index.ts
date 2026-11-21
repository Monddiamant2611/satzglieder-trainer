import basePools from '../pools.json' with { type: 'json' }
import extensionPools from './pools.json' with { type: 'json' }
import type { Pools } from '../../types/pools'

const base = basePools as Pools
const extension = extensionPools as Pools

/** Original 185 training items — never mutated. */
export const BASE_POOLS: Pools = base

/** Extension pool (370 items, exp2_* IDs). */
export const EXTENSION_POOLS: Pools = extension

/** Combined pools for training (base + extension). */
export const ALL_POOLS: Pools = {
  boundary: [...base.boundary, ...extension.boundary],
  move: [...base.move, ...extension.move],
  predicate: [...base.predicate, ...extension.predicate],
  subject: [...base.subject, ...extension.subject],
  accusative: [...base.accusative, ...extension.accusative],
  dative: [...base.dative, ...extension.dative],
  both_objects: [...base.both_objects, ...extension.both_objects],
  adverbial: [...base.adverbial, ...extension.adverbial],
  wordclass: [...base.wordclass, ...extension.wordclass],
  error_analysis: [...base.error_analysis, ...extension.error_analysis],
  full_analysis: [...base.full_analysis, ...extension.full_analysis],
}

export const EXTENSION_COUNTS = {
  boundary: 40,
  move: 20,
  predicate: 40,
  subject: 30,
  accusative: 30,
  dative: 30,
  both_objects: 24,
  adverbial: 48,
  full_analysis: 40,
  error_analysis: 20,
  wordclass: 48,
} as const

export const TOTAL_TRAINING_TARGET = 555
export const EXTENSION_TARGET = 370
