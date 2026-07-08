'use client'

import { AtSign, CalendarDays, Clock, MapPin, Phone } from 'lucide-react'
import { SafeImage } from '@/components/safe-image'
import { getCategoryLabel } from '@/components/category-badge'
import {
  formatMenuDate,
  formatMenuFooterDate,
  getRestaurantInitials,
  MENU_ART_FORMATS,
  type MenuArtFormat,
} from '@/lib/menu-art'
import type { RestaurantSettings } from '@/lib/store/settings'
import type { Prato } from '@/lib/types'
import { cn } from '@/lib/utils'

interface MenuArtPreviewProps {
  pratos: Prato[]
  format: MenuArtFormat
  settings: RestaurantSettings
  date?: Date
  innerRef?: React.Ref<HTMLDivElement>
  className?: string
}

function DishRow({ prato, compact }: { prato: Prato; compact?: boolean }) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[#e8dfd4] bg-white shadow-[0_2px_12px_rgba(61,31,18,0.06)]',
        compact ? 'p-2' : 'p-3'
      )}
    >
      <div className={cn('flex gap-3', compact && 'gap-2')}>
        <div
          className={cn(
            'relative flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-[#e8dfd4]',
            compact ? 'h-12 w-12' : 'h-16 w-16'
          )}
        >
          <SafeImage
            src={prato.imagem || '/placeholder.svg'}
            alt={prato.nome}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <p
              className={cn(
                'font-semibold leading-tight text-[#2c1810]',
                compact ? 'text-[11px]' : 'text-sm'
              )}
            >
              {prato.nome}
            </p>
            <span
              className={cn(
                'flex-shrink-0 font-bold text-[#b45309] font-mono',
                compact ? 'text-xs' : 'text-sm'
              )}
            >
              R$ {prato.preco.toFixed(2)}
            </span>
          </div>
          {!compact && prato.descricao && (
            <p className="line-clamp-2 text-[10px] leading-relaxed text-[#7a6558]">
              {prato.descricao}
            </p>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#92400e]">
              {getCategoryLabel(prato.categoria)}
            </span>
            {prato.acompanhamentos.length > 0 && !compact && (
              <span className="text-[9px] text-[#9a8475]">
                + {prato.acompanhamentos.slice(0, 2).join(', ')}
                {prato.acompanhamentos.length > 2 ? '…' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MenuArtPreview({
  pratos,
  format,
  settings,
  date = new Date(),
  innerRef,
  className,
}: MenuArtPreviewProps) {
  const config = MENU_ART_FORMATS[format]
  const initials = getRestaurantInitials(settings.nome)
  const isPrint = format === 'print'
  const gridCols =
    config.cols === 1 ? 'grid-cols-1' : config.cols === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div
      ref={innerRef}
      className={cn(
        'relative w-full overflow-hidden select-none shadow-2xl shadow-[#3d1f12]/20',
        config.ratio,
        !isPrint && 'rounded-[1.75rem]',
        className
      )}
      style={{ maxWidth: config.maxW }}
    >
      {/* Fundo texturizado */}
      <div className="absolute inset-0 bg-[#faf6f0]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(180,83,9,0.08) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(124,45,18,0.06) 0%, transparent 40%)',
        }}
      />

      <div className="relative flex h-full min-h-0 flex-col">
        {/* Cabeçalho premium */}
        <div className="relative flex-shrink-0 overflow-hidden px-6 pb-5 pt-6 text-white">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, #2c1810 0%, #5c2a14 42%, #9a3412 78%, #c2410c 100%)',
            }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclSpaceOnUseSIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIj48cGF0aCBkPSJNMzAgMGgxdjYwaC0xek0wIDMwaDYwdjFIMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-60" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-sm font-bold backdrop-blur-sm">
                  {initials}
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    Restaurante
                  </p>
                  <p className="text-base font-bold leading-tight">{settings.nome}</p>
                </div>
              </div>
              <div className="hidden rounded-full border border-[#fbbf24]/40 bg-[#fbbf24]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#fde68a] sm:block">
                Especial do dia
              </div>
            </div>

            <div className="mb-3 h-px w-full bg-gradient-to-r from-transparent via-[#fbbf24]/70 to-transparent" />

            <h3
              className={cn(
                'font-bold leading-none tracking-tight text-white',
                isPrint ? 'text-3xl' : 'text-2xl'
              )}
            >
              Cardápio do Dia
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/75">
              <span className="inline-flex items-center gap-1.5 capitalize">
                <CalendarDays size={12} />
                {formatMenuDate(date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} />
                {settings.horario}
              </span>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className={cn('relative flex-1 overflow-hidden', isPrint ? 'p-6' : 'p-4')}>
          {pratos.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-[#9a8475]">
              Nenhum prato selecionado
            </div>
          ) : (
            <div className={cn('grid gap-3', gridCols, !isPrint && 'content-start')}>
              {pratos.map((prato) => (
                <DishRow key={prato.id} prato={prato} compact={format === 'story'} />
              ))}
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="relative flex-shrink-0 border-t border-[#e8dfd4] bg-white/90 px-5 py-4 backdrop-blur-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-[#5c4030]">
              Comida caseira feita com carinho · {pratos.length}{' '}
              {pratos.length === 1 ? 'opção' : 'opções'}
            </p>
            <span className="rounded-lg bg-[#9a3412] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Peça já
            </span>
          </div>

          <div className="grid gap-1.5 text-[10px] text-[#7a6558]">
            {settings.endereco && (
              <span className="inline-flex items-start gap-1.5">
                <MapPin size={11} className="mt-0.5 flex-shrink-0" />
                {settings.endereco}
              </span>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {settings.telefone && (
                <span className="inline-flex items-center gap-1">
                  <Phone size={11} />
                  {settings.telefone}
                </span>
              )}
              {settings.whatsapp && (
                <span className="inline-flex items-center gap-1">WhatsApp: {settings.whatsapp}</span>
              )}
              {settings.instagram && (
                <span className="inline-flex items-center gap-1">
                  <AtSign size={11} />
                  {settings.instagram}
                </span>
              )}
            </div>
          </div>

          {isPrint && (
            <p className="mt-3 border-t border-[#efe6dc] pt-2 text-[9px] text-[#a89588]">
              {settings.nome} · Cardápio sujeito a alterações · Gerado em{' '}
              {formatMenuFooterDate(date)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
