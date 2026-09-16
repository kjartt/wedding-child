import type { ValuesDTO } from './types'

export const POLL_MS = 5_000
export const STALE_MS = 45_000
const STORAGE_KEY = 'wedding-values-v2'
const MAX_STORED_AGE_MS = 24 * 60 * 60 * 1000

export function parseValues(value: unknown): ValuesDTO {
  if (!value || typeof value !== 'object') throw new Error('Некорректный ответ сервера')
  const data = value as Record<string, unknown>
  const amount = (n: unknown): n is number =>
    typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= Number.MAX_SAFE_INTEGER / 100
  const timestamp = (s: unknown): s is string => typeof s === 'string' && Number.isFinite(Date.parse(s))
  if (!amount(data.a) || !amount(data.b) || !timestamp(data.updatedAt) ||
    !timestamp(data.fetchedAt) || typeof data.stale !== 'boolean' ||
    data.hash !== `${data.a}|${data.b}`) throw new Error('Некорректный ответ сервера')
  return {
    a: data.a, b: data.b, updatedAt: data.updatedAt, fetchedAt: data.fetchedAt,
    hash: data.hash as string, stale: data.stale,
  }
}

export function restoreValues(): ValuesDTO | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const data = parseValues(JSON.parse(saved))
    const age = Date.now() - Date.parse(data.fetchedAt)
    return age >= 0 && age < MAX_STORED_AGE_MS ? { ...data, stale: true } : null
  } catch { return null }
}

export function saveValues(data: ValuesDTO) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* Storage is optional. */ }
}
