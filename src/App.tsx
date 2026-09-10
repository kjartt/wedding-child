import { useState } from 'react'
import { STALE_MS } from './api'
import { GiftViews, Sprig } from './GiftViews'
import { ThemeTabs } from './ThemeTabs'
import { initialTheme, THEME_STORAGE_KEY, type Theme } from './themes'
import { useValues } from './useValues'

const time = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

export default function App() {
  const { data, error, now, retry } = useValues()
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const stale = !!data && (data.stale || now - Date.parse(data.fetchedAt) > STALE_MS || !!error)

  function selectTheme(next: Theme) {
    setTheme(next)
    try { localStorage.setItem(THEME_STORAGE_KEY, next) } catch { /* Selection works without storage. */ }
    const url = new URL(window.location.href)
    url.searchParams.set('style', next)
    window.history.replaceState(null, '', url)
  }

  return (
    <main className={`wedding theme-${theme}`}>
      <div className='wedding-shell'>
        <header className='topline'>
          <span className='wedding-date'>17 <i>/</i> 09 <i>/</i> 2026</span>
          <ThemeTabs selected={theme} onSelect={selectTheme} />
        </header>
        <section className='wedding-panel' id='wedding-panel' role='tabpanel' aria-labelledby={`tab-${theme}`}>
          <div className='presentation'>
            <div className='hero'>
              <span className='couple'>Елизавета <i>&</i> Алексей</span>
              <Sprig />
              <h1>Кто будет <em>первым?</em></h1>
              <p className='intro'>Маленькое пожелание —<br className='evening-break' /> большая любовь.</p>
            </div>
            <GiftViews data={data} theme={theme} />
          </div>
          <footer className='wedding-footer'>
            <span className='footer-wish'>Самое главное — чтобы в любви.</span>
            <span className={`data-status ${stale || error ? 'is-stale' : ''}`}>
              <span className='status-dot' aria-hidden='true' />
              {data ? `${stale ? 'Последние данные' : 'Обновлено'} в ${time.format(new Date(data.fetchedAt))}` : error ? 'Ждём данные' : 'Получаем суммы…'}
            </span>
          </footer>
          {(error || stale) && (
            <div className='error' role='status'>
              <span>{error || 'Показаны последние сохранённые суммы. Обновляем данные…'}</span>
              <button type='button' onClick={retry}>Повторить сейчас</button>
            </div>
          )}
        </section>
        <span className='selection-note'>Три настроения одного прекрасного дня</span>
      </div>
    </main>
  )
}
