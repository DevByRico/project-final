export const BRAND = import.meta.env.VITE_BRAND_NAME || 'Bästa barbern'

export function setTitle(suffix = 'Boka') {
  document.title = `${BRAND} – ${suffix}`
}
