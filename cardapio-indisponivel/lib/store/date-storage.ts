import type { AppState } from '@/lib/store/app-store'
import type { Mensalista, Pedido } from '@/lib/types'

function reviveDate(value: unknown): Date {
  return value instanceof Date ? value : new Date(String(value))
}

function revivePedidos(pedidos: Pedido[]): Pedido[] {
  return pedidos.map((pedido) => ({
    ...pedido,
    criadoEm: reviveDate(pedido.criadoEm),
    modoRecebimento: pedido.modoRecebimento ?? 'retirada',
    formaPagamento:
      pedido.formaPagamento ?? (pedido.tipo === 'mensalista' ? 'mensalista' : 'pix'),
  }))
}

function reviveMensalistas(mensalistas: Mensalista[]): Mensalista[] {
  return mensalistas.map((mensalista) => ({
    ...mensalista,
    criadoEm: reviveDate(mensalista.criadoEm),
  }))
}

export function revivePersistedState(state: AppState): AppState {
  return {
    ...state,
    pedidos: revivePedidos(state.pedidos ?? []),
    mensalistas: reviveMensalistas(state.mensalistas ?? []),
  }
}

export const dateAwareStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(name)
  },
  setItem: (name: string, value: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(name, value)
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(name)
  },
}
