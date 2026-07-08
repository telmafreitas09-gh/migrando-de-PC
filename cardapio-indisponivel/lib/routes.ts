import type { UserRole } from '@/lib/types'

export const HOME_BY_ROLE: Record<UserRole, string> = {
  guest: '/cardapio',
  mensalista: '/minhas-despesas',
  admin: '/pratos',
}

export const ALLOWED_ROUTES: Record<UserRole, string[]> = {
  guest: ['/cardapio', '/privacidade'],
  mensalista: ['/minhas-despesas', '/cardapio-dia', '/privacidade'],
  admin: ['/pratos', '/cardapio', '/pedidos', '/vendas', '/mensalistas', '/arte', '/configuracoes', '/privacidade'],
}

export const ROLE_LABELS: Record<UserRole, string> = {
  guest: 'Visitante',
  mensalista: 'Mensalista',
  admin: 'Administrador',
}

export function isRouteAllowed(role: UserRole, pathname: string): boolean {
  const allowed = ALLOWED_ROUTES[role] ?? []
  return allowed.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}
