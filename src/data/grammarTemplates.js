// Template-based grammar question generator.
// Instead of a fixed list, each template combines random subjects/verbs/
// objects/time markers to produce many different question instances,
// giving thousands of practical combinations instead of a fixed set.

const SUBJECTS = [
  { text: 'I', be: 'am', bePast: 'was', doAux: 'do', has: 'have' },
  { text: 'You', be: 'are', bePast: 'were', doAux: 'do', has: 'have' },
  { text: 'We', be: 'are', bePast: 'were', doAux: 'do', has: 'have' },
  { text: 'They', be: 'are', bePast: 'were', doAux: 'do', has: 'have' },
  { text: 'He', be: 'is', bePast: 'was', doAux: 'does', has: 'has' },
  { text: 'She', be: 'is', bePast: 'was', doAux: 'does', has: 'has' },
]

const THIRD_PERSON = new Set(['He', 'She'])

// { base, s (3rd person singular), ed (simple past / participle), ing }
// Only transitive verbs that read naturally with a "thing" object from
// OBJECTS below (subject + verb + object), to avoid ungrammatical
// combinations like "arrived the room" or "talked the report".
const REGULAR_VERBS = [
  { base: 'play', s: 'plays', ed: 'played', ing: 'playing' },
  { base: 'watch', s: 'watches', ed: 'watched', ing: 'watching' },
  { base: 'clean', s: 'cleans', ed: 'cleaned', ing: 'cleaning' },
  { base: 'cook', s: 'cooks', ed: 'cooked', ing: 'cooking' },
  { base: 'study', s: 'studies', ed: 'studied', ing: 'studying' },
  { base: 'visit', s: 'visits', ed: 'visited', ing: 'visiting' },
  { base: 'finish', s: 'finishes', ed: 'finished', ing: 'finishing' },
  { base: 'open', s: 'opens', ed: 'opened', ing: 'opening' },
  { base: 'close', s: 'closes', ed: 'closed', ing: 'closing' },
  { base: 'wash', s: 'washes', ed: 'washed', ing: 'washing' },
  { base: 'explain', s: 'explains', ed: 'explained', ing: 'explaining' },
  { base: 'follow', s: 'follows', ed: 'followed', ing: 'following' },
  { base: 'check', s: 'checks', ed: 'checked', ing: 'checking' },
  { base: 'repair', s: 'repairs', ed: 'repaired', ing: 'repairing' },
  { base: 'paint', s: 'paints', ed: 'painted', ing: 'painting' },
  { base: 'lock', s: 'locks', ed: 'locked', ing: 'locking' },
  { base: 'answer', s: 'answers', ed: 'answered', ing: 'answering' },
  { base: 'return', s: 'returns', ed: 'returned', ing: 'returning' },
  { base: 'prepare', s: 'prepares', ed: 'prepared', ing: 'preparing' },
  { base: 'review', s: 'reviews', ed: 'reviewed', ing: 'reviewing' },
  { base: 'collect', s: 'collects', ed: 'collected', ing: 'collecting' },
  { base: 'copy', s: 'copies', ed: 'copied', ing: 'copying' },
  { base: 'print', s: 'prints', ed: 'printed', ing: 'printing' },
  { base: 'edit', s: 'edits', ed: 'edited', ing: 'editing' },
  { base: 'translate', s: 'translates', ed: 'translated', ing: 'translating' },
  { base: 'save', s: 'saves', ed: 'saved', ing: 'saving' },
  { base: 'arrange', s: 'arranges', ed: 'arranged', ing: 'arranging' },
  { base: 'measure', s: 'measures', ed: 'measured', ing: 'measuring' },
  { base: 'serve', s: 'serves', ed: 'served', ing: 'serving' },
  { base: 'share', s: 'shares', ed: 'shared', ing: 'sharing' },
  { base: 'replace', s: 'replaces', ed: 'replaced', ing: 'replacing' },
  { base: 'remove', s: 'removes', ed: 'removed', ing: 'removing' },
  { base: 'update', s: 'updates', ed: 'updated', ing: 'updating' },
  { base: 'upload', s: 'uploads', ed: 'uploaded', ing: 'uploading' },
  { base: 'download', s: 'downloads', ed: 'downloaded', ing: 'downloading' },
  { base: 'scan', s: 'scans', ed: 'scanned', ing: 'scanning' },
  { base: 'sign', s: 'signs', ed: 'signed', ing: 'signing' },
  { base: 'examine', s: 'examines', ed: 'examined', ing: 'examining' },
  { base: 'revise', s: 'revises', ed: 'revised', ing: 'revising' },
  { base: 'cover', s: 'covers', ed: 'covered', ing: 'covering' },
  { base: 'deliver', s: 'delivers', ed: 'delivered', ing: 'delivering' },
  { base: 'decorate', s: 'decorates', ed: 'decorated', ing: 'decorating' },
  { base: 'rent', s: 'rents', ed: 'rented', ing: 'renting' },
  { base: 'inspect', s: 'inspects', ed: 'inspected', ing: 'inspecting' },
  { base: 'mark', s: 'marks', ed: 'marked', ing: 'marking' },
  { base: 'fix', s: 'fixes', ed: 'fixed', ing: 'fixing' },
  { base: 'design', s: 'designs', ed: 'designed', ing: 'designing' },
  { base: 'damage', s: 'damages', ed: 'damaged', ing: 'damaging' },
  { base: 'protect', s: 'protects', ed: 'protected', ing: 'protecting' },
  { base: 'guard', s: 'guards', ed: 'guarded', ing: 'guarding' },
  { base: 'observe', s: 'observes', ed: 'observed', ing: 'observing' },
  { base: 'monitor', s: 'monitors', ed: 'monitored', ing: 'monitoring' },
  { base: 'record', s: 'records', ed: 'recorded', ing: 'recording' },
  { base: 'perform', s: 'performs', ed: 'performed', ing: 'performing' },
  { base: 'compose', s: 'composes', ed: 'composed', ing: 'composing' },
  { base: 'publish', s: 'publishes', ed: 'published', ing: 'publishing' },
  { base: 'announce', s: 'announces', ed: 'announced', ing: 'announcing' },
  { base: 'present', s: 'presents', ed: 'presented', ing: 'presenting' },
  { base: 'attach', s: 'attaches', ed: 'attached', ing: 'attaching' },
  { base: 'enclose', s: 'encloses', ed: 'enclosed', ing: 'enclosing' },
  { base: 'address', s: 'addresses', ed: 'addressed', ing: 'addressing' },
  { base: 'receive', s: 'receives', ed: 'received', ing: 'receiving' },
  { base: 'accept', s: 'accepts', ed: 'accepted', ing: 'accepting' },
  { base: 'reject', s: 'rejects', ed: 'rejected', ing: 'rejecting' },
  { base: 'approve', s: 'approves', ed: 'approved', ing: 'approving' },
  { base: 'request', s: 'requests', ed: 'requested', ing: 'requesting' },
  { base: 'expect', s: 'expects', ed: 'expected', ing: 'expecting' },
  { base: 'donate', s: 'donates', ed: 'donated', ing: 'donating' },
  { base: 'create', s: 'creates', ed: 'created', ing: 'creating' },
  { base: 'produce', s: 'produces', ed: 'produced', ing: 'producing' },
  { base: 'complete', s: 'completes', ed: 'completed', ing: 'completing' },
  { base: 'draft', s: 'drafts', ed: 'drafted', ing: 'drafting' },
  { base: 'type', s: 'types', ed: 'typed', ing: 'typing' },
  { base: 'photograph', s: 'photographs', ed: 'photographed', ing: 'photographing' },
  { base: 'film', s: 'films', ed: 'filmed', ing: 'filming' },
  { base: 'stream', s: 'streams', ed: 'streamed', ing: 'streaming' },
  { base: 'format', s: 'formats', ed: 'formatted', ing: 'formatting' },
  { base: 'polish', s: 'polishes', ed: 'polished', ing: 'polishing' },
  { base: 'vacuum', s: 'vacuums', ed: 'vacuumed', ing: 'vacuuming' },
  { base: 'tidy', s: 'tidies', ed: 'tidied', ing: 'tidying' },
  { base: 'mop', s: 'mops', ed: 'mopped', ing: 'mopping' },
  { base: 'dust', s: 'dusts', ed: 'dusted', ing: 'dusting' },
  { base: 'water', s: 'waters', ed: 'watered', ing: 'watering' },
  { base: 'trim', s: 'trims', ed: 'trimmed', ing: 'trimming' },
  { base: 'weed', s: 'weeds', ed: 'weeded', ing: 'weeding' },
  { base: 'plant', s: 'plants', ed: 'planted', ing: 'planting' },
  { base: 'furnish', s: 'furnishes', ed: 'furnished', ing: 'furnishing' },
  { base: 'occupy', s: 'occupies', ed: 'occupied', ing: 'occupying' },
  { base: 'reserve', s: 'reserves', ed: 'reserved', ing: 'reserving' },
  { base: 'confirm', s: 'confirms', ed: 'confirmed', ing: 'confirming' },
  { base: 'expand', s: 'expands', ed: 'expanded', ing: 'expanding' },
]

