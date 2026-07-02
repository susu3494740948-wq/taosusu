import { formatTime } from '../lib/formatTime'
import { PHASE_COLORS, PHASE_LABELS } from '../lib/constants'
import type { Phase, TimerStatus } from '../store/pomodoroStore'

interface TimerRingProps {
  phase: Phase
  remainingMs: number
  progress: number
  status: TimerStatus
}

const RADIUS = 88
const STROKE = 10
const SIZE = (RADIUS + STROKE) * 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimerRing({ phase, remainingMs, progress, status }: TimerRingProps) {
  const offset = CIRCUMFERENCE * (1 - progress)
  const colors = PHASE_COLORS[phase]

  return (
    <section
      className="relative flex flex-col items-center"
      aria-label="番茄钟计时器"
    >
      <div
        className={`relative transition-colors duration-300 ${colors.bg} rounded-full p-1`}
        role="timer"
        aria-live="polite"
        aria-atomic="true"
      >
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            className="stroke-neutral-200 dark:stroke-neutral-700"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            className={`${colors.ring} transition-all duration-300`}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-xs font-medium uppercase tracking-widest ${colors.text} mb-1 transition-colors duration-300`}
          >
            {PHASE_LABELS[phase]}
          </span>
          <span className="text-5xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-50">
            {formatTime(remainingMs)}
          </span>
          <span className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {statusLabel(status)}
          </span>
        </div>
      </div>
    </section>
  )
}

function statusLabel(status: TimerStatus): string {
  switch (status) {
    case 'idle':
      return '准备就绪'
    case 'running':
      return '进行中'
    case 'paused':
      return '已暂停'
    case 'completed':
      return '阶段完成'
  }
}
