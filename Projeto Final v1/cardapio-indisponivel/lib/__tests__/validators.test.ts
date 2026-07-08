import { describe, expect, it } from 'vitest'
import {
  loginCredentialsSchema,
  loginGuestSchema,
  registerMensalistaSchema,
} from '@/lib/validators'

describe('validators', () => {
  it('valida login de visitante', () => {
    expect(loginGuestSchema.safeParse({ nome: 'João' }).success).toBe(true)
    expect(loginGuestSchema.safeParse({ nome: 'J' }).success).toBe(false)
  })

  it('valida credenciais', () => {
    expect(
      loginCredentialsSchema.safeParse({
        nome: 'Admin',
        email: 'admin@cantinho.com',
        senha: 'admin123',
      }).success
    ).toBe(true)
  })

  it('valida cadastro de mensalista', () => {
    expect(
      registerMensalistaSchema.safeParse({
        nome: 'Maria',
        email: 'maria@email.com',
        cpf: '12345678900',
      }).success
    ).toBe(true)
  })
})
