import { useMemo, useState } from 'react'
import { FOUNDATION_MODULES, FOUNDATION_TOTAL } from '../data/foundations'
import { FoundationStep } from '../components/FoundationStep'
import { TrainerProgress } from '../components/TrainerProgress'

type Props = {
  initialModule?: number
  onProgress: (moduleIndex: number, completed: boolean) => void
  onExit: () => void
  onFinishedToTrain: () => void
}

export function FoundationsPage({
  initialModule = 0,
  onProgress,
  onExit,
  onFinishedToTrain,
}: Props) {
  const start = Math.min(Math.max(initialModule, 0), FOUNDATION_TOTAL - 1)
  const [moduleIndex, setModuleIndex] = useState(start)
  const [screenIndex, setScreenIndex] = useState(0)

  const mod = FOUNDATION_MODULES[moduleIndex]
  const screen = mod.screens[screenIndex]
  const globalStep = useMemo(() => {
    let n = 0
    for (let i = 0; i < moduleIndex; i++) n += FOUNDATION_MODULES[i].screens.length
    return n + screenIndex + 1
  }, [moduleIndex, screenIndex])
  const globalTotal = useMemo(
    () => FOUNDATION_MODULES.reduce((s, m) => s + m.screens.length, 0),
    [],
  )

  const advance = () => {
    if (screenIndex < mod.screens.length - 1) {
      setScreenIndex(screenIndex + 1)
      return
    }
    const nextModule = moduleIndex + 1
    if (nextModule >= FOUNDATION_TOTAL) {
      onProgress(FOUNDATION_TOTAL, true)
      onFinishedToTrain()
      return
    }
    onProgress(nextModule, false)
    setModuleIndex(nextModule)
    setScreenIndex(0)
  }

  return (
    <div className="content-knowledge">
      <div className="exercise-top">
        <p className="eyebrow">
          {mod.kicker} · {mod.title}
        </p>
        <button type="button" className="overview-link" onClick={onExit}>
          Beenden
        </button>
      </div>
      <TrainerProgress
        current={globalStep - 1}
        total={globalTotal}
        label={`Schritt ${globalStep} von ${globalTotal}`}
        accent="sage"
      />
      <div className="learning-card learning-card--roomy" style={{ marginTop: 16 }}>
        <FoundationStep
          key={`${moduleIndex}-${screenIndex}`}
          screen={screen}
          onContinue={advance}
        />
      </div>
    </div>
  )
}
