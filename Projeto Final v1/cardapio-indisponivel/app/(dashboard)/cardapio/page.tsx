'use client'

import { useRef } from 'react'
import {
  ShoppingCart, Plus, Minus, CheckCircle,
  Download, ImageDown, CalendarDays, UtensilsCrossed, Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryBadge } from '@/components/category-badge'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { ExtrasSelector } from '@/components/cart/extras-selector'
import { SafeImage } from '@/components/safe-image'
import { useMenuCart } from '@/hooks/use-menu-cart'
import { useApp, extras } from '@/lib/app-context'
import { extrasTotal } from '@/lib/cart-utils'
import { formatLongDate } from '@/lib/format-date'
import { toast } from 'sonner'

export default function CardapioPage() {
  const { pratos, cardapioDia, user } = useApp()
  const printRef = useRef<HTMLDivElement>(null)
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
  } = useMenuCart()

  const isAdmin = user?.role === 'admin'
  const isGuest = user?.role === 'guest'
  const cardapioPratos = pratos.filter((p) => cardapioDia.includes(p.id) && p.disponivel)
  const today = new Date()

  function handleExportPDF() {
    if (!printRef.current) return
    const original = document.title
    document.title = `Cardapio-${today.toISOString().split('T')[0]}`
    window.print()
    document.title = original
  }

  async function handleExportImage() {
    if (!printRef.current) return
    toast.info('Gerando imagem...')
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })
      const link = document.createElement('a')
      link.download = `cardapio-${today.toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('Imagem salva com sucesso!')
    } catch {
      toast.error('Erro ao gerar imagem. Tente exportar como PDF.')
    }
  }

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #cardapio-print, #cardapio-print * { visibility: visible !important; }
          #cardapio-print { position: fixed; inset: 0; padding: 32px; background: #fff; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 no-print">
          <div>
            <h1 className="text-2xl font-bold">Cardápio do Dia</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {cardapioPratos.length} pratos disponíveis hoje
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && cardapioPratos.length > 0 && (
              <>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleExportImage}>
                  <ImageDown size={15} />
                  Salvar imagem
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPDF}>
                  <Download size={15} />
                  Exportar PDF
                </Button>
              </>
            )}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart size={17} />
              Carrinho
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {isGuest && (
          <div className="no-print mb-6 flex items-start gap-3 bg-muted border border-border rounded-2xl px-4 py-3 text-sm text-muted-foreground">
            <UtensilsCrossed size={16} className="mt-0.5 flex-shrink-0" />
            <span>
              Bem-vindo ao <strong className="text-foreground">Cantinho do Sabor</strong>! Escolha seus pratos e
              adicione ao carrinho para fazer o pedido.
            </span>
          </div>
        )}

        {isAdmin && (
          <div className="no-print mb-6 flex items-start gap-3 bg-primary/8 border border-primary/20 rounded-2xl px-4 py-3 text-sm text-primary">
            <CalendarDays size={16} className="mt-0.5 flex-shrink-0" />
            <span>
              Para alterar os pratos do cardápio, vá em <strong>Pratos</strong> e use o checkbox <strong>Cardápio do dia</strong>.
            </span>
          </div>
        )}

        {orderPlaced && (
          <div className="no-print mb-6 flex items-center gap-3 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-4 py-3 rounded-2xl">
            <CheckCircle size={20} />
            <span className="font-medium">Pedido enviado! Acompanhe em Pedidos.</span>
          </div>
        )}

        {cardapioPratos.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <UtensilsCrossed size={40} className="mx-auto mb-4 opacity-40" />
            <p className="font-medium">Nenhum prato no cardápio hoje.</p>
            {isAdmin && (
              <p className="mt-2 text-sm">
                Vá em <strong>Pratos</strong> e marque o checkbox &quot;Cardápio do dia&quot; nos pratos desejados.
              </p>
            )}
          </div>
        ) : (
          <>
            <div
              id="cardapio-print"
              ref={printRef}
              className="bg-white rounded-3xl border border-border overflow-hidden"
            >
              <div className="bg-primary px-8 py-7 text-primary-foreground">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Cantinho do Sabor</h2>
                    <p className="text-primary-foreground/80 text-sm mt-1 font-medium">
                      Comida caseira feita com amor
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-primary-foreground/90 text-sm">
                      <CalendarDays size={14} />
                      <span className="capitalize">{formatLongDate(today)}</span>
                    </div>
                    <p className="text-primary-foreground/70 text-xs mt-1">
                      {cardapioPratos.length} opções disponíveis
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cardapioPratos.map((prato) => {
                    const pratoExtras = selectedExtras[prato.id] ?? []
                    const inCart = getCartItem(prato.id, pratoExtras)

                    return (
                      <div
                        key={prato.id}
                        className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col"
                      >
                        <div className="relative h-44">
                          <SafeImage src={prato.imagem} alt={prato.nome} fill />
                          <div className="absolute top-3 left-3">
                            <CategoryBadge category={prato.categoria} />
                          </div>
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-semibold">{prato.nome}</h3>
                          <p className="text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-2">
                            {prato.descricao}
                          </p>
                          {prato.acompanhamentos.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Acomp.: {prato.acompanhamentos.join(', ')}
                            </p>
                          )}

                          <ExtrasSelector
                            className="no-print mt-3"
                            extras={extras}
                            selected={pratoExtras}
                            onToggle={(extra) => toggleExtra(prato.id, extra)}
                          />

                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                            <div>
                              <span className="font-bold text-primary font-mono text-lg">
                                R$ {prato.preco.toFixed(2)}
                              </span>
                              {pratoExtras.length > 0 && (
                                <span className="no-print text-xs text-muted-foreground ml-1">
                                  +R$ {extrasTotal(pratoExtras).toFixed(2)}
                                </span>
                              )}
                            </div>

                            <div className="no-print">
                              {inCart ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => updateQtyForPrato(prato.id, inCart.quantidade - 1, pratoExtras)}
                                    className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                                  >
                                    <Minus size={13} />
                                  </button>
                                  <span className="text-sm font-semibold w-4 text-center">
                                    {inCart.quantidade}
                                  </span>
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
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Cantinho do Sabor · Cardápio sujeito a alterações</span>
                  <span>Gerado em {today.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {!isAdmin && (
              <div className="no-print mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock size={12} />
                <span>Apenas administradores podem exportar o cardápio.</span>
              </div>
            )}
          </>
        )}
      </div>

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
        isMensalista={user?.role === 'mensalista'}
      />
    </>
  )
}
