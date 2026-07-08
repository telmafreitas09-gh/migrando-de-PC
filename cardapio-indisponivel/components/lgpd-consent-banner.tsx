'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { hasLgpdConsent, saveLgpdConsent } from '@/lib/lgpd'

export function LgpdConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!hasLgpdConsent()) setVisible(true)
  }, [])

  function accept() {
    saveLgpdConsent()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-2xl sm:flex-row sm:items-center sm:p-5">
        <div className="flex flex-1 items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold">Privacidade e proteção de dados (LGPD)</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Utilizamos cookies e armazenamento local para manter sua sessão, preferências e dados
              de pedidos. Ao continuar, você concorda com nossa{' '}
              <Link href="/privacidade" className="font-medium text-primary hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:flex-shrink-0">
          <Button size="sm" onClick={accept} className="flex-1 sm:flex-none">
            Aceitar
          </Button>
          <Link
            href="/privacidade"
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground sm:flex-none"
          >
            Saiba mais
          </Link>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg p-2 text-muted-foreground hover:text-foreground sm:hidden"
            aria-label="Fechar aviso"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
