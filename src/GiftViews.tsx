import type { ValuesDTO } from './types'

const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 2,
})

type Gift = { name: string; recipient: string; phone: string; value: number; share: number; side: 'boy' | 'girl' }

function gifts(data: ValuesDTO | null): Gift[] {
  const total = data ? data.a + data.b : 0
  const boyShare = total ? Math.round(data!.a / total * 100) : 0
  return [
    { name: 'Мальчик', recipient: 'Алексея', phone: '+7 (980) 391-01-79',
      value: data?.a ?? 0, share: boyShare, side: 'boy' },
    { name: 'Девочка', recipient: 'Елизаветы', phone: '+7 (900) 947-87-83',
      value: data?.b ?? 0, share: total ? 100 - boyShare : 0, side: 'girl' },
  ]
}

function Contact({ entry }: { entry: Gift }) {
  return (
    <div className='contact'>
      <span className='contact-name'>Перевод для {entry.recipient}</span>
      <span className='phone-number'>{entry.phone}</span>
    </div>
  )
}

export function GiftViews({ data }: { data: ValuesDTO | null }) {
  const entries = gifts(data)
  const total = data ? data.a + data.b : 0
  const empty = data && total === 0

  return (
    <div className='olive-results'>
      <div className='arch-cards'>
        {entries.map(entry => (
          <section className={`arch-card ${entry.side}`} key={entry.side} aria-label={entry.name}>
            <span className='little-star' aria-hidden='true'>✳</span>
            <span className='eyebrow'>Наше маленькое будущее</span>
            <h2>{entry.name}</h2>
            <div className='arch-share'>{data ? entry.share : '—'}<span>{data ? '%' : ''}</span></div>
            <div className='share-track' role='img' aria-label={`${entry.name}: ${data ? entry.share + '%' : 'ожидаем данные'}`}>
              <div style={{ width: `${entry.share}%` }} />
            </div>
            <div className='gift-amount'>{data ? money.format(entry.value) : '—'}</div>
            <Contact entry={entry} />
            <span style={{fontSize: '32px'}} className='contact-name'>ВТБ</span>
          </section>
        ))}
      </div>
      <div className='olive-total'><span>Вместе подарено</span><strong>{data ? money.format(total) : '—'}</strong></div>
      {empty && <p className='empty-note'>Пока нет подарков. Всё самое прекрасное впереди.</p>}
    </div>
  )
}
