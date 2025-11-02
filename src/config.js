// Centralized tunables and flags. Adjust via Vite envs when needed.
// Example: VITE_ENABLE_BREACH_CHECK=false npm run dev

export const ENABLE_BREACH_CHECK = (import.meta.env?.VITE_ENABLE_BREACH_CHECK ?? 'true') !== 'false'

export const DEFAULT_SUGGESTIONS = [
  'Use a password manager to generate and store unique passwords.',
  'Prefer multi-word passphrases for memorability and strength.',
  'Enable multi-factor authentication wherever possible.',
]

export const MIN_RECOMMENDED_LENGTH = Number(import.meta.env?.VITE_MIN_RECOMMENDED_LENGTH ?? 12)
export const MIN_SUGGESTION_LENGTH = Number(import.meta.env?.VITE_MIN_SUGGESTION_LENGTH ?? 12)
