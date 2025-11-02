import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { analyzePassword, suggestImprovements, buildGuidance } from '../utils/estimator'
import { ENABLE_BREACH_CHECK, MIN_RECOMMENDED_LENGTH } from '../config'
import { checkPwnedPassword } from '../utils/breachCheck'
import './PasswordStrength.css'

const SCORE_LABELS = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']

function Meter({ score }) {
  const pct = ((score + 1) / 5) * 100
  return (
    <div className="meter">
      <div className={`bar score-${score}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function PasswordStrength() {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [ideas, setIdeas] = useState([])
  const [pwned, setPwned] = useState({ pwned: false, count: 0 })

  const result = useMemo(() => analyzePassword(pw), [pw])

  // Debounced breach check
  useEffect(() => {
    if (! ENABLE_BREACH_CHECK) return
    let alive = true
    const h = setTimeout(async () => {
      const r = await checkPwnedPassword(pw)
      if (alive) setPwned(r)
    }, 450)
    return () => { alive = false; clearTimeout(h) }
  }, [pw])

  // Debounced improvement generator
  useEffect(() => {
    let alive = true
    const h = setTimeout(() => {
      const s = suggestImprovements(pw, { count: 3 })
      if (alive) setIdeas(s)
    }, 250)
    return () => { alive = false; clearTimeout(h) }
  }, [pw])

  const guidance = useMemo(() => buildGuidance(pw, result, pwned), [pw, result, pwned])
  const isSafe = useMemo(() => (
    (result.score >= 3 && pw.length >= MIN_RECOMMENDED_LENGTH && !pwned.pwned)
  ), [result.score, pw.length, pwned.pwned])

  return (
    <div className="container analyzer">
      <div className="toolbar">
        <h1>Password Strength</h1>
      </div>
      <div className="center">
        <div className="input-row">
          <input
            aria-label="Password"
            className="pw-input"
            placeholder="Type a password to analyze"
            type={show ? 'text' : 'password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <button className="secondary" onClick={() => setShow(s => !s)}>
            {show ? 'Hide' : 'Show'}
          </button>
          <button className="secondary" onClick={() => setPw('')}>
            Clear
          </button>
        </div>
        <div className="meter-row">
          <Meter score={result.score} />
          <div className={`score-label score-${result.score}`}>{SCORE_LABELS[result.score]}</div>
          {ENABLE_BREACH_CHECK && (pwned.pwned || pwned.error) && (
            <span className={`chip ${pwned.pwned ? 'danger' : 'muted'}`}>
              {pwned.error ? 'Breach check unavailable' : `Found in breaches (${pwned.count.toLocaleString()})`}
            </span>
          )}
        </div>
      </div>

      <div className="tiles">
        <section className="tile">
          <h2 className="section-title">Guidance</h2>
          {!pw ? (
            <p>Type a password to see guidance.</p>
          ) : isSafe ? (
            <p className="good-msg">This password looks strong for most uses. Keep it unique and enable MFA.</p>
          ) : (
            <>
              {guidance.issues.length ? (
                <ul className="compact-list">
                  {guidance.issues.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              ) : null}
              {guidance.actions.length ? (
                <ul className="compact-list">
                  {guidance.actions.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              ) : null}
            </>
          )}
        </section>
        <section className="tile">
          <h2 className="section-title">Better Options</h2>
          {!pw ? (
            <p>We'll propose stronger variants here.</p>
          ) : isSafe ? (
            <p className="good-msg">Looks solid — no alternatives suggested.</p>
          ) : ideas.length === 0 ? (
            <p>We'll propose stronger variants here.</p>
          ) : (
            <ul className="ideas full">
              {ideas.map((x, i) => (
                <li key={i}>
                  <code>{x.proposal}</code>
                  <button className="secondary" onClick={() => navigator.clipboard?.writeText(x.proposal)}>Copy</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="footer">
        <Link className="learn-link" to="/about">Learn more about how we score</Link>
      </div>
    </div>
  )
}
