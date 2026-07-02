import { useCallback, useEffect, useRef, useState } from 'react'
import { getNextPhase, getPhaseDurationMs } from '../lib/constants'
import type { Phase, Settings, TimerStatus } from '../store/pomodoroStore'

export interface TimerCallbacks {
  onPhaseComplete?: (phase: Phase) => void
}

export interface UsePomodoroTimerOptions {
  settings: Settings
  completedFocusCount: number
  callbacks?: TimerCallbacks
}

export interface UsePomodoroTimerReturn {
  phase: Phase
  status: TimerStatus
  remainingMs: number
  progress: number
  durationMs: number
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  setPhase: (phase: Phase) => void
}

export function usePomodoroTimer({
  settings,
  completedFocusCount,
  callbacks,
}: UsePomodoroTimerOptions): UsePomodoroTimerReturn {
  const [phase, setPhaseState] = useState<Phase>('focus')
  const [status, setStatus] = useState<TimerStatus>('idle')
  const [remainingMs, setRemainingMs] = useState(() =>
    getPhaseDurationMs('focus', settings),
  )

  const endTimeRef = useRef<number | null>(null)
  const phaseRef = useRef(phase)
  const statusRef = useRef(status)
  const completedFocusRef = useRef(completedFocusCount)
  const settingsRef = useRef(settings)
  const callbacksRef = useRef(callbacks)

  phaseRef.current = phase
  statusRef.current = status
  completedFocusRef.current = completedFocusCount
  settingsRef.current = settings
  callbacksRef.current = callbacks

  const durationMs = getPhaseDurationMs(phase, settings)

  const completePhase = useCallback(() => {
    endTimeRef.current = null
    setStatus('completed')
    statusRef.current = 'completed'
    callbacksRef.current?.onPhaseComplete?.(phaseRef.current)
  }, [])

  const start = useCallback(() => {
    if (statusRef.current === 'running') return

    if (statusRef.current === 'completed') {
      const next = getNextPhase(
        phaseRef.current,
        completedFocusRef.current,
        settingsRef.current,
      )
      const dur = getPhaseDurationMs(next, settingsRef.current)
      endTimeRef.current = Date.now() + dur
      setPhaseState(next)
      phaseRef.current = next
      setRemainingMs(dur)
      setStatus('running')
      statusRef.current = 'running'
      return
    }

    const base =
      statusRef.current === 'paused'
        ? remainingMs
        : getPhaseDurationMs(phaseRef.current, settingsRef.current)

    endTimeRef.current = Date.now() + base
    setRemainingMs(base)
    setStatus('running')
    statusRef.current = 'running'
  }, [remainingMs])

  const pause = useCallback(() => {
    if (statusRef.current !== 'running' || endTimeRef.current === null) return
    const next = Math.max(0, endTimeRef.current - Date.now())
    endTimeRef.current = null
    setRemainingMs(next)
    setStatus('paused')
    statusRef.current = 'paused'
  }, [])

  const reset = useCallback(() => {
    endTimeRef.current = null
    const dur = getPhaseDurationMs(phaseRef.current, settingsRef.current)
    setRemainingMs(dur)
    setStatus('idle')
    statusRef.current = 'idle'
  }, [])

  const skip = useCallback(() => {
    endTimeRef.current = null
    const next = getNextPhase(
      phaseRef.current,
      completedFocusRef.current,
      settingsRef.current,
    )
    const dur = getPhaseDurationMs(next, settingsRef.current)
    setPhaseState(next)
    phaseRef.current = next
    setRemainingMs(dur)
    setStatus('idle')
    statusRef.current = 'idle'
  }, [])

  const setPhase = useCallback((nextPhase: Phase) => {
    endTimeRef.current = null
    const dur = getPhaseDurationMs(nextPhase, settingsRef.current)
    setPhaseState(nextPhase)
    phaseRef.current = nextPhase
    setRemainingMs(dur)
    setStatus('idle')
    statusRef.current = 'idle'
  }, [])

  useEffect(() => {
    if (status !== 'running') return

    const tick = () => {
      const endTime = endTimeRef.current
      if (endTime === null || statusRef.current !== 'running') return

      const next = Math.max(0, endTime - Date.now())
      setRemainingMs(next)

      if (next <= 0) {
        completePhase()
        return
      }
    }

    tick()
    const id = window.setInterval(tick, 200)
    return () => window.clearInterval(id)
  }, [status, completePhase])

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return
      if (statusRef.current !== 'running' || endTimeRef.current === null) return

      const next = Math.max(0, endTimeRef.current - Date.now())
      setRemainingMs(next)
      if (next <= 0) completePhase()
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [completePhase])

  useEffect(() => {
    if (statusRef.current === 'running') return
    if (statusRef.current === 'paused') return
    const dur = getPhaseDurationMs(phase, settings)
    setRemainingMs(dur)
  }, [
    settings.workMinutes,
    settings.shortBreakMinutes,
    settings.longBreakMinutes,
    phase,
    settings,
  ])

  const progress =
    durationMs > 0 ? Math.min(1, Math.max(0, 1 - remainingMs / durationMs)) : 0

  return {
    phase,
    status,
    remainingMs,
    progress,
    durationMs,
    start,
    pause,
    reset,
    skip,
    setPhase,
  }
}

/** Testable pure helpers */
export function computeRemaining(endTime: number | null, now: number): number | null {
  if (endTime === null) return null
  return Math.max(0, endTime - now)
}

export function shouldComplete(endTime: number | null, now: number): boolean {
  if (endTime === null) return false
  return endTime - now <= 0
}

export function computeEndTime(remainingMs: number, now: number): number {
  return now + remainingMs
}
