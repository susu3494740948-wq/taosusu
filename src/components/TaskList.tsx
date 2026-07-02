import { useState, type FormEvent } from 'react'
import type { Task } from '../store/pomodoroStore'

interface TaskListProps {
  tasks: Task[]
  activeTaskId: string | null
  onAdd: (title: string) => void
  onRemove: (id: string) => void
  onToggleComplete: (id: string) => void
  onSetActive: (id: string) => void
}

export function TaskList({
  tasks,
  activeTaskId,
  onAdd,
  onRemove,
  onToggleComplete,
  onSetActive,
}: TaskListProps) {
  const [input, setInput] = useState('')
  const pending = tasks.filter((t) => !t.completed)
  const activeTask = tasks.find((t) => t.id === activeTaskId)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onAdd(input)
    setInput('')
  }

  return (
    <section className="w-full" aria-label="任务列表">
      <h2 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
        任务
      </h2>

      {activeTask && (
        <div className="mb-3 rounded-xl border border-focus/30 bg-focus-muted px-3 py-2 animate-fade-in">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">当前任务</p>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            {activeTask.title}
          </p>
          <p className="text-xs text-neutral-500">
            已完成 {activeTask.pomodoroCount} 个番茄
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="添加专注任务…"
          className="min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-focus dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          aria-label="新任务名称"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="shrink-0 rounded-lg bg-focus px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          aria-label="添加任务"
        >
          添加
        </button>
      </form>

      {pending.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400 dark:border-neutral-700">
          暂无待办，添加一个任务开始专注吧
        </p>
      ) : (
        <ul className="space-y-2">
          {pending.map((task) => (
            <li
              key={task.id}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 ${
                task.id === activeTaskId
                  ? 'border-focus/40 bg-focus-muted/50'
                  : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'
              }`}
            >
              <button
                type="button"
                onClick={() => onSetActive(task.id)}
                className="min-w-0 flex-1 text-left text-sm"
                aria-label={`设为当前任务：${task.title}`}
                aria-current={task.id === activeTaskId ? 'true' : undefined}
              >
                <span className="font-medium text-neutral-800 dark:text-neutral-100">
                  {task.title}
                </span>
                <span className="ml-2 text-xs text-neutral-400">
                  🍅 {task.pomodoroCount}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onToggleComplete(task.id)}
                className="rounded p-1 text-xs text-neutral-400 hover:text-short"
                aria-label={`完成任务：${task.title}`}
                title="标记完成"
              >
                ✓
              </button>
              <button
                type="button"
                onClick={() => onRemove(task.id)}
                className="rounded p-1 text-xs text-neutral-400 hover:text-red-500"
                aria-label={`删除任务：${task.title}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
