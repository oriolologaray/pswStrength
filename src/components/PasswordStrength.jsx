import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { analyzePassword, suggestImprovements, buildGuidance } from '../utils/estimator'
import { ENABLE_BREACH_CHECK, MIN_RECOMMENDED_LENGTH } from '../config'
import { checkPwnedPassword } from '../utils/breachCheck'
import './PasswordStrength.css'

const SCORE_LABEL_KEYS = ['score_0','score_1','score_2','score_3','score_4']

function Meter({ score }) {
  const pct = ((score + 1) / 5) * 100
  return (
    <div className="meter">
      <div className={`bar score-${score}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function PasswordStrength() {
  const { t, i18n } = useTranslation()
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
  const scoreLabel = t(SCORE_LABEL_KEYS[result.score] || 'score_0')

  return (
    <div className="container analyzer">
      <div className="toolbar">
        <h1>{t('title')}</h1>
      </div>
      <div className="center">
        <div className="input-row">
          <input
            aria-label={t('title')}
            className="pw-input"
            placeholder={t('input_placeholder')}
            type={show ? 'text' : 'password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <button className="secondary" onClick={() => setShow(s => !s)}>
            {show ? t('hide') : t('show')}
          </button>
          <button className="secondary" onClick={() => setPw('')}>
            {t('clear')}
          </button>
        </div>
        <div className="meter-row">
          <Meter score={result.score} />
          <div className={`score-label score-${result.score}`}>{scoreLabel}</div>
          {ENABLE_BREACH_CHECK && (pwned.pwned || pwned.error) && (
            <span className={`chip ${pwned.pwned ? 'danger' : 'muted'}`}>
              {pwned.error ? t('breach_unavailable') : t('breach_found', { count: pwned.count.toLocaleString() })}
            </span>
          )}
        </div>
      </div>

      <div className="tiles">
        <section className="tile">
          <h2 className="section-title">{t('guidance_title')}</h2>
          {!pw ? (
            <p>{t('guidance_type_to_see')}</p>
          ) : isSafe ? (
            <p className="good-msg">{t('guidance_good_enough')}</p>
          ) : (
            <>
              {guidance.issueCodes?.length ? (
                <ul className="compact-list">
                  {guidance.issueCodes.map((x, i) => (
                    <li key={i}>
                      {x.code === 'too_short' ? t('g_too_short', { length: x.length }) :
                       x.code === 'low_variety' ? t('g_low_variety') :
                       x.code === 'breached' ? t('g_breached') : null}
                    </li>
                  ))}
                </ul>
              ) : null}
              {guidance.actionCodes?.length ? (
                <ul className="compact-list">
                  {guidance.actionCodes.map((x, i) => (
                    <li key={i}>
                      {x.code === 'increase_length' ? t('a_increase_length', { min: x.min }) :
                       x.code === 'mix_types' ? t('a_mix_types') :
                       x.code === 'no_reuse_breached' ? t('a_no_reuse_breached') :
                       x.code === 'add_unpredictability' ? t('a_add_unpredictability') : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </section>
        <section className="tile">
          <h2 className="section-title">{t('options_title')}</h2>
          {!pw ? (
            <p>{t('options_will_propose')}</p>
          ) : isSafe ? (
            <p className="good-msg">{t('options_good_no_alternatives')}</p>
          ) : ideas.length === 0 ? (
            <p>{t('options_will_propose')}</p>
          ) : (
            <ul className="ideas full">
              {ideas.map((x, i) => (
                <li key={i}>
                  <code>{x.proposal}</code>
                  <button className="secondary" onClick={() => navigator.clipboard?.writeText(x.proposal)}>{t('copy')}</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="footer">
        <Link className="learn-link" to="/about">{t('learn_more')}</Link>
        <span className="sep">·</span>
        <a href="#" className="learn-link" onClick={(e) => { e.preventDefault(); i18n.changeLanguage('en'); localStorage.setItem('lang','en') }}>EN</a>
        <span className="sep">/</span>
        <a href="#" className="learn-link" onClick={(e) => { e.preventDefault(); i18n.changeLanguage('es'); localStorage.setItem('lang','es') }}>ES</a>
      </div>
    </div>
  )
}
