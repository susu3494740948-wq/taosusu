const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop`

/** Real product / lifestyle photos matched to each SKU */
export const productPhotoUrls: Record<string, string> = {
  cooling: pexels(6550985),
  fan: pexels(7677724),
  blanket: pexels(1648776),
  mistfan: pexels(3680219),
  pet: pexels(5731862),
  glove: pexels(5732450),
  lint: pexels(5591663),
  packing: pexels(3762879),
  toiletry: pexels(1450360),
  shoebag: pexels(1900175),
  curl: pexels(3065209),
  sleepcap: pexels(3992857),
  mirror: pexels(2533269),
  organizer: pexels(66100),
  sink: pexels(5824512),
  divider: pexels(5824535),
  bottle: pexels(416528),
  bands: pexels(841130),
  sunhat: pexels(1054218),
  umbrella: pexels(995301),
  petwipes: pexels(5731862),
  petbrush: pexels(5732450),
  travelpillow: pexels(210578),
  cable: pexels(1181243),
  clawclip: pexels(3993448),
  jaderoller: pexels(6620997),
  closet: pexels(6489067),
  spice: pexels(5824556),
  yogamat: pexels(863988),
  jumprope: pexels(3822864),
}

/** Usage and detail shots for the product detail gallery */
export const productGalleryPhotos: Record<string, string[]> = {
  cooling: [pexels(1552242), pexels(5994640)],
  fan: [pexels(259911), pexels(3680219)],
  blanket: [pexels(1454806), pexels(1080721)],
  mistfan: [pexels(7677724), pexels(259911)],
  pet: [pexels(5591663), pexels(5732450)],
  glove: [pexels(5731862), pexels(5591663)],
  lint: [pexels(5731862), pexels(5732450)],
  packing: [pexels(9960960), pexels(4489728)],
  toiletry: [pexels(9960960), pexels(4489728)],
  shoebag: [pexels(1005638), pexels(4489728)],
  curl: [pexels(3993448), pexels(3992857)],
  sleepcap: [pexels(3993448), pexels(3065209)],
  mirror: [pexels(448005), pexels(66100)],
  organizer: [pexels(448005), pexels(5824535)],
  sink: [pexels(7536265), pexels(5824868)],
  divider: [pexels(5824556), pexels(4846430)],
  bottle: [pexels(416476), pexels(4476375)],
  bands: [pexels(3076509), pexels(4476375)],
  sunhat: [pexels(5994640), pexels(46710)],
  umbrella: [pexels(4489728), pexels(5994640)],
  petwipes: [pexels(5732450), pexels(5591663)],
  petbrush: [pexels(5731862), pexels(5732450)],
  travelpillow: [pexels(4489728), pexels(9960960)],
  cable: [pexels(1181243), pexels(4489728)],
  clawclip: [pexels(3065209), pexels(3992857)],
  jaderoller: [pexels(2533269), pexels(448005)],
  closet: [pexels(6489067), pexels(5824535)],
  spice: [pexels(5824556), pexels(5824868)],
  yogamat: [pexels(3822621), pexels(4476375)],
  jumprope: [pexels(1576930), pexels(841130)],
}

export const defaultProductPhoto = productPhotoUrls.cooling

export function getProductPhotoUrl(imageKey: string): string {
  return productPhotoUrls[imageKey] ?? defaultProductPhoto
}

export function getProductGalleryPhotoUrls(imageKey: string): string[] {
  return productGalleryPhotos[imageKey] ?? []
}
