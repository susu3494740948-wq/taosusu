import { useEffect, useMemo, useState } from 'react'
import { getProductMedia, type ProductMediaSlide } from '../../lib/productMedia'
import { theme } from '../../lib/themeClasses'
import type { Product } from '../../types'

interface ProductMediaGalleryProps {
  product: Product
}

function slideLabel(slide: ProductMediaSlide): string {
  return slide.label
}

export function ProductMediaGallery({ product }: ProductMediaGalleryProps) {
  const slides = useMemo(() => getProductMedia(product), [product])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [product.id])

  const activeSlide = slides[activeIndex] ?? slides[0]
  const hasMultipleSlides = slides.length > 1

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1))
  }

  function showNext() {
    setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1))
  }

  if (!activeSlide) return null

  return (
    <div className="space-y-4">
      <div
        className={`relative aspect-square overflow-hidden rounded-[2rem] ${theme.surface}`}
        aria-live="polite"
      >
        {activeSlide.type === 'video' ? (
          <video
            key={activeSlide.id}
            className="h-full w-full bg-stone-950 object-contain"
            controls
            playsInline
            preload="metadata"
            poster={activeSlide.poster}
            aria-label={activeSlide.alt}
          >
            <source src={activeSlide.src} type="video/mp4" />
            您的浏览器暂不支持视频播放。
          </video>
        ) : (
          <img
            src={activeSlide.src}
            alt={activeSlide.alt}
            className={`h-full w-full ${activeSlide.type === 'size' ? 'object-contain bg-stone-50 p-4' : 'object-cover'}`}
          />
        )}

        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black ${theme.accentSoft}`}
        >
          {slideLabel(activeSlide)}
        </span>

        {hasMultipleSlides ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-black text-stone-900 shadow"
              aria-label="上一张"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-black text-stone-900 shadow"
              aria-label="下一张"
            >
              ›
            </button>
            <p className="absolute bottom-4 right-4 rounded-full bg-stone-950/70 px-3 py-1 text-xs font-bold text-white">
              {activeIndex + 1} / {slides.length}
            </p>
          </>
        ) : null}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`min-w-[88px] shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                isActive ? 'border-[var(--accent)]' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
              aria-label={`查看${slide.label}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <div className="relative aspect-square w-[88px] bg-stone-100">
                {slide.type === 'video' ? (
                  <>
                    <img
                      src={slide.poster ?? slide.src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-stone-950/35 text-white">
                      ▶
                    </span>
                  </>
                ) : slide.type === 'size' ? (
                  <div className={`flex h-full w-full flex-col items-center justify-center px-2 text-center ${theme.surfaceMuted}`}>
                    <span className="text-lg font-black">📐</span>
                    <span className="mt-1 text-[10px] font-bold leading-tight">尺寸</span>
                  </div>
                ) : (
                  <img src={slide.src} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <p className={`px-1 py-2 text-center text-[11px] font-bold ${theme.heading}`}>{slide.label}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
