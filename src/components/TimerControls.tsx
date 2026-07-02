import type { TimerStatus } from '../store/pomodoroStore'

interface TimerControlsProps {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerControlsProps) {
  const isRunning = status === 'running'
  const isCompleted = status === 'completed'

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        type="button"
        onClick={isRunning ? onPause : onStart}
        className="w-full rounded-xl bg-neutral-900 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
        aria-label={isRunning ? '暂停计时' : isCompleted ? '开始下一阶段' : '开始计时'}
      >
        {isRunning ? '暂停' : isCompleted ? '下一阶段' : '开始'}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onReset}
          disabled={status === 'idle'}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          aria-label="重置当前阶段"
        >
          重置
        </button>
        <button
          type="button"
          onClick={onSkip}
          disabled={status === 'idle' || status === 'completed'}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          aria-label="跳过当前阶段"
        >
          跳过
        </button>
      </div>
      <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
        快捷键：<kbd className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">Space</kbd>{' '}
        开始/暂停 · <kbd className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">R</kbd>{' '}
        重置
      </p>
    </div>
  )
}
