export interface RestaurantSettings {
  nome: string
  telefone: string
  endereco: string
  horario: string
  instagram: string
  whatsapp: string
}

export const defaultRestaurantSettings: RestaurantSettings = {
  nome: 'Cantinho do Sabor',
  telefone: '(31) 99999-0000',
  endereco: 'Rua das Flores, 123 — Belo Horizonte, MG',
  horario: 'Seg–Sex: 11h30 às 14h30',
  instagram: '@cantinhodosabor',
  whatsapp: '(31) 99999-0000',
}
