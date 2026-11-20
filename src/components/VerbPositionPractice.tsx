import { useState } from 'react'
import { ClassificationTask } from './ClassificationTask'
import {
  VERB_POSITION_CHOICES,
  VERB_POSITION_META,
  VERB_POSITION_POOL,
  type VerbPositionItem,
} from '../data/verbPosition'

const DEMO: VerbPositionItem[] = [
  VERB_POSITION_POOL.find((p) => p.id === 'vp02')!,
  VERB_POSITION_POOL.find((p) => p.id === 'vp04')!,
  VERB_POSITION_POOL.find((p) => p.id === 'vp07')!,
  VERB_POSITION_POOL.find((p) => p.id === 'vp10')!,
]

/** Soft interactive examples for tutorials (not scored for progress). */
export function VerbPositionPractice() {
  const [index, setIndex] = useState(0)
  const item = DEMO[index % DEMO.length]
  const meta = VERB_POSITION_META[item.position]

  return (
    <div style={{ marginTop: 12 }}>
      <p className="task-kicker">Gemeinsam · Verbstellung</p>
      <ClassificationTask
        key={item.id}
        soft
        prompt="Welcher Fachbegriff passt zur Verbstellung?"
        sentence={item.sentence}
        choices={VERB_POSITION_CHOICES}
        correctId={item.position}
        explainCorrect={`${meta.term}: ${item.note ?? meta.definition}`}
        explainWrong={`Tipp: ${meta.tip} Vergleich Haupt- vs. Nebensatz und Frage vs. Aussage.`}
        onResult={() => {
          /* soft – continue freely */
        }}
      />
      <div className="intro-actions" style={{ marginTop: 12 }}>
        <button
          type="button"
          className="secondary-button"
          onClick={() => setIndex((i) => i + 1)}
        >
          Nächstes Beispiel
        </button>
      </div>
      {item.multipart ? (
        <p className="muted-note" style={{ marginTop: 8 }}>
          Mehrteiliges Prädikat: Achte auf die Satzklammer – das finite Verb bestimmt die Stellung.
        </p>
      ) : null}
    </div>
  )
}
