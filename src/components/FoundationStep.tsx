import { useState } from 'react'
import type { FoundationScreen } from '../data/foundations'
import { MoveTask } from './MoveTask'
import { MarkingTask } from './MarkingTask'
import { ClassificationTask } from './ClassificationTask'
import { QuestionTask } from './QuestionTask'
import { FeedbackPanel } from './FeedbackPanel'

type Props = {
  screen: FoundationScreen
  onContinue: () => void
}

export function FoundationStep({ screen, onContinue }: Props) {
  const [acted, setActed] = useState(false)
  const [buildPicked, setBuildPicked] = useState<string[]>([])
  const [tapSelected, setTapSelected] = useState<number[]>([])
  const [checkAnswers, setCheckAnswers] = useState<Record<string, string>>({})
  const [checkDone, setCheckDone] = useState(false)

  if (screen.kind === 'example') {
    return (
      <div className="intro-screen">
        <p className="eyebrow">Beispiel</p>
        <h1>{screen.title}</h1>
        <p className="intro-lead">{screen.lead}</p>
        {screen.sentence ? <p className="prompt-sentence">{screen.sentence}</p> : null}
        {screen.blocks ? (
          <div className="intro-word-cards">
            {screen.blocks.map((b) => (
              <div key={b.text} className="intro-word-card" style={toneStyle(b.tone)}>
                {b.text}
              </div>
            ))}
          </div>
        ) : null}
        {screen.highlight ? (
          <div className="intro-groups">
            {screen.highlight.map((h) => (
              <div key={h.label} className="intro-group" style={toneStyle(h.tone)}>
                <div className="intro-group-title">{h.text}</div>
                <span className="muted-note">{h.label}</span>
              </div>
            ))}
          </div>
        ) : null}
        {screen.note ? <p className="muted-note">{screen.note}</p> : null}
        <div className="intro-actions">
          <button type="button" className="primary-button" onClick={onContinue}>
            Weiter
          </button>
        </div>
      </div>
    )
  }

  if (screen.kind === 'observe') {
    return (
      <div className="intro-screen">
        <p className="eyebrow">Beobachten</p>
        <h1>{screen.title}</h1>
        <p className="intro-lead">{screen.lead}</p>
        {screen.sentence ? <p className="prompt-sentence">{screen.sentence}</p> : null}
        <ul className="practice-hint-list">
          {screen.points.map((p) => (
            <li key={p}>
              <strong>{p}</strong>
            </li>
          ))}
        </ul>
        <div className="intro-actions">
          <button type="button" className="primary-button" onClick={onContinue}>
            Weiter
          </button>
        </div>
      </div>
    )
  }

  if (screen.kind === 'explain') {
    return (
      <div className="intro-screen">
        <p className="eyebrow">Erklären</p>
        <h1>{screen.title}</h1>
        <p className="intro-lead">{screen.lead}</p>
        {screen.body.map((b) => (
          <p key={b}>{b}</p>
        ))}
        <div className="intro-actions">
          <button type="button" className="primary-button" onClick={onContinue}>
            Weiter
          </button>
        </div>
      </div>
    )
  }

  if (screen.kind === 'merksatz') {
    return (
      <div className="intro-screen">
        <p className="eyebrow">Merksatz</p>
        <h1>{screen.title}</h1>
        <div className="merke-card">
          <p className="merke-label">Merke</p>
          <p className="merke-text">{screen.merke}</p>
        </div>
        {screen.extra ? <p className="muted-note">{screen.extra}</p> : null}
        <div className="intro-actions">
          <button type="button" className="primary-button" onClick={onContinue}>
            Weiter
          </button>
        </div>
      </div>
    )
  }

  if (screen.kind === 'act-build') {
    const extras = buildPicked
      .map((id) => screen.options.find((o) => o.id === id)!.text)
      .join(' ')
    const built =
      (extras
        ? `${screen.base.replace(/\.$/, '')} ${extras}.`
        : screen.base
      ).replace(/\.\./g, '.')
    return (
      <div className="intro-screen">
        <p className="eyebrow">Ausprobieren</p>
        <h1>{screen.title}</h1>
        <p className="intro-lead">{screen.lead}</p>
        <p className="prompt-sentence">{built}</p>
        <div className="intro-word-cards">
          {screen.options.map((o) => {
            const on = buildPicked.includes(o.id)
            return (
              <button
                key={o.id}
                type="button"
                className={`intro-word-card ${on ? 'active' : ''}`}
                onClick={() =>
                  setBuildPicked((prev) =>
                    on ? prev.filter((x) => x !== o.id) : [...prev, o.id],
                  )
                }
              >
                {o.question}
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-text)',
                    fontWeight: 600,
                  }}
                >
                  {o.text}
                </div>
              </button>
            )
          })}
        </div>
        {buildPicked.length ? (
          <FeedbackPanel variant="soft" title="Tipp" level={1}>
            {screen.success}
          </FeedbackPanel>
        ) : (
          <FeedbackPanel variant="hint" title="Hinweis">
            {screen.hint}
          </FeedbackPanel>
        )}
        <div className="intro-actions">
          <button
            type="button"
            className="primary-button"
            disabled={!buildPicked.length}
            onClick={onContinue}
          >
            Weiter
          </button>
        </div>
      </div>
    )
  }

  if (screen.kind === 'act-move') {
    return (
      <div className="intro-screen content-knowledge">
        <p className="eyebrow">Ausprobieren</p>
        <h1>{screen.title}</h1>
        <p className="intro-lead">{screen.lead}</p>
        {screen.revealTerm ? (
          <p className="session-mode-note">Das nennen wir gleich Verschiebeprobe.</p>
        ) : null}
        <MoveTask
          groups={screen.groups}
          verbIndexes={screen.verbIndexes}
          validSentences={screen.targets}
          originalSentence={`${screen.groups.join(' ')}.`}
          prompt="Verschiebe Satzglieder an den Anfang."
          soft
          explainCorrect={screen.success}
          explainWrong={screen.hint}
          onResult={() => setActed(true)}
        />
        <div className="intro-actions">
          <button type="button" className="primary-button" disabled={!acted} onClick={onContinue}>
            Weiter
          </button>
        </div>
      </div>
    )
  }

  if (screen.kind === 'act-tap-units') {
    const allSelected =
      screen.correctIds.every((id) => tapSelected.includes(id)) &&
      tapSelected.length === screen.correctIds.length
    return (
      <div className="intro-screen">
        <p className="eyebrow">Ausprobieren</p>
        <h1>{screen.title}</h1>
        <p className="intro-lead">{screen.lead}</p>
        <div className="chunk-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {screen.groups.map((g, i) => (
            <button
              key={g}
              type="button"
              className={`sort-card ${tapSelected.includes(i) ? 'active' : ''}`}
              onClick={() =>
                setTapSelected((prev) =>
                  prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
                )
              }
            >
              {g}
            </button>
          ))}
        </div>
        {allSelected ? (
          <FeedbackPanel variant="soft" title="Gut">
            {screen.success}
            {screen.explain ? <p className="muted-note">{screen.explain}</p> : null}
          </FeedbackPanel>
        ) : (
          <FeedbackPanel variant="hint">{screen.hint}</FeedbackPanel>
        )}
        <div className="intro-actions">
          <button
            type="button"
            className="primary-button"
            disabled={!allSelected}
            onClick={onContinue}
          >
            Weiter
          </button>
        </div>
      </div>
    )
  }

  if (screen.kind === 'act-mark') {
    return (
      <div className="intro-screen content-knowledge">
        <p className="eyebrow">Ausprobieren</p>
        <h1>{screen.title}</h1>
        <p className="intro-lead">{screen.lead}</p>
        <MarkingTask
          sentence={screen.sentence}
          targetPhrases={screen.targets}
          prompt="Tippe alle Wörter des gesuchten Satzglieds an."
          soft
          explainCorrect={screen.success}
          explainWrong={screen.hint}
          onResult={() => setActed(true)}
        />
        <div className="intro-actions">
          <button type="button" className="primary-button" disabled={!acted} onClick={onContinue}>
            Weiter
          </button>
        </div>
      </div>
    )
  }

  if (screen.kind === 'act-classify') {
    return (
      <div className="intro-screen content-knowledge">
        <p className="eyebrow">Ausprobieren</p>
        <h1>{screen.title}</h1>
        <ClassificationTask
          prompt={screen.lead}
          sentence={screen.sentence}
          highlight={screen.target}
          choices={screen.choices}
          correctId={screen.correctId}
          soft
          explainCorrect={screen.success}
          explainWrong={screen.hint}
          onResult={() => setActed(true)}
        />
        <div className="intro-actions">
          <button type="button" className="primary-button" disabled={!acted} onClick={onContinue}>
            Weiter
          </button>
        </div>
      </div>
    )
  }

  if (screen.kind === 'act-questions') {
    return (
      <div className="intro-screen content-knowledge">
        <p className="eyebrow">Ausprobieren</p>
        <h1>{screen.title}</h1>
        <QuestionTask
          prompt={screen.lead}
          sentence={screen.sentence}
          items={screen.items}
          soft
          explainCorrect={screen.success}
          explainWrong={screen.hint}
          onResult={() => setActed(true)}
        />
        <div className="intro-actions">
          <button type="button" className="primary-button" disabled={!acted} onClick={onContinue}>
            Weiter
          </button>
        </div>
      </div>
    )
  }

  if (screen.kind === 'check') {
    return (
      <div className="intro-screen foundations-check">
        <p className="eyebrow">Check</p>
        <h1>{screen.title}</h1>
        <p className="intro-lead">{screen.lead}</p>
        {screen.items.map((item) => (
          <div key={item.id} className="foundations-check-item learning-card">
            <strong>
              {item.id}. {item.prompt}
            </strong>
            {item.sentence ? <p className="muted-note">{item.sentence}</p> : null}
            <div className="choice-list">
              {item.choices.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`choice-option ${
                    checkAnswers[item.id] === c.id ? 'selected' : ''
                  } ${checkDone && c.id === item.correctId ? 'solution' : ''}`}
                  disabled={checkDone}
                  onClick={() =>
                    setCheckAnswers((prev) => ({ ...prev, [item.id]: c.id }))
                  }
                >
                  <span className="choice-radio" />
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
            {checkDone && checkAnswers[item.id] !== item.correctId ? (
              <FeedbackPanel variant="soft" level={2}>
                {item.softHint}
              </FeedbackPanel>
            ) : null}
          </div>
        ))}
        <div className="intro-actions">
          {!checkDone ? (
            <button
              type="button"
              className="primary-button"
              disabled={screen.items.some((i) => !checkAnswers[i.id])}
              onClick={() => setCheckDone(true)}
            >
              Check auswerten
            </button>
          ) : (
            <>
              <FeedbackPanel variant="soft" title="Fertig">
                {screen.outro}
              </FeedbackPanel>
              <button type="button" className="primary-button" onClick={onContinue}>
                Training starten
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return null
}

function toneStyle(tone?: string): React.CSSProperties | undefined {
  if (!tone) return undefined
  const map: Record<string, string> = {
    sage: 'var(--sage-bg)',
    sky: 'var(--sky-bg)',
    rose: 'var(--rose-bg)',
    violet: 'var(--violet-bg)',
    zone: 'var(--zone)',
    warn: 'var(--warn-bg)',
    orange: 'var(--warn-bg)',
  }
  return { background: map[tone] ?? 'var(--zone)' }
}
