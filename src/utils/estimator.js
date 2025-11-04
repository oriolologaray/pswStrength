// Swap hardcoded estimation with zxcvbn package outputs.
import zxcvbn from 'zxcvbn'
import { DEFAULT_SUGGESTIONS, MIN_RECOMMENDED_LENGTH, MIN_SUGGESTION_LENGTH } from '../config'

function countCharSets(pw) {
  const lower = /[a-z]/.test(pw)
  const upper = /[A-Z]/.test(pw)
  const digits = /[0-9]/.test(pw)
  const symbols = /[^A-Za-z0-9]/.test(pw)
  return { lower, upper, digits, symbols }
}

export function analyzePassword(pw) {
  const analysis = zxcvbn(pw || '')
  const sets = countCharSets(pw)
  const time = analysis.crack_times_display || {}
  const timeToCrack = {
    online_slow: time.online_throttling_100_per_hour || '<1s',
    online_fast: time.online_no_throttling_10_per_second || '<1s',
    offline_slow: time.offline_slow_hashing_1e4_per_second || '<1s',
    offline_fast: time.offline_fast_hashing_1e10_per_second || '<1s',
  }

  const feedback = []
  if (analysis.feedback?.warning) feedback.push(analysis.feedback.warning)
  if (Array.isArray(analysis.feedback?.suggestions)) feedback.push(...analysis.feedback.suggestions)

  const suggestions = [...DEFAULT_SUGGESTIONS]

  return {
    length: pw.length,
    sets,
    guesses: analysis.guesses || 1,
    log10: analysis.guesses_log10 || 0,
    score: analysis.score || 0,
    timeToCrack,
    feedback,
    suggestions,
  }
}

// Lightweight diceware-style generator with a tiny internal list to avoid hardcoding
// long dictionaries; consider switching to an external wordlist package if desired.
const MINI_WORDLIST = ['able','also','area','away','baby','back','band','base','blue','boat','body','book','calm','card','care','city','code','cool','corn','data','date','deep','door','duty','east','easy','edge','edit','even','exit','face','fair','fall','farm','fast','feed','feel','film','find','fire','fish','five','flag','flat','flow','food','form','free','from','gain','game','gate','gear','gift','girl','goal','good','gray','grow','hair','hand','hard','have','head','hear','heat','help','hero','high','hill','hold','home','hope','hour','huge','idea','into','iron','join','joke','jump','keep','keys','kick','kind','king','lake','land','last','late','lead','leaf','leak','lean','left','less','life','lift','like','line','link','list','live','load','lock','logo','long','look','loop','lose','lost','love','luck','make','male','mark','mask','mass','meal','mean','meat','meet','menu','mice','mile','milk','mind','mine','mint','miss','mode','moon','more','most','move','much','name','near','neck','need','news','next','nine','none','noon','note','okay','once','only','open','over','pack','page','pair','palm','part','pass','path','peak','pick','pile','pink','pipe','plan','play','plug','plus','poem','pole','pool','poor','port','post','pull','pure','push','quiz','rail','rain','rank','rare','rate','read','real','rest','rice','rich','ride','ring','ripe','rise','road','rock','role','roll','roof','room','root','rope','rose','rule','rush','safe','sail','salt','same','sand','save','scan','seal','seat','seed','seek','seen','sell','send','ship','shoe','shop','show','side','sign','silk','sing','size','skin','slim','slip','slow','snow','soft','soil','solo','some','soon','soul','spin','star','stay','step','stop','stud','suit','sure','swim','tail','take','talk','tall','tape','task','team','tech','tell','tend','tens','term','test','text','than','that','them','then','they','thin','this','thus','tide','tile','time','tiny','tire','tool','tree','trip','true','tune','turn','twin','unit','urge','used','user','wait','wake','walk','wall','warm','warn','wash','wave','weak','wear','week','well','west','what','when','wide','wife','wild','will','wind','wine','wing','wipe','wise','wish','with','wolf','wood','wool','word','work','worm','yard','yarn','year','your','zero','zone']

export function generatePassphrase({ words = 4, separator = '-' } = {}) {
  const cryptoObj = (typeof window !== 'undefined' && window.crypto) || null
  const pick = (n) => {
    if (cryptoObj?.getRandomValues) {
      const arr = new Uint32Array(1)
      cryptoObj.getRandomValues(arr)
      return arr[0] % n
    }
    return Math.floor(Math.random() * n)
  }
  const list = []
  for (let i = 0; i < words; i++) list.push(MINI_WORDLIST[pick(MINI_WORDLIST.length)])
  const num = pick(100)
  return `${list.join(separator)}${separator}${num}`
}

