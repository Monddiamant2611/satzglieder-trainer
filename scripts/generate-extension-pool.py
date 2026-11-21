#!/usr/bin/env python3
"""Generate src/data/extensionPool/pools.json + moveGroups.ts from extension-555-items specs."""

from __future__ import annotations

import json
import re
from pathlib import Path

ITEMS = Path("/cursor/stores/bc-4befbc35-1167-44e6-9ff6-88002b956830/internal/extension-555-items")
OUT_DIR = Path("/workspace/src/data/extensionPool")

ROLE_MAP = {
    "Prädikat": "predicate",
    "Subjekt": "subject",
    "Dativobjekt": "object_dative",
    "Akkusativobjekt": "object_accusative",
    "temporal": "adverbial_temporal",
    "lokal": "adverbial_lokal",
    "kausal": "adverbial_kausal",
    "modal": "adverbial_modal",
}


def parse_numbered(path: Path) -> list[str]:
    lines = []
    for line in path.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^(\d+)\.\s+(.*)$", line.strip())
        if m:
            lines.append(m.group(2))
    return lines


def parse_d(text: str) -> int:
    m = re.search(r"\bd([123])\b", text)
    return int(m.group(1)) if m else 1


def strip_d(text: str) -> str:
    return re.sub(r"\s*\|\s*d[123]\s*$", "", text).strip()


def tokenize(sentence: str) -> list[str]:
    s = sentence.rstrip(".").strip()
    return s.split()


def find_span(tokens: list[str], phrase: str) -> tuple[int, int]:
    words = phrase.split()
    n = len(words)
    for i in range(len(tokens) - n + 1):
        if tokens[i : i + n] == words:
            return i, i + n - 1
    # case-insensitive fallback
    low = [t.lower() for t in tokens]
    lw = [w.lower() for w in words]
    for i in range(len(low) - n + 1):
        if low[i : i + n] == lw:
            return i, i + n - 1
    raise ValueError(f"phrase not found: {phrase!r} in {tokens}")


def predicate_parts_from_label(label: str) -> list[str]:
    label = label.replace("…", "...").strip()
    if "..." in label:
        a, b = label.split("...", 1)
        return [a.strip(), b.strip()]
    return [label]


# --- Boundaries ---
def build_boundaries() -> list[dict]:
    items = []
    for i, raw in enumerate(parse_numbered(ITEMS / "01-boundaries.md"), 1):
        d = parse_d(raw)
        body = strip_d(raw)
        parts = [p.strip() for p in body.split("|")]
        sentence = parts[0].rstrip(".")
        if not sentence.endswith("."):
            sentence += "."
        groups = [g.strip() for g in parts[1].split("/")]
        pred = None
        if len(parts) > 2 and "Prädikat" in parts[2]:
            pred_label = parts[2].split(":", 1)[1].strip()
            pred = predicate_parts_from_label(pred_label)
        item = {
            "id": f"exp2_boundaries_{i:02d}",
            "sentence": sentence,
            "groups": groups,
            "difficulty": d,
        }
        if pred:
            item["predicateParts"] = pred
        items.append(item)
    return items


# --- Move ---
def build_move() -> tuple[list[dict], dict[str, list[str]], dict[str, list[int]]]:
    items = []
    groups_map: dict[str, list[str]] = {}
    verb_map: dict[str, list[int]] = {}
    for i, raw in enumerate(parse_numbered(ITEMS / "02-move.md"), 1):
        d = parse_d(raw)
        body = strip_d(raw)
        parts = [p.strip() for p in body.split("|")]
        sentence = parts[0]
        if not sentence.endswith("."):
            sentence += "."
        move_phrase = parts[1].replace("move:", "").strip()
        result = parts[2]
        if not result.endswith("."):
            result += "."
        iid = f"exp2_move_{i:02d}"
        # Build groups: split sentence into move_phrase + remaining words as constituents
        # Heuristic: use simple tokenization into the moved phrase and other chunks
        # Better: reconstruct from original by finding the move phrase and treating rest as word groups
        # Look at result: first group is move_phrase, then finite verb, then rest
        result_words = result.rstrip(".").split()
        move_words = move_phrase.split()
        # Finite verb is typically the first word after the Vorfeld in V2 result
        # groups for MoveTask: constituent chunks from ORIGINAL sentence order
        groups = groups_for_move(sentence, move_phrase)
        # find verb index: the finite verb group
        verb_idx = find_verb_index(groups)
        items.append(
            {
                "id": iid,
                "sentence": sentence,
                "valid": [result],
                "difficulty": d,
                "target": move_phrase,
            }
        )
        groups_map[iid] = groups
        verb_map[iid] = [verb_idx]
    return items, groups_map, verb_map


