import { useState } from 'react'
import { ADVERBIAL_LABELS } from '../data/roles'
import { MOVE_GROUPS, MOVE_VERB_INDEX } from '../lib/moveGroups'
import type {
  AdverbialItem,
  BothObjectsItem,
  BoundaryItem,
  ErrorAnalysisItem,
  FullAnalysisItem,
  MoveItem,
  ObjectItem,
  PredicateItem,
  SubjectItem,
  WordclassItem,
} from '../types/pools'
import { ClassificationTask } from './ClassificationTask'
import { FullAnalysisTask } from './FullAnalysisTask'
import { MarkingTask } from './MarkingTask'
import { MoveTask } from './MoveTask'
import { SentenceSplitter } from './SentenceSplitter'
import { FeedbackPanel } from './FeedbackPanel'

export type TaskItem =
  | { type: 'boundary'; data: BoundaryItem }
  | { type: 'move'; data: MoveItem }
  | { type: 'predicate'; data: PredicateItem }
  | { type: 'subject'; data: SubjectItem }
  | { type: 'accusative'; data: ObjectItem }
  | { type: 'dative'; data: ObjectItem }
  | { type: 'both_objects'; data: BothObjectsItem }
  | { type: 'adverbial'; data: AdverbialItem }
  | { type: 'full_analysis'; data: FullAnalysisItem }
  | { type: 'wordclass'; data: WordclassItem }
  | { type: 'error_analysis'; data: ErrorAnalysisItem }

type Props = {
  item: TaskItem
  onResult: (ok: boolean) => void
}

export function TaskRenderer({ item, onResult }: Props) {
  switch (item.type) {
    case 'boundary':
      return (
        <SentenceSplitter
          sentence={item.data.sentence}
          groups={item.data.groups}
          prompt="Setze die Grenzen zwischen den Satzgliedern."
          explainCorrect="Die Satzglieder sind richtig getrennt."
          explainWrong="Vergleiche mit der Verschiebeprobe: Was gehört zusammen?"
          onResult={onResult}
        />
      )
    case 'move': {
      const groups = MOVE_GROUPS[item.data.id] ?? []
      const verbs = MOVE_VERB_INDEX[item.data.id] ?? [1]
      return (
        <MoveTask
          groups={groups}
          verbIndexes={verbs}
          validSentences={item.data.valid}
          originalSentence={item.data.sentence}
          prompt="Ziehe Satzglieder per Drag-and-Drop. Das finite Verb bleibt an Position 2."
          explainCorrect="Diese Umsstellung ist möglich – die Gruppen bleiben intakt."
          explainWrong="Prüfe, ob die Gruppen zusammengeblieben sind und das Verb an Position 2 steht."
          onResult={onResult}
        />
      )
    }
    case 'predicate':
      return (
        <MarkingTask
          sentence={item.data.sentence}
          targetPhrases={item.data.parts}
          prompt="Markiere alle Teile des Prädikats."
          explainCorrect={`Prädikat: ${item.data.parts.join(' … ')}`}
          explainWrong="Denk an mehrteilige Formen (hat … gemacht) und Partikelverben (räumt … auf)."
          onResult={onResult}
        />
      )
    case 'subject':
      return (
        <MarkingTask
          sentence={item.data.sentence}
          targetPhrases={[item.data.subject]}
          prompt="Markiere das Subjekt (Wer oder was?)."
          explainCorrect={`Subjekt: ${item.data.subject}`}
          explainWrong={`Frage: Wer oder was + „${item.data.predicate}“? Markiere die ganze Gruppe.`}
          onResult={onResult}
        />
      )
    case 'accusative':
      return (
        <MarkingTask
          sentence={item.data.sentence}
          targetPhrases={[item.data.obj]}
          prompt="Markiere das Akkusativobjekt (Wen oder was?)."
          explainCorrect={`Akkusativobjekt: ${item.data.obj}`}
          explainWrong="Stelle die Frage: Wen oder was? – und markiere die ganze Nominalgruppe."
          onResult={onResult}
        />
      )
    case 'dative':
      return (
        <MarkingTask
          sentence={item.data.sentence}
          targetPhrases={[item.data.obj]}
          prompt="Markiere das Dativobjekt (Wem?)."
          explainCorrect={`Dativobjekt: ${item.data.obj}`}
          explainWrong="Stelle die Frage: Wem? – und markiere die ganze Nominalgruppe."
          onResult={onResult}
        />
      )
    case 'both_objects':
      return <BothObjectsTask data={item.data} onResult={onResult} />
    case 'adverbial':
      return (
        <ClassificationTask
          prompt="Welche Art von Adverbiale ist hervorgehoben?"
          sentence={item.data.sentence}
          highlight={item.data.target}
          choices={(
            ['temporal', 'lokal', 'kausal', 'modal'] as const
          ).map((id) => ({ id, label: ADVERBIAL_LABELS[id] }))}
          correctId={item.data.role}
          explainCorrect={`„${item.data.target}“ ist ${ADVERBIAL_LABELS[item.data.role]}.`}
          explainWrong="Orientiere dich an der Funktion: Wann? Wo? Warum? Wie?"
          onResult={onResult}
        />
      )
    case 'full_analysis':
      return (
        <FullAnalysisTask
          sentence={item.data.sentence}
          tokens={item.data.tokens}
          constituents={item.data.constituents}
          predicateParts={item.data.predicateParts}
          onResult={onResult}
        />
      )
    case 'wordclass':
      return (
        <ClassificationTask
          prompt={`Welche Wortart hat „${item.data.word}“?`}
          choices={['Substantiv', 'Verb', 'Adjektiv', 'Präposition'].map((c) => ({
            id: c,
            label: c,
          }))}
          correctId={item.data.class}
          explainCorrect={`„${item.data.word}“ ist ein ${item.data.class}.`}
          explainWrong={`Die Lösung ist: ${item.data.class}.`}
          onResult={onResult}
        />
      )
    case 'error_analysis':
      return <ErrorFindTask data={item.data} onResult={onResult} />
    default:
      return null
  }
}

