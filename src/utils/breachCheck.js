// Client-side k-anonymity breach check using Have I Been Pwned Passwords API
// Does not send the password; only first 5 hex chars of SHA-1 are sent.

async function sha1Hex(input) {
  const enc = new TextEncoder()
  const data = enc.encode(input)
  const hash = await crypto.subtle.digest('SHA-1', data)
  const bytes = new Uint8Array(hash)
  let out = ''
  for (let b of bytes) out += b.toString(16).padStart(2, '0')
  return out.toUpperCase()
}

export async function checkPwnedPassword(password) {
  if (!password) return { pwned: false, count: 0 }
  try {
    const digest = await sha1Hex(password)
    const prefix = digest.slice(0, 5)
    const suffix = digest.slice(5)
    const resp = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
    if (!resp.ok) throw new Error('Failed response')
    const text = await resp.text()
    const lines = text.split('\n')
    for (const line of lines) {
      const [hash, countStr] = line.trim().split(':')
      if (hash === suffix) {
        const count = parseInt(countStr, 10) || 0
        return { pwned: count > 0, count }
      }
    }
    return { pwned: false, count: 0 }
  } catch {
    return { pwned: false, count: 0, error: true }
  }
}