def groups_for_move(sentence: str, move_phrase: str) -> list[str]:
    """Split sentence into constituent groups with move_phrase as one group."""
    s = sentence.rstrip(".")
    # Find move phrase in sentence
    idx = s.lower().find(move_phrase.lower())
    if idx < 0:
        raise ValueError(f"move phrase {move_phrase!r} not in {sentence!r}")
    before = s[:idx].strip()
    after = s[idx + len(move_phrase) :].strip()
    chunks: list[str] = []
    if before:
        chunks.extend(split_remaining(before))
    chunks.append(s[idx : idx + len(move_phrase)])
    if after:
        chunks.extend(split_remaining(after))
    return chunks


def split_remaining(text: str) -> list[str]:
    """Split remaining text into rough NP/verb groups using common patterns.

    Strategy: identify finite verb as first verb-like lowercase word that isn't
    a determiner/preposition, then group NPs around articles.
    """
    words = text.split()
    if not words:
        return []
    # Known short function words that start NPs / PPs
    starters = {
        "der",
        "die",
        "das",
        "den",
        "dem",
        "des",
        "ein",
        "eine",
        "einen",
        "einem",
        "einer",
        "eines",
        "mein",
        "meine",
        "meinen",
        "meinem",
        "meiner",
        "dein",
        "seine",
        "seinen",
        "seinem",
        "seiner",
        "ihr",
        "ihre",
        "ihren",
        "ihrem",
        "ihrer",
        "unser",
        "unsere",
        "unseren",
        "unserem",
        "unserer",
        "euer",
        "eure",
        "am",
        "im",
        "vom",
        "zum",
        "zur",
        "beim",
        "ans",
        "ins",
        "auf",
        "an",
        "in",
        "mit",
        "nach",
        "vor",
        "über",
        "unter",
        "neben",
        "zwischen",
        "wegen",
        "trotz",
        "ohne",
        "durch",
        "für",
        "gegen",
        "aus",
        "bei",
        "seit",
        "während",
        "hinter",
        "bis",
        "um",
        "viele",
        "mehrere",
        "einige",
        "beide",
        "drei",
        "zwei",
        "neue",
        "letzte",
        "feste",
        "helle",
        "bunte",
        "alte",
        "lange",
        "kurze",
        "schwere",
        "frische",
        "warme",
        "kalte",
        "große",
        "kleine",
        "schwierige",
        "verlorenen",
        "verlorene",
    }
    # Manual: treat capitalized words / pronouns as possible single NPs or verb
    # Simpler approach used for these 20 items: mark verb as the lowercase
    # content verb (not particle), group contiguous NP material.
    groups: list[str] = []
    i = 0
    while i < len(words):
        w = words[i]
        wl = w.lower()
        # Finite verb candidates: lowercase, not starter, not particle-only
        if (
            w[0].islower()
            and wl
            not in starters
            | {
                "heute",
                "gestern",
                "morgen",
                "oft",
                "häufig",
                "langsam",
                "vorsichtig",
                "regelmäßig",
                "begeistert",
                "heimlich",
                "feierlich",
                "sofort",
                "früh",
                "spät",
                "pünktlich",
                "gemeinsam",
                "laut",
                "ruhig",
                "sehr",
                "fast",
                "immer",
                "nie",
                "schon",
                "noch",
                "auch",
                "nur",
                "bereits",
                "sich",
            }
            and not wl.endswith("lich")
            and wl
            not in {
                "am",
                "im",
                "zum",
                "zur",
                "beim",
            }
        ):
            # likely finite verb (or particle verb finite part)
            groups.append(w)
            i += 1
            continue
        # adverb alone (lowercase manner/time)
        if w[0].islower() and wl in {
            "heute",
            "gestern",
            "morgen",
            "oft",
            "häufig",
            "langsam",
            "vorsichtig",
            "regelmäßig",
            "begeistert",
            "heimlich",
            "feierlich",
            "sofort",
            "früh",
            "spät",
            "pünktlich",
            "gemeinsam",
            "laut",
            "ruhig",
            "sich",
        }:
            groups.append(w)
            i += 1
            continue
        # NP/PP: consume until next verb/adverb boundary
        chunk = [w]
        i += 1
        while i < len(words):
            nw = words[i]
            nl = nw.lower()
            # stop before next finite verb
            if (
                nw[0].islower()
                and nl
                not in starters
                | {
                    "heute",
                    "gestern",
                    "morgen",
                    "oft",
                    "häufig",
                    "langsam",
                    "vorsichtig",
                    "regelmäßig",
                    "begeistert",
                    "heimlich",
                    "feierlich",
                    "sofort",
                    "früh",
                    "spät",
                    "pünktlich",
                    "gemeinsam",
                    "laut",
                    "ruhig",
                    "sich",
                    "sehr",
                    "fast",
                    "immer",
                    "nie",
                    "schon",
                    "noch",
                    "auch",
                    "nur",
                    "bereits",
                }
            ):
                break
            if nw[0].islower() and nl in {
                "heute",
                "gestern",
                "morgen",
                "oft",
                "häufig",
                "langsam",
                "vorsichtig",
                "regelmäßig",
                "begeistert",
                "heimlich",
                "feierlich",
                "sofort",
                "früh",
                "spät",
                "pünktlich",
                "gemeinsam",
                "laut",
                "ruhig",
                "sich",
            }:
                break
            # new NP start with capital after something that completed? keep going for multiword
            chunk.append(nw)
            i += 1
        groups.append(" ".join(chunk))
    return groups


