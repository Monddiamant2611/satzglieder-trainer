/** Prepared constituent groups for Verschiebeprobe items (finite verb kept separate). */
export const MOVE_GROUPS: Record<string, string[]> = {
  m01: ['Der Hund', 'schläft', 'am Nachmittag', 'im Körbchen'],
  m02: ['Mia', 'liest', 'nach dem Unterricht', 'ein neues Buch'],
  m03: ['Der junge Fuchs', 'beobachtet', 'im Garten', 'die Hühner'],
  m04: ['Lena', 'trägt', 'wegen des Regens', 'ihre neue Jacke'],
  m05: ['Ben', 'löst', 'mit großer Konzentration', 'die schwierige Aufgabe'],
  m06: ['Am Freitag', 'besucht', 'unsere Klasse', 'das Naturkundemuseum'],
  m07: ['Der Lehrer', 'erklärt', 'den Kindern', 'nach der Pause', 'die neue Regel'],
  m08: ['Im Sommer', 'trägt', 'meine Schwester', 'häufig', 'helle Kleidung'],
  m09: ['Aus Angst', 'versteckt', 'sich', 'die Katze', 'unter dem Bett'],
  m10: ['Mit großer Vorsicht', 'öffnet', 'Paul', 'die alte Holzkiste'],
}

/** Indices of finite verb (and reflexive) that stay in V2 — not freely dragged to front alone. */
export const MOVE_VERB_INDEX: Record<string, number[]> = {
  m01: [1],
  m02: [1],
  m03: [1],
  m04: [1],
  m05: [1],
  m06: [1],
  m07: [1],
  m08: [1],
  m09: [1, 2],
  m10: [1],
}
