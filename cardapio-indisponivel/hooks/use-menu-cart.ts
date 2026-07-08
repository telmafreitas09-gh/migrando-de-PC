'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { cartItemKey } from '@/lib/cart-utils'
import { useApp } from '@/lib/app-context'
import type { CheckoutData, Extra } from '@/lib/types'

export function useMenuCart(defaultTipo: 'avulso' | 'mensalista' = 'avulso') {
  const {
    pratos,
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartTotal,
    cartCount,
    addPedido,
    user,
  } = useApp()

  const [cartOpen, setCartOpen] = useState(false)
  const [selectedExtras, setSelectedExtras] = useState<Record<string, Extra[]>>({})
  const [orderPlaced, setOrderPlaced] = useState(false)

  const toggleExtra = useCallback((pratoId: string, extra: Extra) => {
    setSelectedExtras((prev) => {
      const current = prev[pratoId] ?? []
      const has = current.some((item) => item.id === extra.id)
      return {
        ...prev,
        [pratoId]: has ? current.filter((item) => item.id !== extra.id) : [...current, extra],
      }
    })
  }, [])

  const handleAddToCart = useCallback(
    (pratoId: string) => {
      const prato = pratos.find((item) => item.id === pratoId)
      if (!prato) return
      addToCart(prato, selectedExtras[pratoId] ?? [])
      toast.success(`${prato.nome} adicionado ao carrinho`)
    },
    [addToCart, pratos, selectedExtras]
  )

  const handleFinalizarPedido = useCallback(
    (checkout: CheckoutData) => {
      if (cart.length === 0) return

      const tipo =
        user?.role === 'mensalista' || defaultTipo === 'mensalista' ? 'mensalista' : 'avulso'

      addPedido({
        items: cart.map((item) => ({
          prato: item.prato,
          quantidade: item.quantidade,
          extras: item.extras,
          nota: item.nota,
        })),
        status: 'novo',
        tipo,
        clienteNome: user?.nome,
        total: cartTotal,
        modoRecebimento: checkout.modoRecebimento,
        enderecoEntrega: checkout.enderecoEntrega,
        formaPagamento: checkout.formaPagamento,
      })

      clearCart()
      setCartOpen(false)
      setOrderPlaced(true)
      setTimeout(() => setOrderPlaced(false), 4000)
      toast.success('Pedido realizado com sucesso!')
    },
    [addPedido, cart, cartTotal, clearCart, defaultTipo, user?.nome, user?.role]
  )

  const getCartItem = useCallback(
    (pratoId: string, extras: Extra[] = selectedExtras[pratoId] ?? []) => {
      const key = cartItemKey(pratoId, extras)
      return cart.find((item) => cartItemKey(item.prato.id, item.extras) === key)
    },
    [cart, selectedExtras]
  )

  const updateQtyForPrato = useCallback(
    (pratoId: string, qty: number, extras: Extra[] = selectedExtras[pratoId] ?? []) => {
      updateCartQty(cartItemKey(pratoId, extras), qty)
    },
    [selectedExtras, updateCartQty]
  )

  return {
    cartOpen,
    setCartOpen,
    selectedExtras,
    orderPlaced,
    toggleExtra,
    handleAddToCart,
    handleFinalizarPedido,
    getCartItem,
    updateQtyForPrato,
    removeFromCart,
    clearCart,
    updateCartQty,
    cart,
    cartTotal,
    cartCount,
  }
}
