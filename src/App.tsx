import { STALE_MS } from './api'
import { GiftViews } from './GiftViews'
import { useValues } from './useValues'

const time = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

export default function App() {
  const { data, error, now, retry } = useValues()
  const stale = !!data && (data.stale || now - Date.parse(data.fetchedAt) > STALE_MS || !!error)

  return (
    <main className='wedding theme-olive'>
      <div className='wedding-shell'>
        <header className='topline'>
          <span className='wedding-date'>17 <i>/</i> 09 <i>/</i> 2026</span>
        </header>
        <section className='wedding-panel'>
          <div className='presentation'>
            <div className='hero'>
              <span className='couple'>Елизавета <i>&</i> Алексей</span>
              <h1>Кто будет <em>первым?</em></h1>
              <p className='intro'>Маленькое пожелание — большая любовь.</p>
            </div>
            <GiftViews data={data} />
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
      </div>
    </main>
  )
}
