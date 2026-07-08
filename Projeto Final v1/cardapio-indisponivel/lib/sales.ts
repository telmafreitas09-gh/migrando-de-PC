import type { Pedido, ReceitaSemanal, Venda } from '@/lib/types'
import { orderItemTotal } from '@/lib/cart-utils'

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const

export function pedidosToVendas(pedidos: Pedido[]): Venda[] {
  return pedidos
    .filter((pedido) => pedido.status === 'entregue')
    .flatMap((pedido) =>
      pedido.items.map((item, index) => ({
        id: `${pedido.id}-${item.prato.id}-${index}`,
        data: pedido.criadoEm,
        pratoNome: item.prato.nome,
        quantidade: item.quantidade,
        total: orderItemTotal(item),
        tipo: pedido.tipo,
      }))
    )
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
}

export function receitaSemanalFromVendas(vendas: Venda[]): ReceitaSemanal[] {
  const totals = WEEKDAY_LABELS.map((dia) => ({ dia, avulso: 0, mensalista: 0 }))

  for (const venda of vendas) {
    const dayIndex = new Date(venda.data).getDay()
    const bucket = totals[dayIndex]
    if (venda.tipo === 'avulso') bucket.avulso += venda.total
    else bucket.mensalista += venda.total
  }

  return [...totals.slice(1), totals[0]]
}

export function mergeVendas(primary: Venda[], fallback: Venda[]): Venda[] {
  if (primary.length > 0) return primary
  return fallback
}
