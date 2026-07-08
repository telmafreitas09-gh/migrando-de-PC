'use client'

import { useMemo } from 'react'
import { Receipt, TrendingDown, CalendarDays, UtensilsCrossed } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

import { formatShortDate } from '@/lib/format-date'

export default function MinhasDespesasPage() {
  const { user, pedidos, mensalistas } = useApp()

  const mensalista = mensalistas.find((m) =>
    user?.mensalistaId
      ? m.id === user.mensalistaId
      : m.nome.toLowerCase() === user?.nome?.toLowerCase()
  )

  const meusPedidos = useMemo(
    () =>
      pedidos
        .filter(
          (p) =>
            p.tipo === 'mensalista' &&
            p.clienteNome?.toLowerCase() === (mensalista?.nome ?? user?.nome)?.toLowerCase()
        )
        .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()),
    [pedidos, user, mensalista]
  )

  const totalGasto = meusPedidos.reduce((acc, p) => acc + p.total, 0)
  const pedidosMes = meusPedidos.filter((p) => {
    const d = new Date(p.criadoEm)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const gastoMes = pedidosMes.reduce((acc, p) => acc + p.total, 0)

  const statusLabel: Record<string, string> = {
    novo: 'Recebido',
    preparo: 'Em preparo',
    pronto: 'Pronto',
    entregue: 'Entregue',
  }

  const statusColor: Record<string, string> = {
    novo:    'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    preparo: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    pronto:  'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    entregue:'bg-muted text-muted-foreground',
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Minhas Despesas</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Histórico de pedidos de <span className="font-semibold text-foreground">{user?.nome}</span>
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingDown size={17} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Total gasto</p>
          </div>
          <p className="text-2xl font-bold font-mono text-primary">
            R$ {totalGasto.toFixed(2)}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <CalendarDays size={17} className="text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm text-muted-foreground">Gasto este mês</p>
          </div>
          <p className="text-2xl font-bold font-mono">
            R$ {gastoMes.toFixed(2)}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Receipt size={17} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Pedidos no mês</p>
          </div>
          <p className="text-2xl font-bold">{pedidosMes.length}</p>
        </div>
      </div>

      {/* Plano mensalista */}
      {mensalista && (
        <div className={cn(
          'mb-6 flex items-center justify-between px-5 py-4 rounded-2xl border',
          mensalista.status === 'ativo'
            ? 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800'
            : 'bg-muted border-border'
        )}>
          <div>
            <p className="text-sm font-semibold">
              Plano Mensalista —{' '}
              <span className={mensalista.status === 'ativo' ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}>
                {mensalista.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Taxa mensal: R$ {mensalista.taxaMensal.toFixed(2)} ·{' '}
              {mensalista.registroStatus === 'confirmado' ? 'Registro confirmado' : 'Aguardando confirmação'}
            </p>
          </div>
          <span className={cn(
            'text-xs font-semibold px-3 py-1 rounded-full',
            mensalista.registroStatus === 'confirmado'
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
          )}>
            {mensalista.registroStatus === 'confirmado' ? 'Confirmado' : 'Pendente'}
          </span>
        </div>
      )}

      {/* Histórico de pedidos */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">Histórico de pedidos</h2>
        </div>

        {meusPedidos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <UtensilsCrossed size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Nenhum pedido encontrado.</p>
            <p className="text-xs mt-1">Seus pedidos aparecerão aqui após a realização.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {meusPedidos.map((pedido) => (
              <div key={pedido.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">#{pedido.numero}</span>
                      <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        statusColor[pedido.status]
                      )}>
                        {statusLabel[pedido.status]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pedido.items.map((i) => `${i.quantidade}x ${i.prato.nome}`).join(' · ')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatShortDate(pedido.criadoEm)}
                    </p>
                  </div>
                  <p className="font-bold font-mono text-primary flex-shrink-0">
                    R$ {pedido.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
