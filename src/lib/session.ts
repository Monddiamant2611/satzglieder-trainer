import { ROUND_SIZE, type AreaId } from '../data/areas'
import type { TaskItem } from '../components/TaskRenderer'
import type { Pools } from '../types/pools'
import { ALL_POOLS } from '../data/extensionPool'
import {
  VERB_POSITION_MOVE_POOL,
  VERB_POSITION_POOL,
} from '../data/verbPosition'
import { FINITE_VERB_EXERCISES } from '../data/finiteVerb'
import { areaPercent, loadProgress, type ProgressState } from './progress'
import { normalizeSentence } from './tokenize'

const data = ALL_POOLS

/** Items marked wrong recently — retry later, not immediately. */
const recentWrongIds = new Set<string>()
const recentWrongQueue: string[] = []

export function noteWrongItem(id: string | undefined): void {
  if (!id) return
  if (recentWrongIds.has(id)) return
  recentWrongIds.add(id)
  recentWrongQueue.push(id)
  while (recentWrongQueue.length > 24) {
    const old = recentWrongQueue.shift()
    if (old) recentWrongIds.delete(old)
  }
}

export function noteCorrectItem(id: string | undefined): void {
  if (!id) return
  if (!recentWrongIds.has(id)) return
  recentWrongIds.delete(id)
  const idx = recentWrongQueue.indexOf(id)
  if (idx >= 0) recentWrongQueue.splice(idx, 1)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function itemDifficulty(item: unknown): number {
  if (!item || typeof item !== 'object') return 1
  const rec = item as Record<string, unknown>
  if (typeof rec.difficulty === 'number') return rec.difficulty
  if (typeof rec.d === 'number') return rec.d
  return 1
}

function itemId(item: unknown): string | undefined {
  if (!item || typeof item !== 'object') return undefined
  const rec = item as Record<string, unknown>
  if (typeof rec.id === 'string') return rec.id
  if (typeof rec.word === 'string' && typeof rec.class === 'string') {
    return `wordclass:${rec.word}:${rec.class}`
  }
  return undefined
}

function itemSentence(item: unknown): string | undefined {
  if (!item || typeof item !== 'object') return undefined
  const rec = item as Record<string, unknown>
  if (typeof rec.sentence === 'string') return normalizeSentence(rec.sentence)
  if (typeof rec.word === 'string') return `word:${normalizeSentence(rec.word)}`
  return undefined
}

/** Adaptive difficulty mix from area progress (no UI level message). */
export function difficultyWeights(progress: ProgressState, areaId: AreaId): {
  1: number
  2: number
  3: number
} {
  const pct = areaPercent(progress.areas[areaId])
  const rounds = progress.roundsStarted?.[areaId] ?? 0
  // Start mostly d1; with confidence and longer phases mix d2/d3
  if (pct == null || pct < 55 || rounds < 1) return { 1: 0.75, 2: 0.2, 3: 0.05 }
  if (pct < 75 || rounds < 3) return { 1: 0.45, 2: 0.4, 3: 0.15 }
  if (pct < 90) return { 1: 0.25, 2: 0.45, 3: 0.3 }
  return { 1: 0.15, 2: 0.4, 3: 0.45 }
}

function pickByDifficulty<T>(
  pool: T[],
  n: number,
  weights: { 1: number; 2: number; 3: number },
  usedIds: Set<string>,
  usedSentences: Set<string>,
): T[] {
  const available = pool.filter((item) => {
    const id = itemId(item)
    const sent = itemSentence(item)
    if (id && usedIds.has(id)) return false
    if (sent && usedSentences.has(sent)) return false
    // Avoid immediate retry of just-failed items when alternatives exist
    if (id && recentWrongIds.has(id) && pool.length > n + recentWrongIds.size) {
      return false
    }
    return true
  })

  const byDiff: Record<1 | 2 | 3, T[]> = { 1: [], 2: [], 3: [] }
  for (const item of available) {
    const d = Math.min(3, Math.max(1, itemDifficulty(item))) as 1 | 2 | 3
    byDiff[d].push(item)
  }
  for (const k of [1, 2, 3] as const) byDiff[k] = shuffle(byDiff[k])

  const picked: T[] = []
  const targets = {
    1: Math.round(n * weights[1]),
    2: Math.round(n * weights[2]),
    3: Math.round(n * weights[3]),
  }
  // Fix rounding so sum == n
  let sum = targets[1] + targets[2] + targets[3]
  while (sum < n) {
    targets[1]++
    sum++
  }
  while (sum > n && targets[1] > 0) {
    targets[1]--
    sum--
  }

  const takeFrom = (d: 1 | 2 | 3, count: number) => {
    while (count > 0 && byDiff[d].length > 0 && picked.length < n) {
      const item = byDiff[d].shift()!
      const id = itemId(item)
      const sent = itemSentence(item)
      if (id && usedIds.has(id)) continue
      if (sent && usedSentences.has(sent)) continue
      if (id) usedIds.add(id)
      if (sent) usedSentences.add(sent)
      picked.push(item)
      count--
    }
  }

  takeFrom(1, targets[1])
  takeFrom(2, targets[2])
  takeFrom(3, targets[3])

  // Fill remainder from any leftover difficulty buckets
  const leftovers = shuffle([...byDiff[1], ...byDiff[2], ...byDiff[3]])
  for (const item of leftovers) {
    if (picked.length >= n) break
    const id = itemId(item)
    const sent = itemSentence(item)
    if (id && usedIds.has(id)) continue
    if (sent && usedSentences.has(sent)) continue
    if (id) usedIds.add(id)
    if (sent) usedSentences.add(sent)
    picked.push(item)
  }

  return picked
}

function takeAdaptive<T>(
  pool: T[],
  n: number,
  areaId: AreaId,
  usedIds: Set<string>,
  usedSentences: Set<string>,
): T[] {
  const progress = loadProgress()
  const weights = difficultyWeights(progress, areaId)
  return pickByDifficulty(pool, n, weights, usedIds, usedSentences)
}

function takeSimple<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.min(n, arr.length))
}

