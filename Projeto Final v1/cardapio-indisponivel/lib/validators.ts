import { z } from 'zod'

export const loginGuestSchema = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome'),
})

export const loginCredentialsSchema = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome'),
  email: z.string().trim().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const registerMensalistaSchema = z.object({
  nome: z.string().trim().min(2, 'Nome é obrigatório'),
  email: z.string().trim().email('E-mail inválido'),
  cpf: z.string().trim().min(11, 'CPF inválido'),
  telefone: z.string().trim().optional(),
})

export const pratoSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
  descricao: z.string(),
  preco: z.number().positive('Preço deve ser maior que zero'),
  categoria: z.enum(['proteina', 'carboidrato', 'graos', 'salada', 'bebida', 'sobremesa']),
  imagem: z.string(),
  acompanhamentos: z.array(z.string()),
  disponivel: z.boolean(),
})

export type LoginGuestInput = z.infer<typeof loginGuestSchema>
export type LoginCredentialsInput = z.infer<typeof loginCredentialsSchema>
export type RegisterMensalistaInput = z.infer<typeof registerMensalistaSchema>
