import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      title: 'Password Strength',
      input_placeholder: 'Type a password to analyze',
      show: 'Show',
      hide: 'Hide',
      clear: 'Clear',
      copy: 'Copy',
      guidance_title: 'Guidance',
      guidance_type_to_see: 'Type a password to see guidance.',
      guidance_good_enough: 'This password looks strong for most uses. Keep it unique and enable MFA.',
      options_title: 'Better Options',
      options_will_propose: "We'll propose stronger variants here.",
      options_good_no_alternatives: 'Looks solid — no alternatives suggested.',
      breach_unavailable: 'Breach check unavailable',
      breach_found: 'Found in breaches ({{count}})',
      learn_more: 'Learn more about how we score',
      score_0: 'Very Weak',
      score_1: 'Weak',
      score_2: 'Fair',
      score_3: 'Strong',
      score_4: 'Very Strong',
      // Codes from buildGuidance
      g_too_short: 'Too short ({{length}} chars)',
      a_increase_length: 'Increase length to at least {{min}} characters.',
      g_low_variety: 'Low character variety',
      a_mix_types: 'Mix upper/lower, digits, and symbols or use a longer passphrase.',
      g_breached: 'Appears in public breach lists',
      a_no_reuse_breached: 'Do not reuse breached passwords; create a unique replacement.',
      a_add_unpredictability: 'Add unpredictability: avoid common words, sequences, and years.',
      // About
      about_title: 'How We Estimate Strength',
      about_p1: 'We use the open‑source zxcvbn library to estimate how many guesses an attacker might need to crack a password. It looks for patterns attackers try first (like common words, names, keyboard sequences, or years) and then estimates the size of the remaining search space.',
      about_list_1: 'Longer is better. Aim for at least 12–14 characters.',
      about_list_2: 'Unpredictable beats complex rules. Avoid common words, sequences, and dates.',
      about_list_3: 'Each site should get a unique password. Use a password manager.',
      about_list_4: 'Enable multi‑factor authentication for important accounts.',
      about_p2: 'We optionally check if your password appears in known breach corpora using the Have I Been Pwned k‑anonymity API. Your password never leaves your device; only the first five characters of a SHA‑1 hash are sent to the API to look up matches.',
      back: 'Back',
      language: 'Language',
    }
  },
  es: {
    translation: {
      title: 'Fortaleza de la contraseña',
      input_placeholder: 'Escribe una contraseña para analizar',
      show: 'Mostrar',
      hide: 'Ocultar',
      clear: 'Limpiar',
      copy: 'Copiar',
      guidance_title: 'Guía',
      guidance_type_to_see: 'Escribe una contraseña para ver la guía.',
      guidance_good_enough: 'Esta contraseña parece suficientemente fuerte para la mayoría de usos. Mantenla única y activa MFA.',
      options_title: 'Opciones mejores',
      options_will_propose: 'Aquí propondremos variantes más fuertes.',
      options_good_no_alternatives: 'Se ve sólida — no sugerimos alternativas.',
      breach_unavailable: 'Comprobación de brechas no disponible',
      breach_found: 'Aparece en brechas ({{count}})',
      learn_more: 'Más sobre cómo puntuamos',
      score_0: 'Muy débil',
      score_1: 'Débil',
      score_2: 'Aceptable',
      score_3: 'Fuerte',
      score_4: 'Muy fuerte',
      g_too_short: 'Demasiado corta ({{length}} caracteres)',
      a_increase_length: 'Aumenta la longitud a al menos {{min}} caracteres.',
      g_low_variety: 'Poca variedad de caracteres',
      a_mix_types: 'Mezcla mayúsculas/minúsculas, dígitos y símbolos o usa una frase de paso más larga.',
      g_breached: 'Aparece en listas públicas de brechas',
      a_no_reuse_breached: 'No reutilices contraseñas filtradas; crea un reemplazo único.',
      a_add_unpredictability: 'Añade imprevisibilidad: evita palabras comunes, secuencias y años.',
      about_title: 'Cómo estimamos la seguridad',
      about_p1: 'Usamos la librería de código abierto zxcvbn para estimar cuántos intentos podría necesitar un atacante para descifrar una contraseña. Detecta patrones que los atacantes prueban primero (palabras comunes, nombres, secuencias de teclado o años) y calcula el tamaño del espacio de búsqueda restante.',
      about_list_1: 'Más larga es mejor. Apunta a 12–14 caracteres como mínimo.',
      about_list_2: 'La imprevisibilidad es mejor que reglas complejas. Evita palabras comunes, secuencias y fechas.',
      about_list_3: 'Cada sitio debe tener una contraseña única. Usa un gestor de contraseñas.',
      about_list_4: 'Activa la autenticación multifactor en cuentas importantes.',
      about_p2: 'Opcionalmente comprobamos si tu contraseña aparece en brechas conocidas usando la API de anonimato de Have I Been Pwned. Tu contraseña nunca sale de tu dispositivo; solo se envían los cinco primeros caracteres del hash SHA‑1 para buscar coincidencias.',
      back: 'Volver',
      language: 'Idioma',
    }
  }
}

const saved = typeof window !== 'undefined' ? window.localStorage.getItem('lang') : null

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: saved || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
