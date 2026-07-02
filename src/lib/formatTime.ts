export function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatWeekday(dateKey: string): string {
  const d = new Date(dateKey + 'T12:00:00')
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return weekdays[d.getDay()] ?? '?'
}