const OBJECTS = [
  'the house', 'a letter', 'the car', 'dinner', 'the report',
  'the room', 'a song', 'the garden', 'the windows', 'breakfast',
  'the project', 'the document', 'the photo', 'the file', 'the package',
  'the invoice', 'the presentation', 'the design', 'the budget', 'the contract',
  'the schedule', 'the ticket', 'the parcel', 'the message', 'the recipe',
  'the essay', 'the exam', 'the form', 'the request', 'the order',
  'the account', 'the certificate', 'the map', 'the poster', 'the invitation',
  'the receipt', 'the manual', 'the survey', 'the album', 'the painting',
  'the machine', 'the engine', 'the bridge', 'the road', 'the fence',
  'the roof', 'the wall', 'the ceiling', 'the floor', 'the pipe',
]

const HABITUAL_TIME = ['every day', 'every morning', 'every week', 'on weekends', 'usually']
const NOW_TIME = ['right now', 'at the moment', 'currently']
const PAST_TIME = ['yesterday', 'last night', 'last week', 'two days ago', 'in 2020']
const SINCE_TIME = ['2015', 'last year', 'Monday', 'this morning', 'childhood']
const FOR_TIME = ['two years', 'a long time', 'five days', 'an hour']

const SHORT_ADJECTIVES = [
  ['tall', 'taller', 'tallest'],
  ['fast', 'faster', 'fastest'],
  ['small', 'smaller', 'smallest'],
  ['big', 'bigger', 'biggest'],
  ['young', 'younger', 'youngest'],
  ['old', 'older', 'oldest'],
  ['strong', 'stronger', 'strongest'],
  ['high', 'higher', 'highest'],
  ['cheap', 'cheaper', 'cheapest'],
]

