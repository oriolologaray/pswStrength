import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="container about">
      <div className="toolbar">
        <h1>How We Estimate Strength</h1>
        <Link className="about-link" to="/">Back</Link>
      </div>
      <p>
        We use the open‑source zxcvbn library to estimate how many guesses an attacker
        might need to crack a password. It looks for patterns attackers try first
        (like common words, names, keyboard sequences, or years) and then estimates
        the size of the remaining search space.
      </p>
      <ul>
        <li>Longer is better. Aim for at least 12–14 characters.</li>
        <li>Unpredictable beats complex rules. Avoid common words, sequences, and dates.</li>
        <li>Each site should get a unique password. Use a password manager.</li>
        <li>Enable multi‑factor authentication for important accounts.</li>
      </ul>
      <p>
        We optionally check if your password appears in known breach corpora using the
        Have I Been Pwned k‑anonymity API. Your password never leaves your device; only
        the first five characters of a SHA‑1 hash are sent to the API to look up matches.
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
