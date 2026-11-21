/**
 * Integrity checks for the 555-item expansion (15 QA rules from 00-rules.md).
 * Run: npx tsx src/data/extensionPool/integrity.test.ts
 */
import { FOUNDATION_MODULES } from '../foundations'
import {
  ALL_POOLS,
  BASE_POOLS,
  EXTENSION_COUNTS,
  EXTENSION_POOLS,
  EXTENSION_TARGET,
  TOTAL_TRAINING_TARGET,
} from './index'
import { MOVE_GROUPS, MOVE_VERB_INDEX } from '../../lib/moveGroups'
import { buildRound, difficultyWeights } from '../../lib/session'
import { normalizeSentence } from '../../lib/tokenize'
import type { ProgressState } from '../../lib/progress'
import type { FullAnalysisItem, Pools } from '../../types/pools'

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg)
}

function countAll(pools: Pools): number {
  return (
    pools.boundary.length +
    pools.move.length +
    pools.predicate.length +
    pools.subject.length +
    pools.accusative.length +
    pools.dative.length +
    pools.both_objects.length +
    pools.adverbial.length +
    pools.full_analysis.length +
    pools.error_analysis.length +
    pools.wordclass.length
  )
}

function collectIds(pools: Pools): string[] {
  const ids: string[] = []
  for (const key of Object.keys(pools) as (keyof Pools)[]) {
    for (const item of pools[key]) {
      if ('id' in item && typeof item.id === 'string') ids.push(item.id)
      else if ('word' in item && 'class' in item) {
        ids.push(`wordclass:${item.word}:${item.class}`)
      }
    }
  }
  return ids
}

const PASSIVE_RE = /\b(wird|wurde|worden|wurden)\b.*\b\w+(ge|be|emp|ent|er|ver|zer)?\w*(t|en)\b|\b(wird|wurde)\b.*\b\w+t\b/i
const MOOD_TASK_RE = /\b(Konjunktiv|Imperativ|Modus)\b/i

// --- 1 IDs eindeutig ---
{
  const ids = collectIds(ALL_POOLS)
  const set = new Set(ids)
  assert(set.size === ids.length, `1 IDs eindeutig: duplicate among ${ids.length} (unique ${set.size})`)
  console.log('✓ 1 IDs eindeutig')
}

// --- 2 keine alten IDs überschrieben ---
{
  const baseIds = new Set(collectIds(BASE_POOLS))
  const extIds = collectIds(EXTENSION_POOLS)
  for (const id of extIds) {
    assert(!baseIds.has(id), `2 old ID overwritten: ${id}`)
  }
  // Base pool object identity / content unchanged counts
  assert(BASE_POOLS.boundary.length === 20, '2 base boundary count')
  assert(BASE_POOLS.move.length === 10, '2 base move count')
  assert(BASE_POOLS.predicate.length === 20, '2 base predicate count')
  assert(BASE_POOLS.subject.length === 15, '2 base subject count')
  assert(BASE_POOLS.accusative.length === 15, '2 base accusative count')
  assert(BASE_POOLS.dative.length === 15, '2 base dative count')
  assert(BASE_POOLS.both_objects.length === 12, '2 base both_objects count')
  assert(BASE_POOLS.adverbial.length === 24, '2 base adverbial count')
  assert(BASE_POOLS.full_analysis.length === 20, '2 base full_analysis count')
  assert(BASE_POOLS.error_analysis.length === 10, '2 base error_analysis count')
  assert(BASE_POOLS.wordclass.length === 24, '2 base wordclass count')
  console.log('✓ 2 keine alten IDs überschrieben')
}

// --- 3 exakt 370 neu ---
{
  assert(countAll(EXTENSION_POOLS) === EXTENSION_TARGET, `3 expected 370 new, got ${countAll(EXTENSION_POOLS)}`)
  for (const [k, n] of Object.entries(EXTENSION_COUNTS)) {
    const got = EXTENSION_POOLS[k as keyof typeof EXTENSION_COUNTS].length
    assert(got === n, `3 ${k}: expected ${n} new, got ${got}`)
  }
  console.log('✓ 3 exakt 370 neu')
}

// --- 4 gesamt 555 ---
{
  const total = countAll(ALL_POOLS)
  assert(total === TOTAL_TRAINING_TARGET, `4 total ${total} != 555`)
  console.log('✓ 4 gesamt 555')
}

// --- 5 Verteilung 60/30/60/45/45/45/36/72/60/30/72 ---
{
  const expected: [keyof Pools, number][] = [
    ['boundary', 60],
    ['move', 30],
    ['predicate', 60],
    ['subject', 45],
    ['accusative', 45],
    ['dative', 45],
    ['both_objects', 36],
    ['adverbial', 72],
    ['full_analysis', 60],
    ['error_analysis', 30],
    ['wordclass', 72],
  ]
  for (const [k, n] of expected) {
    assert(ALL_POOLS[k].length === n, `5 ${k}: ${ALL_POOLS[k].length} != ${n}`)
  }
  console.log('✓ 5 Verteilung')
}

