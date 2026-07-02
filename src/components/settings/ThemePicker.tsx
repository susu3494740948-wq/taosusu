import type { StoreThemeMeta } from '../../data/storeThemes'
import { theme } from '../../lib/themeClasses'
import type { StoreTheme } from '../../store/preferencesStore'

interface ThemePickerProps {
  value: StoreTheme
  themes: StoreThemeMeta[]
  onChange: (theme: StoreTheme) => void
}

export function ThemePicker({ value, themes, onChange }: ThemePickerProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {themes.map((item) => {
        const selected = value === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`rounded-[1.5rem] border p-4 text-left transition ${
              selected
                ? 'border-[var(--accent)] ring-2 ring-[var(--accent)] ring-offset-2 theme-surface'
                : 'theme-border theme-surface hover:-translate-y-0.5'
            }`}
          >
            <div className="flex gap-2">
              {item.swatches.map((color) => (
                <span
                  key={color}
                  className="h-8 flex-1 rounded-xl"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className={`mt-4 text-base font-black ${theme.heading}`}>{item.name}</p>
            <p className={`mt-2 text-sm leading-6 ${theme.muted}`}>{item.description}</p>
            {selected ? (
              <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${theme.accentSoft}`}>
                当前主题
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
