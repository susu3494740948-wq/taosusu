import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DEFAULT_SETTINGS, STORAGE_PREFIX, todayKey } from '../lib/constants'

export type Phase = 'focus' | 'shortBreak' | 'longBreak'
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'
export type ThemeMode = 'light' | 'dark' | 'system'

export interface Settings {
  workMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  longBreakInterval: number
  soundEnabled: boolean
  notificationsEnabled: boolean
}

export interface Task {
  id: string
  title: string
  pomodoroCount: number
  completed: boolean
}

interface PomodoroState {
  settings: Settings
  tasks: Task[]
  activeTaskId: string | null
  dailyStats: Record<string, number>
  completedFocusCount: number
  theme: ThemeMode

  updateSettings: (partial: Partial<Settings>) => void
  setTheme: (theme: ThemeMode) => void
  addTask: (title: string) => void
  removeTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  setActiveTask: (id: string | null) => void
  recordPomodoroComplete: () => void
  resetSessionCount: () => void
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      tasks: [],
      activeTaskId: null,
      dailyStats: {},
      completedFocusCount: 0,
      theme: 'system',

      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      setTheme: (theme) => set({ theme }),

      addTask: (title) => {
        const trimmed = title.trim()
        if (!trimmed) return
        const task: Task = {
          id: crypto.randomUUID(),
          title: trimmed,
          pomodoroCount: 0,
          completed: false,
        }
        set((s) => ({
          tasks: [...s.tasks, task],
          activeTaskId: s.activeTaskId ?? task.id,
        }))
      },

      removeTask: (id) =>
        set((s) => {
          const tasks = s.tasks.filter((t) => t.id !== id)
          const activeTaskId =
            s.activeTaskId === id ? (tasks.find((t) => !t.completed)?.id ?? null) : s.activeTaskId
          return { tasks, activeTaskId }
        }),

      toggleTaskComplete: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t,
          ),
        })),

      setActiveTask: (id) => set({ activeTaskId: id }),

      recordPomodoroComplete: () => {
        const key = todayKey()
        set((s) => {
          const activeId = s.activeTaskId
          const tasks = activeId
            ? s.tasks.map((t) =>
                t.id === activeId ? { ...t, pomodoroCount: t.pomodoroCount + 1 } : t,
              )
            : s.tasks
          return {
            tasks,
            completedFocusCount: s.completedFocusCount + 1,
            dailyStats: {
              ...s.dailyStats,
              [key]: (s.dailyStats[key] ?? 0) + 1,
            },
          }
        })
      },

      resetSessionCount: () => set({ completedFocusCount: 0 }),
    }),
    {
      name: `${STORAGE_PREFIX}store`,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        settings: s.settings,
        tasks: s.tasks,
        activeTaskId: s.activeTaskId,
        dailyStats: s.dailyStats,
        theme: s.theme,
      }),
    },
  ),
)

export function selectTodayCount(state: PomodoroState): number {
  return state.dailyStats[todayKey()] ?? 0
}

export function selectActiveTask(state: PomodoroState): Task | null {
  if (!state.activeTaskId) return null
  return state.tasks.find((t) => t.id === state.activeTaskId) ?? null
}
