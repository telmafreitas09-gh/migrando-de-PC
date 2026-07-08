import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  cartCount as calcCartCount,
  cartItemKey,
  cartTotal as calcCartTotal,
  orderItemTotal,
} from '@/lib/cart-utils'
import {
  extras as extrasIniciais,
  mensalistasIniciais,
  pedidosIniciais,
  pratosIniciais,
} from '@/lib/mock-data'
import { dateAwareStorage, revivePersistedState } from '@/lib/store/date-storage'
import type {
  CartItem,
  Extra,
  Mensalista,
  Pedido,
  Prato,
  User,
} from '@/lib/types'
import {
  defaultRestaurantSettings,
  type RestaurantSettings,
} from '@/lib/store/settings'

export interface AppState {
  user: User | null
  pratos: Prato[]
  pedidos: Pedido[]
  mensalistas: Mensalista[]
  cart: CartItem[]
  cardapioDia: string[]
  settings: RestaurantSettings
  _hasHydrated: boolean
  storeVersion: number
}

interface AppActions {
  setHasHydrated: (value: boolean) => void
  login: (user: User) => void
  logout: () => void
  addPrato: (prato: Omit<Prato, 'id'>) => void
  updatePrato: (prato: Prato) => void
  deletePrato: (id: string) => void
  addPedido: (pedido: Omit<Pedido, 'id' | 'numero' | 'criadoEm'>) => void
  updatePedidoStatus: (id: string, status: Pedido['status']) => void
  addMensalista: (m: Omit<Mensalista, 'id' | 'criadoEm' | 'totalGasto'>) => void
  updateMensalista: (m: Mensalista) => void
  deleteMensalista: (id: string) => void
  addToCart: (prato: Prato, extras?: Extra[]) => void
  removeFromCart: (key: string) => void
  updateCartQty: (key: string, qty: number) => void
  clearCart: () => void
  toggleCardapioDia: (pratoId: string) => void
  updateSettings: (settings: RestaurantSettings) => void
}

export type AppStore = AppState & AppActions

