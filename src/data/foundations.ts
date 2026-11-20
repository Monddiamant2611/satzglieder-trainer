export type FoundationScreen =
  | {
      kind: 'example'
      title: string
      lead: string
      sentence?: string
      blocks?: { text: string; tone?: 'sage' | 'sky' | 'rose' | 'violet' | 'zone' }[]
      highlight?: { text: string; label: string; tone: string }[]
      note?: string
    }
  | {
      kind: 'act-build'
      title: string
      lead: string
      base: string
      options: { id: string; text: string; question: string }[]
      hint: string
      success: string
    }
  | {
      kind: 'act-move'
      title: string
      lead: string
      groups: string[]
      verbIndexes: number[]
      targets: string[]
      hint: string
      success: string
      revealTerm?: boolean
    }
  | {
      kind: 'act-tap-units'
      title: string
      lead: string
      groups: string[]
      correctIds: number[]
      hint: string
      success: string
      explain?: string
    }
  | {
      kind: 'act-mark'
      title: string
      lead: string
      sentence: string
      targets: string[]
      hint: string
      success: string
      roleColor?: string
    }
  | {
      kind: 'act-classify'
      title: string
      lead: string
      sentence: string
      target: string
      choices: { id: string; label: string }[]
      correctId: string
      hint: string
      success: string
    }
  | {
      kind: 'act-questions'
      title: string
      lead: string
      sentence: string
      items: { question: string; answer: string }[]
      hint: string
      success: string
    }
  | {
      kind: 'observe'
      title: string
      lead: string
      points: string[]
      sentence?: string
      highlight?: { text: string; label: string; tone: string }[]
    }
  | {
      kind: 'explain'
      title: string
      lead: string
      body: string[]
    }
  | {
      kind: 'merksatz'
      title: string
      merke: string
      extra?: string
    }
  | {
      kind: 'check'
      title: string
      lead: string
      items: {
        id: string
        prompt: string
        sentence?: string
        choices: { id: string; label: string }[]
        correctId: string
        softHint: string
      }[]
      outro: string
    }

export type FoundationModule = {
  id: number
  title: string
  kicker: string
  screens: FoundationScreen[]
}

