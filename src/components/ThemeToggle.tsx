import type { ThemeMode } from '../store/preferencesStore'

interface ThemeToggleProps {
  theme: ThemeMode
  onChange: (theme: ThemeMode) => void
}

const OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: '系统' },
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
]

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <div
      className="flex rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 dark:border-neutral-700 dark:bg-neutral-800"
      role="group"
      aria-label="主题切换"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
            theme === opt.value
              ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100'
              : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
          }`}
          aria-pressed={theme === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