def find_verb_index(groups: list[str]) -> int:
    for i, g in enumerate(groups):
        if " " not in g and g[0].islower() and g.lower() not in {
            "heute",
            "gestern",
            "morgen",
            "oft",
            "häufig",
            "langsam",
            "vorsichtig",
            "regelmäßig",
            "begeistert",
            "heimlich",
            "feierlich",
            "sofort",
            "früh",
            "spät",
            "pünktlich",
            "gemeinsam",
            "laut",
            "ruhig",
            "sich",
            "am",
            "im",
            "zum",
            "zur",
        }:
            return i
    # fallback: second group often verb in V2 original? or first lowercase
    for i, g in enumerate(groups):
        if g[0].islower():
            return i
    return 1 if len(groups) > 1 else 0


# Manual override for move groups — more reliable for 20 items
MOVE_GROUPS_MANUAL: dict[int, list[str]] = {
    1: ["Die Klasse", "besucht", "am Dienstag", "das Stadtmuseum"],
    2: ["Mia", "trägt", "den schweren Karton", "in den Keller"],
    3: ["Der junge Hund", "schläft", "unter dem Schreibtisch"],
    4: ["Der Gärtner", "pflanzt", "im Frühjahr", "neue Rosen"],
    5: ["Die Kinder", "sammeln", "im Wald", "bunte Blätter"],
    6: ["Der Hausmeister", "gibt", "den Schülern", "vor der Pause", "neue Schlüssel"],
    7: ["Im Musikraum", "übt", "Ben", "am Nachmittag", "ein neues Stück"],
    8: ["Der Bus", "fährt", "wegen des Schnees", "heute", "langsam"],
    9: ["Die Mutter", "bringt", "ihrem Sohn", "am Morgen", "das Sportzeug"],
    10: ["Paul", "liest", "mit großer Ruhe", "den langen Artikel"],
    11: ["Unsere Klasse", "hat", "gestern", "einen Ausflug", "gemacht"],
    12: ["Die Lehrerin", "erklärt", "den Kindern", "die neue Regel"],
    13: ["Lena", "hat", "ihrem Bruder", "eine Postkarte", "geschrieben"],
    14: ["Der Zug", "erreicht", "am frühen Abend", "den Bahnhof"],
    15: ["Ben", "packt", "seine Sportsachen", "in die Tasche"],
    16: ["Der Trainer", "gibt", "der Mannschaft", "vor dem Spiel", "letzte Hinweise"],
    17: ["Der Arzt", "hat", "dem Patienten", "gestern", "die Ergebnisse", "erklärt"],
    18: ["Meine Schwester", "trägt", "beim Wandern", "feste Schuhe"],
    19: ["Die Klasse", "liest", "nach der Pause", "den nächsten Abschnitt"],
    20: ["Der Vater", "stellt", "die Einkaufstaschen", "vorsichtig", "auf den Tisch"],
}