/** Prefer alternating task types when assembling a mixed-type round. */
function interleaveTypes(items: TaskItem[]): TaskItem[] {
  if (items.length <= 1) return items
  const byType = new Map<string, TaskItem[]>()
  for (const item of shuffle(items)) {
    const list = byType.get(item.type) ?? []
    list.push(item)
    byType.set(item.type, list)
  }
  const result: TaskItem[] = []
  const types = shuffle([...byType.keys()])
  while (result.length < items.length) {
    let placed = false
    const last = result[result.length - 1]?.type
    const order = [...types].sort((a, b) => {
      const preferA = a !== last ? 0 : 1
      const preferB = b !== last ? 0 : 1
      return preferA - preferB
    })
    for (const t of order) {
      const bucket = byType.get(t)
      if (bucket && bucket.length) {
        result.push(bucket.shift()!)
        placed = true
        break
      }
    }
    if (!placed) break
  }
  return result
}

export function buildRound(areaId: AreaId): TaskItem[] {
  const usedIds = new Set<string>()
  const usedSentences = new Set<string>()

  switch (areaId) {
    case 'boundary':
      return takeAdaptive(data.boundary, ROUND_SIZE, areaId, usedIds, usedSentences).map(
        (d) => ({ type: 'boundary' as const, data: d }),
      )
    case 'move': {
      const moves = takeAdaptive(data.move, 4, areaId, usedIds, usedSentences).map((d) => ({
        type: 'move' as const,
        data: d,
      }))
      const classify = takeSimple(VERB_POSITION_POOL, 2).map((d) => ({
        type: 'verb_position' as const,
        data: d,
      }))
      const moveLabel = takeSimple(VERB_POSITION_MOVE_POOL, 2).map((d) => ({
        type: 'verb_position_move' as const,
        data: d,
      }))
      return interleaveTypes([...moves, ...classify, ...moveLabel]).slice(0, ROUND_SIZE)
    }
    case 'predicate': {
      const finite = takeSimple(FINITE_VERB_EXERCISES, 5).map((d) => ({
        type: 'finite_verb' as const,
        data: d,
      }))
      const preds = takeAdaptive(data.predicate, 3, areaId, usedIds, usedSentences).map(
        (d) => ({
          type: 'predicate' as const,
          data: d,
        }),
      )
      return interleaveTypes([...finite, ...preds]).slice(0, ROUND_SIZE)
    }
    case 'subject':
      return takeAdaptive(data.subject, ROUND_SIZE, areaId, usedIds, usedSentences).map(
        (d) => ({ type: 'subject' as const, data: d }),
      )
    case 'accusative':
      return takeAdaptive(data.accusative, ROUND_SIZE, areaId, usedIds, usedSentences).map(
        (d) => ({ type: 'accusative' as const, data: d }),
      )
    case 'dative':
      return takeAdaptive(data.dative, ROUND_SIZE, areaId, usedIds, usedSentences).map(
        (d) => ({ type: 'dative' as const, data: d }),
      )
    case 'both_objects':
      return takeAdaptive(
        data.both_objects,
        ROUND_SIZE,
        areaId,
        usedIds,
        usedSentences,
      ).map((d) => ({
        type: 'both_objects' as const,
        data: d,
      }))
    case 'adverbial':
      return takeAdaptive(data.adverbial, ROUND_SIZE, areaId, usedIds, usedSentences).map(
        (d) => ({ type: 'adverbial' as const, data: d }),
      )
    case 'full_analysis':
      return takeAdaptive(
        data.full_analysis,
        Math.min(5, ROUND_SIZE),
        areaId,
        usedIds,
        usedSentences,
      ).map((d) => ({
        type: 'full_analysis' as const,
        data: d,
      }))
    case 'mixed': {
      const mix: TaskItem[] = [
        ...takeAdaptive(data.boundary, 1, 'boundary', usedIds, usedSentences).map((d) => ({
          type: 'boundary' as const,
          data: d,
        })),
        ...takeAdaptive(data.move, 1, 'move', usedIds, usedSentences).map((d) => ({
          type: 'move' as const,
          data: d,
        })),
        ...takeSimple(VERB_POSITION_POOL, 1).map((d) => ({
          type: 'verb_position' as const,
          data: d,
        })),
        ...takeSimple(VERB_POSITION_MOVE_POOL, 1).map((d) => ({
          type: 'verb_position_move' as const,
          data: d,
        })),
        ...takeAdaptive(data.predicate, 1, 'predicate', usedIds, usedSentences).map(
          (d) => ({ type: 'predicate' as const, data: d }),
        ),
        ...takeAdaptive(data.subject, 1, 'subject', usedIds, usedSentences).map((d) => ({
          type: 'subject' as const,
          data: d,
        })),
        ...takeAdaptive(data.accusative, 1, 'accusative', usedIds, usedSentences).map(
          (d) => ({ type: 'accusative' as const, data: d }),
        ),
        ...takeAdaptive(data.adverbial, 1, 'adverbial', usedIds, usedSentences).map(
          (d) => ({ type: 'adverbial' as const, data: d }),
        ),
        ...takeAdaptive(data.wordclass, 1, 'wordclass', usedIds, usedSentences).map(
          (d) => ({ type: 'wordclass' as const, data: d }),
        ),
        ...takeAdaptive(
          data.error_analysis,
          1,
          'error_analysis',
          usedIds,
          usedSentences,
        ).map((d) => ({
          type: 'error_analysis' as const,
          data: d,
        })),
      ]
      return interleaveTypes(mix).slice(0, ROUND_SIZE)
    }
    case 'error_analysis':
      return takeAdaptive(
        data.error_analysis,
        ROUND_SIZE,
        areaId,
        usedIds,
        usedSentences,
      ).map((d) => ({
        type: 'error_analysis' as const,
        data: d,
      }))
    case 'wordclass':
      return takeAdaptive(data.wordclass, ROUND_SIZE, areaId, usedIds, usedSentences).map(
        (d) => ({ type: 'wordclass' as const, data: d }),
      )
    default:
      return []
  }
}

export function taskLabel(item: TaskItem): string {
  switch (item.type) {
    case 'boundary':
      return 'Satzglieder erkennen'
    case 'move':
      return 'Verschiebeprobe'
    case 'verb_position':
      return 'Verbstellung'
    case 'verb_position_move':
      return 'Umsstellung + Verbstellung'
    case 'predicate':
      return 'Prädikat'
    case 'finite_verb':
      return 'Das finite Verb'
    case 'subject':
      return 'Subjekt'
    case 'accusative':
      return 'Akkusativobjekt'
    case 'dative':
      return 'Dativobjekt'
    case 'both_objects':
      return 'Objekte'
    case 'adverbial':
      return 'Adverbiale'
    case 'full_analysis':
      return 'Satzanalyse'
    case 'wordclass':
      return 'Wortart'
    case 'error_analysis':
      return 'Fehler finden'
    default:
      return 'Aufgabe'
  }
}

/** Expose combined pools for tests. */
export function getPools(): Pools {
  return data
}
