import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import type { ValuesDTO } from './types'
import type { Theme } from './themes'

export const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 2,
})

type Gift = { name: string; recipient: string; phone: string; href: string; value: number; share: number; side: 'boy' | 'girl' }

function gifts(data: ValuesDTO | null): Gift[] {
  const total = data ? data.a + data.b : 0
  const boyShare = total ? Math.round(data!.a / total * 100) : 0
  return [
    { name: 'Мальчик', recipient: 'Алексей', phone: '+7 (980) 391-01-79', href: 'tel:+79803910179',
      value: data?.a ?? 0, share: boyShare, side: 'boy' },
    { name: 'Девочка', recipient: 'Елизавета', phone: '+7 (900) 947-87-83', href: 'tel:+79009478783',
      value: data?.b ?? 0, share: total ? 100 - boyShare : 0, side: 'girl' },
  ]
}

function Contact({ entry }: { entry: Gift }) {
  return (
    <div className='contact'>
      <span className='contact-name'>{entry.recipient}</span>
      <a href={entry.href}>{entry.phone}</a>
    </div>
  )
}

function GiftDetails({ entry, available }: { entry: Gift; available: boolean }) {
  return (
    <section className={`gift-details ${entry.side}`} aria-label={entry.name}>
      <span className='eyebrow'>За {entry.side === 'boy' ? 'мальчика' : 'девочку'}</span>
      <h2>{entry.name}</h2>
      <div className='gift-amount'>{available ? money.format(entry.value) : '—'}</div>
      <span className='share-caption'>{available ? `${entry.share}% от общей суммы` : 'Ждём первое пожелание'}</span>
      <Contact entry={entry} />
    </section>
  )
}

export function Sprig() {
  return (
    <svg className='sprig' viewBox='0 0 130 90' fill='none' aria-hidden='true'>
      <path d='M15 77C47 66 82 46 111 12M41 65C27 64 21 56 20 48C35 46 43 51 41 65ZM56 56C51 41 54 32 63 27C71 37 68 47 56 56ZM76 41C78 25 88 19 99 21C98 33 88 40 76 41ZM59 55C74 56 83 61 85 72C71 75 61 68 59 55ZM91 27C102 31 113 29 119 21' stroke='currentColor' strokeWidth='1.1' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}

export function GiftViews({ data, theme }: { data: ValuesDTO | null; theme: Theme }) {
  const entries = gifts(data)
  const total = data ? data.a + data.b : 0
  const empty = data && total === 0
  const summary = data ? entries.map(entry => `${entry.name}: ${money.format(entry.value)}, ${entry.share}%`).join('. ') : 'Ожидаем данные из таблицы'

  if (theme === 'olive') {
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
            </section>
          ))}
        </div>
        <div className='olive-total'><span>Вместе подарено</span><strong>{data ? money.format(total) : '—'}</strong></div>
        {empty && <p className='empty-note'>Пока нет подарков. Всё самое прекрасное впереди.</p>}
      </div>
    )
  }

  if (theme === 'evening') {
    return (
      <div className='evening-results'>
        <div className='evening-total'><span className='eyebrow'>С любовью к будущему</span><strong>{data ? money.format(total) : '—'}</strong><span>Общая сумма подарков</span></div>
        <div className='ribbon-chart' role='img' aria-label={summary}>
          {total > 0 ? entries.map(entry => (
            <div className={entry.side} key={entry.side} style={{ flexBasis: `${entry.value / total * 100}%` }} />
          )) : <div className='ribbon-empty' />}
        </div>
        <div className='evening-gifts'>
          {entries.map(entry => (
            <div className={`evening-gift ${entry.side}`} key={entry.side}>
              <div className='evening-gift-heading'><h2>{entry.name}</h2><span>{data ? `${entry.share}%` : '—'}</span></div>
              <div className='gift-amount'>{data ? money.format(entry.value) : '—'}</div>
              <Contact entry={entry} />
            </div>
          ))}
        </div>
        {empty && <p className='empty-note'>Первое пожелание ещё впереди.</p>}
      </div>
    )
  }

  return (
    <div className='paper-results'>
      <GiftDetails entry={entries[0]} available={!!data} />
      <div className='ring-wrap' role='img' aria-label={summary}>
        {total > 0 ? (
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie data={entries} dataKey='value' nameKey='name' innerRadius='76%' outerRadius='91%' startAngle={90} endAngle={-270} isAnimationActive={false} strokeWidth={0} paddingAngle={total && data?.a && data.b ? 2 : 0}>
                <Cell fill='#68693b' />
                <Cell fill='#d8c5a6' />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : <div className='empty-ring' />}
        <div className='ring-center'>
          <span className='little-star' aria-hidden='true'>✳</span>
          <span className='eyebrow'>{data ? 'Вместе подарено' : 'Пожелания для нас'}</span>
          <strong>{data ? money.format(total) : '—'}</strong>
          <span className='ring-message'>{empty ? 'Всё начинается с любви' : 'Спасибо за вашу любовь'}</span>
        </div>
      </div>
      <GiftDetails entry={entries[1]} available={!!data} />
    </div>
  )
}
