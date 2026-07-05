import { isDirectVideoUrl } from '../../data/blogDefaults'
import { theme } from '../../lib/themeClasses'

interface BlogPostMediaProps {
  imageUrl?: string
  videoUrl?: string
  title: string
}

export function BlogPostMedia({ imageUrl, videoUrl, title }: BlogPostMediaProps) {
  if (videoUrl) {
    if (isDirectVideoUrl(videoUrl)) {
      return (
        <video
          src={videoUrl}
          controls
          playsInline
          className="aspect-video w-full rounded-2xl bg-black object-cover"
        />
      )
    }
    return (
      <div className="aspect-video overflow-hidden rounded-2xl bg-black">
        <iframe
          src={videoUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={title}
        className="aspect-[4/3] w-full rounded-2xl object-cover"
        loading="lazy"
      />
    )
  }

  return (
    <div className={`flex aspect-[4/3] items-center justify-center rounded-2xl ${theme.surfaceMuted}`}>
      <p className={`px-4 text-center text-sm ${theme.muted}`}>暂无图片或视频</p>
    </div>
  )
}
