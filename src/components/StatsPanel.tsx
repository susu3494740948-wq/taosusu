import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatWeekday } from '../lib/formatTime'
import { weekKeys } from '../lib/constants'

interface StatsPanelProps {
  dailyStats: Record<string, number>
  todayCount: number
}

export function StatsPanel({ dailyStats, todayCount }: StatsPanelProps) {
  const keys = weekKeys()
  const chartData = keys.map((key) => ({
    day: formatWeekday(key),
    count: dailyStats[key] ?? 0,
    fullDate: key,
  }))
  const weekTotal = chartData.reduce((sum, d) => sum + d.count, 0)

  return (
    <section className="w-full" aria-label="统计数据">
      <h2 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
        统计
      </h2>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-xs text-neutral-500">今日番茄</p>
          <p className="text-2xl font-bold text-focus">{todayCount}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-xs text-neutral-500">本周合计</p>
          <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            {weekTotal}
          </p>
        </div>
      </div>

      <div className="h-40 rounded-xl border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-800">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#737373' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#737373' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e5e5e5',
                fontSize: 12,
              }}
              formatter={(value) => [`${value} 个`, '番茄']}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.fullDate ?? ''
              }
            />
            <Bar dataKey="count" fill="#e85d4f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
