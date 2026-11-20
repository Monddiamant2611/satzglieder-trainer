import type { AreaId } from './areas'

export type TutorialPhaseId = 'wissen' | 'gemeinsam' | 'selbst'

export type TutorialPhase = {
  id: TutorialPhaseId
  title: string
  sections: { heading: string; body: string[] }[]
  /** Optional guided mini-example (shown, not scored). */
  example?: { sentence: string; note: string }
  /** Soft interactive verb-position practice in tutorial. */
  verbPositionPractice?: boolean
}

export type AreaTutorial = {
  areaId: AreaId
  title: string
  goal: string
  refreshBullets: string[]
  phases: TutorialPhase[]
  /** Show Fachbegriffe Verbstellung glossary cards. */
  showVerbPositions?: boolean
}

const TRAIN_AREA_IDS: AreaId[] = [
  'boundary',
  'move',
  'predicate',
  'subject',
  'accusative',
  'dative',
  'both_objects',
  'adverbial',
  'full_analysis',
  'mixed',
]

export const AREA_TUTORIALS: Record<string, AreaTutorial> = {
  boundary: {
    areaId: 'boundary',
    title: 'Satzglieder erkennen',
    goal: 'Du erkennst, wo ein Satzglied beginnt und endet.',
    refreshBullets: [
      'Satzglieder sind Einheiten, die sich gemeinsam verschieben lassen.',
      'Ein Satzglied kann ein Wort oder eine Wortgruppe sein.',
      'Setze Grenzen nur zwischen Satzgliedern – nicht mitten in einer Gruppe.',
    ],
    phases: [
      {
        id: 'wissen',
        title: 'Wissen auffrischen',
        sections: [
          {
            heading: 'Lernziel',
            body: [
              'Du findest die Grenzen zwischen den Satzgliedern eines Satzes.',
            ],
          },
          {
            heading: 'Erkennungsfragen',
            body: [
              'Was gehört zusammen?',
              'Was lässt sich gemeinsam an den Satzanfang stellen?',
            ],
          },
          {
            heading: 'Regeln',
            body: [
              'Wörter einer Nominalgruppe (z. B. „der kleine Hund“) gehören zusammen.',
              'Präpositionalgruppen (z. B. „am Nachmittag“) sind oft ein Satzglied.',
              'Mehrteilige Prädikate können auseinanderstehen – die Teile zählen trotzdem zum Prädikat.',
            ],
          },
          {
            heading: 'Typische Fehler',
            body: [
              'Jedes Wort als eigenes Satzglied behandeln.',
              'Artikel oder Adjektiv vom Substantiv trennen.',
            ],
          },
          {
            heading: 'So bedienst du die Übung',
            body: [
              'Tippe auf die Lücke zwischen Wörtern, um eine Grenze zu setzen oder zu entfernen.',
              'Danach „Prüfen“.',
            ],
          },
        ],
        example: {
          sentence: 'Der kleine Hund | schläft | am Nachmittag.',
          note: 'Drei Satzglieder – die Gruppe „Der kleine Hund“ bleibt zusammen.',
        },
      },
      {
        id: 'gemeinsam',
        title: 'Gemeinsam ausprobieren',
        sections: [
          {
            heading: 'Gemeinsam denken',
            body: [
              'Lies den Satz laut und frage: Was wandert gemeinsam?',
              'Markiere zuerst große Gruppen (Wer? Wann? Wo?), dann das Geschehen.',
            ],
          },
        ],
        example: {
          sentence: 'Mia | liest | nach dem Unterricht | ein Buch.',
          note: 'Vier Einheiten – „nach dem Unterricht“ und „ein Buch“ sind Gruppen.',
        },
      },
      {
        id: 'selbst',
        title: 'Selbstständig trainieren',
        sections: [
          {
            heading: 'Bereit?',
            body: [
              'In der Runde bekommst du keine Lösungsanzeige – nur, ob es stimmt.',
              'Nutze die Verschiebeprobe im Kopf.',
            ],
          },
        ],
      },
    ],
  },
  move: {
    areaId: 'move',
    title: 'Verschiebeprobe',
    goal: 'Du prüfst mit Umsstellungen, was ein Satzglied ist – und benennst die Verbstellung fachsprachlich.',
    refreshBullets: [
      'Aussagesatz: Verbzweitstellung (finites Verb an Position 2).',
      'Frage/Aufforderung: Verberststellung.',
      'Nebensatz: Verbletztstellung.',
      'Mehrteilige Prädikate: Satzklammer – finites Verb und zweiter Teil können auseinanderstehen.',
      'Ziehe ganze Satzglieder; mehrere gültige Umsstellungen sind möglich.',
    ],
    showVerbPositions: true,
    phases: [
      {
        id: 'wissen',
        title: 'Wissen auffrischen',
        sections: [
          {
            heading: 'Lernziel',
            body: [
              'Du verschiebst Satzglieder und erkennst Verbzweitstellung, Verberststellung und Verbletztstellung.',
            ],
          },
          {
            heading: 'Erkennungsfragen',
            body: [
              'Bleibt der Satz sinnvoll?',
              'Wo steht das finite Verb – Position 1, 2 oder am Ende?',
              'Handelt es sich um Haupt- oder Nebensatz?',
            ],
          },
          {
            heading: 'Regeln',
            body: [
              'Nur ganze Satzglieder wandern.',
              'Aussagesatz (Hauptsatz): Verbzweitstellung – nach dem ersten Satzglied folgt das finite Verb.',
              'Entscheidungsfrage / Aufforderung: Verberststellung.',
              'Nebensatz (weil, dass, als, …): Verbletztstellung.',
              'Mehrteilige Prädikate: Satzklammer (z. B. hat … gelesen); das Finitum bestimmt die Stellung.',
            ],
          },
          {
            heading: 'Typische Fehler',
            body: [
              'Verbzweitstellung mit Verbletztstellung verwechseln.',
              'Nur ein Wort aus einer Gruppe verschieben.',
              'Das finite Verb im Aussagesatz an den Anfang ziehen.',
            ],
          },
          {
            heading: 'So bedienst du die Übung',
            body: [
              'Ziehe Satzglieder per Drag-and-Drop (oder „An den Anfang“).',
              'Benenne danach die Verbstellung mit dem Fachbegriff.',
              '„Ausgangssatz“ setzt zurück. Dann „Prüfen“.',
            ],
          },
        ],
        example: {
          sentence: 'Am Nachmittag schläft der Hund im Körbchen.',
          note: 'Umsstellung möglich – Verbzweitstellung bleibt: erstes Satzglied + finites Verb.',
        },
      },
      {
        id: 'gemeinsam',
        title: 'Gemeinsam ausprobieren',
        sections: [
          {
            heading: 'Gemeinsam',
            body: [
              'Vergleiche die drei Beispiele und ordne den Fachbegriff zu.',
              'Achte auf Satzklammer bei mehrteiligen Prädikaten.',
            ],
          },
        ],
        verbPositionPractice: true,
      },
      {
        id: 'selbst',
        title: 'Selbstständig trainieren',
        sections: [
          {
            heading: 'Bereit?',
            body: [
              'In der Runde gibt es keine Positionsmarkierung – du erkennst die Stellung selbst.',
              'Mehrere Umsstellungen können richtig sein, solange Verbzweitstellung gilt.',
            ],
          },
        ],
      },
    ],
  },
  predicate: {
    areaId: 'predicate',
    title: 'Prädikat',
    goal: 'Du markierst alle Teile des Prädikats.',
    refreshBullets: [
      'Frage: Was geschieht?',
      'Mehrteilig: Satzklammer (hat … gemacht, räumt … auf).',
      'Im Hauptsatz steht das Finitum in Verbzweitstellung; der zweite Teil oft am Ende.',
      'Markiere alle Teile, auch wenn sie auseinanderstehen.',
    ],
    showVerbPositions: true,
    phases: [
      {
        id: 'wissen',
        title: 'Wissen auffrischen',
        sections: [
          {
            heading: 'Lernziel',
            body: ['Du findest das Prädikat – einteilig oder mehrteilig (Satzklammer).'],
          },
          {
            heading: 'Erkennungsfragen',
            body: ['Was geschieht?', 'Welche Wörter sagen das Geschehen aus?'],
          },
          {
            heading: 'Regeln',
            body: [
              'Das Prädikat kann aus mehreren Teilen bestehen.',
              'Partikelverben: finite Form + Partikel (schreibt … auf).',
              'Perfekt u. Ä.: Hilfsverb + Partizip (hat … geschlafen) → Satzklammer.',
              'Im Aussagesatz: Verbzweitstellung des Finitums; im Nebensatz oft Verbletztstellung.',
            ],
          },
          {
            heading: 'Typische Fehler',
            body: [
              'Nur den finiten Teil markieren.',
              'Objekte oder Adverbiale zum Prädikat zählen.',
            ],
          },
          {
            heading: 'Bedienung',
            body: ['Tippe alle Wörter an, die zum Prädikat gehören. Dann „Prüfen“.'],
          },
        ],
        example: {
          sentence: 'Lena hat ihr Zimmer aufgeräumt.',
          note: 'Prädikat: hat … aufgeräumt (zwei Teile).',
        },
      },
      {
        id: 'gemeinsam',
        title: 'Gemeinsam ausprobieren',
        sections: [
          {
            heading: 'Gemeinsam',
            body: ['Suche zuerst die finite Verbform, dann den zweiten Teil am Satzende.'],
          },
        ],
      },
      {
        id: 'selbst',
        title: 'Selbstständig trainieren',
        sections: [
          {
            heading: 'Bereit?',
            body: ['In der Runde siehst du nach dem Prüfen keine fertige Lösungsmarkierung.'],
          },
        ],
      },
    ],
  },
  subject: {
    areaId: 'subject',
    title: 'Subjekt',
    goal: 'Du markierst das Subjekt als ganze Wortgruppe.',
    refreshBullets: [
      'Frage: Wer oder was + Prädikat?',
      'Oft die ganze Nominalgruppe markieren.',
      'Zuerst das Prädikat klären, dann fragen.',
    ],
    phases: [
      {
        id: 'wissen',
        title: 'Wissen auffrischen',
        sections: [
          {
            heading: 'Lernziel',
            body: ['Du findest, wer oder was etwas tut (oder ist).'],
          },
          {
            heading: 'Erkennungsfragen',
            body: ['Wer oder was + Prädikat?'],
          },
          {
            heading: 'Regeln',
            body: [
              'Das Subjekt stimmt mit dem finiten Verb überein.',
              'Markiere die ganze Gruppe (Artikel, Adjektiv, Substantiv).',
            ],
          },
          {
            heading: 'Typische Fehler',
            body: ['Nur das Kernsubstantiv markieren.', 'Ein Objekt für das Subjekt halten.'],
          },
          {
            heading: 'Bedienung',
            body: ['Tippe alle Wörter des Subjekts an.'],
          },
        ],
        example: {
          sentence: 'Der kleine Hund schläft.',
          note: 'Subjekt: Der kleine Hund.',
        },
      },
      {
        id: 'gemeinsam',
        title: 'Gemeinsam ausprobieren',
        sections: [
          {
            heading: 'Gemeinsam',
            body: ['Prädikat finden → „Wer oder was …?“ stellen → ganze Antwort markieren.'],
          },
        ],
      },
      {
        id: 'selbst',
        title: 'Selbstständig trainieren',
        sections: [{ heading: 'Bereit?', body: ['Starte die Runde, wenn du die Frage sicher beherrschst.'] }],
      },
    ],
  },
  accusative: {
    areaId: 'accusative',
    title: 'Akkusativobjekt',
    goal: 'Du markierst das Akkusativobjekt (Wen oder was?).',
    refreshBullets: [
      'Frage: Wen oder was?',
      'Ganze Nominalgruppe markieren.',
      'Nicht mit dem Dativobjekt (Wem?) verwechseln.',
    ],
    phases: [
      {
        id: 'wissen',
        title: 'Wissen auffrischen',
        sections: [
          {
            heading: 'Lernziel',
            body: ['Du findest das Akkusativobjekt.'],
          },
          {
            heading: 'Erkennungsfragen',
            body: ['Wen oder was + Prädikat (+ Subjekt)?'],
          },
          {
            heading: 'Regeln',
            body: ['Antwort auf „Wen oder was?“ = Akkusativobjekt.', 'Oft mit Artikel im Akkusativ (einen, das, …).'],
          },
          {
            heading: 'Typische Fehler',
            body: ['Dativobjekt als Akkusativ markieren.', 'Nur das Substantiv ohne Begleiter.'],
          },
          {
            heading: 'Bedienung',
            body: ['Markiere die gesamte Objektgruppe.'],
          },
        ],
        example: {
          sentence: 'Mia liest einen spannenden Roman.',
          note: 'Akkusativobjekt: einen spannenden Roman.',
        },
      },
      {
        id: 'gemeinsam',
        title: 'Gemeinsam ausprobieren',
        sections: [
          {
            heading: 'Gemeinsam',
            body: ['Stelle die Frage laut: „Wen oder was liest Mia?“'],
          },
        ],
      },
      {
        id: 'selbst',
        title: 'Selbstständig trainieren',
        sections: [{ heading: 'Bereit?', body: ['Keine Lösungsanzeige in der Runde – nur richtig/falsch.'] }],
      },
    ],
  },
  dative: {
    areaId: 'dative',
    title: 'Dativobjekt',
    goal: 'Du markierst das Dativobjekt (Wem?).',
    refreshBullets: [
      'Frage: Wem?',
      'Ganze Gruppe markieren.',
      'Nicht mit „Wen oder was?“ verwechseln.',
    ],
    phases: [
      {
        id: 'wissen',
        title: 'Wissen auffrischen',
        sections: [
          {
            heading: 'Lernziel',
            body: ['Du findest das Dativobjekt.'],
          },
          {
            heading: 'Erkennungsfragen',
            body: ['Wem?'],
          },
          {
            heading: 'Regeln',
            body: ['Antwort auf „Wem?“ = Dativobjekt.', 'Häufig Personen oder Lebewesen als Empfänger.'],
          },
          {
            heading: 'Typische Fehler',
            body: ['Akkusativobjekt als Dativ markieren.'],
          },
          {
            heading: 'Bedienung',
            body: ['Markiere die ganze Dativ-Gruppe.'],
          },
        ],
        example: {
          sentence: 'Mia schenkt ihrem Bruder ein Buch.',
          note: 'Dativobjekt: ihrem Bruder.',
        },
      },
      {
        id: 'gemeinsam',
        title: 'Gemeinsam ausprobieren',
        sections: [
          {
            heading: 'Gemeinsam',
            body: ['Frage: „Wem schenkt Mia ein Buch?“'],
          },
        ],
      },
      {
        id: 'selbst',
        title: 'Selbstständig trainieren',
        sections: [{ heading: 'Bereit?', body: ['Starte die Runde.'], }],
      },
    ],
  },
  both_objects: {
    areaId: 'both_objects',
    title: 'Objekte unterscheiden',
    goal: 'Du trennst Dativ- und Akkusativobjekt sicher.',
    refreshBullets: [
      'Zuerst Wem? (Dativ), dann Wen oder was? (Akkusativ).',
      'Beide Gruppen vollständig markieren.',
      'Reihenfolge der Fragen hilft gegen Verwechslung.',
    ],
    phases: [
      {
        id: 'wissen',
        title: 'Wissen auffrischen',
        sections: [
          {
            heading: 'Lernziel',
            body: ['Du unterscheidest Dativ- und Akkusativobjekt im selben Satz.'],
          },
          {
            heading: 'Erkennungsfragen',
            body: ['Wem?', 'Wen oder was?'],
          },
          {
            heading: 'Regeln',
            body: [
              'Beide Objekte können vorkommen.',
              'Immer die ganze Nominalgruppe nehmen.',
            ],
          },
          {
            heading: 'Typische Fehler',
            body: ['Die beiden Objekte vertauschen.', 'Nur ein Objekt sehen.'],
          },
          {
            heading: 'Bedienung',
            body: ['Zuerst Dativ markieren und prüfen, dann Akkusativ.'],
          },
        ],
        example: {
          sentence: 'Mia schenkt ihrem Bruder ein spannendes Buch.',
          note: 'Dativ: ihrem Bruder · Akkusativ: ein spannendes Buch.',
        },
      },
      {
        id: 'gemeinsam',
        title: 'Gemeinsam ausprobieren',
        sections: [
          {
            heading: 'Gemeinsam',
            body: ['Zwei Fragen nacheinander stellen – nicht raten.'],
          },
        ],
      },
      {
        id: 'selbst',
        title: 'Selbstständig trainieren',
        sections: [{ heading: 'Bereit?', body: ['Die Runde verlangt beide Schritte.'] }],
      },
    ],
  },
  adverbial: {
    areaId: 'adverbial',
    title: 'Adverbiale Bestimmungen',
    goal: 'Du ordnest Umstände den Fragen Wann/Wo/Warum/Wie zu.',
    refreshBullets: [
      'temporal – Wann?',
      'lokal – Wo / Wohin?',
      'kausal – Warum?',
      'modal – Wie?',
      'Die Funktion im Satz entscheidet – nicht nur die Präposition.',
    ],
    phases: [
      {
        id: 'wissen',
        title: 'Wissen auffrischen',
        sections: [
          {
            heading: 'Lernziel',
            body: ['Du bestimmst die Art der adverbialen Bestimmung.'],
          },
          {
            heading: 'Erkennungsfragen',
            body: ['Wann?', 'Wo / Wohin?', 'Warum?', 'Wie?'],
          },
          {
            heading: 'Regeln',
            body: [
              'Die Frage klärt die Funktion.',
              'Dieselbe Präposition kann unterschiedliche Rollen andeuten.',
            ],
          },
          {
            heading: 'Typische Fehler',
            body: [
              'Nur nach der Präposition raten.',
              'Objekte mit Adverbialen verwechseln.',
            ],
          },
          {
            heading: 'Bedienung',
            body: ['Lies den hervorgehobenen Teil und wähle die passende Art.'],
          },
        ],
        example: {
          sentence: 'Wegen des Regens bleibt die Klasse drinnen.',
          note: '„Wegen des Regens“ → kausal (Warum?).',
        },
      },
      {
        id: 'gemeinsam',
        title: 'Gemeinsam ausprobieren',
        sections: [
          {
            heading: 'Gemeinsam',
            body: ['Ersetze den Baustein probeweise durch die Frage – welche passt?'],
          },
        ],
      },
      {
        id: 'selbst',
        title: 'Selbstständig trainieren',
        sections: [{ heading: 'Bereit?', body: ['In der Runde wird die richtige Option nicht farblich vorgezeigt.'] }],
      },
    ],
  },
  full_analysis: {
    areaId: 'full_analysis',
    title: 'Ganze Sätze analysieren',
    goal: 'Du analysierst Sätze Schritt für Schritt.',
    refreshBullets: [
      'Reihenfolge: Prädikat → Subjekt → Objekte → Adverbiale.',
      'Hauptsatz meist Verbzweitstellung; Nebensatz Verbletztstellung.',
      'Mehrteilige Prädikate / Satzklammer vollständig markieren.',
      'Immer ganze Satzglieder, nicht nur Einzelwörter.',
    ],
    showVerbPositions: true,
    phases: [
      {
        id: 'wissen',
        title: 'Wissen auffrischen',
        sections: [
          {
            heading: 'Lernziel',
            body: ['Du bestimmst alle Satzglieder in fester Reihenfolge und beachtest die Verbstellung.'],
          },
          {
            heading: 'Erkennungsfragen',
            body: [
              'Was geschieht? (Prädikat)',
              'Wer oder was? (Subjekt)',
              'Wem? / Wen oder was? (Objekte)',
              'Wann/Wo/Warum/Wie? (Adverbiale)',
            ],
          },
          {
            heading: 'Regeln',
            body: [
              'Ein Schritt nach dem anderen.',
              'Fehlt ein Objekt oder Adverbiale, markierst du nichts und gehst weiter.',
            ],
          },
          {
            heading: 'Typische Fehler',
            body: ['Schritte überspringen.', 'Rollen vertauschen.'],
          },
          {
            heading: 'Bedienung',
            body: ['Markiere die Wörter des aktuellen Schritts und prüfe, bevor du weitergehst.'],
          },
        ],
      },
      {
        id: 'gemeinsam',
        title: 'Gemeinsam ausprobieren',
        sections: [
          {
            heading: 'Gemeinsam',
            body: [
              'Beispielweg: Prädikat finden → Subjekt fragen → Objekte → Adverbiale.',
            ],
          },
        ],
        example: {
          sentence: 'Am Montag bringt Lea ihrem Freund ein Geschenk.',
          note: 'Prädikat bringt · Subjekt Lea · Dativ ihrem Freund · Akkusativ ein Geschenk · temporal Am Montag.',
        },
      },
      {
        id: 'selbst',
        title: 'Selbstständig trainieren',
        sections: [
          {
            heading: 'Bereit?',
            body: ['Am Ende siehst du keine farbige Komplettlösung – nur den Erfolg der Schritte.'],
          },
        ],
      },
    ],
  },
  mixed: {
    areaId: 'mixed',
    title: 'Gemischtes Training',
    goal: 'Du wendest alles gemischt an – inkl. Fehlerfinden und Wortarten.',
    refreshBullets: [
      'Lies die Aufgabenstellung genau.',
      'Verbstellung: Verberststellung · Verbzweitstellung · Verbletztstellung.',
      'Wechsle bewusst zwischen Grenzen, Proben, Rollen und Wortarten.',
      'Bei Fehlerfinden: nur die falschen Zuordnungen antippen.',
    ],
    showVerbPositions: true,
    phases: [
      {
        id: 'wissen',
        title: 'Wissen auffrischen',
        sections: [
          {
            heading: 'Lernziel',
            body: [
              'Du trainierst gemischt – inkl. Verbstellung (Fachbegriffe), Fehlerfinden und Wortarten.',
            ],
          },
          {
            heading: 'Was kommt vor?',
            body: [
              'Satzgliedgrenzen, Verschiebeprobe, Prädikat/Subjekt/Objekte/Adverbiale.',
              'Verbstellung benennen: Verberststellung, Verbzweitstellung, Verbletztstellung.',
              'Fehlerfinden: falsche Etiketten erkennen.',
              'Wortarten: Substantiv, Verb, Adjektiv, Präposition.',
            ],
          },
          {
            heading: 'Typische Fehler',
            body: ['Die Aufgabenart übersehen.', 'Zu schnell tippen ohne die Frage zu lesen.'],
          },
          {
            heading: 'Bedienung',
            body: ['Orientiere dich am Aufgabentitel über der Übung.'],
          },
        ],
      },
      {
        id: 'gemeinsam',
        title: 'Gemeinsam ausprobieren',
        sections: [
          {
            heading: 'Gemeinsam',
            body: [
              'Bei Fehlerfinden: Vergleiche jede Zuordnung mit der passenden Frage.',
              'Bei Wortarten: Frage nach Beugung und Funktion.',
            ],
          },
        ],
      },
      {
        id: 'selbst',
        title: 'Selbstständig trainieren',
        sections: [{ heading: 'Bereit?', body: ['Die Runde mischt die Aufgabentypen.'] }],
      },
    ],
  },
}

export function getTutorial(areaId: AreaId): AreaTutorial {
  return AREA_TUTORIALS[areaId]
}

export const TUTORIAL_AREA_IDS = TRAIN_AREA_IDS
