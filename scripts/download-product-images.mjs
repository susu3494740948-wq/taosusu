import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const productPhotoUrls = {
  cooling: 'https://images.pexels.com/photos/6550985/pexels-photo-6550985.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  fan: 'https://images.pexels.com/photos/7677724/pexels-photo-7677724.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  blanket: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  mistfan: 'https://images.pexels.com/photos/3680219/pexels-photo-3680219.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  pet: 'https://images.pexels.com/photos/5731862/pexels-photo-5731862.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  glove: 'https://images.pexels.com/photos/5732450/pexels-photo-5732450.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  lint: 'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  packing: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  toiletry: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  shoebag: 'https://images.pexels.com/photos/1900175/pexels-photo-1900175.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  curl: 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  sleepcap: 'https://images.pexels.com/photos/3992857/pexels-photo-3992857.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  mirror: 'https://images.pexels.com/photos/2533269/pexels-photo-2533269.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  organizer: 'https://images.pexels.com/photos/66100/pexels-photo-66100.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  sink: 'https://images.pexels.com/photos/5824512/pexels-photo-5824512.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  divider: 'https://images.pexels.com/photos/5824535/pexels-photo-5824535.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  bottle: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  bands: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  sunhat: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  umbrella: 'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  petwipes: 'https://images.pexels.com/photos/5731862/pexels-photo-5731862.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  petbrush: 'https://images.pexels.com/photos/5732450/pexels-photo-5732450.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  travelpillow: 'https://images.pexels.com/photos/210578/pexels-photo-210578.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  cable: 'https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  clawclip: 'https://images.pexels.com/photos/3993448/pexels-photo-3993448.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  jaderoller: 'https://images.pexels.com/photos/6620997/pexels-photo-6620997.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  closet: 'https://images.pexels.com/photos/6489067/pexels-photo-6489067.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  spice: 'https://images.pexels.com/photos/5824556/pexels-photo-5824556.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  yogamat: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
  jumprope: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=900&h=675&fit=crop',
}

const heroUrl =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80'

async function download(url, dest) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed ${url}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, buffer)
}

const productsDir = path.join(root, 'public', 'images', 'products')
const heroDest = path.join(root, 'public', 'images', 'hero.jpg')

console.log('Downloading hero image...')
await download(heroUrl, heroDest)

console.log('Downloading product images...')
for (const [key, url] of Object.entries(productPhotoUrls)) {
  const dest = path.join(productsDir, `${key}.jpg`)
  process.stdout.write(`  ${key}...`)
  await download(url, dest)
  process.stdout.write(' ok\n')
}

console.log('Done.')
