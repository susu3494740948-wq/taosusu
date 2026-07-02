import type { Phase, Settings } from '../store/pomodoroStore'

export const STORAGE_PREFIX = 'pomodoro_v1_'

export const DEFAULT_SETTINGS: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  soundEnabled: true,
  notificationsEnabled: true,
}

export const PHASE_LABELS: Record<Phase, string> = {
  focus: '专注',
  shortBreak: '短休息',
  longBreak: '长休息',
}

export const PHASE_COLORS: Record<Phase, { ring: string; bg: string; text: string }> = {
  focus: { ring: 'stroke-focus', bg: 'bg-focus-muted', text: 'text-focus' },
  shortBreak: { ring: 'stroke-short', bg: 'bg-short-muted', text: 'text-short' },
  longBreak: { ring: 'stroke-long', bg: 'bg-long-muted', text: 'text-long' },
}

export function getPhaseDurationMs(phase: Phase, settings: Settings): number {
  switch (phase) {
    case 'focus':
      return settings.workMinutes * 60_000
    case 'shortBreak':
      return settings.shortBreakMinutes * 60_000
    case 'longBreak':
      return settings.longBreakMinutes * 60_000
  }
}

export function getNextPhase(
  current: Phase,
  completedFocusCount: number,
  settings: Settings,
): Phase {
  if (current !== 'focus') return 'focus'
  return completedFocusCount > 0 && completedFocusCount % settings.longBreakInterval === 0
    ? 'longBreak'
    : 'shortBreak'
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function weekKeys(): string[] {
  const keys: string[] = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    keys.push(d.toISOString().slice(0, 10))
  }
  return keys
}
