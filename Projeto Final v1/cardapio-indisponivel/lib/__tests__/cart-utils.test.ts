import { describe, expect, it } from 'vitest'
import {
  cartCount,
  cartItemKey,
  cartItemTotal,
  cartTotal,
  orderItemTotal,
} from '@/lib/cart-utils'
import type { CartItem, Extra, OrderItem, Prato } from '@/lib/types'

const prato: Prato = {
  id: 'p1',
  nome: 'Teste',
  descricao: 'Desc',
  preco: 10,
  categoria: 'proteina',
  imagem: '',
  acompanhamentos: [],
  disponivel: true,
}

const extra: Extra = { id: 'e1', nome: 'Ovo', preco: 3 }

describe('cart-utils', () => {
  it('gera chaves distintas para extras diferentes', () => {
    expect(cartItemKey('p1', [])).toBe('p1:')
    expect(cartItemKey('p1', [extra])).toBe('p1:e1')
  })

  it('calcula totais incluindo extras', () => {
    const item: CartItem = { prato, quantidade: 2, extras: [extra] }
    expect(cartItemTotal(item)).toBe(26)
    expect(cartTotal([item])).toBe(26)
    expect(cartCount([item])).toBe(2)
  })

  it('calcula total de item de pedido com extras', () => {
    const orderItem: OrderItem = { prato, quantidade: 1, extras: [extra] }
    expect(orderItemTotal(orderItem)).toBe(13)
  })
})