const LONG_ADJECTIVES = [
  ['beautiful', 'more beautiful', 'most beautiful'],
  ['difficult', 'more difficult', 'most difficult'],
  ['expensive', 'more expensive', 'most expensive'],
  ['interesting', 'more interesting', 'most interesting'],
  ['important', 'more important', 'most important'],
  ['comfortable', 'more comfortable', 'most comfortable'],
  ['careful', 'more careful', 'most careful'],
  ['popular', 'more popular', 'most popular'],
  ['dangerous', 'more dangerous', 'most dangerous'],
]

const COLLOCATIONS = [
  { phrase: 'interested', prep: 'in', objects: ['music', 'sports', 'learning English', 'history', 'cooking'] },
  { phrase: 'good', prep: 'at', objects: ['playing football', 'solving problems', 'cooking', 'singing', 'drawing'] },
  { phrase: 'afraid', prep: 'of', objects: ['the dark', 'spiders', 'failure', 'heights', 'snakes'] },
  { phrase: 'married', prep: 'to', objects: ['a doctor', 'a teacher', 'a police officer', 'a famous singer'] },
  { phrase: 'capable', prep: 'of', objects: ['solving this problem', 'handling pressure', 'leading the team'] },
  { phrase: 'proud', prep: 'of', objects: ['the achievement', 'the result', 'the team', 'the award'] },
  { phrase: 'famous', prep: 'for', objects: ['its beaches', 'good food', 'bad weather', 'tall mountains'] },
  { phrase: 'worried', prep: 'about', objects: ['the exam', 'the future', 'the weather', 'the deadline'] },
]

const MODALS = [
  { modal: 'can', meaning: 'kemampuan', context: ['swim very well', 'speak three languages', 'play the piano', 'solve this puzzle'] },
  { modal: 'must', meaning: 'keharusan', context: ['wear a helmet', 'submit the report by Friday', 'follow the rules', 'pay the bill'] },
  { modal: 'should', meaning: 'saran', context: ['see a doctor', 'apologize to her', 'save more money', 'exercise regularly'] },
  { modal: 'may', meaning: 'izin', context: ['leave early today', 'ask a question', 'borrow your pen', 'use the restroom'] },
]

