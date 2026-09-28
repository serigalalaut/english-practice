// Rule-based English regular-verb conjugator (base -> past/participle).
// Used to auto-generate V2/V3 forms so adding more regular verbs only
// needs a base word + meaning, not hand-typed spelling for every entry.
//
// Handles the four real English spelling rules:
//  1. consonant + "y" -> "ied"          (study -> studied)
//  2. ends in silent "e" -> "+d"        (like -> liked)
//  3. single-syllable CVC -> double the final consonant + "ed" (stop -> stopped)
//  4. everything else -> "+ed"          (walk -> walked)
//
// Known two-syllable, stress-on-last-syllable exceptions that also double
// (rule 3's simple heuristic can't detect stress reliably) are listed here.
export const DOUBLING_EXCEPTIONS = {
  prefer: 'preferred', occur: 'occurred', admit: 'admitted', commit: 'committed',
  permit: 'permitted', regret: 'regretted', submit: 'submitted', transfer: 'transferred',
  refer: 'referred', deter: 'deterred', incur: 'incurred', infer: 'inferred',
  recur: 'recurred', concur: 'concurred', equip: 'equipped', control: 'controlled',
  patrol: 'patrolled', extol: 'extolled', expel: 'expelled', compel: 'compelled',
  propel: 'propelled', rebel: 'rebelled', excel: 'excelled',
}

export function conjugateRegular(v1) {
  const lower = v1.toLowerCase()
  if (DOUBLING_EXCEPTIONS[lower]) return DOUBLING_EXCEPTIONS[lower]
  if (/[^aeiou]y$/.test(lower)) return lower.slice(0, -1) + 'ied'
  if (lower.endsWith('e')) return lower + 'd'
  const isSingleSyllableCvc = /^[^aeiou]*[aeiou][^aeiouwxy]$/.test(lower)
  if (isSingleSyllableCvc && lower.length <= 6) return lower + lower.slice(-1) + 'ed'
  return lower + 'ed'
}

// Convenience: build a {v1, v2, v3, meaning} entry from just a base verb
// and its meaning - v2/v3 are auto-conjugated (regular verbs: v2 === v3).
export function regularVerbEntry(v1, meaning) {
  const v2 = conjugateRegular(v1)
  return { v1, v2, v3: v2, meaning }
}
