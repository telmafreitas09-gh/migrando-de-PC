import type { Mensalista } from '@/lib/types'

export const ADMIN_CREDENTIALS = {
  email: 'admin@cantinho.com',
  password: 'admin123',
} as const

export const MENSALISTA_DEMO_PASSWORD = 'mensalista123'

export function validateAdminLogin(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  )
}

export function findMensalistaForLogin(
  email: string,
  password: string,
  mensalistas: Mensalista[]
): Mensalista | null {
  const mensalista = mensalistas.find(
    (m) => m.email.trim().toLowerCase() === email.trim().toLowerCase()
  )
  if (!mensalista || password !== MENSALISTA_DEMO_PASSWORD) return null
  return mensalista
}
