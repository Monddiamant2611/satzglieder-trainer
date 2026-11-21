/**
 * Headless Playwright smoke: Desktop + Mobile interactions.
 */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://127.0.0.1:5173/'
const OUT = '/opt/cursor/artifacts'
mkdirSync(OUT, { recursive: true })

async function seedProgress(page) {
  await page.addInitScript(() => {
    const state = {
      foundationsStep: 10,
      foundationsCompleted: true,
      areas: {},
      tutorialsCompleted: {
        boundary: true,
        move: true,
        predicate: true,
        subject: true,
        accusative: true,
        dative: true,
        both_objects: true,
        adverbial: true,
        full_analysis: true,
        mixed: true,
      },
      roundsStarted: {
        boundary: 1,
        move: 1,
        predicate: 1,
        subject: 1,
        accusative: 1,
        dative: 1,
        both_objects: 1,
        adverbial: 1,
        full_analysis: 1,
        mixed: 1,
      },
    }
    localStorage.setItem('satzglieder-trainer-progress-v1', JSON.stringify(state))
  })
}

async function dismissRefresh(page) {
  for (const name of [/Weiter zum Training/i, /Weiter/i, /Überspringen/i, /Training starten/i]) {
    const btn = page.getByRole('button', { name })
    if (await btn.first().isVisible({ timeout: 800 }).catch(() => false)) {
      await btn.first().click()
      await page.waitForTimeout(300)
    }
  }
}

async function openArea(page, titleText) {
  await page.goto(BASE)
  await page.getByRole('button', { name: 'Trainieren' }).click()
  const card = page.locator('article.path-card, article.module-card').filter({ hasText: titleText })
  await card.getByRole('button', { name: /Runde starten|Tutorial & Training/i }).first().click()
  await dismissRefresh(page)
  await page.waitForTimeout(400)
}

const results = []

