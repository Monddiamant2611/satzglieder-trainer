import { tokenize, isPunctuation } from '../lib/tokenize'
import { WordToken } from './WordToken'

type Props = {
  sentence: string
  selectedIndexes?: number[]
  solutionIndexes?: number[]
  wrongIndexes?: number[]
  interactive?: boolean
  onToggle?: (tokenIndex: number) => void
  disabled?: boolean
}

export function SentenceDisplay({
  sentence,
  selectedIndexes = [],
  solutionIndexes = [],
  wrongIndexes = [],
  interactive = false,
  onToggle,
  disabled,
}: Props) {
  const tokens = tokenize(sentence)
  const selected = new Set(selectedIndexes)
  const solution = new Set(solutionIndexes)
  const wrong = new Set(wrongIndexes)

  return (
    <div className="token-sentence prompt-sentence" role="group" aria-label="Satz">
      {tokens.map((t, i) => {
        if (isPunctuation(t)) {
          return (
            <span key={i} className="scan-punct">
              {t}
            </span>
          )
        }
        if (!interactive) {
          return <WordToken key={i} text={t} as="span" selected={selected.has(i)} />
        }
        return (
          <WordToken
            key={i}
            text={t}
            selected={selected.has(i)}
            solution={solution.has(i)}
            wrong={wrong.has(i)}
            disabled={disabled}
            onClick={() => onToggle?.(i)}
          />
        )
      })}
    </div>
  )
}
