export type UserRole = 'guest' | 'mensalista' | 'admin'

export interface User {
  nome: string
  role: UserRole
  email?: string
  mensalistaId?: string
}

export type Category =
  | 'proteina'
  | 'carboidrato'
  | 'graos'
  | 'salada'
  | 'bebida'
  | 'sobremesa'

export type OrderStatus = 'novo' | 'preparo' | 'pronto' | 'entregue'
export type ClientType = 'avulso' | 'mensalista'
export type ModoRecebimento = 'entrega' | 'retirada' | 'no_local'
export type FormaPagamento = 'pix' | 'debito' | 'credito' | 'mensalista'
export type MensalistaStatus = 'ativo' | 'inativo'
export type RegistroStatus = 'pendente' | 'confirmado'

export interface Extra {
  id: string
  nome: string
  preco: number
}

export interface Prato {
  id: string
  nome: string
  descricao: string
  preco: number
  categoria: Category
  imagem: string
  acompanhamentos: string[]
  disponivel: boolean
}

export interface CartItem {
  prato: Prato
  quantidade: number
  extras: Extra[]
  nota?: string
}

export interface OrderItem {
  prato: Prato
  quantidade: number
  extras: Extra[]
  nota?: string
}

export interface Pedido {
  id: string
  numero: number
  items: OrderItem[]
  status: OrderStatus
  tipo: ClientType
  clienteNome?: string
  total: number
  criadoEm: Date
  modoRecebimento: ModoRecebimento
  enderecoEntrega?: string
  formaPagamento: FormaPagamento
}

export interface CheckoutData {
  modoRecebimento: ModoRecebimento
  enderecoEntrega?: string
  formaPagamento: FormaPagamento
}

export interface Mensalista {
  id: string
  nome: string
  cpf: string
  email: string
  telefone: string
  taxaMensal: number
  status: MensalistaStatus
  registroStatus: RegistroStatus
  criadoEm: Date
  totalGasto: number
}

export interface Venda {
  id: string
  data: Date
  pratoNome: string
  quantidade: number
  total: number
  tipo: ClientType
}

export interface ReceitaSemanal {
  dia: string
  avulso: number
  mensalista: number
}