MOVE_VERB_MANUAL: dict[int, list[int]] = {
    1: [1],
    2: [1],
    3: [1],
    4: [1],
    5: [1],
    6: [1],
    7: [1],
    8: [1],
    9: [1],
    10: [1],
    11: [1],  # hat … gemacht — finite "hat" locked; "gemacht" is separate group
    12: [1],
    13: [1],
    14: [1],
    15: [1],
    16: [1],
    17: [1],
    18: [1],
    19: [1],
    20: [1],
}


def build_move_manual() -> tuple[list[dict], dict[str, list[str]], dict[str, list[int]]]:
    items = []
    groups_map = {}
    verb_map = {}
    for i, raw in enumerate(parse_numbered(ITEMS / "02-move.md"), 1):
        d = parse_d(raw)
        body = strip_d(raw)
        parts = [p.strip() for p in body.split("|")]
        sentence = parts[0]
        if not sentence.endswith("."):
            sentence += "."
        result = parts[2]
        if not result.endswith("."):
            result += "."
        iid = f"exp2_move_{i:02d}"
        groups = MOVE_GROUPS_MANUAL[i]
        # For Perfekt items, participle is separate non-locked group at end
        items.append(
            {
                "id": iid,
                "sentence": sentence,
                "valid": [result],
                "difficulty": d,
                "target": parts[1].replace("move:", "").strip(),
            }
        )
        groups_map[iid] = groups
        verb_map[iid] = MOVE_VERB_MANUAL[i]
        # sanity: groups join equals sentence words
        joined = " ".join(groups) + "."
        if joined.replace(" ", "") != sentence.replace(" ", ""):
            raise SystemExit(f"move {i} groups mismatch:\n{joined}\n{sentence}")
    return items, groups_map, verb_map


# --- Predicate ---
def build_predicate() -> list[dict]:
    items = []
    for i, raw in enumerate(parse_numbered(ITEMS / "03-predicate.md"), 1):
        d = parse_d(raw)
        body = strip_d(raw)
        parts = [p.strip() for p in body.split("|")]
        sentence = parts[0]
        if not sentence.endswith("."):
            sentence += "."
        parts_list = predicate_parts_from_label(parts[1])
        items.append(
            {
                "id": f"exp2_predicate_{i:02d}",
                "sentence": sentence,
                "parts": parts_list,
                "d": d,
            }
        )
    return items


# --- Subject ---
SUBJECT_PREDICATE_HINTS = {
    # optional overrides; otherwise guess from sentence
}