// --- 6 Full-Analyse: alle Tokens zugeordnet ---
{
  for (const item of ALL_POOLS.full_analysis as FullAnalysisItem[]) {
    const covered = new Set<number>()
    for (const c of item.constituents) {
      if (c.tokenIndexes?.length) {
        for (const i of c.tokenIndexes) covered.add(i)
      } else {
        for (let i = c.start; i <= c.end; i++) covered.add(i)
      }
    }
    assert(
      covered.size === item.tokens.length &&
        [...covered].every((i) => i >= 0 && i < item.tokens.length),
      `6 full ${item.id}: tokens not fully covered`,
    )
  }
  console.log('✓ 6 Full-Analyse Tokens')
}

// --- 7 mehrteilige Prädikate vollständig ---
{
  for (const item of ALL_POOLS.predicate) {
    for (const part of item.parts) {
      assert(
        item.sentence.toLowerCase().includes(part.toLowerCase()),
        `7 predicate ${item.id}: part „${part}“ missing in sentence`,
      )
    }
  }
  for (const item of ALL_POOLS.full_analysis) {
    assert(item.predicateParts.length >= 1, `7 full ${item.id}: empty predicateParts`)
    for (const idx of item.predicateParts) {
      assert(idx >= 0 && idx < item.tokens.length, `7 full ${item.id}: bad pred index`)
    }
    const predConst = item.constituents.filter((c) => c.role === 'predicate')
    assert(predConst.length >= 1, `7 full ${item.id}: no predicate constituent`)
  }
  console.log('✓ 7 mehrteilige Prädikate')
}

// --- 8 Subjekt = volle Wortgruppe ---
{
  for (const item of ALL_POOLS.subject) {
    assert(
      item.sentence.toLowerCase().includes(item.subject.toLowerCase()),
      `8 subject ${item.id}: „${item.subject}“ not in sentence`,
    )
    // multi-word subjects should keep articles/adjectives
    const words = item.subject.trim().split(/\s+/)
    if (words.length > 1) {
      assert(
        /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|mein|meine|dein|seine|ihr|unsere|unser|dieser|diese|dieses|jene|kein|keine|viele|mehrere|beide|drei|zwei|niemand|ben|mia|paul|lena|sie|wir)/i.test(
          words[0],
        ) || /^[A-ZÄÖÜ]/.test(words[0]),
        `8 subject ${item.id}: suspicious truncated group „${item.subject}“`,
      )
    }
  }
  console.log('✓ 8 Subjekt volle Wortgruppe')
}

// --- 9 Kasus/Frageprobe DO/AO ---
{
  for (const item of ALL_POOLS.accusative) {
    assert(
      item.sentence.toLowerCase().includes(item.obj.toLowerCase()),
      `9 accusative ${item.id}: obj not in sentence`,
    )
  }
  for (const item of ALL_POOLS.dative) {
    assert(
      item.sentence.toLowerCase().includes(item.obj.toLowerCase()),
      `9 dative ${item.id}: obj not in sentence`,
    )
  }
  for (const item of ALL_POOLS.both_objects) {
    assert(
      item.sentence.toLowerCase().includes(item.dative.toLowerCase()),
      `9 both ${item.id}: dative missing`,
    )
    assert(
      item.sentence.toLowerCase().includes(item.accusative.toLowerCase()),
      `9 both ${item.id}: accusative missing`,
    )
    assert(
      item.dative.toLowerCase() !== item.accusative.toLowerCase(),
      `9 both ${item.id}: DO==AO`,
    )
  }
  console.log('✓ 9 Kasus/Frageprobe DO/AO')
}

// --- 10 Adv. nach Funktion im Satz ---
{
  const roles = new Set(['temporal', 'lokal', 'kausal', 'modal'])
  for (const item of ALL_POOLS.adverbial) {
    assert(roles.has(item.role), `10 adverbial ${item.id ?? item.target}: bad role`)
    assert(
      item.sentence.toLowerCase().includes(item.target.toLowerCase()),
      `10 adverbial: target missing`,
    )
  }
  console.log('✓ 10 Adv. nach Funktion')
}

// --- 11 keine Präpositionalobjekte in Full ---
{
  for (const item of ALL_POOLS.full_analysis) {
    for (const c of item.constituents) {
      assert(
        !String(c.role).includes('prepositional') && c.role !== ('object_prepositional' as never),
        `11 full ${item.id}: prepositional object`,
      )
    }
  }
  console.log('✓ 11 keine Präpositionalobjekte in Full')
}

