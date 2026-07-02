import { useEffect, useState } from 'react'
import type { Settings } from '../store/pomodoroStore'
import {
  getNotificationPermission,
  requestNotificationPermission,
  type NotificationPermissionState,
} from '../lib/notifications'

interface SettingsDialogProps {
  open: boolean
  settings: Settings
  onClose: () => void
  onChange: (partial: Partial<Settings>) => void
}

export function SettingsDialog({
  open,
  settings,
  onClose,
  onChange,
}: SettingsDialogProps) {
  const [notifPerm, setNotifPerm] = useState<NotificationPermissionState>('default')

  useEffect(() => {
    if (open) setNotifPerm(getNotificationPermission())
  }, [open])

  if (!open) return null

  const handleNotifToggle = async (enabled: boolean) => {
    if (enabled) {
      const perm = await requestNotificationPermission()
      setNotifPerm(perm)
      onChange({ notificationsEnabled: perm === 'granted' })
    } else {
      onChange({ notificationsEnabled: false })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-fade-in rounded-2xl bg-white p-5 shadow-xl dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="settings-title" className="text-lg font-semibold">
            设置
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="关闭设置"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <DurationField
            label="专注时长（分钟）"
            value={settings.workMinutes}
            onChange={(v) => onChange({ workMinutes: v })}
          />
          <DurationField
            label="短休息（分钟）"
            value={settings.shortBreakMinutes}
            onChange={(v) => onChange({ shortBreakMinutes: v })}
          />
          <DurationField
            label="长休息（分钟）"
            value={settings.longBreakMinutes}
            onChange={(v) => onChange({ longBreakMinutes: v })}
          />
          <DurationField
            label="长休息间隔（番茄数）"
            value={settings.longBreakInterval}
            min={2}
            max={10}
            onChange={(v) => onChange({ longBreakInterval: v })}
          />

          <ToggleField
            label="提示音"
            checked={settings.soundEnabled}
            onChange={(v) => onChange({ soundEnabled: v })}
          />
          <ToggleField
            label="浏览器通知"
            checked={settings.notificationsEnabled}
            onChange={handleNotifToggle}
          />
          {notifPerm === 'denied' && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              通知权限已被拒绝，请在浏览器设置中允许本站通知。
            </p>
          )}
          {notifPerm === 'unsupported' && (
            <p className="text-xs text-neutral-400">当前浏览器不支持通知 API。</p>
          )}
        </div>
      </div>
    </div>
  )
}

function DurationField({
  label,
  value,
  onChange,
  min = 1,
  max = 120,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="text-neutral-600 dark:text-neutral-300">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-right dark:border-neutral-700 dark:bg-neutral-800"
      />
    </label>
  )
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-sm">
      <span className="text-neutral-600 dark:text-neutral-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
          checked ? 'bg-focus' : 'bg-neutral-300 dark:bg-neutral-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  )
}
