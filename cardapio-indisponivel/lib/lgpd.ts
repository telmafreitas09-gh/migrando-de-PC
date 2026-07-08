export const LGPD_CONSENT_KEY = 'cantinho-lgpd-consent'

export function saveLgpdConsent() {
  if (typeof window === 'undefined') return
  localStorage.setItem(LGPD_CONSENT_KEY, new Date().toISOString())
}

export function hasLgpdConsent() {
  if (typeof window === 'undefined') return false
  return Boolean(localStorage.getItem(LGPD_CONSENT_KEY))
}
