'use client'

import { Plus, Minus, CheckCircle, ShoppingCart, CalendarDays, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryBadge } from '@/components/category-badge'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { ExtrasSelector } from '@/components/cart/extras-selector'
import { useMenuCart } from '@/hooks/use-menu-cart'
import { useApp, extras } from '@/lib/app-context'
import { extrasTotal } from '@/lib/cart-utils'
import { formatLongDate } from '@/lib/format-date'

export default function CardapioDiaMensalistaPage() {
  const { pratos, cardapioDia } = useApp()
  const {
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
  } = useMenuCart('mensalista')

  const cardapioPratos = pratos.filter((p) => cardapioDia.includes(p.id) && p.disponivel)
  const today = new Date()

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cardápio do Dia</h1>
          <p className="text-muted-foreground text-sm mt-0.5 capitalize">
            <CalendarDays size={13} className="inline mr-1 -mt-0.5" />
            {formatLongDate(today)}
          </p>
        </div>

        {cardapioPratos.length > 0 && (
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors self-start sm:self-auto"
          >
            <ShoppingCart size={17} />
            Carrinho
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>

      {orderPlaced && (
        <div className="mb-6 flex items-center gap-3 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-4 py-3 rounded-2xl">
          <CheckCircle size={20} />
          <span className="font-medium">Pedido enviado! Acompanhe em Minhas Despesas.</span>
        </div>
      )}

      {cardapioPratos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <UtensilsCrossed size={28} className="text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Cardápio indisponível</h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-xs">
            O cardápio de hoje ainda não foi gerado pelo estabelecimento. Volte mais tarde.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cardapioPratos.map((prato) => {
            const pratoExtras = selectedExtras[prato.id] ?? []
            const inCart = getCartItem(prato.id, pratoExtras)

            return (
              <div key={prato.id} className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-sm">{prato.nome}</h3>
                      <CategoryBadge category={prato.categoria} />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {prato.descricao}
                    </p>
                    {prato.acompanhamentos.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Acomp.: {prato.acompanhamentos.join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-primary font-mono text-base flex-shrink-0">
                    R$ {prato.preco.toFixed(2)}
                  </span>
                </div>

                <ExtrasSelector
                  extras={extras}
                  selected={pratoExtras}
                  onToggle={(extra) => toggleExtra(prato.id, extra)}
                />

                <div className="flex items-center justify-between pt-1 border-t border-border">
                  {pratoExtras.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      Extras: +R$ {extrasTotal(pratoExtras).toFixed(2)}
                    </span>
                  )}
                  <div className="ml-auto">
                    {inCart ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQtyForPrato(prato.id, inCart.quantidade - 1, pratoExtras)}
                          className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">{inCart.quantidade}</span>
                        <button
                          type="button"
                          onClick={() => updateQtyForPrato(prato.id, inCart.quantidade + 1, pratoExtras)}
                          className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => handleAddToCart(prato.id)} className="gap-1">
                        <Plus size={13} />
                        Adicionar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onUpdateQty={updateCartQty}
        onRemove={removeFromCart}
        onClear={() => {
          clearCart()
          setCartOpen(false)
        }}
        onCheckout={handleFinalizarPedido}
        showImages={false}
        isMensalista
      />
    </div>
  )
}
