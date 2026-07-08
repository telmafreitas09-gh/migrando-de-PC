import type { RestaurantSettings } from '@/lib/store/settings'

export type MenuArtFormat = 'story' | 'feed' | 'whatsapp' | 'print'

export interface MenuArtFormatConfig {
  label: string
  ratio: string
  desc: string
  maxW: number
  cols: 1 | 2 | 3
}

export const MENU_ART_FORMATS: Record<MenuArtFormat, MenuArtFormatConfig> = {
  story: {
    label: 'Stories',
    ratio: 'aspect-[9/16]',
    desc: '1080 × 1920 — Instagram/WhatsApp Stories',
    maxW: 300,
    cols: 1,
  },
  feed: {
    label: 'Feed',
    ratio: 'aspect-square',
    desc: '1080 × 1080 — Instagram Feed',
    maxW: 460,
    cols: 2,
  },
  whatsapp: {
    label: 'WhatsApp',
    ratio: 'aspect-[4/3]',
    desc: '1280 × 960 — WhatsApp Status / Divulgação',
    maxW: 520,
    cols: 2,
  },
  print: {
    label: 'Impressão',
    ratio: 'aspect-auto min-h-[720px]',
    desc: 'Formato A4 / exportação PDF e imagem',
    maxW: 900,
    cols: 3,
  },
}

export function getRestaurantInitials(nome: string) {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function formatMenuDate(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
}

export function formatMenuFooterDate(date: Date) {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getMenuArtContact(settings: RestaurantSettings) {
  return {
    whatsapp: settings.whatsapp,
    telefone: settings.telefone,
    instagram: settings.instagram,
    endereco: settings.endereco,
    horario: settings.horario,
  }
}
