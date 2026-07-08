'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'

interface LgpdRegisterConsentProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function LgpdRegisterConsent({ checked, onChange }: LgpdRegisterConsentProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Shield size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold">Privacidade e proteção de dados (LGPD)</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Coletamos nome, e-mail, CPF e telefone para criar e manter sua conta mensalista,
            além de organizar seus pedidos e despesas. Utilizamos armazenamento local para manter
            sua sessão e preferências no dispositivo. Leia nossa{' '}
            <Link href="/privacidade" className="font-medium text-primary hover:underline">
              Política de Privacidade
            </Link>{' '}
            para saber como seus dados são tratados e quais são seus direitos.
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          Li e aceito a Política de Privacidade e autorizo o tratamento dos meus dados pessoais
          conforme a Lei Geral de Proteção de Dados (LGPD).
        </span>
      </label>
    </div>
  )
}
