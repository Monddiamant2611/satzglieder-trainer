import { useState } from 'react'
import { MoveTask } from './MoveTask'
import { ClassificationTask } from './ClassificationTask'
import { VERB_POSITION_CHOICES, VERB_POSITION_META } from '../data/verbPosition'
import type { VerbPositionMoveItem } from '../data/verbPosition'

type Props = {
  data: VerbPositionMoveItem
  onResult: (ok: boolean) => void
}

/**
 * DnD Umsstellung (Hauptsatz) → danach Fachbegriff Verbzweitstellung benennen.
 * No position markers during independent practice.
 */
export function VerbPositionMoveLabelTask({ data, onResult }: Props) {
  const [phase, setPhase] = useState<'move' | 'label'>('move')
  const [moveOk, setMoveOk] = useState(false)

  if (phase === 'move') {
    return (
      <MoveTask
        groups={data.groups}
        verbIndexes={data.verbIndexes}
        validSentences={data.valid}
        originalSentence={data.originalSentence}
        prompt="Stelle den Satz um (Drag-and-Drop). Im Aussagesatz bleibt Verbzweitstellung."
        explainCorrect="Die Umsstellung ist möglich – Verbzweitstellung ist erhalten."
        explainWrong="Prüfe die Satzgliedgrenzen und die Verbzweitstellung (finites Verb an Position 2)."
        onResult={(ok) => {
          setMoveOk(ok)
          setPhase('label')
        }}
      />
    )
  }

  return (
    <div>
      <p className="muted-note" style={{ marginBottom: 12 }}>
        Umsstellung war {moveOk ? 'gültig' : 'noch nicht gültig'}. Benenne jetzt die Verbstellung
        im Aussagesatz mit dem Fachbegriff.
      </p>
      <ClassificationTask
        prompt="Welche Verbstellung liegt in diesem Aussagesatz vor?"
        sentence={data.originalSentence}
        choices={VERB_POSITION_CHOICES}
        correctId="verbzweit"
        explainCorrect={`Richtig: ${VERB_POSITION_META.verbzweit.term} – ${VERB_POSITION_META.verbzweit.short}.`}
        explainWrong="Denk an Hauptsätze: Nach dem ersten Satzglied folgt das finite Verb → Verbzweitstellung."
        onResult={(ok) => onResult(moveOk && ok)}
      />
    </div>
  )
}
