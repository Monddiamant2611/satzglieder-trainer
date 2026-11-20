import pools from '../data/pools.json' with { type: 'json' }
import { ROUND_SIZE, type AreaId } from '../data/areas'
import type { TaskItem } from '../components/TaskRenderer'
import type { Pools } from '../types/pools'
import {
  VERB_POSITION_MOVE_POOL,
  VERB_POSITION_POOL,
} from '../data/verbPosition'

const data = pools as Pools

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function take<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.min(n, arr.length))
}

export function buildRound(areaId: AreaId): TaskItem[] {
  switch (areaId) {
    case 'boundary':
      return take(data.boundary, ROUND_SIZE).map((d) => ({ type: 'boundary', data: d }))
    case 'move': {
      const moves = take(data.move, 4).map((d) => ({ type: 'move' as const, data: d }))
      const classify = take(VERB_POSITION_POOL, 2).map((d) => ({
        type: 'verb_position' as const,
        data: d,
      }))
      const moveLabel = take(VERB_POSITION_MOVE_POOL, 2).map((d) => ({
        type: 'verb_position_move' as const,
        data: d,
      }))
      return shuffle([...moves, ...classify, ...moveLabel]).slice(0, ROUND_SIZE)
    }
    case 'predicate':
      return take(data.predicate, ROUND_SIZE).map((d) => ({ type: 'predicate', data: d }))
    case 'subject':
      return take(data.subject, ROUND_SIZE).map((d) => ({ type: 'subject', data: d }))
    case 'accusative':
      return take(data.accusative, ROUND_SIZE).map((d) => ({ type: 'accusative', data: d }))
    case 'dative':
      return take(data.dative, ROUND_SIZE).map((d) => ({ type: 'dative', data: d }))
    case 'both_objects':
      return take(data.both_objects, ROUND_SIZE).map((d) => ({
        type: 'both_objects',
        data: d,
      }))
    case 'adverbial':
      return take(data.adverbial, ROUND_SIZE).map((d) => ({ type: 'adverbial', data: d }))
    case 'full_analysis':
      return take(data.full_analysis, Math.min(5, ROUND_SIZE)).map((d) => ({
        type: 'full_analysis',
        data: d,
      }))
    case 'mixed': {
      const mix: TaskItem[] = [
        ...take(data.boundary, 1).map((d) => ({ type: 'boundary' as const, data: d })),
        ...take(data.move, 1).map((d) => ({ type: 'move' as const, data: d })),
        ...take(VERB_POSITION_POOL, 1).map((d) => ({
          type: 'verb_position' as const,
          data: d,
        })),
        ...take(VERB_POSITION_MOVE_POOL, 1).map((d) => ({
          type: 'verb_position_move' as const,
          data: d,
        })),
        ...take(data.predicate, 1).map((d) => ({ type: 'predicate' as const, data: d })),
        ...take(data.subject, 1).map((d) => ({ type: 'subject' as const, data: d })),
        ...take(data.accusative, 1).map((d) => ({ type: 'accusative' as const, data: d })),
        ...take(data.adverbial, 1).map((d) => ({ type: 'adverbial' as const, data: d })),
        ...take(data.wordclass, 1).map((d) => ({ type: 'wordclass' as const, data: d })),
        ...take(data.error_analysis, 1).map((d) => ({
          type: 'error_analysis' as const,
          data: d,
        })),
      ]
      return shuffle(mix).slice(0, ROUND_SIZE)
    }
    case 'error_analysis':
      return take(data.error_analysis, ROUND_SIZE).map((d) => ({
        type: 'error_analysis',
        data: d,
      }))
    case 'wordclass':
      return take(data.wordclass, ROUND_SIZE).map((d) => ({ type: 'wordclass', data: d }))
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