// Generate slightly modified variants of the user's password that are stronger.
// Uses crypto-safe randomness and validates improvement with zxcvbn score/guesses.
export function suggestImprovements(pw, { count = 3 } = {}) {
  const variants = new Set()
  const res = []
  const rng = (n) => {
    const cryptoObj = (typeof window !== 'undefined' && window.crypto) || null
    if (cryptoObj?.getRandomValues) {
      const arr = new Uint32Array(1)
      cryptoObj.getRandomValues(arr)
      return arr[0] % n
    }
    return Math.floor(Math.random() * n)
  }

  const alphaSafe = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  const digits = '2345679'
  const symbols = '!@#$%^&*+-_.'

  const baseScore = zxcvbn(pw || '').score || 0
  const baseGuesses = zxcvbn(pw || '').guesses || 1

  function appendWordAndDigits(s) {
    const w = MINI_WORDLIST[rng(MINI_WORDLIST.length)]
    const d1 = digits[rng(digits.length)]
    const d2 = digits[rng(digits.length)]
    const sep = symbols[rng(symbols.length)]
    return `${s}${sep}${w}${d1}${d2}`
  }

  function insertSymbol(s) {
    if (!s) return s
    const pos = rng(s.length + 1)
    const sym = symbols[rng(symbols.length)]
    return s.slice(0, pos) + sym + s.slice(pos)
  }

  function padTo14(s) {
    const target = Math.max(14, s.length + 2)
    let out = s
    while (out.length < target) {
      const bucket = rng(3)
      if (bucket === 0) out += alphaSafe[rng(alphaSafe.length)]
      else if (bucket === 1) out += digits[rng(digits.length)]
      else out += symbols[rng(symbols.length)]
    }
    return out
  }

  const ops = [appendWordAndDigits, insertSymbol, padTo14]

  let guard = 0
  while (res.length < count && guard < 50) {
    guard++
    const op = ops[rng(ops.length)]
    let candidate = op(pw)
    if (!candidate) continue
    if (candidate.length < MIN_SUGGESTION_LENGTH) {
      // ensure minimum length by padding safely
      while (candidate.length < MIN_SUGGESTION_LENGTH) {
        const bucket = rng(3)
        if (bucket === 0) candidate += alphaSafe[rng(alphaSafe.length)]
        else if (bucket === 1) candidate += digits[rng(digits.length)]
        else candidate += symbols[rng(symbols.length)]
      }
    }
    if (!candidate || variants.has(candidate)) continue
    const evald = zxcvbn(candidate)
    if (evald.score > baseScore || (evald.score === baseScore && evald.guesses > baseGuesses * 10)) {
      variants.add(candidate)
      res.push({ proposal: candidate, score: evald.score, guesses: evald.guesses })
    }
  }
  return res
}

export function buildGuidance(pw, result, pwned) {
  const issues = []
  const actions = []
  const issueCodes = []
  const actionCodes = []
  const extras = []

  if (!pw) return { issues, actions, issueCodes, actionCodes, extras }

  if (pw.length < MIN_RECOMMENDED_LENGTH) {
    issues.push(`Too short (${pw.length} chars)`)
    issueCodes.push({ code: 'too_short', length: pw.length })
    actions.push(`Increase length to at least ${MIN_RECOMMENDED_LENGTH} characters.`)
    actionCodes.push({ code: 'increase_length', min: MIN_RECOMMENDED_LENGTH })
  }

  const setCount = [result.sets.lower, result.sets.upper, result.sets.digits, result.sets.symbols].filter(Boolean).length
  if (setCount < 2 && pw.length < 20) {
    issues.push('Low character variety')
    issueCodes.push({ code: 'low_variety' })
    actions.push('Mix upper/lower, digits, and symbols or use a longer passphrase.')
    actionCodes.push({ code: 'mix_types' })
  }

  if (result.feedback && result.feedback.length) {
    for (const msg of result.feedback) {
      if (msg && !extras.includes(msg)) extras.push(msg)
    }
  }

  if (pwned?.pwned) {
    issues.push('Appears in public breach lists')
    issueCodes.push({ code: 'breached' })
    actions.push('Do not reuse breached passwords; create a unique replacement.')
    actionCodes.push({ code: 'no_reuse_breached' })
  }

  if (result.score <= 1) {
    actions.push('Add unpredictability: avoid common words, sequences, and years.')
    actionCodes.push({ code: 'add_unpredictability' })
  }

  // De-duplicate and cap to keep UI concise
  const dedup = (arr) => Array.from(new Set(arr)).slice(0, 3)
  return {
    issues: dedup(issues),
    actions: dedup(actions),
    issueCodes: dedup(issueCodes),
    actionCodes: dedup(actionCodes),
    extras: dedup(extras),
  }
}
