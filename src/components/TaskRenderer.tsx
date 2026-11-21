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
import { VerbPositionMoveLabelTask } from './VerbPositionMoveLabelTask'
import {
  VERB_POSITION_CHOICES,
  VERB_POSITION_META,
  type VerbPositionItem,
  type VerbPositionMoveItem,
} from '../data/verbPosition'
import type { FiniteVerbExercise } from '../data/finiteVerb'

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
  | { type: 'verb_position'; data: VerbPositionItem }
  | { type: 'verb_position_move'; data: VerbPositionMoveItem }
  | { type: 'finite_verb'; data: FiniteVerbExercise }

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
          prompt="Ziehe Satzglieder per Drag-and-Drop. Im Aussagesatz gilt Verbzweitstellung."
          explainCorrect="Diese Umsstellung ist möglich – Verbzweitstellung und Satzgliedgrenzen stimmen. Beispiel: „Am Dienstag besucht die Klasse das Stadtmuseum.“"
          explainWrong="Nur ganze Satzglieder wandern. Im Aussagesatz bleibt das finite Verb an zweiter Stelle (Verschiebeprobe)."
          onResult={onResult}
        />
      )
    }
    case 'verb_position': {
      const meta = VERB_POSITION_META[item.data.position]
      return (
        <ClassificationTask
          prompt="Welche Verbstellung liegt vor? Wähle den Fachbegriff."
          sentence={item.data.sentence}
          choices={VERB_POSITION_CHOICES}
          correctId={item.data.position}
          explainCorrect={`Richtig: ${meta.term} – ${meta.short}.`}
          explainWrong="Vergleiche: Verberststellung (Frage/Aufforderung), Verbzweitstellung (Aussagesatz), Verbletztstellung (Nebensatz)."
          onResult={onResult}
        />
      )
    }
    case 'verb_position_move':
      return <VerbPositionMoveLabelTask data={item.data} onResult={onResult} />
    case 'predicate':
      return (
        <MarkingTask
          sentence={item.data.sentence}
          targetPhrases={item.data.parts}
          prompt="Markiere alle Teile des Prädikats (auch Satzklammer)."
          explainCorrect="Alle Teile des Prädikats sind markiert. Beispiel: „bringt … zurück“, „hat … vergessen“."
          explainWrong="Was geschieht? Markiere alle Verbteile – auch Partikel und Partizip (Satzklammer)."
          onResult={onResult}
        />
      )
    case 'finite_verb':
      return <FiniteVerbTask data={item.data} onResult={onResult} />
    case 'subject':
      return (
        <MarkingTask
          sentence={item.data.sentence}
          targetPhrases={[item.data.subject]}
          prompt="Markiere das Subjekt (Wer oder was?)."
          explainCorrect="Das Subjekt ist richtig markiert. Beispiel: Wer schläft? → „der kleine Hund“ (ganze Gruppe)."
          explainWrong="Frage: Wer oder was + Prädikat? Markiere die ganze Wortgruppe, nicht nur das Nomen."
          onResult={onResult}
        />
      )
    case 'accusative':
      return (
        <MarkingTask
          sentence={item.data.sentence}
          targetPhrases={[item.data.obj]}
          prompt="Markiere das Akkusativobjekt (Wen oder was?)."
          explainCorrect="Das Akkusativobjekt ist richtig markiert. Beispiel: Wen oder was liest Mia? → „einen spannenden Roman“."
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
          explainCorrect="Das Dativobjekt ist richtig markiert. Beispiel: Wem hilft die Lehrerin? → „dem neuen Schüler“."
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
          explainCorrect="Die Zuordnung stimmt. Temporal = Wann?, lokal = Wo/Wohin?, kausal = Warum?, modal = Wie?"
          explainWrong="Orientiere dich an der Funktion im Satz: Wann? Wo? Warum? Wie? – nicht nur an der Präposition."
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
          explainCorrect="Die Wortart stimmt."
          explainWrong="Prüfe Beugung und Funktion des Wortes noch einmal."
          onResult={onResult}
        />
      )
    case 'error_analysis':
      return <ErrorFindTask data={item.data} onResult={onResult} />
    default:
      return null
  }
}

function FiniteVerbTask({
  data,
  onResult,
}: {
  data: FiniteVerbExercise
  onResult: (ok: boolean) => void
}) {
  if (data.kind === 'choice') {
    return (
      <ClassificationTask
        prompt={data.prompt}
        sentence={data.sentence}
        choices={data.choices}
        correctId={data.correctId}
        explainCorrect="Die Zuordnung zum finiten Verb bzw. zur Verbstellung stimmt."
        explainWrong="Prüfe: Welche Form ist gebeugt? Wo steht das Finitum (Verberst-/Verbzweit-/Verbletztstellung)?"
        onResult={onResult}
      />
    )
  }
  return (
    <MarkingTask
      sentence={data.sentence}
      targetPhrases={data.targets}
      prompt={data.prompt}
      explainCorrect={
        data.kind === 'mark_finite'
          ? 'Das finite Verb ist richtig markiert.'
          : data.kind === 'mark_verbs'
            ? 'Alle Verbformen sind markiert.'
            : 'Das Prädikat ist vollständig markiert.'
      }
      explainWrong={
        data.kind === 'mark_finite'
          ? 'Suche die gebeugte Verbform (Person/Tempus) – nicht das Partizip allein.'
          : data.kind === 'mark_verbs'
            ? 'Markiere Verbformen, keine Substantive oder Adjektive.'
            : 'Finitum und mögliche weitere Teile (Partizip/Partikel) gehören zum Prädikat.'
      }
      onResult={onResult}
    />
  )
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
        explainCorrect="Dativobjekt richtig markiert. Frage: Wem?"
        explainWrong="Frage: Wem? – ganze Gruppe markieren (nicht mit Wen oder was? verwechseln)."
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
        Dativ war {datOk ? 'richtig' : 'noch nicht'} · jetzt Akkusativ
      </p>
      <MarkingTask
        key="akk"
        sentence={data.sentence}
        targetPhrases={[data.accusative]}
        prompt="Markiere das Akkusativobjekt (Wen oder was?)."
        explainCorrect="Akkusativobjekt richtig markiert. Frage: Wen oder was?"
        explainWrong="Frage: Wen oder was? – ganze Gruppe markieren (nicht mit Wem? verwechseln)."
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
            className={`choice-option ${picked.includes(i) ? 'selected' : ''}`}
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
            : 'Prüfe jede Zuordnung erneut mit der passenden Frage.'}
        </FeedbackPanel>
      ) : null}
    </div>
  )
}
