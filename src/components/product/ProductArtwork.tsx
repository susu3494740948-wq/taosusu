import { getProductPhotoUrl } from '../../data/productPhotos'

const artworkClasses: Record<string, string> = {
  cooling: 'from-sky-100 via-cyan-50 to-emerald-100 text-cyan-900',
  fan: 'from-teal-100 via-slate-50 to-blue-100 text-teal-900',
  blanket: 'from-sky-100 via-blue-50 to-indigo-100 text-blue-900',
  mistfan: 'from-cyan-100 via-sky-50 to-teal-100 text-cyan-900',
  pet: 'from-amber-100 via-orange-50 to-stone-100 text-amber-900',
  glove: 'from-orange-100 via-amber-50 to-yellow-100 text-orange-900',
  lint: 'from-stone-100 via-neutral-50 to-zinc-100 text-stone-900',
  packing: 'from-blue-100 via-indigo-50 to-slate-100 text-blue-900',
  toiletry: 'from-violet-100 via-purple-50 to-fuchsia-100 text-violet-900',
  shoebag: 'from-slate-100 via-gray-50 to-stone-100 text-slate-900',
  curl: 'from-rose-100 via-pink-50 to-violet-100 text-rose-900',
  sleepcap: 'from-pink-100 via-rose-50 to-purple-100 text-pink-900',
  mirror: 'from-fuchsia-100 via-pink-50 to-rose-100 text-fuchsia-900',
  organizer: 'from-stone-100 via-neutral-50 to-zinc-100 text-stone-900',
  sink: 'from-emerald-100 via-teal-50 to-cyan-100 text-emerald-900',
  divider: 'from-amber-100 via-yellow-50 to-orange-100 text-amber-900',
  bottle: 'from-green-100 via-emerald-50 to-teal-100 text-green-900',
  bands: 'from-red-100 via-orange-50 to-amber-100 text-red-900',
  sunhat: 'from-yellow-100 via-amber-50 to-orange-100 text-amber-900',
  umbrella: 'from-sky-100 via-blue-50 to-indigo-100 text-blue-900',
  petwipes: 'from-lime-100 via-green-50 to-emerald-100 text-green-900',
  petbrush: 'from-orange-100 via-amber-50 to-yellow-100 text-orange-900',
  travelpillow: 'from-indigo-100 via-violet-50 to-purple-100 text-indigo-900',
  cable: 'from-slate-100 via-gray-50 to-zinc-100 text-slate-900',
  clawclip: 'from-rose-100 via-pink-50 to-fuchsia-100 text-rose-900',
  jaderoller: 'from-emerald-100 via-teal-50 to-green-100 text-emerald-900',
  closet: 'from-stone-100 via-neutral-50 to-zinc-100 text-stone-900',
  spice: 'from-amber-100 via-orange-50 to-red-100 text-amber-900',
  yogamat: 'from-purple-100 via-violet-50 to-fuchsia-100 text-purple-900',
  jumprope: 'from-red-100 via-rose-50 to-orange-100 text-red-900',
}

export function ProductArtwork({
  image,
  name,
  showOverlay = false,
  showBottomCaption = false,
  subtitle,
}: {
  image: string
  name: string
  showOverlay?: boolean
  showBottomCaption?: boolean
  subtitle?: string
}) {
  const photoUrl = getProductPhotoUrl(image)

  return (
    <div
      className={`relative flex aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br ${
        artworkClasses[image] ?? artworkClasses.cooling
      }`}
    >
      <img
        src={photoUrl}
        alt={`${name} product lifestyle photo`}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      {showBottomCaption ? (
        <>
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-stone-950/90 via-stone-950/35 to-transparent" />
          <div className="relative mt-auto w-full px-4 pb-4 pt-12 text-left">
            <p className="line-clamp-2 text-sm font-bold leading-snug text-white">{name}</p>
            {subtitle ? <p className="mt-1 line-clamp-1 text-xs font-medium text-white/80">{subtitle}</p> : null}
          </div>
        </>
      ) : null}
      {showOverlay ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/15 to-white/10" />
          <div className="relative mt-auto w-full p-5">
            <div className="rounded-2xl border border-white/40 bg-white/75 px-5 py-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.25em]">Featured</p>
              <p className="mt-2 max-w-56 text-lg font-bold leading-tight">{name}</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
