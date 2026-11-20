import type { AreaId } from '../data/areas'

/** Keep existing key so prior exercise progress is preserved. */
const KEY = 'satzglieder-trainer-progress-v1'

export type AreaStats = {
  attempts: number
  correct: number
  lastScore?: number
  lastAt?: string
}

export type ProgressState = {
  foundationsStep: number
  foundationsCompleted: boolean
  areas: Partial<Record<AreaId, AreaStats>>
  /** Separate from exercise success — which area tutorials were finished. */
  tutorialsCompleted?: Partial<Record<AreaId, boolean>>
  /** How many scored rounds were started per area (for rule-refresh). */
  roundsStarted?: Partial<Record<AreaId, number>>
}

const defaultState = (): ProgressState => ({
  foundationsStep: 0,
  foundationsCompleted: false,
  areas: {},
  tutorialsCompleted: {},
  roundsStarted: {},
})

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as ProgressState
    return {
      ...defaultState(),
      ...parsed,
      areas: parsed.areas ?? {},
      tutorialsCompleted: parsed.tutorialsCompleted ?? {},
      roundsStarted: parsed.roundsStarted ?? {},
    }
  } catch {
    return defaultState()
  }
}

export function saveProgress(state: ProgressState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function setFoundationsStep(step: number, completed = false): ProgressState {
  const next = loadProgress()
  next.foundationsStep = Math.max(next.foundationsStep, step)
  if (completed) next.foundationsCompleted = true
  saveProgress(next)
  return next
}

export function recordAreaResult(
  areaId: AreaId,
  correct: number,
  total: number,
): ProgressState {
  const next = loadProgress()
  const prev = next.areas[areaId] ?? { attempts: 0, correct: 0 }
  next.areas[areaId] = {
    attempts: prev.attempts + total,
    correct: prev.correct + correct,
    lastScore: total ? Math.round((correct / total) * 100) : 0,
    lastAt: new Date().toISOString(),
  }
  saveProgress(next)
  return next
}

export function markTutorialComplete(areaId: AreaId): ProgressState {
  const next = loadProgress()
  next.tutorialsCompleted = { ...next.tutorialsCompleted, [areaId]: true }
  saveProgress(next)
  return next
}

export function isTutorialComplete(progress: ProgressState, areaId: AreaId): boolean {
  return !!progress.tutorialsCompleted?.[areaId]
}

export function bumpRoundStarted(areaId: AreaId): ProgressState {
  const next = loadProgress()
  const prev = next.roundsStarted?.[areaId] ?? 0
  next.roundsStarted = { ...next.roundsStarted, [areaId]: prev + 1 }
  saveProgress(next)
  return next
}

export function roundsStartedCount(progress: ProgressState, areaId: AreaId): number {
  return progress.roundsStarted?.[areaId] ?? 0
}

export function areaPercent(stats?: AreaStats): number | null {
  if (!stats || !stats.attempts) return null
  return Math.round((stats.correct / stats.attempts) * 100)
}
