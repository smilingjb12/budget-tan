const KANJI_NUMERALS = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
];

/** Japanese month name for a 1-indexed month, e.g. 9 → 九月. */
export function kanjiMonth(month: number): string {
  return `${KANJI_NUMERALS[month - 1] ?? ""}月`;
}
