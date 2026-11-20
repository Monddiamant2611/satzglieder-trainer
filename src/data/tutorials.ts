import type { AreaId } from './areas'

export type TutorialExercise =
  | {
      kind: 'choice'
      prompt: string
      sentence?: string
      choices: { id: string; label: string }[]
      correctId: string
    }
  | {
      kind: 'mark'
      prompt: string
      sentence: string
      targets: string[]
    }
  | {
      kind: 'boundary'
      prompt: string
      sentence: string
      groups: string[]
    }
  | {
      kind: 'move'
      prompt: string
      groups: string[]
      verbIndexes: number[]
      valid: string[]
      originalSentence: string
    }

export type TutorialStep = {
  id: string
  title: string
  /** Short teaching text (~40–60 words). */
  explanation: string
  example: { sentence: string; note: string }
  exercise: TutorialExercise
  feedbackCorrect: string
  /** Conceptual hint only — never dump the solution. */
  feedbackWrong: string
}

export type AreaTutorial = {
  areaId: AreaId
  title: string
  goal: string
  refreshBullets: string[]
  showVerbPositions?: boolean
  steps: TutorialStep[]
}

const YES_NO = [
  { id: 'ja', label: 'Ja' },
  { id: 'nein', label: 'Nein' },
]

const VERB_POS = [
  { id: 'verberst', label: 'Verberststellung' },
  { id: 'verbzweit', label: 'Verbzweitstellung' },
  { id: 'verbletzt', label: 'Verbletztstellung' },
]

