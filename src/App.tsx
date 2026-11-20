import { useEffect, useState } from 'react'
import { type AreaId } from './data/areas'
import { FOUNDATION_TOTAL } from './data/foundations'
import {
  loadProgress,
  recordAreaResult,
  setFoundationsStep,
  type ProgressState,
} from './lib/progress'
import { HomePage } from './pages/HomePage'
import { FoundationsPage } from './pages/FoundationsPage'
import { TrainPathPage } from './pages/TrainPathPage'
import { SessionPage } from './pages/SessionPage'
import { CompletionPage } from './pages/CompletionPage'
import { ProgressPage } from './pages/ProgressPage'

type View =
  | { name: 'home' }
  | { name: 'foundations' }
  | { name: 'train' }
  | { name: 'progress' }
  | { name: 'session'; areaId: AreaId; forceTutorial?: boolean }
  | {
      name: 'completion'
      areaId: AreaId
      correct: number
      total: number
      byType: Record<string, { correct: number; total: number }>
    }

export default function App() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [view, setView] = useState<View>({ name: 'home' })
  const [menuOpen, setMenuOpen] = useState(false)
  const [sessionKey, setSessionKey] = useState(0)

  useEffect(() => {
    setProgress(loadProgress())
  }, [view])

  const goHome = () => {
    setMenuOpen(false)
    setView({ name: 'home' })
  }

  const startArea = (id: AreaId, opts?: { forceTutorial?: boolean }) => {
    setSessionKey((k) => k + 1)
    setView({ name: 'session', areaId: id, forceTutorial: opts?.forceTutorial })
  }

  const navButton = (
    id: string,
    label: string,
    active: boolean,
    onClick: () => void,
  ) => (
    <button
      key={id}
      type="button"
      className={active ? 'active' : ''}
      onClick={() => {
        setMenuOpen(false)
        onClick()
      }}
    >
      {label}
    </button>
  )

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Zum Inhalt
      </a>
      <button
        type="button"
        className="mobile-menu"
        aria-label="Menü"
        onClick={() => setMenuOpen((o) => !o)}
      >
        ☰
      </button>
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <button type="button" className="brand" onClick={goHome}>
          <span className="brand-mark" aria-hidden>
            Sg
          </span>
          <span>
            Satzglieder
            <small>Trainer · Klasse 6</small>
          </span>
        </button>
        <nav aria-label="Hauptnavigation">
          {navButton('home', 'Start', view.name === 'home', goHome)}
          {navButton('foundations', 'Grundlagen', view.name === 'foundations', () =>
            setView({ name: 'foundations' }),
          )}
          {navButton('train', 'Trainieren', view.name === 'train' || view.name === 'session', () =>
            setView({ name: 'train' }),
          )}
          {navButton('progress', 'Fortschritt', view.name === 'progress', () =>
            setView({ name: 'progress' }),
          )}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <p className="muted-note" style={{ color: 'var(--sidebar-text)', opacity: 0.75 }}>
            Schwester-App zum Adverbien-Trainer
          </p>
        </div>
      </aside>

      <main id="main" className="content-shell">
        {view.name === 'home' ? (
          <HomePage
            progress={progress}
            onStartFoundations={() => setView({ name: 'foundations' })}
            onOpenTrain={() => setView({ name: 'train' })}
            onOpenProgress={() => setView({ name: 'progress' })}
            onStartArea={(id) => startArea(id)}
          />
        ) : null}

        {view.name === 'foundations' ? (
          <FoundationsPage
            initialModule={
              progress.foundationsCompleted
                ? 0
                : Math.min(progress.foundationsStep, FOUNDATION_TOTAL - 1)
            }
            onProgress={(moduleIndex, completed) => {
              setProgress(setFoundationsStep(moduleIndex, completed))
            }}
            onExit={goHome}
            onFinishedToTrain={() => setView({ name: 'train' })}
          />
        ) : null}

        {view.name === 'train' ? (
          <TrainPathPage progress={progress} onBack={goHome} onStart={startArea} />
        ) : null}

        {view.name === 'progress' ? (
          <ProgressPage progress={progress} onBack={goHome} />
        ) : null}

        {view.name === 'session' ? (
          <SessionPage
            key={sessionKey}
            areaId={view.areaId}
            progress={progress}
            forceTutorial={view.forceTutorial}
            onProgress={setProgress}
            onAbort={() => setView({ name: 'train' })}
            onComplete={(correct, total, byType) => {
              setProgress(recordAreaResult(view.areaId, correct, total))
              setView({
                name: 'completion',
                areaId: view.areaId,
                correct,
                total,
                byType,
              })
            }}
          />
        ) : null}

        {view.name === 'completion' ? (
          <CompletionPage
            areaId={view.areaId}
            correct={view.correct}
            total={view.total}
            byType={view.byType}
            onAgain={() => startArea(view.areaId)}
            onTrainPath={() => setView({ name: 'train' })}
            onHome={goHome}
          />
        ) : null}
      </main>
    </div>
  )
}
