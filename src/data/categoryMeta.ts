import type { Category } from '../types'

export interface CategoryMeta {
  title: Category
  description: string
  image: string
}

export const categoryMeta: Record<Category, CategoryMeta> = {
  'Summer Comfort': {
    title: 'Summer Comfort',
    description: 'Cooling towels, neck fans, and lightweight summer essentials for heat waves and outdoor days.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  },
  'Pet Cleaning': {
    title: 'Pet Cleaning',
    description: 'Hair removers, grooming gloves, and lint tools for pet owners and fabric-heavy homes.',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
  },
  'Travel Organization': {
    title: 'Travel Organization',
    description: 'Packing cubes, toiletry bags, and shoe organizers built for carry-on and weekend trips.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80',
  },
  'Hair And Beauty': {
    title: 'Hair And Beauty',
    description: 'Heatless curl sets, sleep caps, and vanity tools for everyday beauty routines.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  },
  'Home Organization': {
    title: 'Home Organization',
    description: 'Under-sink racks, drawer dividers, and vanity organizers for small-space living.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
  },
  'Fitness & Outdoor': {
    title: 'Fitness & Outdoor',
    description: 'Collapsible bottles, resistance bands, and travel-friendly workout gear.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80',
  },
}
