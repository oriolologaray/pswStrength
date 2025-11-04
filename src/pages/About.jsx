import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()
  return (
    <div className="container about">
      <div className="toolbar">
        <h1>{t('about_title')}</h1>
        <Link className="about-link" to="/">{t('back')}</Link>
      </div>
      <p>
        {t('about_p1')}
      </p>
      <ul>
        <li>{t('about_list_1')}</li>
        <li>{t('about_list_2')}</li>
        <li>{t('about_list_3')}</li>
        <li>{t('about_list_4')}</li>
      </ul>
      <p>
        {t('about_p2')}
      </p>
      <p style={{opacity:.85}}>
        Learn more:
        {' '}<a href="https://pages.nist.gov/800-63-3/sp800-63b.html" target="_blank" rel="noreferrer">NIST SP 800‑63B</a>,
        {' '}<a href="https://ieeexplore.ieee.org/document/5161091" target="_blank" rel="noreferrer">Weir et al.</a>,
        {' '}<a href="https://ieeexplore.ieee.org/document/6234436" target="_blank" rel="noreferrer">Bonneau et al.</a>,
        {' '}<a href="https://dropbox.tech/security/zxcvbn-realistic-password-strength-estimation" target="_blank" rel="noreferrer">zxcvbn</a>.
      </p>
    </div>
  )
}
