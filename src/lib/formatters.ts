import type { CurrencyFormat } from '../store/preferencesStore'

export function formatCurrency(value: number, format: CurrencyFormat = 'symbol'): string {
  if (format === 'code') {
    return `USD ${value.toFixed(2)}`
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatOrderId(date = new Date()): string {
  return `ER-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
    date.getDate(),
  ).padStart(2, '0')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))
}
