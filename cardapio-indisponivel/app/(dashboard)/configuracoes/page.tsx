'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor, LogOut, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/app-context'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { RestaurantSettings } from '@/lib/store/settings'

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const { user, logout, settings, updateSettings } = useApp()
  const router = useRouter()
  const [restaurante, setRestaurante] = useState<RestaurantSettings>(settings)

  function handleLogout() {
    logout()
    router.push('/login')
  }

  function handleSave() {
    updateSettings(restaurante)
    toast.success('Configurações salvas!')
  }

  const themeOptions = [
    { value: 'light', label: 'Claro', icon: <Sun size={18} /> },
    { value: 'dark', label: 'Escuro', icon: <Moon size={18} /> },
    { value: 'system', label: 'Sistema', icon: <Monitor size={18} /> },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Gerencie as preferências do sistema</p>
      </div>

      <section className="bg-card border border-border rounded-2xl p-6 mb-5">
        <h2 className="font-semibold mb-4">Aparência</h2>
        <div className="flex gap-3">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border flex-1 transition-all ${
                theme === opt.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40'
              }`}
            >
              {opt.icon}
              <span className="text-xs font-semibold">{opt.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-6 mb-5">
        <h2 className="font-semibold mb-4">Informações do Restaurante</h2>
        <div className="space-y-4">
          {([
            { label: 'Nome do restaurante', key: 'nome' },
            { label: 'Telefone', key: 'telefone' },
            { label: 'Endereço', key: 'endereco' },
            { label: 'Horário de funcionamento', key: 'horario' },
            { label: 'Instagram', key: 'instagram' },
            { label: 'WhatsApp', key: 'whatsapp' },
          ] as const).map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <Input
                value={restaurante[key]}
                onChange={(e) => setRestaurante({ ...restaurante, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <Button className="mt-5 gap-2" onClick={handleSave}>
          <Save size={15} />
          Salvar informações
        </Button>
      </section>

      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Conta</h2>
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
            {user?.nome?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="font-semibold">{user?.nome ?? 'Usuário'}</p>
            <p className="text-sm text-muted-foreground capitalize">{user?.role ?? 'guest'}</p>
          </div>
        </div>
        <Button variant="destructive" className="gap-2 w-full sm:w-auto" onClick={handleLogout}>
          <LogOut size={15} />
          Sair da conta
        </Button>
      </section>
    </div>
  )
}
