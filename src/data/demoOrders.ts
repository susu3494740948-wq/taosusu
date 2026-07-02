import { buildLogistics } from '../lib/orderLogistics'
import { getProductById } from './products'
import type { Order } from '../types'

const demoCustomer = {
  name: 'Emily Chen',
  email: 'emily.chen@example.com',
  address: '742 Evergreen Terrace',
  city: 'Los Angeles',
  country: 'United States',
  postalCode: '90001',
}

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

function cartItem(productId: string, quantity: number) {
  const product = getProductById(productId)
  if (!product) throw new Error(`Missing demo product: ${productId}`)
  return { product, quantity }
}

export const demoOrders: Order[] = [
  {
    id: 'ER-20250618-PAY01',
    items: [cartItem('compression-packing-cubes', 1), cartItem('travel-cable-organizer', 1)],
    customer: demoCustomer,
    shippingMethod: 'standard',
    discountCode: 'SUMMER10',
    total: 38.38,
    createdAt: daysAgo(0),
    paymentStatus: 'unpaid',
    status: 'pending_payment',
  },
  {
    id: 'ER-20250610-SHP02',
    items: [cartItem('cooling-towel-kit', 2)],
    customer: demoCustomer,
    shippingMethod: 'express',
    discountCode: '',
    total: 59.98,
    createdAt: daysAgo(8),
    paymentStatus: 'paid',
    status: 'shipped',
    paidAt: daysAgo(8),
    logistics: buildLogistics(
      {
        id: 'ER-20250610-SHP02',
        items: [],
        customer: demoCustomer,
        shippingMethod: 'express',
        discountCode: '',
        total: 59.98,
        createdAt: daysAgo(8),
        paymentStatus: 'paid',
        status: 'shipped',
        paidAt: daysAgo(8),
      },
      'shipped',
    ),
  },
  {
    id: 'ER-20250520-DLV03',
    items: [cartItem('portable-neck-fan', 1), cartItem('ice-silk-blanket', 1)],
    customer: demoCustomer,
    shippingMethod: 'standard',
    discountCode: 'SUMMER10',
    total: 49.48,
    createdAt: daysAgo(29),
    paymentStatus: 'paid',
    status: 'delivered',
    paidAt: daysAgo(29),
    logistics: buildLogistics(
      {
        id: 'ER-20250520-DLV03',
        items: [],
        customer: demoCustomer,
        shippingMethod: 'standard',
        discountCode: 'SUMMER10',
        total: 49.48,
        createdAt: daysAgo(29),
        paymentStatus: 'paid',
        status: 'delivered',
        paidAt: daysAgo(29),
      },
      'delivered',
    ),
  },
  {
    id: 'ER-20250615-PRO04',
    items: [cartItem('pet-grooming-glove', 1)],
    customer: demoCustomer,
    shippingMethod: 'standard',
    discountCode: '',
    total: 16.99,
    createdAt: daysAgo(3),
    paymentStatus: 'paid',
    status: 'processing',
    paidAt: daysAgo(3),
    logistics: buildLogistics(
      {
        id: 'ER-20250615-PRO04',
        items: [],
        customer: demoCustomer,
        shippingMethod: 'standard',
        discountCode: '',
        total: 16.99,
        createdAt: daysAgo(3),
        paymentStatus: 'paid',
        status: 'processing',
        paidAt: daysAgo(3),
      },
      'processing',
    ),
  },
]
