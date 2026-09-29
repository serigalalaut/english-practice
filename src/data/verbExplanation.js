// Builds the explanation shown after answering a verb question: the full
// V1 - V2 - V3 set, whether the verb is regular or irregular, and (for
// regular verbs) which past-tense spelling rule produced V2/V3. Derived
// purely from the forms, so it works for every verb in the bank.

const VOWELS = 'aeiou'

function regularRule(v1, v2) {
  const base = v1.toLowerCase()
  const past = v2.toLowerCase()
  const last = base.slice(-1)

  if (/[^aeiou]y$/.test(base) && past === base.slice(0, -1) + 'ied') {
    return `berakhiran konsonan + "y", jadi "y" diganti "ied" (${base} → ${past}).`
  }
  if (base.endsWith('e') && past === base + 'd') {
    return `sudah berakhiran "e", jadi cukup ditambah "d" (${base} → ${past}).`
  }
  if (base.endsWith('c') && past === base + 'ked') {
    return `berakhiran "c", jadi ditambah "k" sebelum "ed" (${base} → ${past}).`
  }
  if (!VOWELS.includes(last) && past === base + last + 'ed') {
    return `diakhiri pola konsonan-vokal-konsonan, jadi huruf "${last}" digandakan lalu ditambah "ed" (${base} → ${past}).`
  }
  if (past === base + 'ed') {
    return `cukup ditambah "ed" (${base} → ${past}).`
  }
  return null
}

export function explainVerb(verb) {
  const forms = `${verb.v1} – ${verb.v2} – ${verb.v3}`
  const v2Rule = regularRule(verb.v1, verb.v2)

  let summary
  if (v2Rule && verb.v2 === verb.v3) {
    summary = `Regular verb: V2 dan V3 sama, ${v2Rule}`
  } else if (v2Rule) {
    summary = `V2 beraturan (${v2Rule.replace(/\.$/, '')}), tapi V3 "${verb.v3}" tidak beraturan, jadi V3-nya perlu dihafal.`
  } else {
    summary = `Irregular verb: bentuk V2/V3 tidak mengikuti aturan "+ed", jadi perlu dihafal.`
  }

  const parts = [`${forms}. ${summary}`]
  if (verb.meaning) parts.push(`Arti: ${verb.meaning}.`)
  return parts.join(' ')
}
