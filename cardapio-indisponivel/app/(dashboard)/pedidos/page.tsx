'use client'

import { useState } from 'react'
import { ChevronDown, Clock, Flame, CheckCircle2, Package } from 'lucide-react'
import { useApp, orderItemTotal } from '@/lib/app-context'
import type { FormaPagamento, ModoRecebimento, OrderStatus, Pedido } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  novo: {
    label: 'Novo',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    icon: <Clock size={14} />,
  },
  preparo: {
    label: 'Em Preparo',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    icon: <Flame size={14} />,
  },
  pronto: {
    label: 'Pronto',
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    icon: <CheckCircle2 size={14} />,
  },
  entregue: {
    label: 'Entregue',
    color: 'bg-muted text-muted-foreground',
    icon: <Package size={14} />,
  },
}

const STATUS_ORDER: OrderStatus[] = ['novo', 'preparo', 'pronto', 'entregue']

const modoRecebimentoLabel: Record<ModoRecebimento, string> = {
  entrega: 'Entrega',
  retirada: 'Retirada',
  no_local: 'No local',
}

const formaPagamentoLabel: Record<FormaPagamento, string> = {
  pix: 'PIX',
  debito: 'Cartão de Débito',
  credito: 'Cartão de Crédito',
  mensalista: 'Pagamento Mensalista',
}

function nextStatus(status: OrderStatus): OrderStatus | null {
  const idx = STATUS_ORDER.indexOf(status)
  return idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null
}

function OrderCard({ pedido }: { pedido: Pedido }) {
  const { updatePedidoStatus } = useApp()
  const [expanded, setExpanded] = useState(pedido.status !== 'entregue')
  const config = statusConfig[pedido.status]
  const next = nextStatus(pedido.status)

  function handleAdvance() {
    if (!next) return
    updatePedidoStatus(pedido.id, next)
    toast.success(`Pedido #${pedido.numero} → ${statusConfig[next].label}`)
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground leading-none">Pedido</p>
            <p className="font-bold text-lg leading-tight font-mono">#{pedido.numero}</p>
          </div>
          <div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                config.color
              )}
            >
              {config.icon}
              {config.label}
            </span>
            {pedido.clienteNome && (
              <p className="text-xs text-muted-foreground mt-0.5">{pedido.clienteNome}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-bold text-primary font-mono">R$ {pedido.total.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {pedido.tipo === 'mensalista' ? 'Mensalista' : 'Avulso'}
            </p>
          </div>
          <ChevronDown
            size={16}
            className={cn('text-muted-foreground transition-transform', expanded && 'rotate-180')}
          />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-4 py-3">
          <div className="space-y-2 mb-4">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-muted px-2.5 py-1 font-medium">
                {modoRecebimentoLabel[pedido.modoRecebimento]}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-1 font-medium">
                {formaPagamentoLabel[pedido.formaPagamento]}
              </span>
            </div>
            {pedido.enderecoEntrega && (
              <p className="text-xs text-muted-foreground">
                Endereço: {pedido.enderecoEntrega}
              </p>
            )}
            {pedido.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <img
                  src={item.prato.imagem}
                  alt={item.prato.nome}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {item.quantidade}x {item.prato.nome}
                  </p>
                  {item.extras.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      + {item.extras.map((e) => e.nome).join(', ')}
                    </p>
                  )}
                  {item.nota && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                      Obs: {item.nota}
                    </p>
                  )}
                </div>
                <p className="text-xs font-mono text-muted-foreground">
                  R$ {orderItemTotal(item).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {next && (
            <button
              onClick={handleAdvance}
              className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Avançar para {statusConfig[next].label}
            </button>
          )}
          {!next && (
            <div className="text-center text-xs text-muted-foreground py-1">
              Pedido concluído
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function PedidosPage() {
  const { pedidos } = useApp()
  const [filter, setFilter] = useState<OrderStatus | 'todos'>('todos')

  const filtered = pedidos
    .filter((p) => filter === 'todos' || p.status === filter)
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())

  const counts = STATUS_ORDER.reduce(
    (acc, s) => ({ ...acc, [s]: pedidos.filter((p) => p.status === s).length }),
    {} as Record<OrderStatus, number>
  )

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{pedidos.length} pedidos no total</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {STATUS_ORDER.map((s) => {
          const cfg = statusConfig[s]
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'flex flex-col items-start p-4 rounded-2xl border transition-colors text-left',
                filter === s
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:bg-muted/30'
              )}
            >
              <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold mb-2', cfg.color)}>
                {cfg.icon} {cfg.label}
              </span>
              <span className="text-2xl font-bold">{counts[s]}</span>
            </button>
          )
        })}
      </div>

      {/* Filter row */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('todos')}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors',
            filter === 'todos'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground'
          )}
        >
          Todos ({pedidos.length})
        </button>
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors',
              filter === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {statusConfig[s].label} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((pedido) => (
            <OrderCard key={pedido.id} pedido={pedido} />
          ))}
        </div>
      )}
    </div>
  )
}