export const FOUNDATION_MODULES: FoundationModule[] = [
  {
    id: 1,
    title: 'Ein Satz wächst',
    kicker: 'Modul 1',
    screens: [
      {
        kind: 'example',
        title: 'Ein Satz kann wachsen',
        lead: 'Schau, wie aus wenigen Wörtern ein ganzer Satz wird.',
        blocks: [
          { text: 'Hund', tone: 'sage' },
          { text: 'schläft', tone: 'zone' },
        ],
        note: 'Noch fehlt vieles – aber es ist schon ein Satz.',
      },
      {
        kind: 'act-build',
        title: 'Baue den Satz aus',
        lead: 'Tippe Zusätze an. Jeder Zusatz beantwortet eine Frage.',
        base: 'Der Hund schläft.',
        options: [
          { id: 'wann', text: 'am Nachmittag', question: 'Wann?' },
          { id: 'wo', text: 'im Körbchen', question: 'Wo?' },
          { id: 'wie', text: 'ruhig', question: 'Wie?' },
        ],
        hint: 'Probier ruhig mehrere aus – du kannst nichts falsch machen.',
        success: 'Siehst du? Der Satz wird genauer, wenn wir Wann, Wo oder Wie ergänzen.',
      },
      {
        kind: 'observe',
        title: 'Was fällt auf?',
        lead: 'Zusätze machen den Satz anschaulicher.',
        points: [
          'Wann? → Zeit',
          'Wo? → Ort',
          'Warum? → Grund',
          'Wie? → Art und Weise',
        ],
        sentence: 'Der Hund schläft am Nachmittag ruhig im Körbchen.',
      },
      {
        kind: 'explain',
        title: 'Kurz erklärt',
        lead: 'Sätze bestehen aus Bausteinen, die wir später Satzglieder nennen.',
        body: [
          'Manche Bausteine sagen, wer etwas tut.',
          'Andere sagen, was geschieht – oder wann, wo, warum und wie.',
        ],
      },
      {
        kind: 'merksatz',
        title: 'Merke',
        merke: 'Ein Satz kann wachsen: Zusätze beantworten Fragen wie Wann? Wo? Warum? Wie?',
      },
    ],
  },
  {
    id: 2,
    title: 'Was gehört zusammen?',
    kicker: 'Modul 2',
    screens: [
      {
        kind: 'example',
        title: 'Wörter kleben zusammen',
        lead: 'Nicht jedes Wort steht für sich – manche bilden eine Gruppe.',
        sentence: 'Der kleine Hund schläft unter dem Tisch.',
        blocks: [
          { text: 'Der kleine Hund', tone: 'sky' },
          { text: 'schläft', tone: 'zone' },
          { text: 'unter dem Tisch', tone: 'sage' },
        ],
      },
      {
        kind: 'act-move',
        title: 'Schiebe Gruppen nach vorn',
        lead: 'Tippe eine Gruppe an und setze sie an den Satzanfang. Im Aussagesatz gilt Verbzweitstellung.',
        groups: ['Der kleine Hund', 'schläft', 'unter dem Tisch'],
        verbIndexes: [1],
        targets: [
          'Unter dem Tisch schläft der kleine Hund.',
          'Der kleine Hund schläft unter dem Tisch.',
        ],
        hint: 'Wähle eine Gruppe (nicht das Verb) und tippe „Nach vorn“.',
        success: 'Was sich gemeinsam verschieben lässt, gehört zusammen – Verbzweitstellung bleibt.',
      },
      {
        kind: 'observe',
        title: 'Beobachtung',
        lead: 'Gruppen wandern gemeinsam.',
        points: [
          '„Der kleine Hund“ bleibt beisammen.',
          '„unter dem Tisch“ bleibt beisammen.',
          'Einzelne Wörter aus der Gruppe allein wirken oft seltsam.',
        ],
      },
      {
        kind: 'explain',
        title: 'Kurz erklärt',
        lead: 'Zusammengehörigkeit zeigt sich durch gemeinsames Verschieben.',
        body: [
          'Wenn Wörter nur gemeinsam an den Anfang können, bilden sie eine Einheit.',
          'Diese Probe nutzen wir gleich noch gezielter.',
        ],
      },
      {
        kind: 'merksatz',
        title: 'Merke',
        merke: 'Was sich gemeinsam verschieben lässt, gehört zusammen.',
      },
    ],
  },
  {
    id: 3,
    title: 'Verschiebeprobe',
    kicker: 'Modul 3',
    screens: [
      {
        kind: 'example',
        title: 'Ausprobieren erlaubt',
        lead: 'Wir verschieben Bausteine und prüfen, ob der Satz noch stimmt.',
        sentence: 'Mia liest nach dem Unterricht ein Buch.',
      },
      {
        kind: 'act-move',
        title: 'Probiere Umsstellungen',
        lead: 'Verschiebe Gruppen. Im Aussagesatz gilt Verbzweitstellung.',
        groups: ['Mia', 'liest', 'nach dem Unterricht', 'ein Buch'],
        verbIndexes: [1],
        targets: [
          'Nach dem Unterricht liest Mia ein Buch.',
          'Ein Buch liest Mia nach dem Unterricht.',
          'Mia liest nach dem Unterricht ein Buch.',
        ],
        hint: 'Tippe eine Gruppe (außer dem Verb) und setze sie nach vorn.',
        success: 'Mehrere Umsstellungen sind möglich – Verbzweitstellung bleibt erhalten.',
        revealTerm: true,
      },
      {
        kind: 'observe',
        title: 'Jetzt der Name',
        lead: 'Diese Prüfung heißt Verschiebeprobe.',
        points: [
          'Satzglieder sind die Einheiten, die sich verschieben lassen.',
          'Aussagesatz: Verbzweitstellung – finites Verb nach dem ersten Satzglied.',
          'Entscheidungsfrage / Aufforderung: Verberststellung.',
          'Nebensatz: Verbletztstellung.',
          'Mehrteilige Prädikate (Satzklammer) wandern nicht als Block an den Anfang.',
        ],
      },
      {
        kind: 'explain',
        title: 'Kurz erklärt',
        lead: 'Die Verschiebeprobe hilft, Grenzen zu finden – und die Verbstellung zu prüfen.',
        body: [
          'Wir fragen: Was kann gemeinsam nach vorn?',
          'So trennen wir Satzglieder zuverlässig voneinander.',
          'Fachbegriffe: Verberststellung, Verbzweitstellung, Verbletztstellung.',
        ],
      },
      {
        kind: 'merksatz',
        title: 'Merke',
        merke: 'Mit der Verschiebeprobe findest du Satzglieder. Im Aussagesatz bleibt Verbzweitstellung.',
      },
    ],
  },
  {
    id: 4,
    title: 'Begriff Satzglied',
    kicker: 'Modul 4',
    screens: [
      {
        kind: 'example',
        title: 'Satzglieder benennen',
        lead: 'Ein Satzglied kann ein Wort oder mehrere Wörter sein.',
        blocks: [
          { text: 'Paul', tone: 'sky' },
          { text: 'trägt', tone: 'zone' },
          { text: 'seinen schweren Rucksack', tone: 'rose' },
          { text: 'in die Schule', tone: 'sage' },
        ],
      },
      {
        kind: 'act-tap-units',
        title: 'Tippe die Satzglieder an',
        lead: 'Markiere jede Einheit, die ein Satzglied ist.',
        groups: ['Paul', 'trägt', 'seinen schweren Rucksack', 'in die Schule'],
        correctIds: [0, 1, 2, 3],
        hint: 'Alle vier Bausteine sind Satzglieder – auch die mehrwortigen.',
        success: 'Genau: einwortig oder mehrwortig – beides kann ein Satzglied sein.',
        explain: '„seinen schweren Rucksack“ und „in die Schule“ sind mehrwortige Satzglieder.',
      },
      {
        kind: 'observe',
        title: 'Ein Wort oder mehrere?',
        lead: 'Vergleiche:',
        points: [
          '„Paul“ = ein Wort, ein Satzglied',
          '„seinen schweren Rucksack“ = drei Wörter, ein Satzglied',
          'Nicht jedes Wort ist ein eigenes Satzglied',
        ],
      },
      {
        kind: 'explain',
        title: 'Kurz erklärt',
        lead: 'Satzglied ≠ Wort.',
        body: [
          'Ein Satzglied ist eine Funktionseinheit im Satz.',
          'Es kann aus einem Wort oder aus einer Wortgruppe bestehen.',
        ],
      },
      {
        kind: 'merksatz',
        title: 'Merke',
        merke: 'Ein Satzglied kann ein Wort oder eine Wortgruppe sein.',
      },
    ],
  },
  {
    id: 5,
    title: 'Prädikat',
    kicker: 'Modul 5',
    screens: [
      {
        kind: 'example',
        title: 'Was geschieht?',
        lead: 'Das Prädikat sagt, was passiert. Es kann ein- oder mehrteilig sein.',
        highlight: [
          { text: 'schläft', label: 'einteilig', tone: 'warn' },
          { text: 'hat … geschlafen', label: 'mehrteilig', tone: 'warn' },
          { text: 'räumt … auf', label: 'Partikelverb', tone: 'warn' },
        ],
      },
      {
        kind: 'act-mark',
        title: 'Markiere das Prädikat',
        lead: 'Tippe alle Teile des Prädikats an.',
        sentence: 'Lena hat nach dem Essen ihr Zimmer aufgeräumt.',
        targets: ['hat', 'aufgeräumt'],
        hint: 'Bei „hat … aufgeräumt“ gehören beide Teile zum Prädikat.',
        success: 'Richtig: „hat“ und „aufgeräumt“ bilden zusammen das Prädikat.',
        roleColor: 'predicate',
      },
      {
        kind: 'act-mark',
        title: 'Partikelverben',
        lead: 'Auch abtrennbare Partikeln gehören zum Prädikat.',
        sentence: 'Ben schreibt die Informationen sorgfältig auf.',
        targets: ['schreibt', 'auf'],
        hint: '„auf“ ist die Partikel von „aufschreiben“.',
        success: '„schreibt … auf“ ist das Prädikat.',
        roleColor: 'predicate',
      },
      {
        kind: 'observe',
        title: 'Beobachtung',
        lead: 'Mehrteilige Prädikate können auseinanderstehen.',
        points: [
          'Aussagesatz: Verbzweitstellung; Frage: Verberststellung; Nebensatz: Verbletztstellung',
          'Zweiter Teil (Partizip/Partikel) oft am Ende',
          'Bei der Verschiebeprobe wandert nicht das ganze Prädikat als Block nach vorn',
        ],
      },
      {
        kind: 'merksatz',
        title: 'Merke',
        merke: 'Das Prädikat sagt, was geschieht. Es kann aus mehreren Teilen bestehen, die im Satz auseinanderstehen.',
      },
    ],
  },
  {
    id: 6,
    title: 'Subjekt',
    kicker: 'Modul 6',
    screens: [
      {
        kind: 'example',
        title: 'Wer oder was?',
        lead: 'Das Subjekt nennt, wer oder was etwas tut (oder ist).',
        sentence: 'Der kleine Hund schläft unter dem Tisch.',
        blocks: [
          { text: 'Der kleine Hund', tone: 'sky' },
          { text: 'schläft', tone: 'zone' },
        ],
        note: 'Frage: Wer oder was schläft?',
      },
      {
        kind: 'act-mark',
        title: 'Finde das Subjekt',
        lead: 'Markiere die ganze Wortgruppe – nicht nur ein Wort.',
        sentence: 'Unsere neue Mitschülerin liest in der Pause.',
        targets: ['Unsere', 'neue', 'Mitschülerin'],
        hint: 'Frage: Wer oder was liest? Die ganze Nominalgruppe gehört dazu.',
        success: '„Unsere neue Mitschülerin“ ist das Subjekt.',
        roleColor: 'subject',
      },
      {
        kind: 'observe',
        title: 'Nach dem Prädikat fragen',
        lead: 'Zuverlässiger Weg:',
        points: [
          'Zuerst das Prädikat finden',
          'Dann fragen: Wer oder was + Prädikat?',
          'Antwort = Subjekt (oft die ganze Nominalphrase)',
        ],
      },
      {
        kind: 'explain',
        title: 'Kurz erklärt',
        lead: 'Das Subjekt stimmt mit dem finiten Verb überein.',
        body: [
          '„der Hund schläft“ / „die Hunde schlafen“',
          'Markiere immer die ganze Gruppe, nicht nur das Kernsubstantiv.',
        ],
      },
      {
        kind: 'merksatz',
        title: 'Merke',
        merke: 'Das Subjekt antwortet auf „Wer oder was?“ – oft als ganze Wortgruppe.',
      },
    ],
  },
  {
    id: 7,
    title: 'Objekte',
    kicker: 'Modul 7',
    screens: [
      {
        kind: 'example',
        title: 'Wem? Wen oder was?',
        lead: 'Objekte ergänzen das Geschehen. Wir unterscheiden Dativ und Akkusativ.',
        blocks: [
          { text: 'Wem? → Dativobjekt', tone: 'violet' },
          { text: 'Wen oder was? → Akkusativobjekt', tone: 'rose' },
        ],
        sentence: 'Mia schenkt ihrem Bruder ein Buch.',
      },
      {
        kind: 'act-questions',
        title: 'Frage die Objekte ab',
        lead: 'Beantworte die Fragen zum Satz.',
        sentence: 'Mia schenkt ihrem Bruder ein Buch.',
        items: [
          { question: 'Wem schenkt Mia ein Buch?', answer: 'ihrem Bruder' },
          { question: 'Wen oder was schenkt Mia?', answer: 'ein Buch' },
        ],
        hint: 'Dativ = Wem? · Akkusativ = Wen oder was?',
        success: 'Dativobjekt: „ihrem Bruder“ · Akkusativobjekt: „ein Buch“',
      },
      {
        kind: 'act-mark',
        title: 'Markiere das Akkusativobjekt',
        lead: 'Wen oder was liest Mia?',
        sentence: 'Mia liest einen spannenden Roman.',
        targets: ['einen', 'spannenden', 'Roman'],
        hint: 'Die ganze Gruppe „einen spannenden Roman“.',
        success: '„einen spannenden Roman“ ist das Akkusativobjekt.',
        roleColor: 'object_accusative',
      },
      {
        kind: 'observe',
        title: 'Beobachtung',
        lead: 'Beide Objekte können im selben Satz vorkommen.',
        points: [
          'Zuerst Prädikat und Subjekt klären',
          'Dann Wem? und Wen oder was? stellen',
          'Immer die ganze Nominalgruppe markieren',
        ],
      },
      {
        kind: 'merksatz',
        title: 'Merke',
        merke: 'Dativobjekt ← Wem? · Akkusativobjekt ← Wen oder was?',
      },
    ],
  },
  {
    id: 8,
    title: 'Adverbiale Bestimmungen',
    kicker: 'Modul 8',
    screens: [
      {
        kind: 'example',
        title: 'Umstände im Satz',
        lead: 'Adverbiale Bestimmungen nennen Umstände: Zeit, Ort, Grund, Art und Weise.',
        blocks: [
          { text: 'Wann? temporal', tone: 'sage' },
          { text: 'Wo? lokal', tone: 'sky' },
          { text: 'Warum? kausal', tone: 'rose' },
          { text: 'Wie? modal', tone: 'violet' },
        ],
      },
      {
        kind: 'act-questions',
        title: 'Stelle die Umstandsfragen',
        lead: 'Welche Frage passt zu welchem Baustein?',
        sentence: 'Am Morgen lernt Lea wegen der Arbeit mit großer Ruhe im Garten.',
        items: [
          { question: 'Wann?', answer: 'Am Morgen' },
          { question: 'Warum?', answer: 'wegen der Arbeit' },
          { question: 'Wie?', answer: 'mit großer Ruhe' },
          { question: 'Wo?', answer: 'im Garten' },
        ],
        hint: 'Orientiere dich an der Funktion im Satz – nicht nur an der Präposition.',
        success: 'Die Fragen zeigen die adverbiale Art.',
      },
      {
        kind: 'act-classify',
        title: 'Ordne die Art zu',
        lead: 'Welche Art von Adverbiale ist hervorgehoben?',
        sentence: 'Wegen des Regens bleibt die Klasse drinnen.',
        target: 'Wegen des Regens',
        choices: [
          { id: 'temporal', label: 'temporal (Wann?)' },
          { id: 'lokal', label: 'lokal (Wo?)' },
          { id: 'kausal', label: 'kausal (Warum?)' },
          { id: 'modal', label: 'modal (Wie?)' },
        ],
        correctId: 'kausal',
        hint: '„Wegen …“ nennt hier den Grund.',
        success: 'Richtig – kausal: Warum bleibt die Klasse drinnen?',
      },
      {
        kind: 'explain',
        title: 'Kurz erklärt',
        lead: 'Die Funktion im Satz entscheidet.',
        body: [
          'Dieselbe Präposition kann unterschiedliche Rollen andeuten – die Frage klärt es.',
          '„in der Pause“ → Wann? (temporal), „in der Schule“ → Wo? (lokal)',
        ],
      },
      {
        kind: 'merksatz',
        title: 'Merke',
        merke: 'Adverbiale Bestimmungen: temporal (Wann?), lokal (Wo?), kausal (Warum?), modal (Wie?).',
      },
    ],
  },
  {
    id: 9,
    title: 'Ganze Sätze analysieren',
    kicker: 'Modul 9',
    screens: [
      {
        kind: 'example',
        title: 'Schritt für Schritt',
        lead: 'Wir analysieren in einer festen Reihenfolge.',
        sentence: 'Am Montag bringt Lea ihrem Freund ein Geschenk.',
        note: 'Prädikat → Subjekt → Objekte → Adverbiale',
      },
      {
        kind: 'observe',
        title: 'Die Reihenfolge',
        lead: 'So gehst du vor:',
        points: [
          '1. Prädikat finden',
          '2. Subjekt (Wer oder was?)',
          '3. Objekte (Wem? / Wen oder was?)',
          '4. Adverbiale Bestimmungen (Wann? Wo? Warum? Wie?)',
        ],
      },
      {
        kind: 'act-mark',
        title: 'Schritt 1–2',
        lead: 'Markiere zuerst das Prädikat, dann tippe „Weiter“ in Gedanken: hier das Subjekt.',
        sentence: 'Am Montag bringt Lea ihrem Freund ein Geschenk.',
        targets: ['bringt'],
        hint: 'Was geschieht? → „bringt“',
        success: 'Prädikat: bringt. Subjekt wäre als Nächstes: Lea.',
        roleColor: 'predicate',
      },
      {
        kind: 'act-questions',
        title: 'Objekte und Adverbiale',
        lead: 'Vervollständige die Analyse mit Fragen.',
        sentence: 'Am Montag bringt Lea ihrem Freund ein Geschenk.',
        items: [
          { question: 'Wer bringt?', answer: 'Lea' },
          { question: 'Wem?', answer: 'ihrem Freund' },
          { question: 'Wen oder was?', answer: 'ein Geschenk' },
          { question: 'Wann?', answer: 'Am Montag' },
        ],
        hint: 'Nutze die Fragen der Reihe nach.',
        success: 'Vollständige Analyse geschafft.',
      },
      {
        kind: 'merksatz',
        title: 'Merke',
        merke: 'Analyse-Reihenfolge: Prädikat → Subjekt → Objekte → Adverbiale.',
      },
    ],
  },
  {
    id: 10,
    title: 'Kurzer Check',
    kicker: 'Modul 10',
    screens: [
      {
        kind: 'check',
        title: 'Check A–D',
        lead: 'Kein Stress: Du bekommst sanfte Hinweise. Am Ende startet das Training.',
        items: [
          {
            id: 'A',
            prompt: 'Was gehört zusammen und lässt sich gemeinsam verschieben?',
            sentence: 'Der kleine Hund / schläft / unter dem Tisch',
            choices: [
              { id: 'a', label: 'Nur einzelne Wörter sind Satzglieder' },
              { id: 'b', label: 'Wortgruppen, die sich gemeinsam verschieben lassen' },
              { id: 'c', label: 'Nur das Verb' },
            ],
            correctId: 'b',
            softHint: 'Denk an die Verschiebeprobe.',
          },
          {
            id: 'B',
            prompt: 'Was ist das Prädikat in: „Lena räumt ihr Zimmer auf.“?',
            choices: [
              { id: 'a', label: 'räumt' },
              { id: 'b', label: 'räumt … auf' },
              { id: 'c', label: 'ihr Zimmer' },
            ],
            correctId: 'b',
            softHint: 'Partikelverben zählen vollständig.',
          },
          {
            id: 'C',
            prompt: '„ihrem Bruder“ in „Mia schenkt ihrem Bruder ein Buch.“ ist …',
            choices: [
              { id: 'a', label: 'Akkusativobjekt (Wen oder was?)' },
              { id: 'b', label: 'Dativobjekt (Wem?)' },
              { id: 'c', label: 'Subjekt' },
            ],
            correctId: 'b',
            softHint: 'Stelle die Frage Wem?',
          },
          {
            id: 'D',
            prompt: '„Wegen des Regens“ nennt meist den …',
            choices: [
              { id: 'a', label: 'Ort (lokal)' },
              { id: 'b', label: 'Grund (kausal)' },
              { id: 'c', label: 'Akkusativobjekt' },
            ],
            correctId: 'b',
            softHint: 'Warum? → kausal.',
          },
        ],
        outro: 'Du kennst die Grundlagen. Als Nächstes kannst du trainieren.',
      },
      {
        kind: 'merksatz',
        title: 'Bereit?',
        merke: 'Satzglieder findest du mit Fragen und der Verschiebeprobe. Nun: Training starten!',
        extra: 'Im Trainingsbereich gibt es Punkte und Auswertungen nach Kompetenz.',
      },
    ],
  },
]

export const FOUNDATION_TOTAL = FOUNDATION_MODULES.length
