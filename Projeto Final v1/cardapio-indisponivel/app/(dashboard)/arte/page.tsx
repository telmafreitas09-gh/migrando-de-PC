'use client'

import { useRef, useState } from 'react'
import { Download, Share2, MessageCircle, LayoutGrid, CalendarDays, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SafeImage } from '@/components/safe-image'
import { useApp } from '@/lib/app-context'
import { toast } from 'sonner'
import type { Prato } from '@/lib/types'

type ArtType = 'story' | 'feed' | 'whatsapp'

const artConfigs: Record<ArtType, { label: string; icon: React.ReactNode; ratio: string; desc: string; maxW: number }> = {
  story: {
    label: 'Stories',
    icon: <Share2 size={16} />,
    ratio: 'aspect-[9/16]',
    desc: '1080 × 1920 — Instagram/WhatsApp Stories',
    maxW: 300,
  },
  feed: {
    label: 'Feed',
    icon: <LayoutGrid size={16} />,
    ratio: 'aspect-square',
    desc: '1080 × 1080 — Instagram Feed',
    maxW: 460,
  },
  whatsapp: {
    label: 'WhatsApp',
    icon: <MessageCircle size={16} />,
    ratio: 'aspect-[4/3]',
    desc: '1280 × 960 — WhatsApp Status / Divulgação',
    maxW: 520,
  },
}

function formatDate(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })
}

// Peça de arte com TODAS as refeições selecionadas no cardápio do dia
function ArtPreview({
  pratos,
  type,
  innerRef,
}: {
  pratos: Prato[]
  type: ArtType
  innerRef?: React.Ref<HTMLDivElement>
}) {
  const config = artConfigs[type]
  const today = new Date()
  const cols = type === 'story' ? 'grid-cols-1' : 'grid-cols-2'

  return (
    <div
      ref={innerRef}
      className={`relative ${config.ratio} w-full rounded-2xl overflow-hidden bg-foreground select-none flex flex-col`}
      style={{ maxWidth: config.maxW }}
    >
      {/* Cabeçalho */}
      <div className="bg-primary text-primary-foreground px-5 pt-5 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="bg-white/20 rounded-full px-3 py-1">
            <span className="text-white text-[10px] font-bold tracking-wide">CANTINHO DO SABOR</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center">
            <span className="text-white text-xs font-bold">CS</span>
          </div>
        </div>
        <h3 className="text-white font-bold text-2xl leading-tight mt-3 text-balance">Cardápio do Dia</h3>
        <div className="flex items-center gap-1.5 mt-1 text-white/80 text-[11px]">
          <CalendarDays size={12} />
          <span className="capitalize">{formatDate(today)}</span>
        </div>
      </div>

      {/* Lista de refeições */}
      <div className="flex-1 overflow-hidden bg-background p-4">
        <div className={`grid ${cols} gap-2.5 h-full content-start`}>
          {pratos.map((prato) => (
            <div
              key={prato.id}
              className="flex items-center gap-2.5 bg-card rounded-xl p-2 border border-border"
            >
              <SafeImage
                src={prato.imagem || '/placeholder.svg'}
                alt={prato.nome}
                width={44}
                height={44}
                className="w-11 h-11 rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-semibold text-xs leading-tight truncate">{prato.nome}</p>
                <p className="text-primary font-bold text-sm font-mono">R$ {prato.preco.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé */}
      <div className="bg-primary text-primary-foreground px-5 py-3 flex items-center justify-between flex-shrink-0">
        <span className="text-white text-[11px] font-medium">Comida caseira feita com amor</span>
        <div className="bg-white/20 rounded-lg px-2.5 py-1">
          <span className="text-white text-[11px] font-bold">PEÇA JÁ!</span>
        </div>
      </div>
    </div>
  )
}

export default function ArtePage() {
  const { pratos, cardapioDia } = useApp()
  const [artType, setArtType] = useState<ArtType>('feed')
  const printRef = useRef<HTMLDivElement>(null)

  // Todas as refeições selecionadas na página de Pratos (cardápio do dia)
  const cardapioPratos = pratos.filter((p) => cardapioDia.includes(p.id) && p.disponivel)

  async function handleDownload() {
    if (!printRef.current) return
    toast.info('Gerando arte...')
    try {
      // @ts-ignore — carregado dinamicamente
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(printRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      })
      const link = document.createElement('a')
      link.download = `arte-cardapio-${artType}-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('Arte salva com sucesso!')
    } catch {
      toast.error('Erro ao gerar a arte. Tente novamente.')
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Arte</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Gere uma arte com todas as refeições do cardápio do dia para divulgação
        </p>
      </div>

      {cardapioPratos.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 text-muted-foreground">
          <UtensilsCrossed size={40} className="mb-4 opacity-40" />
          <p className="font-medium">Nenhuma refeição selecionada no cardápio.</p>
          <p className="mt-2 text-sm max-w-sm text-balance">
            Vá em <strong>Pratos</strong> e marque o checkbox &quot;Cardápio do dia&quot; nas refeições
            que devem aparecer na arte.
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Controles */}
          <div className="lg:w-72 flex-shrink-0 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4">
              <h2 className="font-semibold text-sm mb-1">Formato da arte</h2>
              <p className="text-xs text-muted-foreground mb-3">{artConfigs[artType].desc}</p>
              <div className="space-y-2">
                {(Object.entries(artConfigs) as [ArtType, typeof artConfigs[ArtType]][]).map(
                  ([type, cfg]) => (
                    <button
                      key={type}
                      onClick={() => setArtType(type)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                        artType === type
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{cardapioPratos.length}</strong>{' '}
                {cardapioPratos.length === 1 ? 'refeição' : 'refeições'} no cardápio de hoje
              </p>
            </div>

            <Button className="w-full gap-2" onClick={handleDownload}>
              <Download size={16} />
              Baixar Arte
            </Button>
          </div>

          {/* Preview */}
          <div className="flex-1 flex justify-center">
            <ArtPreview pratos={cardapioPratos} type={artType} innerRef={printRef} />
          </div>
        </div>
      )}
    </div>
  )
}
