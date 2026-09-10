import { useRef } from 'react'
import { THEMES, type Theme } from './themes'

export function ThemeTabs({ selected, onSelect }: { selected: Theme; onSelect: (theme: Theme) => void }) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  return (
    <nav className='appearance' aria-label='Оформление страницы'>
      <span className='appearance-label'>Выберите настроение</span>
      <div className='theme-tabs' role='tablist' aria-label='Варианты оформления'>
        {THEMES.map((theme, index) => (
          <button
            key={theme.id}
            ref={element => { buttons.current[index] = element }}
            className='theme-tab'
            id={`tab-${theme.id}`}
            role='tab'
            type='button'
            aria-selected={selected === theme.id}
            aria-controls='wedding-panel'
            tabIndex={selected === theme.id ? 0 : -1}
            onClick={() => onSelect(theme.id)}
            onKeyDown={event => {
              const next = event.key === 'ArrowRight' ? (index + 1) % THEMES.length
                : event.key === 'ArrowLeft' ? (index + THEMES.length - 1) % THEMES.length
                : event.key === 'Home' ? 0 : event.key === 'End' ? THEMES.length - 1 : null
              if (next === null) return
              event.preventDefault()
              onSelect(THEMES[next].id)
              buttons.current[next]?.focus()
            }}
          >
            <span className='tab-number' aria-hidden='true'>{theme.number}</span>
            {theme.name}
          </button>
        ))}
      </div>
    </nav>
  )
}