def guess_predicate(sentence: str, subject: str) -> str | list[str]:
    s = sentence.rstrip(".")
    # remove subject occurrence for scanning
    words = s.split()
    # common multipart
    for a, b in [
        ("hat", "geschrieben"),
        ("hat", "repariert"),
        ("ist", "angekommen"),
        ("wird", "besuchen"),
    ]:
        if a in words and b in words:
            return [a, b]
    # find finite verb: first lowercase content after/before subject
    subj_words = set(subject.split())
    for w in words:
        if w in subj_words:
            continue
        if w[0].islower() and w not in {
            "am",
            "im",
            "zum",
            "zur",
            "beim",
            "heute",
            "gestern",
            "morgen",
            "sehr",
            "fast",
            "immer",
            "uns",
            "ab",
            "ohne",
            "mit",
            "nach",
            "vor",
            "unter",
            "über",
            "auf",
            "in",
            "an",
            "aus",
            "bei",
            "seit",
            "wegen",
            "durch",
            "für",
            "gegen",
            "hinter",
            "neben",
            "zwischen",
            "während",
            "trotz",
            "um",
            "bis",
        }:
            return w
    return words[1] if len(words) > 1 else words[0]


def build_subject() -> list[dict]:
    items = []
    for i, raw in enumerate(parse_numbered(ITEMS / "04-subject.md"), 1):
        d = parse_d(raw)
        body = strip_d(raw)
        parts = [p.strip() for p in body.split("|")]
        sentence = parts[0]
        if not sentence.endswith("."):
            sentence += "."
        subject = parts[1]
        pred = guess_predicate(sentence, subject)
        items.append(
            {
                "id": f"exp2_subject_{i:02d}",
                "sentence": sentence,
                "subject": subject,
                "predicate": pred,
                "difficulty": d,
            }
        )
    return items


def build_object(path: str, prefix: str) -> list[dict]:
    items = []
    for i, raw in enumerate(parse_numbered(ITEMS / path), 1):
        d = parse_d(raw)
        body = strip_d(raw)
        parts = [p.strip() for p in body.split("|")]
        sentence = parts[0]
        if not sentence.endswith("."):
            sentence += "."
        items.append(
            {
                "id": f"{prefix}_{i:02d}",
                "sentence": sentence,
                "obj": parts[1],
                "difficulty": d,
            }
        )
    return items


def build_both_objects() -> list[dict]:
    items = []
    for i, raw in enumerate(parse_numbered(ITEMS / "07-objects.md"), 1):
        # difficulty from ranges in header
        if i <= 8:
            d = 1
        elif i <= 16:
            d = 2
        else:
            d = 3
        parts = [p.strip() for p in raw.split("|")]
        sentence = parts[0]
        if not sentence.endswith("."):
            sentence += "."
        dative = accusative = None
        for p in parts[1:]:
            if p.startswith("DO:"):
                dative = p[3:].strip()
            elif p.startswith("AO:"):
                accusative = p[3:].strip()
        items.append(
            {
                "id": f"exp2_objects_{i:02d}",
                "sentence": sentence,
                "dative": dative,
                "accusative": accusative,
                "difficulty": d,
            }
        )
    return items


def build_adverbial() -> list[dict]:
    items = []
    for i, raw in enumerate(parse_numbered(ITEMS / "08-adverbials.md"), 1):
        if i <= 16:
            d = 1
        elif i <= 32:
            d = 2
        else:
            d = 3
        parts = [p.strip() for p in raw.split("|")]
        sentence = parts[0]
        if not sentence.endswith("."):
            sentence += "."
        items.append(
            {
                "id": f"exp2_adverbials_{i:02d}",
                "sentence": sentence,
                "target": parts[1],
                "role": parts[2],
                "difficulty": d,
            }
        )
    return items


