'use client'

import { useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts'
import { TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react'
import { vendasIniciais } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'
import { formatShortDate } from '@/lib/format-date'
import { mergeVendas, pedidosToVendas, receitaSemanalFromVendas } from '@/lib/sales'

const ITEMS_PER_PAGE = 8

function StatCard({
  label, value, icon, sub,
}: {
  label: string
  value: string
  icon: React.ReactNode
  sub?: string
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        <p className="text-2xl font-bold font-mono mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

interface TooltipPayloadItem {
  name: string
  value: number
  fill: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 text-sm shadow-lg">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.fill }} className="flex justify-between gap-6">
            <span>{entry.name === 'avulso' ? 'Avulso' : 'Mensalista'}</span>
            <span className="font-mono font-semibold">R$ {entry.value.toFixed(2)}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function VendasPage() {
  const { pedidos } = useApp()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<'todos' | 'avulso' | 'mensalista'>('todos')

  const vendas = useMemo(
    () => mergeVendas(pedidosToVendas(pedidos), vendasIniciais),
    [pedidos]
  )

  const receitaSemanal = useMemo(() => receitaSemanalFromVendas(vendas), [vendas])

  const filteredVendas = vendas.filter((venda) => filter === 'todos' || venda.tipo === filter)

  const totalReceita = filteredVendas.reduce((acc, venda) => acc + venda.total, 0)
  const totalQtd = filteredVendas.reduce((acc, venda) => acc + venda.quantidade, 0)
  const totalPedidos = filteredVendas.length
  const mediaTicket = totalPedidos > 0 ? totalReceita / totalPedidos : 0

  const pages = Math.ceil(filteredVendas.length / ITEMS_PER_PAGE)
  const paginated = filteredVendas.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Vendas</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Resumo derivado dos pedidos entregues</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Receita Total"
          value={`R$ ${totalReceita.toFixed(2)}`}
          icon={<DollarSign size={18} />}
          sub="pedidos entregues"
        />
        <StatCard
          label="Pratos Vendidos"
          value={String(totalQtd)}
          icon={<ShoppingBag size={18} />}
          sub={`${totalPedidos} vendas`}
        />
        <StatCard
          label="Ticket Médio"
          value={`R$ ${mediaTicket.toFixed(2)}`}
          icon={<TrendingUp size={18} />}
        />
        <StatCard
          label="Pratos únicos"
          value={String(new Set(filteredVendas.map((venda) => venda.pratoNome)).size)}
          icon={<Users size={18} />}
        />
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 mb-8">
        <h2 className="font-semibold mb-5">Receita por dia</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={receitaSemanal} barSize={22} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="dia"
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }} />
            <Legend
              formatter={(value) => (value === 'avulso' ? 'Avulso' : 'Mensalista')}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="avulso" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="mensalista" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold">Histórico de Vendas</h2>
          <div className="flex gap-2">
            {(['todos', 'avulso', 'mensalista'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setFilter(option)
                  setPage(1)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filter === option
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {option === 'todos' ? 'Todos' : option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Data</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Prato</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">Qtd</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">Total</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((venda) => (
                <tr key={venda.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatShortDate(venda.data)}
                  </td>
                  <td className="px-5 py-3 font-medium">{venda.pratoNome}</td>
                  <td className="px-5 py-3 text-center">{venda.quantidade}</td>
                  <td className="px-5 py-3 text-right font-mono font-semibold text-primary">
                    R$ {venda.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        venda.tipo === 'mensalista'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {venda.tipo === 'mensalista' ? 'Mensalista' : 'Avulso'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filteredVendas.length)} de {filteredVendas.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs border border-border disabled:opacity-40 hover:bg-muted transition-colors"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(pages, current + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 rounded-lg text-xs border border-border disabled:opacity-40 hover:bg-muted transition-colors"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
