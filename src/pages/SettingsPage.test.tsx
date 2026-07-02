import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SettingsPage } from './SettingsPage'

describe('SettingsPage', () => {
  it('renders expanded preference tabs and theme picker', () => {
    render(<SettingsPage />)

    expect(screen.getByRole('heading', { name: /偏好设置/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '外观' })).toBeInTheDocument()
    expect(screen.getByText('店铺主题')).toBeInTheDocument()
    expect(screen.getByText('经典石棕')).toBeInTheDocument()
    expect(screen.getByText('默认排序')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '隐私' }))
    expect(screen.getByText('个性化推荐')).toBeInTheDocument()
    expect(screen.queryByText('店铺主题')).not.toBeInTheDocument()
  })
})