def build_full() -> list[dict]:
    text = (ITEMS / "09-full.md").read_text(encoding="utf-8")
    # numbered blocks: "N. sentence\nanalysis"
    blocks = re.findall(
        r"^(\d+)\.\s+(.+?)\n([^\n]+?)(?=\n\d+\.|\n*$)",
        text,
        flags=re.M | re.S,
    )
    items = []
    for num_s, sentence, analysis in blocks:
        i = int(num_s)
        if i <= 12:
            d = 1
        elif i <= 26:
            d = 2
        else:
            d = 3
        sentence = sentence.strip()
        if not sentence.endswith("."):
            sentence += "."
        tokens = tokenize(sentence)
        constituents = []
        predicate_parts: list[int] = []
        for chunk in analysis.split(";"):
            chunk = chunk.strip()
            if not chunk or "→" not in chunk:
                continue
            phrase, role_raw = [x.strip() for x in chunk.split("→", 1)]
            role_raw = role_raw.strip()
            if "…" in phrase or "..." in phrase:
                # multipart predicate label like "liest … vor" or "hat … weitergegeben"
                parts = predicate_parts_from_label(phrase)
                idxs = []
                for part in parts:
                    start, end = find_span(tokens, part)
                    assert start == end, f"pred part multiword? {part}"
                    idxs.append(start)
                predicate_parts = idxs
                display = f"{parts[0]} … {parts[1]}" if len(parts) == 2 else " … ".join(parts)
                constituents.append(
                    {
                        "text": display,
                        "start": min(idxs),
                        "end": max(idxs),
                        "role": "predicate",
                        "tokenIndexes": idxs,
                    }
                )
            else:
                role = ROLE_MAP.get(role_raw)
                if role is None:
                    raise SystemExit(f"unknown role {role_raw!r} in full {i}")
                start, end = find_span(tokens, phrase)
                c = {
                    "text": " ".join(tokens[start : end + 1]),
                    "start": start,
                    "end": end,
                    "role": role,
                }
                if role == "predicate":
                    predicate_parts = list(range(start, end + 1))
                constituents.append(c)
        # verify all tokens covered
        covered = set()
        for c in constituents:
            if "tokenIndexes" in c:
                covered.update(c["tokenIndexes"])
            else:
                covered.update(range(c["start"], c["end"] + 1))
        if covered != set(range(len(tokens))):
            missing = set(range(len(tokens))) - covered
            raise SystemExit(
                f"full {i} uncovered tokens {missing}: {[tokens[j] for j in sorted(missing)]}"
            )
        items.append(
            {
                "id": f"exp2_full_{i:02d}",
                "sentence": sentence,
                "tokens": tokens,
                "constituents": constituents,
                "predicateParts": predicate_parts,
                "difficulty": d,
                "tags": [],
            }
        )
    return items


ERROR_SENTENCES = {
    1: "Im Garten spielt Ben Fußball.",
    2: "Wegen der Hitze bleibt der Hund.",
    3: "Mit großer Ruhe liest Mia den Text.",
    4: "Nach dem Unterricht besucht Lena ihre Freundin.",
    5: "Der rote Ball fängt Ben.",
    6: "Mia gibt seinem Bruder das Buch.",
    7: "Der Lehrer erklärt den Kindern die Aufgabe.",
    8: "Mia zeigt ihrem Freund die neue Aufgabe.",
    9: "Der Schüler hat den Schlüssel gefunden.",
    10: "Lena räumt ihr Zimmer auf.",
    11: "Unter dem Tisch schläft die Katze.",
    12: "Vor Angst zittert der Junge.",
    13: "Gestern hat Ben das Fahrrad repariert.",
    14: "Mia öffnet vorsichtig die Kiste.",
    15: "Die beiden jungen Hunde spielen im Garten.",
    16: "Das Fahrrad gehört meiner Schwester.",
    17: "Die Mutter kauft ihrer Tochter eine neue Jacke.",
    18: "Die Mutter gibt ihrer Tochter einen Schlüssel.",
    19: "Lena wird morgen ihre Großmutter besuchen.",
    20: "Den schweren Karton trägt Paul in den Keller.",
}


