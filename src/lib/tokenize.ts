/** Split a German sentence into word tokens, keeping punctuation separate. */
export function tokenize(sentence: string): string[] {
  const cleaned = sentence.trim()
  const parts: string[] = []
  const re = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*|[.,!?;:…„“”"«»()]/gu
  let m: RegExpExecArray | null
  while ((m = re.exec(cleaned))) {
    parts.push(m[0])
  }
  return parts
}

export function isPunctuation(token: string): boolean {
  return /^[.,!?;:…„“”"«»()]+$/.test(token)
}

export function wordsOnly(tokens: string[]): string[] {
  return tokens.filter((t) => !isPunctuation(t))
}

/** Join tokens into a readable sentence string. */
export function joinTokens(tokens: string[]): string {
  let out = ''
  for (const t of tokens) {
    if (!out) {
      out = t
      continue
    }
    if (isPunctuation(t)) out += t
    else out += ` ${t}`
  }
  return out
}

/** Find start/end word indices (ignoring punctuation) for a phrase in a sentence. */
export function findPhraseSpan(
  sentence: string,
  phrase: string,
): { start: number; end: number; wordIndexes: number[] } | null {
  const tokens = tokenize(sentence)
  const wordIdx: number[] = []
  tokens.forEach((t, i) => {
    if (!isPunctuation(t)) wordIdx.push(i)
  })
  const words = wordIdx.map((i) => tokens[i])
  const phraseWords = wordsOnly(tokenize(phrase))
  if (!phraseWords.length) return null

  for (let i = 0; i <= words.length - phraseWords.length; i++) {
    let ok = true
    for (let j = 0; j < phraseWords.length; j++) {
      if (normalize(words[i + j]) !== normalize(phraseWords[j])) {
        ok = false
        break
      }
    }
    if (ok) {
      const indexes = wordIdx.slice(i, i + phraseWords.length)
      return {
        start: indexes[0],
        end: indexes[indexes.length - 1],
        wordIndexes: indexes,
      }
    }
  }
  return null
}

export function normalize(s: string): string {
  return s
    .normalize('NFC')
    .replace(/[.…]+$/g, '')
    .toLowerCase()
}

export function normalizeSentence(s: string): string {
  return s
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .trim()
    .replace(/[.!?]$/, '')
    .toLowerCase()
}

export function sentencesEqual(a: string, b: string): boolean {
  return normalizeSentence(a) === normalizeSentence(b)
}
