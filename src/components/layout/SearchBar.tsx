import { useEffect, useId, useRef, useState } from 'react'
import { getSearchSuggestions, popularSearchTerms } from '../../lib/productSearch'
import { formatCurrency } from '../../lib/formatters'
import { theme } from '../../lib/themeClasses'
import { usePreferencesStore } from '../../store/preferencesStore'
import type { Product } from '../../types'

interface SearchBarProps {
  products: Product[]
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onSelectProduct: (productId: string) => void
  placeholder?: string
}

export function SearchBar({
  products,
  value,
  onChange,
  onSubmit,
  onSelectProduct,
  placeholder = '搜索商品名、分类或标签',
}: SearchBarProps) {
  const inputId = useId()
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const currencyFormat = usePreferencesStore((state) => state.currencyFormat)

  const suggestions = value.trim() ? getSearchSuggestions(products, value, 6) : []
  const showSuggestions = open && (suggestions.length > 0 || (!value.trim() && popularSearchTerms.length > 0))

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setOpen(false)
    onSubmit()
  }

  function handleSelectProduct(productId: string) {
    setOpen(false)
    onSelectProduct(productId)
  }

  function handlePopularTerm(term: string) {
    onChange(term)
    setOpen(false)
    onSubmit()
  }

  function handleClear() {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full" role="search">
        <label className="sr-only" htmlFor={inputId}>
          搜索商品
        </label>
        <div
          className={`flex items-center gap-2 rounded-full border px-2 py-1.5 shadow-sm transition focus-within:border-[var(--accent)] ${theme.surface} ${theme.border}`}
        >
          <span className={`pl-2 text-sm ${theme.muted}`} aria-hidden="true">
            ⌕
          </span>
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            onChange={(event) => {
              onChange(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setOpen(false)
                inputRef.current?.blur()
              }
            }}
            placeholder={placeholder}
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls={listboxId}
            aria-autocomplete="list"
            className={`min-w-0 flex-1 border-0 bg-transparent px-1 py-2 text-base outline-none sm:py-1.5 sm:text-sm ${theme.heading}`}
          />
          {value ? (
            <button
              type="button"
              onClick={handleClear}
              className={`rounded-full px-2 py-1 text-xs font-bold ${theme.muted}`}
              aria-label="清除搜索"
            >
              清除
            </button>
          ) : null}
          <button type="submit" className={`touch-target shrink-0 rounded-full px-3 py-2 text-sm sm:px-4 ${theme.primaryBtn}`}>
            <span className="sm:hidden" aria-hidden="true">
              ⌕
            </span>
            <span className="hidden sm:inline">搜索</span>
          </button>
        </div>
      </form>

      {showSuggestions ? (
        <div
          id={listboxId}
          role="listbox"
          className={`absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-3xl border shadow-xl ${theme.surface} ${theme.border}`}
        >
          {value.trim() ? (
            <>
              <p className={`border-b px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] ${theme.muted}`}>
                商品建议
              </p>
              {suggestions.length > 0 ? (
                <ul>
                  {suggestions.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        role="option"
                        onClick={() => handleSelectProduct(product.id)}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-stone-100/80 ${theme.heading}`}
                      >
                        <span>
                          <span className="block font-bold">{product.name}</span>
                          <span className={`text-xs ${theme.muted}`}>{product.category}</span>
                        </span>
                        <span className={`shrink-0 text-sm font-black ${theme.accentText}`}>
                          {formatCurrency(product.price, currencyFormat)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`px-4 py-4 text-sm ${theme.muted}`}>没有找到匹配商品，请换个关键词。</p>
              )}
            </>
          ) : (
            <>
              <p className={`border-b px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] ${theme.muted}`}>
                热门搜索
              </p>
              <div className="flex flex-wrap gap-2 px-4 py-4">
                {popularSearchTerms.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handlePopularTerm(term)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${theme.accentSoft}`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}