export const AREA_TUTORIALS: Record<string, AreaTutorial> = {
  boundary: {
    areaId: 'boundary',
    title: 'Satzglieder erkennen',
    goal: 'Du erkennst, wo ein Satzglied beginnt und endet.',
    refreshBullets: [
      'Satzglieder lassen sich gemeinsam verschieben.',
      'Ein Satzglied kann ein Wort oder eine Wortgruppe sein.',
      'Grenzen nur zwischen Satzgliedern setzen.',
    ],
    steps: [
      {
        id: 'b1',
        title: 'Was ist ein Satzglied?',
        explanation:
          'Satzglieder sind die Bausteine eines Satzes. Manche bestehen aus einem Wort, andere aus einer ganzen Gruppe wie Artikel, Adjektiv und Substantiv. Was zusammengehört, bleibt bei Proben zusammen. So findest du die Grenzen – nicht Wort für Wort, sondern Einheit für Einheit. Das trainierst du jetzt Schritt für Schritt.',
        example: {
          sentence: 'Der Hund schläft.',
          note: 'Zwei Einheiten: „Der Hund“ und „schläft“.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Ist „Der kleine Hund“ ein Satzglied (eine Gruppe)?',
          sentence: 'Der kleine Hund schläft.',
          choices: YES_NO,
          correctId: 'ja',
        },
        feedbackCorrect: 'Richtig – Artikel, Adjektiv und Substantiv gehören zusammen.',
        feedbackWrong: 'Denk an Zusammengehörigkeit: Welche Wörter bilden eine Einheit?',
      },
      {
        id: 'b2',
        title: 'Wortgruppen erkennen',
        explanation:
          'Nominalgruppen und Präpositionalgruppen sind oft ein Satzglied. „am Nachmittag“ gehört zusammen, ebenso „unter dem Tisch“. Trenne nicht mitten in der Gruppe – sonst zerstörst du die Einheit. Orientiere dich daran, was gemeinsam verschoben werden könnte. So erkennst du zuverlässige Grenzen zwischen den Satzgliedern.',
        example: {
          sentence: 'Mia liest am Nachmittag.',
          note: '„am Nachmittag“ bleibt eine Gruppe.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Gehören „am“ und „Nachmittag“ zum selben Satzglied?',
          sentence: 'Mia liest am Nachmittag.',
          choices: YES_NO,
          correctId: 'ja',
        },
        feedbackCorrect: 'Stimmt – Präposition und Nominalgruppe bilden eine Einheit.',
        feedbackWrong: 'Präposition und Folgewörter oft gemeinsam prüfen.',
      },
      {
        id: 'b3',
        title: 'Das finite Verb',
        explanation:
          'Das finite Verb ist die gebeugte Verbform nach Person und Tempus. In vielen Aussagesätzen bildet es ein eigenes Satzglied – oft den Kern des Prädikats. Es hilft dir, den Satz zu gliedern und spätere Proben zu verstehen. Markiere zuerst dieses Finitum, bevor du weitere Einheiten bestimmst.',
        example: {
          sentence: 'Paul trägt den Rucksack.',
          note: '„trägt“ ist die finite Verbform.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das finite Verb.',
          sentence: 'Paul trägt den Rucksack.',
          targets: ['trägt'],
        },
        feedbackCorrect: 'Genau – „trägt“ ist finit.',
        feedbackWrong: 'Suche die gebeugte Verbform – sie sagt, was geschieht.',
      },
      {
        id: 'b4',
        title: 'Grenzen setzen',
        explanation:
          'Zwischen Satzgliedern setzt du Grenzen. Innerhalb einer Gruppe setzt du keine. Tippe auf die Lücken zwischen Wörtern, um eine Grenze zu setzen oder zu entfernen. Prüfe danach, ob jede Gruppe sinnvoll wirkt und gemeinsam verschoben werden könnte. So übst du die Technik der Satzgliedgrenzen.',
        example: {
          sentence: 'Der kleine Hund | schläft | am Nachmittag.',
          note: 'Drei Satzglieder – Gruppen bleiben intakt.',
        },
        exercise: {
          kind: 'boundary',
          prompt: 'Setze die Grenzen zwischen den Satzgliedern.',
          sentence: 'Der kleine Hund schläft am Nachmittag.',
          groups: ['Der kleine Hund', 'schläft', 'am Nachmittag'],
        },
        feedbackCorrect: 'Die Grenzen stimmen – die Gruppen sind intakt.',
        feedbackWrong: 'Prüfe, was gemeinsam verschoben werden könnte. Keine Grenze mitten in der Gruppe.',
      },
      {
        id: 'b5',
        title: 'Mehrteilige Prädikate',
        explanation:
          'Manchmal steht das Prädikat auseinander: Hilfsverb und Partizip oder Verb und Partikel. Die Teile gehören trotzdem zusammen. Bei Grenzen zählt das finite Verb; der zweite Teil kann am Ende stehen – das nennt man Satzklammer. Übersehe diese Teile nicht, auch wenn sie getrennt wirken.',
        example: {
          sentence: 'Lena hat ihr Zimmer aufgeräumt.',
          note: '„hat … aufgeräumt“ gehört zum Prädikat.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Gehört „aufgeräumt“ zum Prädikat, obwohl es am Ende steht?',
          sentence: 'Lena hat ihr Zimmer aufgeräumt.',
          choices: YES_NO,
          correctId: 'ja',
        },
        feedbackCorrect: 'Ja – Satzklammer: finites Verb und zweiter Teil gehören zusammen.',
        feedbackWrong: 'Denk an mehrteilige Prädikate und die Satzklammer.',
      },
      {
        id: 'b6',
        title: 'Anwenden',
        explanation:
          'Jetzt setzt du alles zusammen: Gruppen erkennen, finites Verb finden und Grenzen setzen. Arbeite ruhig und prüfe jede Einheit. Mehrere sinnvolle Gruppen sind besser als viele Einzelwörter. Danach startet das eigentliche Training – ohne Lösungshinweise in den Aufgaben. Bleib bei den Gruppen und prüfe jede Grenze ruhig.',
        example: {
          sentence: 'Am Morgen trägt Paul seinen Rucksack.',
          note: 'Vier Einheiten: Zeitangabe, Verb, Subjekt, Objekt.',
        },
        exercise: {
          kind: 'boundary',
          prompt: 'Setze die Satzgliedgrenzen.',
          sentence: 'Am Morgen trägt Paul seinen Rucksack.',
          groups: ['Am Morgen', 'trägt', 'Paul', 'seinen Rucksack'],
        },
        feedbackCorrect: 'Sehr gut – du erkennst die Satzgliedgrenzen.',
        feedbackWrong: 'Orientiere dich an Gruppen und am finiten Verb – ohne die Lösung abzulesen.',
      },
    ],
  },

  move: {
    areaId: 'move',
    title: 'Verschiebeprobe',
    goal: 'Du prüfst mit Umsstellungen, was ein Satzglied ist – und benennst die Verbstellung.',
    showVerbPositions: true,
    refreshBullets: [
      'Aussagesatz: Verbzweitstellung.',
      'Frage/Aufforderung: Verberststellung.',
      'Nebensatz: Verbletztstellung.',
      'Ganze Satzglieder verschieben; mehrere Umsstellungen können gelten.',
    ],
    steps: [
      {
        id: 'm1',
        title: 'Einheiten erkennen',
        explanation:
          'Bevor du verschiebst, erkennst du die Satzglieder. Nur ganze Einheiten wandern. Artikel und Adjektive bleiben beim Substantiv. Das finite Verb merkst du dir besonders – es spielt bei der Verbstellung die Hauptrolle. Ohne klare Bausteine wird die Verschiebeprobe ungenau. Ohne klare Bausteine wird jede Umsstellung unsicher.',
        example: {
          sentence: 'Der Hund schläft am Nachmittag im Körbchen.',
          note: 'Vier Bausteine: Subjekt, Verb, Zeit, Ort.',
        },
        exercise: {
          kind: 'boundary',
          prompt: 'Markiere die Grenzen der Satzglieder.',
          sentence: 'Der Hund schläft am Nachmittag.',
          groups: ['Der Hund', 'schläft', 'am Nachmittag'],
        },
        feedbackCorrect: 'Die Einheiten stimmen – bereit zum Verschieben.',
        feedbackWrong: 'Suche sinnvolle Gruppen, nicht einzelne Buchstaben oder Artikel allein.',
      },
      {
        id: 'm2',
        title: 'Verschieben per Drag-and-Drop',
        explanation:
          'Bei der Verschiebeprobe ziehst du Satzglieder an eine neue Stelle. Der Satz muss sinnvoll bleiben. Mehrere Reihenfolgen können richtig sein. Ziehe ganze Chips per Drag-and-Drop oder nutze „An den Anfang“. So prüfst du, was wirklich zusammengehört und ein Satzglied bildet. Mehrere gültige Reihenfolgen sind erlaubt, wenn die Gruppen stimmen.',
        example: {
          sentence: 'Am Nachmittag schläft der Hund.',
          note: 'Umsstellung von „Der Hund schläft am Nachmittag.“',
        },
        exercise: {
          kind: 'move',
          prompt: 'Stelle den Satz um (Drag-and-Drop oder „An den Anfang“).',
          groups: ['Der Hund', 'schläft', 'am Nachmittag'],
          verbIndexes: [1],
          originalSentence: 'Der Hund schläft am Nachmittag.',
          valid: [
            'Am Nachmittag schläft der Hund.',
            'Der Hund schläft am Nachmittag.',
          ],
        },
        feedbackCorrect: 'Gute Umsstellung – die Gruppen bleiben intakt.',
        feedbackWrong: 'Verschiebe ganze Satzglieder und prüfe, ob der Satz noch stimmt.',
      },
      {
        id: 'm3',
        title: 'Verbzweitstellung',
        explanation:
          'Im Aussagesatz steht das finite Verb nach dem ersten Satzglied: Verbzweitstellung. Egal welches Satzglied vorne steht – danach folgt das Verb. Das ist der typische Hauptsatz in der Aussage. Merke den Fachbegriff bewusst; er gilt auch nach einer Umsstellung. Nach jeder Umsstellung prüfst du diesen Fachbegriff erneut.',
        example: {
          sentence: 'Am Nachmittag schläft der Hund.',
          note: 'Erstes Satzglied + finites Verb → Verbzweitstellung.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Verbstellung liegt vor?',
          sentence: 'Am Nachmittag schläft der Hund.',
          choices: VERB_POS,
          correctId: 'verbzweit',
        },
        feedbackCorrect: 'Richtig: Verbzweitstellung – Fachbegriff für den Aussagesatz.',
        feedbackWrong: 'Schau, wo das finite Verb steht: nach dem ersten Satzglied?',
      },
      {
        id: 'm4',
        title: 'Verberststellung',
        explanation:
          'In Entscheidungsfragen und Aufforderungen steht das finite Verb zuerst: Verberststellung. Es gibt kein Satzglied vor dem Verb. Auch bei mehrteiligen Prädikaten zählt das Finitum vorn; der zweite Teil kann später folgen. So erkennst du Frage und Aufforderung am Satzbau. Merke den Unterschied zur Verbzweitstellung im Aussagesatz.',
        example: {
          sentence: 'Schläft der Hund im Körbchen?',
          note: 'Finites Verb an Position 1 → Verberststellung.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Verbstellung liegt vor?',
          sentence: 'Hat Mia das Buch gelesen?',
          choices: VERB_POS,
          correctId: 'verberst',
        },
        feedbackCorrect: 'Richtig: Verberststellung – auch bei mehrteiligem Prädikat zählt das Finitum.',
        feedbackWrong: 'Steht das finite Verb ganz vorn? Dann ist es eine andere Stellung als im Aussagesatz.',
      },
      {
        id: 'm5',
        title: 'Verbletztstellung',
        explanation:
          'In Nebensätzen mit weil, dass, als oder obwohl wandert das finite Verb ans Ende: Verbletztstellung. Bei mehrteiligen Prädikaten stehen oft Partizip und Hilfsverb am Schluss. Das unterscheidet Neben- von Hauptsätzen klar. Achte auf die Konjunktion und die Position des Finitums. Konjunktion und Verbende sind hier deine wichtigsten Signale.',
        example: {
          sentence: '… weil der Hund im Körbchen schläft.',
          note: 'Finites Verb am Ende → Verbletztstellung.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Verbstellung liegt vor?',
          sentence: '… dass Mia das Buch gelesen hat.',
          choices: VERB_POS,
          correctId: 'verbletzt',
        },
        feedbackCorrect: 'Richtig: Verbletztstellung im Nebensatz.',
        feedbackWrong: 'Prüfe: Nebensatzkonjunktion? Dann oft Verb am Ende.',
      },
      {
        id: 'm6',
        title: 'Die drei Stellungen vergleichen',
        explanation:
          'Verberststellung, Verbzweitstellung und Verbletztstellung unterscheidest du am Ort des finiten Verbs und am Satztyp. Aussage führt zu Verbzweitstellung, Frage oder Aufforderung zu Verberststellung, Nebensatz zu Verbletztstellung. Vergleiche die drei Fachbegriffe bewusst, bevor du weiter übst. Ein kurzer Vergleich der drei Typen festigt die Fachbegriffe.',
        example: {
          sentence: 'Vergleich: Schläft er? / Er schläft. / … weil er schläft.',
          note: 'Drei Typen – drei Fachbegriffe.',
        },
        exercise: {
          kind: 'choice',
          prompt: '„… obwohl Ben die Aufgabe gelöst hat.“ – welche Stellung?',
          sentence: '… obwohl Ben die Aufgabe gelöst hat.',
          choices: VERB_POS,
          correctId: 'verbletzt',
        },
        feedbackCorrect: 'Vergleich gelungen: Nebensatz → Verbletztstellung.',
        feedbackWrong: 'Vergleiche mit Aussage und Frage – wo steht das Finitum hier?',
      },
      {
        id: 'm7',
        title: 'Anwenden: Umsstellung + Begriff',
        explanation:
          'Jetzt verbindest du Probe und Fachbegriff. Stelle einen Aussagesatz um und behalte die Verbzweitstellung. Ganze Satzglieder wandern, das Finitum bleibt nach dem ersten Satzglied. Danach startet das reguläre Training – ohne Positionsmarkierungen und ohne Lösungshinweise. Danach übst du selbstständig ohne Positionsmarkierungen.',
        example: {
          sentence: 'Mia liest nach dem Unterricht ein Buch.',
          note: 'Umsstellung möglich bei Verbzweitstellung.',
        },
        exercise: {
          kind: 'move',
          prompt: 'Stelle um – Verbzweitstellung bleibt erhalten.',
          groups: ['Mia', 'liest', 'nach dem Unterricht', 'ein Buch'],
          verbIndexes: [1],
          originalSentence: 'Mia liest nach dem Unterricht ein Buch.',
          valid: [
            'Nach dem Unterricht liest Mia ein Buch.',
            'Ein Buch liest Mia nach dem Unterricht.',
            'Mia liest nach dem Unterricht ein Buch.',
          ],
        },
        feedbackCorrect: 'Stark – Umsstellung und Verbzweitstellung passen. Als Nächstes: Training.',
        feedbackWrong: 'Ganze Satzglieder verschieben und prüfen, ob der Aussagesatz noch stimmig wirkt.',
      },
    ],
  },

  predicate: {
    areaId: 'predicate',
    title: 'Das finite Verb',
    goal: 'Du erkennst das finite Verb und baust daraus ein- und mehrteilige Prädikate.',
    showVerbPositions: true,
    refreshBullets: [
      'Finit = gebeugte Verbform (Person/Tempus).',
      'Finit allein → einteiliges Prädikat; mit Partizip/Partikel → mehrteilig (z. B. hat gelesen).',
      'Verberststellung · Verbzweitstellung · Verbletztstellung gelten für das Finitum.',
    ],
    steps: [
      {
        id: 'p1',
        title: 'Verben erkennen',
        explanation:
          'Zuerst findest du alle Verbformen im Satz. Dazu gehören finite Formen und infinite Formen wie Partizipien. Substantive und Adjektive sind keine Verben. Markiere nur echte Verbformen. So bereitest du die Suche nach dem finiten Verb vor und vermeidest Verwechslungen mit Objekten.',
        example: {
          sentence: 'Mia hat das Buch gelesen.',
          note: 'Verbformen: „hat“ und „gelesen“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere alle Verbformen.',
          sentence: 'Mia hat das Buch gelesen.',
          targets: ['hat', 'gelesen'],
        },
        feedbackCorrect: 'Beide Verbformen erkannt – gut vorbereitet.',
        feedbackWrong: 'Suche Wörter, die ein Geschehen oder Sein ausdrücken – nicht das Objekt.',
      },
      {
        id: 'p2',
        title: 'Das finite Verb finden',
        explanation:
          'Das finite Verb ist die gebeugte Form: Sie zeigt Person und Tempus. In „Mia hat gelesen“ ist „hat“ finit, „gelesen“ nicht. Das Finitum ist der Kern des Prädikats. Markiere jetzt nur diese gebeugte Form und lass Partizip oder Partikel zunächst weg.',
        example: {
          sentence: 'Mia hat gelesen.',
          note: 'Finit: „hat“ – gebeugt.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere nur das finite Verb.',
          sentence: 'Mia hat das Buch gelesen.',
          targets: ['hat'],
        },
        feedbackCorrect: '„hat“ ist finit – die gebeugte Form.',
        feedbackWrong: 'Welche Form ist nach Person und Tempus gebeugt?',
      },
      {
        id: 'p3',
        title: 'Finit und infinit unterscheiden',
        explanation:
          'Finite Formen sind gebeugt; infinite Formen wie Partizipien („gelesen“) sind es nicht. Partikeln am Satzende gehören oft zum Prädikat, sind aber nicht finit. Nur das Finitum steuert die Verbstellung. Übe diese Unterscheidung, bevor du das ganze Prädikat markierst. Bleib genau und prüfe deine Markierung.',
        example: {
          sentence: 'Lena hat aufgeräumt.',
          note: 'Finit „hat“, infinit „aufgeräumt“.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Form ist finit?',
          sentence: 'Lena hat ihr Zimmer aufgeräumt.',
          choices: [
            { id: 'hat', label: 'hat' },
            { id: 'aufgeraeumt', label: 'aufgeräumt' },
            { id: 'zimmer', label: 'Zimmer' },
          ],
          correctId: 'hat',
        },
        feedbackCorrect: 'Richtig – nur „hat“ ist finit.',
        feedbackWrong: 'Vergleiche gebeugte Form und Partizip: Welche zeigt Person/Tempus?',
      },
      {
        id: 'p4',
        title: 'Einteiliges Prädikat',
        explanation:
          'Steht das finite Verb allein als Verbaussage, ist das Prädikat einteilig. Beispiel: „Mia liest.“ Hier ist das Finitum zugleich das ganze Prädikat. Markiere diese eine Form ohne zusätzliche Partizipien oder Partikeln. So wird der Unterschied zum Mehrteiligen klar. Bleib genau und prüfe deine Markierung.',
        example: {
          sentence: 'Der Hund schläft.',
          note: 'Einteilig: nur „schläft“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das einteilige Prädikat.',
          sentence: 'Paul trägt seinen Rucksack.',
          targets: ['trägt'],
        },
        feedbackCorrect: 'Einteiliges Prädikat = finites Verb allein.',
        feedbackWrong: 'Hier reicht die eine gebeugte Verbform als ganzes Prädikat.',
      },
      {
        id: 'p5',
        title: 'Mehrteiliges Prädikat',
        explanation:
          'Mit anderen Verbformen wird das Prädikat mehrteilig: „Mia hat gelesen“ – finit „hat“, ganzes Prädikat „hat gelesen“. Auch Partikelverben wie „räumt … auf“ sind mehrteilig. Markiere alle Teile der Aussage, auch wenn sie auseinanderstehen und eine Satzklammer bilden. Bleib genau und prüfe deine Markierung.',
        example: {
          sentence: 'Mia hat gelesen.',
          note: 'Finit „hat“, Prädikat „hat gelesen“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das gesamte mehrteilige Prädikat.',
          sentence: 'Mia hat das Buch gelesen.',
          targets: ['hat', 'gelesen'],
        },
        feedbackCorrect: 'Mehrteilig: Finitum plus weiterer Verbteil.',
        feedbackWrong: 'Nimm das Finitum und den zweiten Teil (Partizip/Partikel) mit.',
      },
      {
        id: 'p6',
        title: 'Verbstellung des Finitums',
        explanation:
          'Verberststellung, Verbzweitstellung und Verbletztstellung beschreiben den Ort des finiten Verbs. Aussage oft Verbzweitstellung, Frage oder Aufforderung Verberststellung, Nebensatz Verbletztstellung. Das Partizip wandert mit, zählt aber nicht als Finitum. Miss die Stellung immer am Finitum. Bleib genau und prüfe deine Markierung.',
        example: {
          sentence: 'Hat Mia gelesen? / Mia hat gelesen. / … weil Mia gelesen hat.',
          note: 'Drei Stellungen – immer am Finitum gemessen.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Verbstellung hat das Finitum?',
          sentence: '… weil Mia das Buch gelesen hat.',
          choices: VERB_POS,
          correctId: 'verbletzt',
        },
        feedbackCorrect: 'Verbletztstellung – Finitum am Ende des Nebensatzes.',
        feedbackWrong: 'Schau nur auf das Finitum und den Satztyp (Frage, Aussage, Nebensatz).',
      },
      {
        id: 'p7',
        title: 'Selbstständig anwenden',
        explanation:
          'Jetzt verbindest du alles: Verbformen finden, Finitum bestimmen, ein- oder mehrteiliges Prädikat markieren. Im folgenden Training gibt es keine Lösungshinweise. Arbeite Schritt für Schritt und prüfe jede Markierung bewusst, bevor du weitergehst. Bleib genau und prüfe deine Markierung. Nutze die Beispiele als Orientierung.',
        example: {
          sentence: 'Ben schreibt die Aufgabe auf.',
          note: 'Finit „schreibt“, Prädikat „schreibt … auf“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das gesamte Prädikat.',
          sentence: 'Ben schreibt die Aufgabe sorgfältig auf.',
          targets: ['schreibt', 'auf'],
        },
        feedbackCorrect: 'Anwendung gelungen – bereit fürs Training „Das finite Verb“.',
        feedbackWrong: 'Finitum plus möglichen zweiten Teil markieren – ohne die Lösung abzulesen.',
      },
    ],
  },

  subject: {
    areaId: 'subject',
    title: 'Subjekt',
    goal: 'Du findest, wer oder was etwas tut.',
    refreshBullets: [
      'Frage: Wer oder was + Prädikat?',
      'Das Subjekt kann eine ganze Gruppe sein.',
      'Nicht mit dem Objekt verwechseln.',
    ],
    steps: [
      {
        id: 's1',
        title: 'Wer oder was?',
        explanation:
          'Das Subjekt antwortet auf „Wer oder was?“ plus Prädikat. Es ist oft die handelnde Größe im Satz. Markiere die ganze Gruppe – nicht nur das Substantiv ohne Artikel oder Adjektiv. So bleibt das Satzglied vollständig und verschiebbar. Die vollständige Gruppe ist das Ziel, nicht ein Einzelwort.',
        example: {
          sentence: 'Der Hund schläft.',
          note: 'Subjekt: „Der Hund“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Subjekt.',
          sentence: 'Der Hund schläft im Körbchen.',
          targets: ['Der Hund'],
        },
        feedbackCorrect: 'Subjekt richtig erkannt.',
        feedbackWrong: 'Stelle die Frage: Wer oder was + Prädikat?',
      },
      {
        id: 's2',
        title: 'Gruppen als Subjekt',
        explanation:
          'Das Subjekt kann länger sein: „Die beiden Freunde“ oder „Unsere neue Mitschülerin“. Alles, was zur Antwort auf die Subjektfrage gehört, markierst du gemeinsam. Kurze Antworten ohne Begleiter sind oft unvollständig. Trainiere bewusst die ganze Gruppe. Begleiter und Adjektive gehören zur Subjektgruppe dazu.',
        example: {
          sentence: 'Die beiden Freunde besuchen die Oma.',
          note: 'Ganzes Subjekt: „Die beiden Freunde“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das gesamte Subjekt.',
          sentence: 'Die beiden Freunde besuchen am Samstag ihre Großeltern.',
          targets: ['Die beiden Freunde'],
        },
        feedbackCorrect: 'Die ganze Subjektgruppe ist markiert.',
        feedbackWrong: 'Nimm Artikel und Begleiter mit – die Gruppe bleibt zusammen.',
      },
      {
        id: 's3',
        title: 'Nicht am Satzanfang?',
        explanation:
          'Durch Umsstellung kann etwas anderes vorne stehen. Das Subjekt bleibt Subjekt – auch in der Mitte des Satzes. Verbzweitstellung im Aussagesatz ändert die Rolle nicht. Finde das Subjekt über die Frage, nicht nur über die Position am Satzanfang. Die Wer-oder-was-Frage bleibt entscheidend.',
        example: {
          sentence: 'Am Morgen trägt Paul den Rucksack.',
          note: 'Subjekt ist „Paul“, nicht „Am Morgen“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Subjekt.',
          sentence: 'Am Morgen trägt Paul den Rucksack.',
          targets: ['Paul'],
        },
        feedbackCorrect: 'Richtig – Position ≠ Rolle.',
        feedbackWrong: 'Nutze die Wer/Was-Frage, nicht nur den Satzanfang.',
      },
      {
        id: 's4',
        title: 'Subjekt und Prädikat',
        explanation:
          'Zuerst das Prädikat, dann das Subjekt: Wer oder was plus Prädikat? So vermeidest du Verwechslungen mit Objekten. Das Subjekt passt in Person und Numerus zum finiten Verb. Diese Reihenfolge macht die Bestimmung klarer und sicherer. Person und Numerus zum Verb geben dir eine zusätzliche Kontrolle.',
        example: {
          sentence: 'Mia liest ein Buch.',
          note: 'Prädikat „liest“ → Subjekt „Mia“.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Was ist das Subjekt?',
          sentence: 'Mia liest ein Buch.',
          choices: [
            { id: 'mia', label: 'Mia' },
            { id: 'buch', label: 'ein Buch' },
            { id: 'liest', label: 'liest' },
          ],
          correctId: 'mia',
        },
        feedbackCorrect: '„Mia“ – wer liest?',
        feedbackWrong: 'Objekt und Verb sind etwas anderes als das Subjekt.',
      },
      {
        id: 's5',
        title: 'Anwenden',
        explanation:
          'Markiere das Subjekt in einem etwas längeren Satz. Achte auf die ganze Gruppe inklusive Artikel und Adjektive. Nutze die Wer-oder-was-Frage bewusst. Danach folgt das Training ohne Lösungshinweise in den Aufgabenstellungen. Danach trainierst du ohne Lösungshinweise weiter. Danach trainierst du ohne Lösungshinweise weiter.',
        example: {
          sentence: 'Unsere neue Mitschülerin liest in der Pause.',
          note: 'Lange Subjektgruppe.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Subjekt.',
          sentence: 'Unsere neue Mitschülerin liest in der Pause einen Roman.',
          targets: ['Unsere neue Mitschülerin'],
        },
        feedbackCorrect: 'Sauber – Subjektgruppe vollständig.',
        feedbackWrong: 'Wer liest? Markiere die ganze Antwortgruppe.',
      },
    ],
  },

  accusative: {
    areaId: 'accusative',
    title: 'Akkusativobjekt',
    goal: 'Du markierst das Akkusativobjekt (Wen oder was?).',
    refreshBullets: [
      'Frage: Wen oder was + Prädikat + Subjekt?',
      'Ganze Nominalgruppe markieren.',
      'Nicht mit Dativ (Wem?) verwechseln.',
    ],
    steps: [
      {
        id: 'a1',
        title: 'Wen oder was?',
        explanation:
          'Das Akkusativobjekt antwortet auf „Wen oder was?“. Es ergänzt oft, worauf sich das Geschehen richtet. Markiere die ganze Gruppe inklusive Artikel und Adjektive. Verwechsle es nicht mit dem Subjekt – die Frage entscheidet über die Rolle. Die Objektsfrage führt dich sicherer als die Position im Satz.',
        example: {
          sentence: 'Mia liest ein Buch.',
          note: 'Akkusativobjekt: „ein Buch“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Akkusativobjekt.',
          sentence: 'Mia liest ein Buch.',
          targets: ['ein Buch'],
        },
        feedbackCorrect: 'Akkusativobjekt erkannt.',
        feedbackWrong: 'Frage: Wen oder was? – ganze Gruppe markieren.',
      },
      {
        id: 'a2',
        title: 'Längere Gruppen',
        explanation:
          'Auch längere Gruppen wie „seinen schweren Rucksack“ oder „einen spannenden Roman“ sind ein Objekt. Trenne nicht Artikel und Adjektiv ab. Die Verschiebeprobe kann die Gruppe gemeinsam bewegen. Das bestätigt, dass sie ein Satzglied bildet. Eine intakte Gruppe ist das Kennzeichen eines Satzglieds.',
        example: {
          sentence: 'Paul trägt seinen schweren Rucksack.',
          note: 'Objektgruppe bleibt zusammen.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Akkusativobjekt vollständig.',
          sentence: 'Paul trägt seinen schweren Rucksack.',
          targets: ['seinen schweren Rucksack'],
        },
        feedbackCorrect: 'Die ganze Objektgruppe stimmt.',
        feedbackWrong: 'Nimm Begleiter und Adjektive mit.',
      },
      {
        id: 'a3',
        title: 'Nicht das Subjekt',
        explanation:
          'Subjekt und Akkusativobjekt sind verschieden. Erst Prädikat und Subjekt klären, dann „Wen oder was?“ stellen. So vermeidest du Verwechslungen, besonders wenn das Objekt durch Umsstellung vorne steht. Die Rolle zählt mehr als die Position. Rolle vor Position – das gilt auch nach Umsstellungen.',
        example: {
          sentence: 'Ein Buch liest Mia.',
          note: 'Objekt vorne, Subjekt „Mia“.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Was ist das Akkusativobjekt?',
          sentence: 'Ein Buch liest Mia.',
          choices: [
            { id: 'buch', label: 'Ein Buch' },
            { id: 'mia', label: 'Mia' },
            { id: 'liest', label: 'liest' },
          ],
          correctId: 'buch',
        },
        feedbackCorrect: '„Ein Buch“ – Wen oder was liest Mia?',
        feedbackWrong: 'Nutze die Objektsfrage, nicht nur die Position.',
      },
      {
        id: 'a4',
        title: 'Probe mit Umsstellung',
        explanation:
          'Das Akkusativobjekt lässt sich oft als Ganzes verschieben. Bleibt die Gruppe zusammen und der Satz sinnvoll, spricht das für ein Satzglied – hier das Objekt. Übe die Umsstellung ruhig und prüfe danach den Sinn des Satzes. Sinnvoller Satz und intakte Gruppe sind dein Prüfmaßstab.',
        example: {
          sentence: 'Nach dem Unterricht liest Mia ein Buch.',
          note: '„ein Buch“ bleibt Objekt.',
        },
        exercise: {
          kind: 'move',
          prompt: 'Stelle um – Gruppen bleiben intakt.',
          groups: ['Mia', 'liest', 'ein Buch'],
          verbIndexes: [1],
          originalSentence: 'Mia liest ein Buch.',
          valid: ['Ein Buch liest Mia.', 'Mia liest ein Buch.'],
        },
        feedbackCorrect: 'Umsstellung möglich – Objektgruppe intakt.',
        feedbackWrong: 'Verschiebe ganze Satzglieder und prüfe den Sinn.',
      },
      {
        id: 'a5',
        title: 'Anwenden',
        explanation:
          'Markiere das Akkusativobjekt in einem Trainingssatz. Stelle die Frage „Wen oder was?“ und nimm die ganze Antwortgruppe. Danach übst du selbstständig ohne Lösungshinweise. Genauigkeit bei der Gruppe ist wichtiger als Tempo. Genauigkeit bei der Gruppe zählt mehr als Tempo. Genauigkeit bei der Gruppe zählt mehr als Tempo.',
        example: {
          sentence: 'Die Klasse besucht das Museum.',
          note: '„das Museum“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Akkusativobjekt.',
          sentence: 'Die Klasse besucht das Museum.',
          targets: ['das Museum'],
        },
        feedbackCorrect: 'Treffer – bereit fürs Training.',
        feedbackWrong: 'Wen oder was besucht die Klasse?',
      },
    ],
  },

  dative: {
    areaId: 'dative',
    title: 'Dativobjekt',
    goal: 'Du markierst das Dativobjekt (Wem?).',
    refreshBullets: [
      'Frage: Wem + Prädikat + Subjekt?',
      'Oft Personen oder Zuwendungen.',
      'Nicht mit Akkusativ (Wen oder was?) tauschen.',
    ],
    steps: [
      {
        id: 'd1',
        title: 'Wem?',
        explanation:
          'Das Dativobjekt antwortet auf „Wem?“. Es nennt oft, wem etwas gilt oder gegeben wird. Markiere die ganze Gruppe. Vergleiche später mit dem Akkusativobjekt, damit die beiden Rollen nicht vermischt werden. Die Frage ist dein sicherster Weg. Die Wem-Frage trennt den Dativ klar vom Akkusativ.',
        example: {
          sentence: 'Mia zeigt ihrem Bruder das Fahrrad.',
          note: 'Dativ: „ihrem Bruder“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Dativobjekt.',
          sentence: 'Mia zeigt ihrem Bruder das Fahrrad.',
          targets: ['ihrem Bruder'],
        },
        feedbackCorrect: 'Dativobjekt erkannt.',
        feedbackWrong: 'Stelle die Frage: Wem?',
      },
      {
        id: 'd2',
        title: 'Formen erkennen',
        explanation:
          'Dativformen siehst du oft an Endungen wie „dem“, „der“, „einem“ oder „ihrem“. Die Form allein reicht nicht – die Frage „Wem?“ sichert die Bestimmung. Markiere die ganze Nominalgruppe und prüfe, ob die Antwort zur Frage passt. Form und Frage zusammen ergeben eine sichere Bestimmung.',
        example: {
          sentence: 'Paul hilft dem Freund.',
          note: '„dem Freund“ – Wem hilft Paul?',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Dativobjekt.',
          sentence: 'Paul hilft dem Freund.',
          targets: ['dem Freund'],
        },
        feedbackCorrect: 'Wem-Frage und Markierung passen.',
        feedbackWrong: 'Suche die Antwort auf „Wem?“ – als ganze Gruppe.',
      },
      {
        id: 'd3',
        title: 'Nicht Akkusativ',
        explanation:
          '„Wen oder was?“ trifft den Akkusativ, „Wem?“ den Dativ. In Sätzen mit beiden Objekten klärst du die Fragen bewusst getrennt. So vermeidest du, die Rollen zu tauschen. Kurze Zuordnungen festigen den Unterschied nachhaltig. Zwei Fragen nacheinander verhindern Rollentausch. Zwei Fragen nacheinander verhindern Rollentausch.',
        example: {
          sentence: 'Sie gibt dem Kind den Ball.',
          note: 'Dativ „dem Kind“, Akkusativ „den Ball“.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Was ist das Dativobjekt?',
          sentence: 'Sie gibt dem Kind den Ball.',
          choices: [
            { id: 'kind', label: 'dem Kind' },
            { id: 'ball', label: 'den Ball' },
            { id: 'sie', label: 'Sie' },
          ],
          correctId: 'kind',
        },
        feedbackCorrect: '„dem Kind“ – Wem gibt sie den Ball?',
        feedbackWrong: 'Trenne Wem? und Wen/was? bewusst.',
      },
      {
        id: 'd4',
        title: 'Gruppe verschieben',
        explanation:
          'Auch Dativobjekte sind Satzglieder und lassen sich oft umstellen. Die Gruppe bleibt dabei zusammen. So prüfst du, ob du die richtige Einheit markiert hast. Die Verschiebeprobe hilft bei Objekten genauso wie bei anderen Satzgliedern. Die Probe bestätigt, dass du die richtige Einheit hast.',
        example: {
          sentence: 'Ihrem Bruder zeigt Mia das Fahrrad.',
          note: 'Dativgruppe vorne möglich.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Kann „ihrem Bruder“ als ganzes Satzglied nach vorn?',
          sentence: 'Mia zeigt ihrem Bruder das Fahrrad.',
          choices: YES_NO,
          correctId: 'ja',
        },
        feedbackCorrect: 'Ja – typisch für Satzglieder.',
        feedbackWrong: 'Denk an die Verschiebeprobe für ganze Gruppen.',
      },
      {
        id: 'd5',
        title: 'Anwenden',
        explanation:
          'Markiere das Dativobjekt selbstständig in einem neuen Satz. Nutze nur die Wem-Frage und die ganze Antwortgruppe. Danach startet das Training ohne Lösungshinweise. Bleib bei einer Rolle, bis sie sitzt. Bleib bei einer Rolle, bis sie wirklich sitzt. Bleib bei einer Rolle, bis sie wirklich sitzt.',
        example: {
          sentence: 'Der Lehrer erklärt der Klasse die Regel.',
          note: '„der Klasse“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Dativobjekt.',
          sentence: 'Der Lehrer erklärt der Klasse die Regel.',
          targets: ['der Klasse'],
        },
        feedbackCorrect: 'Stimmt – bereit fürs Training.',
        feedbackWrong: 'Wem erklärt der Lehrer die Regel?',
      },
    ],
  },

  both_objects: {
    areaId: 'both_objects',
    title: 'Objekte unterscheiden',
    goal: 'Du trennst Dativ- und Akkusativobjekt sicher.',
    refreshBullets: [
      'Zuerst Wem? dann Wen oder was? (oder bewusst getrennt).',
      'Beide Gruppen vollständig markieren.',
      'Rollen nicht tauschen.',
    ],
    steps: [
      {
        id: 'o1',
        title: 'Zwei Fragen',
        explanation:
          'Manche Sätze haben zwei Objekte. Du brauchst zwei Fragen: „Wem?“ für den Dativ und „Wen oder was?“ für den Akkusativ. Bearbeite sie nacheinander – so bleiben die Rollen klar. Mische die Antworten nicht in einem Schritt. Eine Frage nach der anderen hält die Analyse klar.',
        example: {
          sentence: 'Mia zeigt ihrem Bruder das Fahrrad.',
          note: 'Wem? / Wen oder was?',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Frage trifft „ihrem Bruder“?',
          sentence: 'Mia zeigt ihrem Bruder das Fahrrad.',
          choices: [
            { id: 'wem', label: 'Wem?' },
            { id: 'wen', label: 'Wen oder was?' },
            { id: 'wer', label: 'Wer oder was?' },
          ],
          correctId: 'wem',
        },
        feedbackCorrect: 'Dativ → Wem?',
        feedbackWrong: 'Ordne die Frage der Rolle zu.',
      },
      {
        id: 'o2',
        title: 'Dativ zuerst',
        explanation:
          'Markiere zuerst das Dativobjekt. Bleib strikt bei der Wem-Frage. Das Akkusativobjekt lässt du in diesem Schritt bewusst weg – so trainierst du die Trennung. Erst wenn der Dativ sitzt, kommt der Akkusativ. Erst Dativ fertig, dann Akkusativ – nicht beides zugleich.',
        example: {
          sentence: 'Sie gibt dem Kind den Ball.',
          note: 'Zuerst „dem Kind“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere nur das Dativobjekt.',
          sentence: 'Sie gibt dem Kind den Ball.',
          targets: ['dem Kind'],
        },
        feedbackCorrect: 'Dativ sauber getrennt.',
        feedbackWrong: 'Nur die Antwort auf „Wem?“ markieren.',
      },
      {
        id: 'o3',
        title: 'Dann Akkusativ',
        explanation:
          'Jetzt die zweite Frage: Wen oder was? Markiere nur das Akkusativobjekt. Vergleiche mental mit dem Dativ – die beiden Gruppen dürfen sich nicht vermischen. Saubere Trennung ist das Lernziel dieses Schritts. Saubere Trennung ist hier wichtiger als Schnelligkeit. Saubere Trennung ist hier wichtiger als Schnelligkeit.',
        example: {
          sentence: 'Sie gibt dem Kind den Ball.',
          note: 'Akkusativ: „den Ball“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere nur das Akkusativobjekt.',
          sentence: 'Sie gibt dem Kind den Ball.',
          targets: ['den Ball'],
        },
        feedbackCorrect: 'Akkusativ klar getrennt.',
        feedbackWrong: 'Nur Wen/was? – nicht den Dativ mitmarkieren.',
      },
      {
        id: 'o4',
        title: 'Rollen prüfen',
        explanation:
          'Ein häufiger Fehler: Dativ und Akkusativ tauschen. Prüfe beide Fragen erneut. Formen helfen, ersetzen die Fragen aber nicht. Kurze Zuordnungsaufgaben festigen den Unterschied, bevor du im Training beides hintereinander markierst. Kurze Kontrolle beider Fragen vermeidet typische Fehler. Kurze Kontrolle beider Fragen vermeidet typische Fehler.',
        example: {
          sentence: 'Der Lehrer erklärt der Klasse die Regel.',
          note: 'Dativ Klasse, Akkusativ Regel.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Was ist das Akkusativobjekt?',
          sentence: 'Der Lehrer erklärt der Klasse die Regel.',
          choices: [
            { id: 'regel', label: 'die Regel' },
            { id: 'klasse', label: 'der Klasse' },
            { id: 'lehrer', label: 'Der Lehrer' },
          ],
          correctId: 'regel',
        },
        feedbackCorrect: '„die Regel“ – Wen oder was erklärt er?',
        feedbackWrong: 'Noch einmal Wem? und Wen/was? stellen.',
      },
      {
        id: 'o5',
        title: 'Anwenden',
        explanation:
          'Im Training markierst du oft nacheinander Dativ und Akkusativ. Hier übst du den Dativ in einem neuen Satz mit beiden Objekten. Danach folgt das selbstständige Training ohne Lösungshinweise. Bleib bei der gewählten Frage. Im Training folgt oft direkt der zweite Objektschritt.',
        example: {
          sentence: 'Nach dem Unterricht zeigt Mia ihrem Bruder das Fahrrad.',
          note: 'Dativgruppe in der Satzmitte.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Dativobjekt.',
          sentence: 'Nach dem Unterricht zeigt Mia ihrem Bruder das Fahrrad.',
          targets: ['ihrem Bruder'],
        },
        feedbackCorrect: 'Gut getrennt – weiter zum Training.',
        feedbackWrong: 'Wem zeigt Mia das Fahrrad?',
      },
    ],
  },

  adverbial: {
    areaId: 'adverbial',
    title: 'Adverbiale Bestimmungen',
    goal: 'Du bestimmst Wann, Wo, Warum oder Wie.',
    refreshBullets: [
      'temporal · lokal · kausal · modal',
      'Fragen: Wann? Wo? Warum? Wie?',
      'Oft verschiebbare Gruppen.',
    ],
    steps: [
      {
        id: 'ad1',
        title: 'Was sind Adverbiale?',
        explanation:
          'Adverbiale Bestimmungen geben Umstände an: Zeit, Ort, Grund oder Art und Weise. Sie sind Satzglieder und oft verschiebbar. Du bestimmst sie über die passende Frage – nicht nur über einzelne Wörter. Die vier Grundfragen strukturieren deine Entscheidung. Die passende Umstandsfrage entscheidet über den Typ.',
        example: {
          sentence: 'Am Nachmittag schläft der Hund.',
          note: '„Am Nachmittag“ – Wann?',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Frage passt zu „Am Nachmittag“?',
          sentence: 'Am Nachmittag schläft der Hund.',
          choices: [
            { id: 'wann', label: 'Wann?' },
            { id: 'wo', label: 'Wo?' },
            { id: 'warum', label: 'Warum?' },
            { id: 'wie', label: 'Wie?' },
          ],
          correctId: 'wann',
        },
        feedbackCorrect: 'Temporal – Wann?',
        feedbackWrong: 'Probiere die vier Umstandsfragen der Reihe nach.',
      },
      {
        id: 'ad2',
        title: 'Temporal und lokal',
        explanation:
          'Temporal antwortet auf Wann?, lokal auf Wo? oder Wohin? Beide sind häufig und leicht zu verwechseln, wenn Orts- und Zeitangaben im selben Satz stehen. Kläre die Frage bewusst, bevor du den Typ zuordnest. Genauigkeit schlägt Tempo. Zeit und Ort bewusst unterscheiden, bevor du zuordnest.',
        example: {
          sentence: 'Der Hund schläft unter dem Tisch.',
          note: 'Lokal: „unter dem Tisch“.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Art von Adverbiale ist hervorgehoben?',
          sentence: 'Der Hund schläft unter dem Tisch.',
          choices: [
            { id: 'temporal', label: 'temporal (Wann?)' },
            { id: 'lokal', label: 'lokal (Wo?)' },
            { id: 'kausal', label: 'kausal (Warum?)' },
            { id: 'modal', label: 'modal (Wie?)' },
          ],
          correctId: 'lokal',
        },
        feedbackCorrect: 'Lokal – Ort.',
        feedbackWrong: 'Ist es Zeit oder Ort? Die Frage entscheidet.',
      },
      {
        id: 'ad3',
        title: 'Kausal und modal',
        explanation:
          'Kausal nennt den Grund mit Warum? oder Weshalb?. Modal beschreibt die Art und Weise mit Wie?. Beide können Präpositionalgruppen oder Adverbien sein. Wieder gilt: erst fragen, dann zuordnen. So bleibt die Systematik klar. Grund und Art/Weise nicht in einen Topf werfen.',
        example: {
          sentence: 'Wegen des Regens fällt der Ausflug aus.',
          note: 'Kausal: „Wegen des Regens“.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Adverbiale?',
          sentence: 'Wegen des Regens fällt der Ausflug aus.',
          choices: [
            { id: 'temporal', label: 'temporal' },
            { id: 'lokal', label: 'lokal' },
            { id: 'kausal', label: 'kausal' },
            { id: 'modal', label: 'modal' },
          ],
          correctId: 'kausal',
        },
        feedbackCorrect: 'Kausal – Warum?',
        feedbackWrong: 'Warum oder Wie? Trenne Grund und Art/Weise.',
      },
      {
        id: 'ad4',
        title: 'Verschieben als Probe',
        explanation:
          'Adverbiale lassen sich oft an den Anfang stellen. Bleibt die Gruppe zusammen, spricht das für ein Satzglied. Die Verbzweitstellung im Aussagesatz bleibt dabei erhalten. Nutze die Umsstellung als Probe für die Einheit der Angabe. Umsstellung prüft die Einheit der Adverbiale.',
        example: {
          sentence: 'Mit großer Sorgfalt bereitet er das Essen.',
          note: 'Modalgruppe verschiebbar.',
        },
        exercise: {
          kind: 'move',
          prompt: 'Stelle die Adverbiale nach vorn.',
          groups: ['Er', 'bereitet', 'mit großer Sorgfalt', 'das Essen'],
          verbIndexes: [1],
          originalSentence: 'Er bereitet mit großer Sorgfalt das Essen.',
          valid: [
            'Mit großer Sorgfalt bereitet er das Essen.',
            'Er bereitet mit großer Sorgfalt das Essen.',
          ],
        },
        feedbackCorrect: 'Umsstellung gelungen – Adverbiale als Einheit.',
        feedbackWrong: 'Verschiebe die ganze Umstandsgruppe.',
      },
      {
        id: 'ad5',
        title: 'Anwenden',
        explanation:
          'Ordne die hervorgehobene Angabe dem richtigen Typ zu. Nutze die vier Fragen der Reihe nach. Danach trainierst du gemischt ohne Lösungshinweise. Die Fachbegriffe temporal, lokal, kausal und modal solltest du sicher abrufen können. Die vier Fachbegriffe solltest du sicher abrufen können.',
        example: {
          sentence: 'Sie arbeitet besonders sorgfältig.',
          note: 'Modal: Wie?',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Adverbiale ist „besonders sorgfältig“?',
          sentence: 'Sie arbeitet besonders sorgfältig.',
          choices: [
            { id: 'temporal', label: 'temporal' },
            { id: 'lokal', label: 'lokal' },
            { id: 'kausal', label: 'kausal' },
            { id: 'modal', label: 'modal' },
          ],
          correctId: 'modal',
        },
        feedbackCorrect: 'Modal – Art und Weise.',
        feedbackWrong: 'Welche der vier Fragen passt am besten?',
      },
    ],
  },

  full_analysis: {
    areaId: 'full_analysis',
    title: 'Ganze Sätze analysieren',
    goal: 'Du bestimmst Satzglieder in fester Reihenfolge.',
    showVerbPositions: true,
    refreshBullets: [
      'Reihenfolge: Prädikat → Subjekt → Objekte → Adverbiale.',
      'Hauptsatz oft Verbzweitstellung; Nebensatz Verbletztstellung.',
      'Mehrteilige Prädikate vollständig.',
    ],
    steps: [
      {
        id: 'f1',
        title: 'Reihenfolge merken',
        explanation:
          'Bei der Vollanalyse gehst du systematisch vor: zuerst Prädikat, dann Subjekt, dann Objekte, zuletzt Adverbiale. Die feste Reihenfolge verhindert Chaos und vergessene Teile. Merke dir diese Abfolge, bevor du einen ganzen Satz bestimmst. Diese Abfolge hält auch längere Sätze übersichtlich.',
        example: {
          sentence: 'Mia liest am Abend ein Buch.',
          note: 'Prädikat → Subjekt → Objekt → Adverbiale.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Womit beginnst du die Analyse?',
          choices: [
            { id: 'pred', label: 'Prädikat' },
            { id: 'subj', label: 'Subjekt' },
            { id: 'adv', label: 'Adverbiale' },
          ],
          correctId: 'pred',
        },
        feedbackCorrect: 'Zuerst das Prädikat – dann klappt der Rest.',
        feedbackWrong: 'Denk an die vereinbarte Reihenfolge der Bestimmung.',
      },
      {
        id: 'f2',
        title: 'Prädikat zuerst',
        explanation:
          'Markiere alle Prädikatsteile inklusive Satzklammer. Das finite Verb und mögliche zweite Teile gehören dazu. Danach fragst du nach dem Subjekt. Ohne vollständiges Prädikat werden die folgenden Schritte unsicher. Erst wenn das Prädikat vollständig ist, kommt das Subjekt. Erst wenn das Prädikat vollständig ist, kommt das Subjekt.',
        example: {
          sentence: 'Lena hat das Zimmer aufgeräumt.',
          note: '„hat … aufgeräumt“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Prädikat vollständig.',
          sentence: 'Lena hat das Zimmer aufgeräumt.',
          targets: ['hat', 'aufgeräumt'],
        },
        feedbackCorrect: 'Prädikat vollständig – guter Start.',
        feedbackWrong: 'Alle Verbteile der Aussage markieren.',
      },
      {
        id: 'f3',
        title: 'Subjekt danach',
        explanation:
          'Mit dem Prädikat stellst du die Subjektfrage. Markiere die ganze Gruppe. Position im Satz ist egal – die Rolle zählt. So baust du die Analyse Schicht für Schicht auf und vermeidest Verwechslungen mit Objekten. Schicht für Schicht vermeidest du Lücken in der Analyse.',
        example: {
          sentence: 'Am Abend hat Lena das Zimmer aufgeräumt.',
          note: 'Subjekt bleibt „Lena“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Subjekt.',
          sentence: 'Am Abend hat Lena das Zimmer aufgeräumt.',
          targets: ['Lena'],
        },
        feedbackCorrect: 'Subjekt gefunden.',
        feedbackWrong: 'Wer oder was + Prädikat?',
      },
      {
        id: 'f4',
        title: 'Objekte und Adverbiale',
        explanation:
          'Objekte bestimmst du über Wen/was? und Wem?, Adverbiale über Wann, Wo, Warum oder Wie. Arbeite der Reihe nach. Bei Verbzweitstellung im Hauptsatz bleibt das Finitum nach dem ersten Satzglied – das hilft beim Überblick. Objekte und Adverbiale erst nach Prädikat und Subjekt.',
        example: {
          sentence: 'Mia zeigt ihrem Bruder am Abend das Fahrrad.',
          note: 'Dativ, Adverbiale, Akkusativ.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Was ist „am Abend“?',
          sentence: 'Mia zeigt ihrem Bruder am Abend das Fahrrad.',
          choices: [
            { id: 'obj', label: 'Objekt' },
            { id: 'adv', label: 'Adverbiale' },
            { id: 'subj', label: 'Subjekt' },
          ],
          correctId: 'adv',
        },
        feedbackCorrect: 'Adverbiale – Wann?',
        feedbackWrong: 'Ist es Ergänzung (Objekt) oder Umstand (Adverbiale)?',
      },
      {
        id: 'f5',
        title: 'Verbstellung im Blick',
        explanation:
          'Während der Analyse lohnt ein Blick auf die Verbstellung: Verbzweitstellung im Aussagesatz, Verbletztstellung im Nebensatz. So verlierst du keine Prädikatsteile am Satzende. Die Fachbegriffe gehören zur sauberen Analyse dazu. Verbstellung hilft besonders bei mehrteiligen Prädikaten. Verbstellung hilft besonders bei mehrteiligen Prädikaten.',
        example: {
          sentence: '… weil Lena das Zimmer aufgeräumt hat.',
          note: 'Verbletztstellung.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Verbstellung?',
          sentence: '… weil Lena das Zimmer aufgeräumt hat.',
          choices: VERB_POS,
          correctId: 'verbletzt',
        },
        feedbackCorrect: 'Verbletztstellung – Prädikat am Ende nicht vergessen.',
        feedbackWrong: 'Haupt- oder Nebensatz? Wo steht das Finitum?',
      },
      {
        id: 'f6',
        title: 'Anwenden',
        explanation:
          'Zum Abschluss markierst du das Akkusativobjekt in einem Analysensatz. Nutze die gelernten Fragen. Im Training bestimmst du dann Schritt für Schritt den ganzen Satz – ohne Lösungshinweise und ohne Positionsmarkierungen. Danach bestimmst du im Training den ganzen Satz Schritt für Schritt.',
        example: {
          sentence: 'Paul trägt am Morgen seinen Rucksack.',
          note: 'Objekt: „seinen Rucksack“.',
        },
        exercise: {
          kind: 'mark',
          prompt: 'Markiere das Akkusativobjekt.',
          sentence: 'Paul trägt am Morgen seinen Rucksack.',
          targets: ['seinen Rucksack'],
        },
        feedbackCorrect: 'Analyseweg sitzt – weiter zum Training.',
        feedbackWrong: 'Wen oder was trägt Paul?',
      },
    ],
  },

  mixed: {
    areaId: 'mixed',
    title: 'Gemischtes Training',
    goal: 'Du wechselst sicher zwischen Grenzen, Proben, Rollen und Wortarten.',
    showVerbPositions: true,
    refreshBullets: [
      'Aufgabenstellung genau lesen.',
      'Verberststellung · Verbzweitstellung · Verbletztstellung.',
      'Bei Fehlerfinden nur falsche Zuordnungen antippen.',
    ],
    steps: [
      {
        id: 'x1',
        title: 'Aufgaben lesen',
        explanation:
          'Im gemischten Training wechselt der Aufgabentyp. Lies jede Anweisung genau: Grenze setzen, verschieben, markieren, zuordnen oder Fehler finden. Der erste Blick gilt der Fragestellung. Erst danach entscheidest du die passende Technik. Die Technik folgt immer aus der gelesenen Aufgabe. Die Technik folgt immer aus der gelesenen Aufgabe.',
        example: {
          sentence: 'Beispiel: „Markiere das Subjekt.“',
          note: 'Andere Aufgabe = anderer Fokus.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Was machst du zuerst bei einer neuen Aufgabe?',
          choices: [
            { id: 'read', label: 'Die Aufgabenstellung lesen' },
            { id: 'guess', label: 'Sofort irgendetwas markieren' },
            { id: 'skip', label: 'Die Aufgabe überspringen' },
          ],
          correctId: 'read',
        },
        feedbackCorrect: 'Genau – erst lesen, dann handeln.',
        feedbackWrong: 'Ohne die Fragestellung rateest du nur.',
      },
      {
        id: 'x2',
        title: 'Grenzen kurz prüfen',
        explanation:
          'Manchmal geht es um Satzgliedgrenzen. Erinnere die Probe: Was gehört zusammen? Setze Grenzen nur zwischen Einheiten. Das finite Verb hilft beim Gliedern. Kurze Grenzübungen halten diese Fähigkeit im Mix wach. Kurze Grenzproben halten diese Fähigkeit im Mix wach. Kurze Grenzproben halten diese Fähigkeit im Mix wach.',
        example: {
          sentence: 'Der Hund | schläft | im Körbchen.',
          note: 'Drei Satzglieder.',
        },
        exercise: {
          kind: 'boundary',
          prompt: 'Setze die Grenzen.',
          sentence: 'Der Hund schläft im Körbchen.',
          groups: ['Der Hund', 'schläft', 'im Körbchen'],
        },
        feedbackCorrect: 'Grenzen sitzen.',
        feedbackWrong: 'Gruppen prüfen – keine Grenze mitten drin.',
      },
      {
        id: 'x3',
        title: 'Verbstellung blitzschnell',
        explanation:
          'Du kannst Verberststellung, Verbzweitstellung und Verbletztstellung zuordnen. Kurz vergleichen: Frage, Aussage, Nebensatz. Der Fachbegriff gehört zur Antwort. Ein schneller Blick auf das finite Verb entscheidet oft schon richtig. Ein Blick auf das Finitum entscheidet oft schon richtig. Ein Blick auf das Finitum entscheidet oft schon richtig.',
        example: {
          sentence: 'Schläft der Hund?',
          note: 'Verberststellung.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Verbstellung?',
          sentence: 'Der Hund schläft im Körbchen.',
          choices: VERB_POS,
          correctId: 'verbzweit',
        },
        feedbackCorrect: 'Verbzweitstellung – Aussagesatz.',
        feedbackWrong: 'Vergleiche Frage, Aussage und Nebensatz.',
      },
      {
        id: 'x4',
        title: 'Wortarten',
        explanation:
          'Manchmal geht es um Wortarten: Substantiv, Verb, Adjektiv oder Präposition. Das ist etwas anderes als die Satzgliedrolle. Lies die Frage sorgfältig – Wortart oder Satzglied? Diese Unterscheidung verhindert typische Mischfehler. Wortart und Satzgliedrolle sind zwei verschiedene Ebenen. Wortart und Satzgliedrolle sind zwei verschiedene Ebenen.',
        example: {
          sentence: 'Wort: „unter“ → Präposition.',
          note: 'Wortart ≠ Satzgliedrolle.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Welche Wortart hat „schläft“?',
          sentence: 'Der Hund schläft.',
          choices: [
            { id: 'Substantiv', label: 'Substantiv' },
            { id: 'Verb', label: 'Verb' },
            { id: 'Adjektiv', label: 'Adjektiv' },
            { id: 'Präposition', label: 'Präposition' },
          ],
          correctId: 'Verb',
        },
        feedbackCorrect: 'Verb – die Wortart stimmt.',
        feedbackWrong: 'Wortart bestimmen, nicht die Satzgliedrolle.',
      },
      {
        id: 'x5',
        title: 'Fehlerfinden',
        explanation:
          'Beim Fehlerfinden tippst du nur falsche Zuordnungen an. Richtige Etiketten lässt du ruhen. Arbeite systematisch: jede Zuordnung mit der passenden Frage prüfen. Markiere nicht alles – nur das, was wirklich falsch ist. Nur echte Fehler antippen – Richtiges stehen lassen.',
        example: {
          sentence: 'Analyse prüfen – nur Fehler wählen.',
          note: 'Nicht alles markieren.',
        },
        exercise: {
          kind: 'choice',
          prompt: 'Ist „schläft“ als Subjekt markiert – falsch?',
          sentence: 'Der Hund schläft. (Analyse: schläft → Subjekt)',
          choices: YES_NO,
          correctId: 'ja',
        },
        feedbackCorrect: 'Ja – „schläft“ ist Prädikat, nicht Subjekt.',
        feedbackWrong: 'Stimmt die Zuordnung zur Rolle?',
      },
      {
        id: 'x6',
        title: 'Kurz verschieben',
        explanation:
          'Auch im Mix kann eine Verschiebeprobe vorkommen. Ganze Satzglieder ziehen und im Aussagesatz die Verbzweitstellung beachten. Prüfe den Sinn des Satzes. Danach startet das gemischte Training ohne Lösungshinweise. Danach startet das gemischte Training ohne Lösungshinweise. Danach startet das gemischte Training ohne Lösungshinweise.',
        example: {
          sentence: 'Im Körbchen schläft der Hund.',
          note: 'Umsstellung mit Verbzweitstellung.',
        },
        exercise: {
          kind: 'move',
          prompt: 'Stelle den Satz um.',
          groups: ['Der Hund', 'schläft', 'im Körbchen'],
          verbIndexes: [1],
          originalSentence: 'Der Hund schläft im Körbchen.',
          valid: [
            'Im Körbchen schläft der Hund.',
            'Der Hund schläft im Körbchen.',
          ],
        },
        feedbackCorrect: 'Bereit fürs gemischte Training.',
        feedbackWrong: 'Ganze Gruppen verschieben und den Satz prüfen.',
      },
    ],
  },
}

export function getTutorial(areaId: AreaId): AreaTutorial {
  return AREA_TUTORIALS[areaId]
}