// --- 12 kein Passiv ---
{
  for (const item of EXTENSION_POOLS.full_analysis) {
    // Training focus: no passive as learning object — reject werden+Partizip as sole predicate pattern
    const pred = item.constituents.find((c) => c.role === 'predicate')
    if (!pred) continue
    const predText = pred.tokenIndexes
      ? pred.tokenIndexes.map((i) => item.tokens[i]).join(' ')
      : item.tokens.slice(pred.start, pred.end + 1).join(' ')
    // Allow "wird … zeigen/schließen/erklären" as Futur/Modal-ish future (finite wird + infinitive), not passive
    const joined = predText.toLowerCase()
    const isFutureInfinitive =
      /\bwird\b/.test(joined) &&
      pred.tokenIndexes &&
      pred.tokenIndexes.length === 2 &&
      !/(ge\w+t|ge\w+en)$/.test(item.tokens[pred.tokenIndexes[1]].toLowerCase())
    if (/\b(wird|wurde|worden)\b/.test(joined) && !isFutureInfinitive) {
      assert(false, `12 passive suspected in ${item.id}: ${predText}`)
    }
  }
  console.log('✓ 12 kein Passiv')
}

// --- 13 keine Modi-Aufgaben ---
{
  for (const key of Object.keys(EXTENSION_POOLS) as (keyof Pools)[]) {
    for (const item of EXTENSION_POOLS[key]) {
      const blob = JSON.stringify(item)
      assert(!MOOD_TASK_RE.test(blob), `13 mood task in ${key}`)
    }
  }
  console.log('✓ 13 keine Modi-Aufgaben')
}

// --- 14 keine auto-generierten Extra-Lösungen ---
{
  // Extension move items list exactly the specified valid sentence(s) from the brief
  for (const item of EXTENSION_POOLS.move) {
    assert(item.valid.length >= 1, `14 move ${item.id}: empty valid`)
    assert(item.valid.length <= 3, `14 move ${item.id}: suspiciously many auto-valid (${item.valid.length})`)
    assert(MOVE_GROUPS[item.id]?.length > 0, `14 move ${item.id}: missing MOVE_GROUPS`)
    assert(MOVE_VERB_INDEX[item.id]?.length > 0, `14 move ${item.id}: missing verb index`)
  }
  console.log('✓ 14 keine Extra-Lösungen / move groups present')
}

// --- 15 keine identischen normalisierten Sätze im selben Exp-Pool (außer bewusste andere Mechanik) ---
{
  const byArea: (keyof Pools)[] = [
    'boundary',
    'move',
    'predicate',
    'subject',
    'accusative',
    'dative',
    'both_objects',
    'adverbial',
    'full_analysis',
    'error_analysis',
  ]
  for (const area of byArea) {
    const seen = new Map<string, string>()
    for (const item of EXTENSION_POOLS[area]) {
      if (!('sentence' in item) || typeof item.sentence !== 'string') continue
      const norm = normalizeSentence(item.sentence)
      const prev = seen.get(norm)
      assert(!prev, `15 duplicate sentence in ${area}: ${item.id} vs ${prev}`)
      seen.set(norm, 'id' in item ? String(item.id) : norm)
    }
  }
  console.log('✓ 15 keine identischen Sätze im Exp-Pool')
}

// Grundlagen unverändert (10)
{
  assert(FOUNDATION_MODULES.length === 10, `Grundlagen ${FOUNDATION_MODULES.length} != 10`)
  console.log('✓ Grundlagen 10 unverändert (count)')
}

// Round builder / adaptive / dedupe smoke
{
  const progress: ProgressState = {
    foundationsStep: 10,
    foundationsCompleted: true,
    areas: { boundary: { attempts: 20, correct: 18 } },
    roundsStarted: { boundary: 4 },
  }
  const w = difficultyWeights(progress, 'boundary')
  assert(w[2] + w[3] > w[1] * 0.5, 'adaptive should raise d2/d3 with high accuracy')

  for (const area of [
    'boundary',
    'move',
    'predicate',
    'subject',
    'accusative',
    'dative',
    'both_objects',
    'adverbial',
    'full_analysis',
    'mixed',
  ] as const) {
    const round = buildRound(area)
    assert(round.length > 0, `empty round for ${area}`)
    const ids = round
      .map((t) => {
        const d = t.data as { id?: string; word?: string; class?: string }
        return d.id ?? (d.word ? `wordclass:${d.word}:${d.class}` : undefined)
      })
      .filter(Boolean) as string[]
    assert(new Set(ids).size === ids.length, `round dedupe ids failed for ${area}`)
    const sents = round
      .map((t) => {
        const d = t.data as { sentence?: string }
        return d.sentence ? normalizeSentence(d.sentence) : undefined
      })
      .filter(Boolean) as string[]
    assert(new Set(sents).size === sents.length, `round dedupe sentences failed for ${area}`)
  }
  console.log('✓ TaskSelector rounds + adaptive + dedupe')
}

// Silence unused
void PASSIVE_RE

console.log('\nextensionPool integrity.test.ts OK')
