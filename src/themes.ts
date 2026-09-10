export const THEMES = [
  { id: 'paper', name: 'Приглашение', number: '01' },
  { id: 'olive', name: 'Олива', number: '02' },
  { id: 'evening', name: 'Вечер', number: '03' },
] as const

export type Theme = typeof THEMES[number]['id']
export const DEFAULT_THEME: Theme = 'paper'
export const THEME_STORAGE_KEY = 'wedding-appearance-v1'

export function isTheme(value: unknown): value is Theme {
  return THEMES.some(theme => theme.id === value)
}

export function initialTheme(): Theme {
  const fromUrl = new URLSearchParams(window.location.search).get('style')
  if (isTheme(fromUrl)) return fromUrl
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (isTheme(saved)) return saved
  } catch { /* Appearance still works without browser storage. */ }
  return DEFAULT_THEME
}