const initialCardapioDia: string[] = []

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      pratos: pratosIniciais,
      pedidos: pedidosIniciais,
      mensalistas: mensalistasIniciais,
      cart: [],
      cardapioDia: initialCardapioDia,
      settings: defaultRestaurantSettings,
      _hasHydrated: false,
      storeVersion: 2,

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      login: (user) => set({ user }),

      logout: () => set({ user: null, cart: [] }),

      addPrato: (prato) => {
        const newPrato: Prato = { ...prato, id: `p${Date.now()}` }
        set((state) => ({ pratos: [...state.pratos, newPrato] }))
      },

      updatePrato: (prato) => {
        set((state) => ({
          pratos: state.pratos.map((p) => (p.id === prato.id ? prato : p)),
        }))
      },

      deletePrato: (id) => {
        set((state) => ({
          pratos: state.pratos.filter((p) => p.id !== id),
          cardapioDia: state.cardapioDia.filter((pratoId) => pratoId !== id),
        }))
      },

      addPedido: (pedido) => {
        set((state) => {
          const numero =
            state.pedidos.length > 0
              ? Math.max(...state.pedidos.map((p) => p.numero)) + 1
              : 1001

          const newPedido: Pedido = {
            ...pedido,
            id: `ord${Date.now()}`,
            numero,
            criadoEm: new Date(),
          }

          let mensalistas = state.mensalistas
          if (pedido.formaPagamento === 'mensalista' && pedido.clienteNome) {
            mensalistas = mensalistas.map((m) =>
              m.nome.toLowerCase() === pedido.clienteNome!.toLowerCase()
                ? { ...m, totalGasto: m.totalGasto + pedido.total }
                : m
            )
          }

          return {
            pedidos: [...state.pedidos, newPedido],
            mensalistas,
          }
        })
      },

      updatePedidoStatus: (id, status) => {
        set((state) => ({
          pedidos: state.pedidos.map((p) => (p.id === id ? { ...p, status } : p)),
        }))
      },

      addMensalista: (m) => {
        const newMensalista: Mensalista = {
          ...m,
          id: `m${Date.now()}`,
          criadoEm: new Date(),
          totalGasto: 0,
        }
        set((state) => ({ mensalistas: [...state.mensalistas, newMensalista] }))
      },

      updateMensalista: (m) => {
        set((state) => ({
          mensalistas: state.mensalistas.map((x) => (x.id === m.id ? m : x)),
        }))
      },

      deleteMensalista: (id) => {
        set((state) => ({
          mensalistas: state.mensalistas.filter((m) => m.id !== id),
        }))
      },

      addToCart: (prato, extras = []) => {
        const key = cartItemKey(prato.id, extras)
        set((state) => {
          const existing = state.cart.find((item) => cartItemKey(item.prato.id, item.extras) === key)
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                cartItemKey(item.prato.id, item.extras) === key
                  ? { ...item, quantidade: item.quantidade + 1 }
                  : item
              ),
            }
          }
          return { cart: [...state.cart, { prato, quantidade: 1, extras }] }
        })
      },

      removeFromCart: (key) => {
        set((state) => ({
          cart: state.cart.filter((item) => cartItemKey(item.prato.id, item.extras) !== key),
        }))
      },

      updateCartQty: (key, qty) => {
        if (qty <= 0) {
          get().removeFromCart(key)
          return
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            cartItemKey(item.prato.id, item.extras) === key
              ? { ...item, quantidade: qty }
              : item
          ),
        }))
      },

      clearCart: () => set({ cart: [] }),

      toggleCardapioDia: (pratoId) => {
        set((state) => ({
          cardapioDia: state.cardapioDia.includes(pratoId)
            ? state.cardapioDia.filter((id) => id !== pratoId)
            : [...state.cardapioDia, pratoId],
        }))
      },

      updateSettings: (settings) => set({ settings }),
    }),
    {
      name: 'cantinho-app-store',
      storage: createJSONStorage(() => dateAwareStorage),
      partialize: (state) => ({
        user: state.user,
        pratos: state.pratos,
        pedidos: state.pedidos,
        mensalistas: state.mensalistas,
        cart: state.cart,
        cardapioDia: state.cardapioDia,
        settings: state.settings,
        storeVersion: state.storeVersion,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState>
        const merged = revivePersistedState({
          ...current,
          ...p,
        } as AppState)

        if (!p.storeVersion || p.storeVersion < 2) {
          merged.cardapioDia = []
        }
        merged.storeVersion = 2

        return merged
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

export function useCartTotal() {
  return useAppStore((state) => calcCartTotal(state.cart))
}

export function useCartCount() {
  return useAppStore((state) => calcCartCount(state.cart))
}

export function useApp() {
  const store = useAppStore()
  return {
    user: store.user,
    login: store.login,
    logout: store.logout,
    pratos: store.pratos,
    addPrato: store.addPrato,
    updatePrato: store.updatePrato,
    deletePrato: store.deletePrato,
    pedidos: store.pedidos,
    addPedido: store.addPedido,
    updatePedidoStatus: store.updatePedidoStatus,
    mensalistas: store.mensalistas,
    addMensalista: store.addMensalista,
    updateMensalista: store.updateMensalista,
    deleteMensalista: store.deleteMensalista,
    cart: store.cart,
    addToCart: store.addToCart,
    removeFromCart: store.removeFromCart,
    updateCartQty: store.updateCartQty,
    clearCart: store.clearCart,
    cartTotal: calcCartTotal(store.cart),
    cartCount: calcCartCount(store.cart),
    cardapioDia: store.cardapioDia,
    toggleCardapioDia: store.toggleCardapioDia,
    settings: store.settings,
    updateSettings: store.updateSettings,
    hasHydrated: store._hasHydrated,
  }
}

export const extras = extrasIniciais
export { orderItemTotal }
