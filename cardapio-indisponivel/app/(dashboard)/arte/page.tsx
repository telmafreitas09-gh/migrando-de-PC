'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Download, Share2, MessageCircle, LayoutGrid, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MenuArtPreview } from '@/components/menu-art/menu-art-preview'
import { useApp } from '@/lib/app-context'
import { MENU_ART_FORMATS, type MenuArtFormat } from '@/lib/menu-art'
import { toast } from 'sonner'

const artIcons: Record<MenuArtFormat, React.ReactNode> = {
  story: <Share2 size={16} />,
  feed: <LayoutGrid size={16} />,
  whatsapp: <MessageCircle size={16} />,
  print: <LayoutGrid size={16} />,
}

function ArtePageContent() {
  const searchParams = useSearchParams()
  const { pratos, cardapioDia, settings } = useApp()
  const [artType, setArtType] = useState<MenuArtFormat>('feed')
  const printRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const cardapioPratos = pratos.filter((p) => cardapioDia.includes(p.id) && p.disponivel)
  const gerado = searchParams.get('gerado') === '1'

  useEffect(() => {
    if (!gerado || cardapioPratos.length === 0) return
    toast.success(`Arte pronta com ${cardapioPratos.length} prato(s) do cardápio de hoje!`)
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [gerado, cardapioPratos.length])

  async function handleDownload() {
    if (!printRef.current) return
    toast.info('Gerando arte...')
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(printRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#faf6f0',
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

  const socialFormats = (['story', 'feed', 'whatsapp'] as const)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Arte</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Gere artes profissionais para divulgar o cardápio do dia nas redes sociais
        </p>
      </div>

      {cardapioPratos.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 text-muted-foreground">
          <Sparkles size={40} className="mb-4 opacity-40" />
          <p className="font-medium">Nenhuma refeição selecionada no cardápio.</p>
          <p className="mt-2 text-sm max-w-sm text-balance">
            Vá em <strong>Pratos</strong>, marque o checkbox &quot;Cardápio do dia&quot; e clique em{' '}
            <strong>Gerar Arte</strong>.
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-72 flex-shrink-0 space-y-4">
            {gerado && (
              <div className="rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3 text-sm text-primary">
                <p className="font-semibold">Arte gerada a partir de Pratos</p>
                <p className="mt-1 text-xs text-primary/80">
                  {cardapioPratos.length} refeição(ões) pronta(s) para download.
                </p>
              </div>
            )}

            <div className="bg-card border border-border rounded-2xl p-4">
              <h2 className="font-semibold text-sm mb-1">Formato da arte</h2>
              <p className="text-xs text-muted-foreground mb-3">{MENU_ART_FORMATS[artType].desc}</p>
              <div className="space-y-2">
                {socialFormats.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setArtType(type)}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                      artType === type
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {artIcons[type]}
                    {MENU_ART_FORMATS[type].label}
                  </button>
                ))}
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

          <div ref={previewRef} className="flex-1 flex justify-center">
            <MenuArtPreview
              pratos={cardapioPratos}
              format={artType}
              settings={settings}
              innerRef={printRef}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function ArtePage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Carregando arte...</div>}>
      <ArtePageContent />
    </Suspense>
  )
}
