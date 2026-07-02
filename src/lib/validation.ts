import type { CustomerInfo } from '../types'

export function validateCustomerInfo(info: CustomerInfo): Partial<Record<keyof CustomerInfo, string>> {
  const errors: Partial<Record<keyof CustomerInfo, string>> = {}

  if (!info.name.trim()) errors.name = 'Name is required'
  if (!/^\S+@\S+\.\S+$/.test(info.email)) errors.email = 'Valid email is required'
  if (!info.address.trim()) errors.address = 'Address is required'
  if (!info.city.trim()) errors.city = 'City is required'
  if (!info.country.trim()) errors.country = 'Country is required'
  if (!info.postalCode.trim()) errors.postalCode = 'Postal code is required'

  return errors
}