def build_errors() -> list[dict]:
    items = []
    for i, raw in enumerate(parse_numbered(ITEMS / "10-errors.md"), 1):
        if i <= 6:
            d = 1
        elif i <= 14:
            d = 2
        else:
            d = 3
        sentence = ERROR_SENTENCES[i]
        # parse analysis pieces before | Korrektur / | Satz
        main = raw.split("|")[0].strip()
        # also may have Satz: in later parts
        for part in raw.split("|"):
            part = part.strip()
            if part.startswith("Satz:"):
                sentence = part[5:].strip()
                if not sentence.endswith("."):
                    sentence += "."
        analysis = []
        # pieces separated by ;
        for piece in main.split(";"):
            piece = piece.strip()
            if not piece:
                continue
            # text→shown FALSCH? or text→shown
            m = re.match(r"^(.+?)→(.+?)(?:\s+FALSCH)?$", piece)
            if not m:
                raise SystemExit(f"bad error piece {piece!r} in {i}")
            text = m.group(1).strip()
            shown = m.group(2).strip()
            wrong = "FALSCH" in piece
            entry: dict = {"text": text, "shown": shown, "wrong": wrong}
            if wrong:
                # get correction from Korrektur:
                corr_m = re.search(r"Korrektur:\s*(.+)$", raw)
                if corr_m:
                    corr = corr_m.group(1).strip()
                    # formats: X→Y or Prädikat→hat … gefunden
                    if "→" in corr:
                        entry["correct"] = corr.split("→", 1)[1].strip()
            analysis.append(entry)
        # For items that only list the wrong part in the markdown (11+),
        # expand with correct parts from the sentence when only one wrong listed
        # Keep as specified — existing e03–e10 also only list the wrong item
        items.append(
            {
                "id": f"exp2_errors_{i:02d}",
                "sentence": sentence,
                "analysis": analysis,
                "difficulty": d,
            }
        )
    return items


def build_wordclasses() -> list[dict]:
    items = []
    for i, raw in enumerate(parse_numbered(ITEMS / "11-wordclasses.md"), 1):
        parts = [p.strip() for p in raw.split("|")]
        items.append(
            {
                "id": f"exp2_wordclasses_{i:02d}",
                "word": parts[0],
                "example": parts[1],
                "class": parts[2],
            }
        )
    return items


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    boundary = build_boundaries()
    move, move_groups, move_verbs = build_move_manual()
    predicate = build_predicate()
    subject = build_subject()
    accusative = build_object("05-accusative.md", "exp2_accusative")
    dative = build_object("06-dative.md", "exp2_dative")
    both = build_both_objects()
    adverbial = build_adverbial()
    full = build_full()
    errors = build_errors()
    wordclass = build_wordclasses()

    pools = {
        "boundary": boundary,
        "move": move,
        "predicate": predicate,
        "subject": subject,
        "accusative": accusative,
        "dative": dative,
        "both_objects": both,
        "adverbial": adverbial,
        "full_analysis": full,
        "error_analysis": errors,
        "wordclass": wordclass,
    }

    expected = {
        "boundary": 40,
        "move": 20,
        "predicate": 40,
        "subject": 30,
        "accusative": 30,
        "dative": 30,
        "both_objects": 24,
        "adverbial": 48,
        "full_analysis": 40,
        "error_analysis": 20,
        "wordclass": 48,
    }
    for k, n in expected.items():
        got = len(pools[k])
        if got != n:
            raise SystemExit(f"{k}: expected {n}, got {got}")

    total = sum(len(v) for v in pools.values())
    if total != 370:
        raise SystemExit(f"total {total} != 370")

    (OUT_DIR / "pools.json").write_text(
        json.dumps(pools, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    # moveGroups.ts
    lines = [
        "/** Move groups for extension pool (exp2_move_*). */",
        "export const EXT_MOVE_GROUPS: Record<string, string[]> = {",
    ]
    for iid, groups in move_groups.items():
        g = json.dumps(groups, ensure_ascii=False)
        lines.append(f"  {json.dumps(iid)}: {g},")
    lines.append("}")
    lines.append("")
    lines.append("export const EXT_MOVE_VERB_INDEX: Record<string, number[]> = {")
    for iid, idxs in move_verbs.items():
        lines.append(f"  {json.dumps(iid)}: {json.dumps(idxs)},")
    lines.append("}")
    lines.append("")
    (OUT_DIR / "moveGroups.ts").write_text("\n".join(lines) + "\n", encoding="utf-8")

    print("OK", {k: len(v) for k, v in pools.items()}, "total", total)


if __name__ == "__main__":
    main()
