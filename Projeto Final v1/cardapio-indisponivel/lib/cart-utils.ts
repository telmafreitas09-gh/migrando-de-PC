import type { CartItem, Extra, OrderItem } from '@/lib/types'

export function cartItemKey(pratoId: string, extras: Extra[]): string {
  const extrasKey = extras
    .map((e) => e.id)
    .sort()
    .join(',')
  return `${pratoId}:${extrasKey}`
}

export function extrasTotal(extras: Extra[]): number {
  return extras.reduce((sum, extra) => sum + extra.preco, 0)
}

export function itemUnitPrice(preco: number, extras: Extra[]): number {
  return preco + extrasTotal(extras)
}

export function cartItemTotal(item: CartItem): number {
  return itemUnitPrice(item.prato.preco, item.extras) * item.quantidade
}

export function orderItemTotal(item: OrderItem): number {
  return itemUnitPrice(item.prato.preco, item.extras) * item.quantidade
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + cartItemTotal(item), 0)
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantidade, 0)
}
