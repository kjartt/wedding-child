import { useEffect, useState } from 'react'
import { parseValues, POLL_MS, restoreValues, saveValues } from './api'
import type { ValuesDTO } from './types'

export function useValues() {
  const [data, setData] = useState<ValuesDTO | null>(restoreValues)
  const [error, setError] = useState<string | null>(null)
  const [revision, setRevision] = useState(0)
  const [now, setNow] = useState(Date.now)

  useEffect(() => {
    const clock = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(clock)
  }, [])

  useEffect(() => {
    let stopped = false
    let timer: number | undefined
    let controller: AbortController | undefined
    let failures = 0

    async function poll() {
      controller = new AbortController()
      const timeout = window.setTimeout(() => controller?.abort(), 12_000)
      try {
        const response = await fetch('/api/values', { cache: 'no-store', signal: controller.signal })
        if (!response.ok) throw new Error('Не удалось получить суммы')
        const next = parseValues(await response.json())
        if (stopped) return
        setData(next)
        saveValues(next)
        setError(next.stale ? 'Таблица временно недоступна. Показаны последние сохранённые суммы.' : null)
        failures = next.stale ? failures + 1 : 0
      } catch {
        if (stopped) return
        failures += 1
        setError('Нет свежих данных. Проверьте интернет и настройки таблицы. Повторяем автоматически.')
      } finally {
        window.clearTimeout(timeout)
        if (!stopped) {
          const delay = Math.min(60_000, POLL_MS * 2 ** Math.min(failures, 3))
          timer = window.setTimeout(poll, delay)
        }
      }
    }

    void poll()
    return () => {
      stopped = true
      window.clearTimeout(timer)
      controller?.abort()
    }
  }, [revision])

  return { data, error, now, retry: () => setRevision(value => value + 1) }
}