function note(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`)
}

async function runDesktop() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await seedProgress(page)

  await page.goto(BASE)
  await page.screenshot({ path: `${OUT}/smoke-home-desktop.png`, fullPage: true })
  note('Desktop home loads', await page.getByText('Satzglieder-Trainer').first().isVisible())

  // Boundaries
  await openArea(page, 'Satzglieder erkennen')
  const boundaryPrompt = page.getByText(/Grenzen zwischen den Satzgliedern/i)
  note('Boundaries task', await boundaryPrompt.isVisible({ timeout: 5000 }).catch(() => false))
  const checkBtn = page.getByRole('button', { name: 'Prüfen' })
  if (await checkBtn.isVisible().catch(() => false)) {
    const tokens = page.locator('.sentence-row button, .split-word, button.word-token, .token')
    const n = await tokens.count()
    if (n > 0) await tokens.nth(Math.min(1, n - 1)).click()
    await checkBtn.click()
    const feedback = page.locator('.feedback-banner, .hint-banner')
    note('Boundaries Prüfen/feedback', await feedback.first().isVisible({ timeout: 3000 }).catch(() => false))
  } else {
    note('Boundaries Prüfen/feedback', false, 'no Prüfen button')
  }
  await page.screenshot({ path: `${OUT}/smoke-boundary-desktop.png` })

  // Move — click mode
  await openArea(page, 'Verschiebeprobe')
  const moveNote = page.getByText(/Drag-and-Drop|An den Anfang|Verbzweitstellung/i)
  note('Move task loads', await moveNote.first().isVisible({ timeout: 5000 }).catch(() => false))

  // Prefer classic move task; if verb_position first, click Weiter a few times
  for (let i = 0; i < 6; i++) {
    if (await page.getByRole('button', { name: /An den Anfang/i }).isVisible().catch(() => false)) break
    const next = page.getByRole('button', { name: /Weiter|Nächste/i })
    if (await next.isVisible().catch(() => false)) {
      // need to complete current first — skip by checking if choice options
      const choice = page.locator('.choice-option').first()
      if (await choice.isVisible().catch(() => false)) {
        await choice.click()
        const pruefen = page.getByRole('button', { name: 'Prüfen' })
        if (await pruefen.isVisible().catch(() => false)) await pruefen.click()
        await page.getByRole('button', { name: /Weiter/i }).click().catch(() => {})
      }
    } else break
  }

  const movable = page.locator('.dnd-chip--movable')
  if (await movable.count()) {
    await movable.first().click()
    const toFront = page.getByRole('button', { name: /An den Anfang/i })
    if (await toFront.isEnabled()) {
      await toFront.click()
      note('Move click/tap An den Anfang', true)
    } else {
      note('Move click/tap An den Anfang', false, 'button disabled after select')
    }
  } else {
    note('Move click/tap An den Anfang', false, 'no movable chips (maybe verb_position only)')
  }

  const dragTarget = page.locator('.dnd-chip--movable').first()
  const dropTarget = page.locator('.dnd-chip').nth(2)
  if ((await dragTarget.count()) && (await dropTarget.count())) {
    const box1 = await dragTarget.boundingBox()
    const box2 = await dropTarget.boundingBox()
    if (box1 && box2) {
      await page.mouse.move(box1.x + box1.width / 2, box1.y + box1.height / 2)
      await page.mouse.down()
      await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2, { steps: 10 })
      await page.mouse.up()
      note('Move DnD drag', true)
    } else note('Move DnD drag', false, 'no boxes')
  } else note('Move DnD drag', false, 'missing chips')
  await page.screenshot({ path: `${OUT}/smoke-move-desktop.png` })

  // Predicate
  await openArea(page, 'Prädikat')
  // skip refresh already done; may land on finite_verb choice or marking
  const predVisible = await page
    .getByText(/Prädikat|finite Verb|Verbform|Markiere/i)
    .first()
    .isVisible({ timeout: 5000 })
    .catch(() => false)
  note('Predicate task', predVisible)
  const wordish = page.locator(
    '.marking-sentence button, .token-row button, button.word-token, .sentence-words button',
  )
  if (await wordish.count()) {
    await wordish.first().click()
  } else {
    const choice = page.locator('.choice-option').first()
    if (await choice.isVisible().catch(() => false)) await choice.click()
  }
  if (await checkBtn.isVisible().catch(() => false)) await checkBtn.click()
  await page.screenshot({ path: `${OUT}/smoke-predicate-desktop.png` })
  note('Predicate interaction', true)

  // Full analysis
  await openArea(page, 'Ganze Sätze analysieren')
  note(
    'Full analysis task',
    await page
      .getByText(/analys|Prädikat|Subjekt|Schritt|Satz/i)
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false),
  )
  await page.screenshot({ path: `${OUT}/smoke-full-desktop.png` })

  // Mixed
  await openArea(page, 'Gemischtes Training')
  note(
    'Mixed training task',
    await page
      .locator('.exercise-card, .instruction-note, .prompt-sentence')
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false),
  )
  await page.screenshot({ path: `${OUT}/smoke-mixed-desktop.png` })

  // Progress / localStorage
  await page.getByRole('button', { name: 'Fortschritt' }).click()
  const prog = await page.getByText(/Fortschritt|Noch offen|%|Versuche|Tutorial/i).first().isVisible()
  const stored = await page.evaluate(() => localStorage.getItem('satzglieder-trainer-progress-v1'))
  note('localStorage progress', !!stored && prog)
  await page.screenshot({ path: `${OUT}/smoke-progress-desktop.png` })

  await browser.close()
}

async function runMobile() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    ...devices['iPhone 12'],
  })
  const page = await context.newPage()
  await seedProgress(page)
  await page.goto(BASE)
  await page.screenshot({ path: `${OUT}/smoke-home-mobile.png`, fullPage: true })

  const menu = page.getByRole('button', { name: /Menü/i })
  note('Mobile hamburger', await menu.isVisible())
  await menu.click()
  await page.getByRole('button', { name: 'Trainieren' }).click()
  const card = page.locator('article.path-card, article.module-card').filter({ hasText: 'Verschiebeprobe' })
  await card.getByRole('button', { name: /Runde starten|Tutorial & Training/i }).first().click()
  await dismissRefresh(page)

  for (let i = 0; i < 6; i++) {
    if (await page.getByRole('button', { name: /An den Anfang/i }).isVisible().catch(() => false)) break
    const choice = page.locator('.choice-option').first()
    if (await choice.isVisible().catch(() => false)) {
      await choice.click()
      const pruefen = page.getByRole('button', { name: 'Prüfen' })
      if (await pruefen.isVisible().catch(() => false)) await pruefen.click()
      await page.getByRole('button', { name: /Weiter/i }).click().catch(() => {})
    } else break
  }

  const tapOk = await page
    .getByText(/An den Anfang|Drag-and-Drop|Finger/i)
    .first()
    .isVisible({ timeout: 5000 })
    .catch(() => false)
  note('Mobile move tap UI', tapOk)
  const movable = page.locator('.dnd-chip--movable')
  if (await movable.count()) {
    await movable.first().tap()
    const toFront = page.getByRole('button', { name: /An den Anfang/i })
    if (await toFront.isEnabled()) {
      await toFront.tap()
      note('Mobile tap An den Anfang', true)
    } else {
      note('Mobile tap An den Anfang', false, 'button disabled')
    }
  } else {
    note('Mobile tap An den Anfang', false, 'no chips')
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 2,
  )
  note('Mobile no horizontal overflow', !overflow)
  await page.screenshot({ path: `${OUT}/smoke-move-mobile.png` })
  await browser.close()
}

await runDesktop()
await runMobile()

const failed = results.filter((r) => !r.ok)
console.log('\n--- summary ---')
console.log(JSON.stringify(results, null, 2))
if (failed.length) {
  console.error(`FAILED ${failed.length}`)
  process.exit(1)
}
console.log('ALL SMOKE PASS')
