import { ClassificationTask } from './ClassificationTask'
import { MarkingTask } from './MarkingTask'
import { MoveTask } from './MoveTask'
import { SentenceSplitter } from './SentenceSplitter'
import type { TutorialExercise as Exercise } from '../data/tutorials'

type Props = {
  exercise: Exercise
  exerciseKey: string
  feedbackCorrect: string
  feedbackWrong: string
  onResult: (ok: boolean) => void
}

/** Soft mini-exercises for tutorials — wrong feedback never dumps the solution. */
export function TutorialExercise({
  exercise,
  exerciseKey,
  feedbackCorrect,
  feedbackWrong,
  onResult,
}: Props) {
  switch (exercise.kind) {
    case 'choice':
      return (
        <ClassificationTask
          key={exerciseKey}
          soft
          prompt={exercise.prompt}
          sentence={exercise.sentence}
          choices={exercise.choices}
          correctId={exercise.correctId}
          explainCorrect={feedbackCorrect}
          explainWrong={feedbackWrong}
          onResult={onResult}
        />
      )
    case 'mark':
      return (
        <MarkingTask
          key={exerciseKey}
          soft
          sentence={exercise.sentence}
          targetPhrases={exercise.targets}
          prompt={exercise.prompt}
          explainCorrect={feedbackCorrect}
          explainWrong={feedbackWrong}
          onResult={onResult}
        />
      )
    case 'boundary':
      return (
        <SentenceSplitter
          key={exerciseKey}
          soft
          sentence={exercise.sentence}
          groups={exercise.groups}
          prompt={exercise.prompt}
          explainCorrect={feedbackCorrect}
          explainWrong={feedbackWrong}
          onResult={onResult}
        />
      )
    case 'move':
      return (
        <MoveTask
          key={exerciseKey}
          soft
          guideMarkers
          groups={exercise.groups}
          verbIndexes={exercise.verbIndexes}
          validSentences={exercise.valid}
          originalSentence={exercise.originalSentence}
          prompt={exercise.prompt}
          explainCorrect={feedbackCorrect}
          explainWrong={feedbackWrong}
          onResult={onResult}
        />
      )
    default:
      return null
  }
}
