'use client'

import { useEffect, useState } from 'react'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet } from '@/components/ui/sheet'
import { cartItemKey, cartItemTotal } from '@/lib/cart-utils'
import type { CartItem, CheckoutData, FormaPagamento, ModoRecebimento } from '@/lib/types'
import { cn } from '@/lib/utils'
import { SafeImage } from '@/components/safe-image'

const MODOS_RECEBIMENTO: { value: ModoRecebimento; label: string }[] = [
  { value: 'entrega', label: 'Entrega' },
  { value: 'retirada', label: 'Retirada' },
  { value: 'no_local', label: 'No local' },
]

const FORMAS_PAGAMENTO: { value: FormaPagamento; label: string; mensalistaOnly?: boolean }[] = [
  { value: 'pix', label: 'PIX' },
  { value: 'debito', label: 'Cartão de Débito' },
  { value: 'credito', label: 'Cartão de Crédito' },
  { value: 'mensalista', label: 'Pagamento Mensalista', mensalistaOnly: true },
]

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  onUpdateQty: (key: string, qty: number) => void
  onRemove: (key: string) => void
  onClear: () => void
  onCheckout: (data: CheckoutData) => void
  showImages?: boolean
  isMensalista?: boolean
}

export function CartDrawer({
  open,
  onOpenChange,
  cart,
  cartCount,
  cartTotal,
  onUpdateQty,
  onRemove,
  onClear,
  onCheckout,
  showImages = true,
  isMensalista = false,
}: CartDrawerProps) {
  const [modoRecebimento, setModoRecebimento] = useState<ModoRecebimento | null>(null)
  const [enderecoEntrega, setEnderecoEntrega] = useState('')
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento | null>(null)

  useEffect(() => {
    if (!open) {
      setModoRecebimento(null)
      setEnderecoEntrega('')
      setFormaPagamento(null)
    }
  }, [open])

  const formasDisponiveis = FORMAS_PAGAMENTO.filter(
    (forma) => !forma.mensalistaOnly || isMensalista
  )

  const enderecoObrigatorio = modoRecebimento === 'entrega'
  const enderecoValido = !enderecoObrigatorio || enderecoEntrega.trim().length > 0
  const podeFinalizar =
    cart.length > 0 && modoRecebimento !== null && formaPagamento !== null && enderecoValido

  function handleFinalizar() {
    if (!podeFinalizar || !modoRecebimento || !formaPagamento) return

    onCheckout({
      modoRecebimento,
      enderecoEntrega: enderecoObrigatorio ? enderecoEntrega.trim() : undefined,
      formaPagamento,
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-md"
      title={
        <span className="flex items-center gap-2">
          <ShoppingCart size={18} />
          Carrinho
          {cartCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {cartCount}
            </span>
          )}
        </span>
      }
      footer={
        cart.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold text-primary font-mono">
                R$ {cartTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClear}>
                Limpar
              </Button>
              <Button className="flex-1" onClick={handleFinalizar} disabled={!podeFinalizar}>
                Finalizar pedido
              </Button>
            </div>
          </div>
        ) : undefined
      }
    >
      {cart.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">Carrinho vazio</div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            {cart.map((item) => {
              const key = cartItemKey(item.prato.id, item.extras)
              return (
                <div
                  key={key}
                  className="flex gap-3 rounded-xl border border-border bg-background p-3"
                >
                  {showImages && (
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                      <SafeImage src={item.prato.imagem} alt={item.prato.nome} fill />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.prato.nome}</p>
                    {item.extras.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        + {item.extras.map((extra) => extra.nome).join(', ')}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-primary font-mono">
                        R$ {cartItemTotal(item).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(key, item.quantidade - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted text-xs"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-4 text-center text-xs font-semibold">
                          {item.quantidade}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(key, item.quantidade + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-xs text-primary-foreground"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemove(key)}
                          className="ml-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <div>
              <p className="mb-2 text-sm font-semibold">Como deseja receber o pedido?</p>
              <div className="grid grid-cols-3 gap-2">
                {MODOS_RECEBIMENTO.map((modo) => (
                  <button
                    key={modo.value}
                    type="button"
                    onClick={() => setModoRecebimento(modo.value)}
                    className={cn(
                      'rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors',
                      modoRecebimento === modo.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                    )}
                  >
                    {modo.label}
                  </button>
                ))}
              </div>
            </div>

            {modoRecebimento === 'entrega' && (
              <div>
                <label htmlFor="endereco-entrega" className="mb-2 block text-sm font-semibold">
                  Endereço de entrega
                </label>
                <Input
                  id="endereco-entrega"
                  placeholder="Rua, número, bairro, complemento..."
                  value={enderecoEntrega}
                  onChange={(e) => setEnderecoEntrega(e.target.value)}
                />
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-semibold">Forma de pagamento</p>
              <div className="grid grid-cols-2 gap-2">
                {formasDisponiveis.map((forma) => (
                  <button
                    key={forma.value}
                    type="button"
                    onClick={() => setFormaPagamento(forma.value)}
                    className={cn(
                      'rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors',
                      formaPagamento === forma.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                    )}
                  >
                    {forma.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  )
}