function BothObjectsTask({
  data,
  onResult,
}: {
  data: BothObjectsItem
  onResult: (ok: boolean) => void
}) {
  const [phase, setPhase] = useState<'dat' | 'dat-done' | 'akk'>('dat')
  const [datOk, setDatOk] = useState(false)

  if (phase === 'dat') {
    return (
      <MarkingTask
        key="dat"
        sentence={data.sentence}
        targetPhrases={[data.dative]}
        prompt="Zuerst: Markiere das Dativobjekt (Wem?)."
        explainCorrect={`Dativobjekt: ${data.dative}`}
        explainWrong={`Lösung Dativ: ${data.dative}`}
        onResult={(ok) => {
          setDatOk(ok)
          setPhase('dat-done')
        }}
      />
    )
  }

  if (phase === 'dat-done') {
    return (
      <div className="exercise-actions">
        <button type="button" className="primary-button" onClick={() => setPhase('akk')}>
          Weiter zum Akkusativobjekt
        </button>
      </div>
    )
  }

  return (
    <>
      <p className="muted-note">
        Dativ war {datOk ? 'richtig' : 'nicht ganz'} · jetzt Akkusativ
      </p>
      <MarkingTask
        key="akk"
        sentence={data.sentence}
        targetPhrases={[data.accusative]}
        prompt="Markiere das Akkusativobjekt (Wen oder was?)."
        explainCorrect={`Akkusativobjekt: ${data.accusative}`}
        explainWrong={`Lösung Akkusativ: ${data.accusative}`}
        onResult={(ok) => onResult(datOk && ok)}
      />
    </>
  )
}

function ErrorFindTask({
  data,
  onResult,
}: {
  data: ErrorAnalysisItem
  onResult: (ok: boolean) => void
}) {
  const wrongIndexes = data.analysis
    .map((a, i) => (a.wrong ? i : -1))
    .filter((i) => i >= 0)
  const [picked, setPicked] = useState<number[]>([])
  const [checked, setChecked] = useState(false)
  const ok =
    picked.length === wrongIndexes.length &&
    picked.every((i) => wrongIndexes.includes(i))

  return (
    <div>
      <p className="instruction-note">
        Hier ist eine Analyse mit Fehlern. Tippe alle falschen Zuordnungen an.
      </p>
      <p className="prompt-sentence">{data.sentence}</p>
      <div className="choice-list task-options--wide">
        {data.analysis.map((a, i) => (
          <button
            key={`${a.text}-${i}`}
            type="button"
            className={`choice-option ${picked.includes(i) ? 'selected' : ''} ${
              checked && a.wrong ? 'solution' : ''
            } ${checked && !ok && picked.includes(i) && !a.wrong ? 'mismatch' : ''}`}
            disabled={checked}
            onClick={() =>
              setPicked((prev) =>
                prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
              )
            }
          >
            <span className="choice-check" />
            <span>
              <strong>{a.text}</strong> → {a.shown}
              {checked && a.wrong ? (
                <span className="muted-note">
                  {' '}
                  (richtig: {a.correct ?? '?'})
                </span>
              ) : null}
            </span>
          </button>
        ))}
      </div>
      <div className="exercise-actions">
        {!checked ? (
          <button
            type="button"
            className="primary-button"
            disabled={!picked.length}
            onClick={() => {
              setChecked(true)
              const match =
                picked.length === wrongIndexes.length &&
                picked.every((i) => wrongIndexes.includes(i))
              onResult(match)
            }}
          >
            Prüfen
          </button>
        ) : null}
      </div>
      {checked ? (
        <FeedbackPanel variant={ok ? 'correct' : 'wrong'} title={ok ? 'Fehler gefunden!' : 'Nicht alle'}>
          {ok
            ? 'Du hast die falschen Zuordnungen erkannt.'
            : 'Vergleiche die markierten Stellen mit der Lösung.'}
        </FeedbackPanel>
      ) : null}
    </div>
  )
}