const VOWEL_SOUND_NOUNS = ['apple', 'orange', 'umbrella', 'hour', 'idea', 'elephant', 'egg']
const CONSONANT_SOUND_NOUNS = ['car', 'book', 'university', 'European country', 'dog', 'one-eyed monster']

const REPORTED_STATEMENTS = [
  { direct: 'I am tired', answer: 'was tired', distractors: ['am tired', 'have been tired', 'will be tired'] },
  { direct: 'I like coffee', answer: 'liked coffee', distractors: ['like coffee', 'have liked coffee', 'will like coffee'] },
  { direct: 'I am watching TV', answer: 'was watching TV', distractors: ['am watching TV', 'watched TV', 'will watch TV'] },
  { direct: 'I have finished the work', answer: 'had finished the work', distractors: ['have finished the work', 'finished the work', 'will finish the work'] },
  { direct: 'I will come tomorrow', answer: 'would come the next day', distractors: ['will come tomorrow', 'came tomorrow', 'come tomorrow'] },
  { direct: 'I can help you', answer: 'could help me', distractors: ['can help me', 'helped me', 'will help me'] },
]

const GERUND_VERBS = ['enjoy', 'avoid', 'finish', 'suggest', 'deny', 'practice', 'consider']
const INFINITIVE_VERBS = ['decide', 'want', 'promise', 'plan', 'manage', 'agree', 'hope']
const NO_S_SUBJECTS = ['I', 'You', 'We', 'They']

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffle(array) {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function presentSimple(subj, verb) {
  return THIRD_PERSON.has(subj.text) ? verb.s : verb.base
}

// Builds a 4-option list containing `correct` plus unique distractors,
// falling back to generic filler forms if candidates run out or collide.
function buildOptions(correct, candidates, fillers = []) {
  const options = [correct]
  for (const c of [...candidates, ...fillers]) {
    if (options.length >= 4) break
    if (!options.includes(c)) options.push(c)
  }
  return options
}

const TEMPLATES = [
  // Simple present (habitual) vs present continuous (now)
  function tPresentTense() {
    const subj = pick(SUBJECTS)
    const verb = pick(REGULAR_VERBS)
    const obj = pick(OBJECTS)
    const isNow = Math.random() < 0.5

    if (isNow) {
      const time = pick(NOW_TIME)
      const correct = `${subj.be} ${verb.ing}`
      const options = buildOptions(correct, [
        presentSimple(subj, verb),
        `${subj.doAux} ${verb.base}`,
        verb.ed,
      ], [`${subj.bePast} ${verb.ing}`, `${subj.has} ${verb.ed}`])
      return {
        q: `${subj.text} ${'___'} ${obj} ${time}.`,
        options,
        answer: correct,
        explanation: `Pola: Present Continuous → subjek + am/is/are + V-ing.\n"${time}" menunjukkan aksi sedang berlangsung saat ini, sehingga dipakai "${correct}".\nContoh lain: Look, ${subj.text.toLowerCase()} ${correct} ${obj} right now.`,
      }
    }

    const time = pick(HABITUAL_TIME)
    const correct = presentSimple(subj, verb)
    const options = buildOptions(correct, [
      `${subj.be} ${verb.ing}`,
      verb.ed,
      THIRD_PERSON.has(subj.text) ? verb.base : verb.s,
    ], [`${subj.doAux} ${verb.ing}`, `will ${verb.base}`])
    return {
      q: `${subj.text} ${'___'} ${obj} ${time}.`,
      options,
      answer: correct,
      explanation: `Pola: Simple Present → subjek + V1(+s/es untuk he/she/it).\n"${time}" menandakan kebiasaan/rutinitas, sehingga dipakai "${correct}", bukan bentuk continuous atau past.\nContoh lain: ${subj.text} ${correct} ${obj} ${pick(HABITUAL_TIME)}.`,
    }
  },

  // Simple past with a clear past time marker
  function tSimplePast() {
    const subj = pick(SUBJECTS)
    const verb = pick(REGULAR_VERBS)
    const obj = pick(OBJECTS)
    const time = pick(PAST_TIME)
    const correct = verb.ed
    const options = buildOptions(correct, [
      presentSimple(subj, verb),
      `${subj.be} ${verb.ing}`,
      verb.base,
    ], [`${subj.has} ${verb.ed}`, `will ${verb.base}`])
    return {
      q: `${subj.text} ${'___'} ${obj} ${time}.`,
      options,
      answer: correct,
      explanation: `Pola: Simple Past → subjek + V2.\n"${time}" adalah penanda waktu yang sudah pasti selesai di masa lalu, sehingga dipakai bentuk past "${correct}", bukan present.\nContoh lain: They ${verb.ed} ${obj} ${pick(PAST_TIME)}.`,
    }
  },

  // Present perfect (since/for) vs simple past (specific time)
  function tPerfectVsPast() {
    const subj = pick(SUBJECTS)
    const verb = pick(REGULAR_VERBS)
    const obj = pick(OBJECTS)
    const usePerfect = Math.random() < 0.5

    if (usePerfect) {
      const useSince = Math.random() < 0.5
      const marker = useSince ? `since ${pick(SINCE_TIME)}` : `for ${pick(FOR_TIME)}`
      const correct = `${subj.has} ${verb.ed}`
      const options = buildOptions(correct, [
        verb.ed,
        presentSimple(subj, verb),
        `${subj.be} ${verb.ing}`,
      ], [`had ${verb.ed}`])
      return {
        q: `${subj.text} ${'___'} ${obj} ${marker}.`,
        options,
        answer: correct,
        explanation: `Pola: Present Perfect → subjek + has/have + V3, dipakai dengan "since + titik waktu" atau "for + durasi".\n"${marker}" adalah ciri khas present perfect (aksi mulai di masa lalu, masih relevan/berlanjut sekarang), sehingga dipakai "${correct}".\nContoh lain: ${subj.text} ${correct} ${obj} ${useSince ? 'since ' + pick(SINCE_TIME) : 'for ' + pick(FOR_TIME)}.`,
      }
    }

    const time = pick(PAST_TIME)
    const correct = verb.ed
    const options = buildOptions(correct, [
      `${subj.has} ${verb.ed}`,
      presentSimple(subj, verb),
      `${subj.be} ${verb.ing}`,
    ], [`had ${verb.ed}`])
    return {
      q: `${subj.text} ${'___'} ${obj} ${time}.`,
      options,
      answer: correct,
      explanation: `Pola: Simple Past → subjek + V2.\n"${time}" adalah penanda waktu SPESIFIK di masa lalu, sehingga wajib memakai simple past "${correct}", bukan present perfect (present perfect TIDAK dipakai bersama penanda waktu spesifik seperti ini).\nContoh lain: I ${correct} ${obj} ${pick(PAST_TIME)}.`,
    }
  },

  // Comparative / superlative
  function tComparative() {
    const useShort = Math.random() < 0.5
    const pool = useShort ? SHORT_ADJECTIVES : LONG_ADJECTIVES
    const [base, comp, sup] = pick(pool)
    const nameA = pick(['Andi', 'Budi', 'Sari', 'Rina', 'Tono'])
    const nameB = pick(['Dewi', 'Joko', 'Maya', 'Rudi', 'Lina'])
    const useComparative = Math.random() < 0.5

    if (useComparative) {
      const options = buildOptions(comp, [base, sup, `${base}est`], [`most ${base}`])
      return {
        q: `${nameA} is ${'___'} than ${nameB}.`,
        options,
        answer: comp,
        explanation: `Pola: Comparative (perbandingan dua hal) + "than" → ${useShort ? 'adjective pendek + "-er"' : '"more" + adjective panjang'}.\nKata "than" adalah sinyal comparative, sehingga dipakai "${comp}", bukan bentuk dasar atau superlative.\nContoh lain: This bag is ${comp} than that one.`,
      }
    }

    const group = pick(['the class', 'the family', 'the team', 'the city', 'the group'])
    const options = buildOptions(sup, [base, comp, `${base}est`], [`most ${base}`])
    return {
      q: `${nameA} is the ${'___'} person in ${group}.`,
      options,
      answer: sup,
      explanation: `Pola: Superlative (paling unggul di antara semua) → the + ${useShort ? 'adjective pendek + "-est"' : '"most" + adjective panjang'}.\nFrasa "the ... in ${group}" adalah sinyal khas superlative, sehingga dipakai "${sup}".\nContoh lain: This is the ${sup} building in the city.`,
      }
  },

  // Fixed preposition collocations, with random subject/object for variety
  function tCollocation() {
    const subj = pick(SUBJECTS)
    const col = pick(COLLOCATIONS)
    const obj = pick(col.objects)
    const be = subj.be
    const wrongPreps = shuffle(['in', 'on', 'at', 'of', 'for', 'to', 'with', 'about'].filter((p) => p !== col.prep))
    const options = buildOptions(col.prep, wrongPreps.slice(0, 3))
    return {
      q: `${subj.text} ${be} ${col.phrase} ${'___'} ${obj}.`,
      options,
      answer: col.prep,
      explanation: `Ini soal kolokasi (pasangan kata tetap): "${col.phrase}" SELALU berpasangan dengan preposisi "${col.prep}", bukan preposisi lain. Pola seperti ini harus dihafal karena tidak selalu bisa diterjemahkan secara harfiah.\nContoh lain: ${pick(SUBJECTS).text} ${be} ${col.phrase} ${col.prep} ${pick(col.objects)}.`,
    }
  },

  // Passive voice, simple present/past
  function tPassive() {
    const verb = pick(REGULAR_VERBS)
    const obj = pick(OBJECTS)
    const doer = pick(['the manager', 'the students', 'my father', 'the teacher', 'the workers'])
    const isPast = Math.random() < 0.5
    const beWord = isPast ? 'was' : 'is'
    const wrongBe = isPast ? 'is' : 'was'
    const correct = `${beWord} ${verb.ed}`
    const options = buildOptions(correct, [
      `${wrongBe} ${verb.ed}`,
      verb.ed,
      `${beWord} ${verb.ing}`,
    ], [`${beWord} being ${verb.ed}`])
    return {
      q: `${obj[0].toUpperCase()}${obj.slice(1)} ${'___'} by ${doer}.`,
      options,
      answer: correct,
      explanation: `Pola: Passive Voice → subjek + ${beWord}/${wrongBe} + V3 (+ by pelaku).\nSubjek kalimat ("${obj}") DIKENAI aksi, bukan pelakunya, jadi memakai bentuk pasif "${correct}". Kata "by ${doer}" menunjukkan pelaku aslinya.\nContoh lain: The song ${beWord === 'is' ? 'is' : 'was'} ${pick(REGULAR_VERBS).ed} by the band.`,
    }
  },

  // Question tags
  function tQuestionTag() {
    const subj = pick(SUBJECTS)
    const verb = pick(REGULAR_VERBS)
    const obj = pick(OBJECTS)
    const isNegative = Math.random() < 0.5
    const mainVerb = isNegative
      ? `${subj.doAux === 'does' ? "doesn't" : "don't"} ${verb.base}`
      : presentSimple(subj, verb)

    const tagAux = subj.doAux
    const correctTag = isNegative ? `${tagAux} ${subj.text.toLowerCase()}` : `${tagAux === 'does' ? "doesn't" : "don't"} ${subj.text.toLowerCase()}`
    const wrongTag1 = isNegative ? `${tagAux === 'does' ? "doesn't" : "don't"} ${subj.text.toLowerCase()}` : `${tagAux} ${subj.text.toLowerCase()}`
    const options = buildOptions(correctTag, [wrongTag1, `is ${subj.text.toLowerCase()}`, `isn't ${subj.text.toLowerCase()}`])
    return {
      q: `${subj.text} ${mainVerb} ${obj}, ${'___'}?`,
      options: [...new Set(options)].slice(0, 4),
      answer: correctTag,
      explanation: `Pola question tag: kalimat utama ${isNegative ? 'NEGATIF' : 'POSITIF'} dipasangkan dengan tag ${isNegative ? 'POSITIF' : 'NEGATIF'}, memakai auxiliary yang sama ("${tagAux}") dengan subjek yang sama ("${subj.text.toLowerCase()}"): "${correctTag}".\nContoh lain: ${subj.text} ${isNegative ? presentSimple(subj, verb) : `${tagAux === 'does' ? "doesn't" : "don't"} ${verb.base}`} ${obj}, ${isNegative ? wrongTag1.replace(subj.text.toLowerCase(), subj.text.toLowerCase()) : correctTag}?`,
    }
  },

  // Modal verbs: ability / obligation / advice / permission
  function tModal() {
    const subj = pick(SUBJECTS)
    const m = pick(MODALS)
    const ctx = pick(m.context)
    const wrongModals = shuffle(['can', 'must', 'should', 'may', 'will'].filter((x) => x !== m.modal)).slice(0, 3)
    const options = buildOptions(m.modal, wrongModals)
    return {
      q: `${subj.text} ${'___'} ${ctx}.`,
      options,
      answer: m.modal,
      explanation: `Modal "${m.modal}" dipakai untuk menyatakan ${m.meaning}, bukan makna modal lain seperti kemampuan/keharusan/saran/izin yang berbeda-beda.\nContoh lain: ${pick(SUBJECTS).text} ${m.modal} ${pick(m.context)}.`,
    }
  },

  // Article a / an, based on the SOUND that follows, not the letter
  function tArticle() {
    const useVowelSound = Math.random() < 0.5
    const noun = useVowelSound ? pick(VOWEL_SOUND_NOUNS) : pick(CONSONANT_SOUND_NOUNS)
    const correct = useVowelSound ? 'an' : 'a'
    const options = buildOptions(correct, [useVowelSound ? 'a' : 'an', 'the', 'some'])
    return {
      q: `I saw ${'___'} ${noun} yesterday.`,
      options,
      answer: correct,
      explanation: `Artikel "an" dipakai bila kata berikutnya diawali BUNYI vokal, dan "a" bila diawali BUNYI konsonan — bukan berdasar huruf pertamanya saja.\n"${noun}" diawali bunyi ${useVowelSound ? 'vokal' : 'konsonan'}, sehingga dipakai "${correct}".\nContoh jebakan umum: "a university" (bunyi "yu", konsonan) dan "an hour" (huruf h tapi bunyi vokal, "h"-nya tidak dibaca).`,
    }
  },

  // Reported speech: direct statement backshifted into indirect speech
  function tReportedSpeech() {
    const s = pick(REPORTED_STATEMENTS)
    const subj = pick(['He', 'She'])
    const options = buildOptions(s.answer, s.distractors)
    return {
      q: `${subj} said, "${s.direct}." → ${subj} said (that) ${subj === 'He' ? 'he' : 'she'} ${'___'}.`,
      options,
      answer: s.answer,
      explanation: `Pola: Reported Speech — tense pada ucapan langsung mundur satu tingkat (backshift) saat dilaporkan sebagai ucapan tidak langsung.\nUcapan asli "${s.direct}" menjadi "...${s.answer}" ketika dilaporkan.\nContoh lain: Direct: "I am hungry." → Reported: She said she was hungry.`,
    }
  },

  // Gerund vs to-infinitive after specific verbs
  function tGerundInfinitive() {
    const subj = pick(NO_S_SUBJECTS)
    const useGerund = Math.random() < 0.5
    const mainVerb = useGerund ? pick(GERUND_VERBS) : pick(INFINITIVE_VERBS)
    const actionVerb = pick(REGULAR_VERBS)
    const obj = pick(OBJECTS)
    const correct = useGerund ? actionVerb.ing : `to ${actionVerb.base}`
    const wrong = useGerund ? `to ${actionVerb.base}` : actionVerb.ing
    const options = buildOptions(correct, [wrong, actionVerb.base, actionVerb.ed])
    return {
      q: `${subj} ${mainVerb} ${'___'} ${obj}.`,
      options,
      answer: correct,
      explanation: `"${mainVerb}" termasuk kelompok kata kerja yang SELALU diikuti ${useGerund ? 'gerund (V-ing)' : 'to-infinitive'}, tidak pernah ${useGerund ? 'to-infinitive' : 'gerund'}. Pola ini harus dihafal per kata kerja.\nContoh lain: ${pick(NO_S_SUBJECTS)} ${mainVerb} ${correct} ${pick(OBJECTS)}.`,
    }
  },
]

// Generates up to `count` unique template-based questions, skipping any
// whose question text is already in `avoid` (recently used, from history).
export function generateTemplateQuestions(count, avoid = new Set()) {
  const results = []
  const seen = new Set()
  let attempts = 0
  const maxAttempts = count * 40

  while (results.length < count && attempts < maxAttempts) {
    attempts += 1
    const template = pick(TEMPLATES)
    const item = template()
    if (!item) continue
    if (seen.has(item.q) || avoid.has(item.q)) continue
    if (new Set(item.options).size < 2) continue

    seen.add(item.q)
    results.push(item)
  }

  return results
}
