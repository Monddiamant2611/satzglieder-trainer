import type { AreaId } from '../data/areas'

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
}

const defaultState = (): ProgressState => ({
  foundationsStep: 0,
  foundationsCompleted: false,
  areas: {},
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

export function areaPercent(stats?: AreaStats): number | null {
  if (!stats || !stats.attempts) return null
  return Math.round((stats.correct / stats.attempts) * 100)
}
