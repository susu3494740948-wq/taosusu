import { useEffect } from 'react'
import { applyTheme } from './useThemeEffect'
import { usePreferencesStore } from '../store/preferencesStore'

export function usePreferencesEffect() {
  const theme = usePreferencesStore((state) => state.theme)
  const storeTheme = usePreferencesStore((state) => state.storeTheme)
  const fontSize = usePreferencesStore((state) => state.fontSize)
  const reducedMotion = usePreferencesStore((state) => state.reducedMotion)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.storeTheme = storeTheme
    root.dataset.fontSize = fontSize
    root.classList.toggle('reduce-motion', reducedMotion)
  }, [storeTheme, fontSize, reducedMotion])
}
