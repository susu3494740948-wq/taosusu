export type Category =
  | 'Summer Comfort'
  | 'Pet Cleaning'
  | 'Travel Organization'
  | 'Hair And Beauty'
  | 'Home Organization'
  | 'Fitness & Outdoor'

export type ShippingMethod = 'standard' | 'express'

export interface Product {
  id: string
  name: string
  category: Category
  price: number
  compareAtPrice?: number
  rating: number
  reviewCount: number
  stock: number
  badge?: string
  image: string
  tags: string[]
  benefits: string[]
  description: string
  details: string[]
  shippingNote: string
  /** Data URL or remote URL for user-uploaded product photos */
  customImageUrl?: string
  /** Extra detail/gallery image URLs for the product page carousel */
  galleryImageUrls?: string[]
  /** Optional source note, e.g. supplier sheet or platform listing reference */
  sourceNote?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CustomerInfo {
  name: string
  email: string
  address: string
  city: string
  country: string
  postalCode: string
}

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export type OrderStatus =
  | 'pending_payment'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface LogisticsEvent {
  id: string
  timestamp: string
  location: string
  description: string
  completed: boolean
}

export interface OrderLogistics {
  carrier: string
  trackingNumber: string
  estimatedDelivery: string
  events: LogisticsEvent[]
}

export interface Order {
  id: string
  items: CartItem[]
  customer: CustomerInfo
  shippingMethod: ShippingMethod
  discountCode: string
  total: number
  createdAt: string
  paymentStatus: PaymentStatus
  status: OrderStatus
  paidAt?: string
  logistics?: OrderLogistics
}
