/// <reference types="vitest/config" />

import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  usePomodoroTimer,
  computeRemaining,
  shouldComplete,
  computeEndTime,
} from '../hooks/usePomodoroTimer'
import { DEFAULT_SETTINGS } from '../lib/constants'

const settings = { ...DEFAULT_SETTINGS }

describe('timer pure helpers', () => {
  it('computeRemaining returns ms until end', () => {
    expect(computeRemaining(1000, 400)).toBe(600)
    expect(computeRemaining(null, 400)).toBeNull()
  })

  it('shouldComplete detects elapsed endTime', () => {
    expect(shouldComplete(1000, 1000)).toBe(true)
    expect(shouldComplete(1000, 500)).toBe(false)
  })

  it('computeEndTime adds remaining to now', () => {
    expect(computeEndTime(5000, 1000)).toBe(6000)
  })
})

describe('usePomodoroTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-30T10:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts and pauses using Date.now() based endTime', () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({ settings, completedFocusCount: 0 }),
    )

    expect(result.current.status).toBe('idle')
    expect(result.current.remainingMs).toBe(25 * 60_000)

    act(() => result.current.start())
    expect(result.current.status).toBe('running')

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.remainingMs).toBeLessThanOrEqual(25 * 60_000 - 5000)

    act(() => result.current.pause())
    expect(result.current.status).toBe('paused')
    const pausedRemaining = result.current.remainingMs

    act(() => vi.advanceTimersByTime(10_000))
    expect(result.current.remainingMs).toBe(pausedRemaining)
  })

  it('completes phase when time elapses', () => {
    const onPhaseComplete = vi.fn()
    const { result } = renderHook(() =>
      usePomodoroTimer({
        settings: { ...settings, workMinutes: 0.05 },
        completedFocusCount: 0,
        callbacks: { onPhaseComplete },
      }),
    )

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(4000))
    expect(result.current.status).toBe('completed')
    expect(onPhaseComplete).toHaveBeenCalledWith('focus')
  })

  it('advances to break after focus completion via start', () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({
        settings: { ...settings, workMinutes: 0.05 },
        completedFocusCount: 1,
      }),
    )

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(4000))
    expect(result.current.status).toBe('completed')

    act(() => result.current.start())
    expect(result.current.phase).toBe('shortBreak')
    expect(result.current.status).toBe('running')
  })
})
