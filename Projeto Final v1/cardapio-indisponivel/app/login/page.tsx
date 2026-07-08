'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Eye, EyeOff, UserRound, Star, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SafeImage } from '@/components/safe-image'
import { useApp } from '@/lib/app-context'
import { findMensalistaForLogin, MENSALISTA_DEMO_PASSWORD, validateAdminLogin } from '@/lib/auth'
import { HOME_BY_ROLE } from '@/lib/routes'
import {
  loginCredentialsSchema,
  loginGuestSchema,
  registerMensalistaSchema,
} from '@/lib/validators'
import { toast } from 'sonner'

const carouselSlides = [
  {
    title: 'Sabor que conquista',
    subtitle: 'Pratos frescos preparados todos os dias com carinho',
    bg: 'from-amber-900 to-red-900',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  },
  {
    title: 'Cardápio variado',
    subtitle: 'Mais de 48 pratos distribuídos em 6 categorias',
    bg: 'from-orange-900 to-amber-800',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
  },
  {
    title: 'Nossa equipe',
    subtitle: 'Profissionais dedicados a servir com excelência',
    bg: 'from-red-900 to-orange-900',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  },
  {
    title: 'Clientes felizes',
    subtitle: 'Mais de 500 clientes satisfeitos todo mês',
    bg: 'from-rose-900 to-red-800',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
  },
]

type Mode = 'select' | 'guest' | 'mensalista' | 'admin' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const { login, addMensalista, mensalistas } = useApp()
  const [mode, setMode] = useState<Mode>('select')
  const [slide, setSlide] = useState(0)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ nome: '', email: '', senha: '', cpf: '', telefone: '' })
  const [paused, setPaused] = useState(false)
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (paused) return undefined
    const timer = setInterval(() => setSlide((current) => (current + 1) % carouselSlides.length), 6000)
    return () => clearInterval(timer)
  }, [paused])

  function goToSlide(index: number) {
    setSlide(index)
    setPaused(true)
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = setTimeout(() => setPaused(false), 8000)
  }

  function handleGuestLogin() {
    const parsed = loginGuestSchema.safeParse({ nome: form.nome })
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Dados inválidos')
      return
    }
    login({ nome: parsed.data.nome, role: 'guest' })
    toast.success(`Bem-vindo, ${parsed.data.nome}!`)
    router.push(HOME_BY_ROLE.guest)
  }

  function handleMensalistaLogin() {
    const parsed = loginCredentialsSchema.safeParse(form)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Dados inválidos')
      return
    }

    const mensalista = findMensalistaForLogin(parsed.data.email, parsed.data.senha, mensalistas)
    if (!mensalista) {
      toast.error('E-mail ou senha inválidos')
      return
    }
    if (mensalista.status !== 'ativo') {
      toast.error('Mensalista inativo. Entre em contato com o restaurante.')
      return
    }

    login({
      nome: parsed.data.nome || mensalista.nome,
      role: 'mensalista',
      email: mensalista.email,
      mensalistaId: mensalista.id,
    })
    toast.success(`Bem-vindo, ${mensalista.nome}!`)
    router.push(HOME_BY_ROLE.mensalista)
  }

  function handleAdminLogin() {
    const parsed = loginCredentialsSchema.safeParse(form)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Dados inválidos')
      return
    }
    if (!validateAdminLogin(parsed.data.email, parsed.data.senha)) {
      toast.error('Credenciais de administrador inválidas')
      return
    }

    login({
      nome: parsed.data.nome,
      role: 'admin',
      email: parsed.data.email,
    })
    toast.success(`Bem-vindo, ${parsed.data.nome}!`)
    router.push(HOME_BY_ROLE.admin)
  }

  function handleRegister() {
    const parsed = registerMensalistaSchema.safeParse(form)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Dados inválidos')
      return
    }

    const emailExists = mensalistas.some(
      (m) => m.email.toLowerCase() === parsed.data.email.toLowerCase()
    )
    if (emailExists) {
      toast.error('Este e-mail já está cadastrado')
      return
    }

    addMensalista({
      nome: parsed.data.nome,
      email: parsed.data.email,
      cpf: parsed.data.cpf,
      telefone: parsed.data.telefone ?? '',
      taxaMensal: 19.9,
      status: 'ativo',
      registroStatus: 'pendente',
    })

    login({
      nome: parsed.data.nome,
      role: 'mensalista',
      email: parsed.data.email,
    })

    toast.success(`Cadastro realizado! Senha demo: ${MENSALISTA_DEMO_PASSWORD}`)
    router.push(HOME_BY_ROLE.mensalista)
  }

  const current = carouselSlides[slide]

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex relative flex-1 overflow-hidden">
        <SafeImage src={current.image} alt={current.title} fill priority className="transition-all duration-700" />
        <div className={`absolute inset-0 bg-gradient-to-br ${current.bg} opacity-70`} />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="absolute top-10 left-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-bold text-xl text-white shadow-lg">
              CS
            </div>
            <div>
              <p className="font-bold text-white leading-tight">Cantinho do Sabor</p>
              <p className="text-white/70 text-xs">Cardápio Digital</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-balance mb-3">{current.title}</h1>
            <p className="text-white/80 text-lg">{current.subtitle}</p>
          </div>

          <div className="flex gap-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === slide ? 'bg-white w-8' : 'bg-white/40 w-4'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => goToSlide((slide - 1 + carouselSlides.length) % carouselSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => goToSlide((slide + 1) % carouselSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex-1 lg:max-w-md flex flex-col items-center justify-center p-8 bg-background">
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-bold text-xl text-primary-foreground">
            CS
          </div>
          <div>
            <p className="font-bold text-foreground leading-tight">Cantinho do Sabor</p>
            <p className="text-muted-foreground text-xs">Cardápio Digital</p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          {mode === 'select' && (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">Bem-vindo!</h2>
                <p className="text-muted-foreground text-sm mt-1">Como deseja acessar?</p>
              </div>

              {[
                { id: 'guest' as const, title: 'Visitante', desc: 'Apenas ver o cardápio do dia', icon: UserRound },
                { id: 'mensalista' as const, title: 'Mensalista', desc: 'Cardápio do dia e minhas despesas', icon: Star },
                { id: 'admin' as const, title: 'Administrador', desc: 'Gestão completa do sistema', icon: Shield },
              ].map(({ id, title, desc, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-muted-foreground text-xs">{desc}</p>
                  </div>
                </button>
              ))}

              <p className="text-center text-sm text-muted-foreground pt-2">
                Novo por aqui?{' '}
                <button type="button" onClick={() => setMode('register')} className="text-primary font-semibold hover:underline">
                  Cadastre-se
                </button>
              </p>
            </div>
          )}

          {(mode === 'guest' || mode === 'mensalista' || mode === 'admin') && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
              >
                <ChevronLeft size={16} />
                Voltar
              </button>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">
                  {mode === 'guest' && 'Entrar como Visitante'}
                  {mode === 'mensalista' && 'Entrar como Mensalista'}
                  {mode === 'admin' && 'Entrar como Admin'}
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <Input
                  placeholder="Seu nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>

              {(mode === 'mensalista' || mode === 'admin') && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">E-mail</label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Senha</label>
                    <Input
                      type={showPass ? 'text' : 'password'}
                      className="pr-10"
                      placeholder="••••••••"
                      value={form.senha}
                      onChange={(e) => setForm({ ...form, senha: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {mode === 'admin' && (
                    <p className="text-xs text-muted-foreground">
                      Demo: admin@cantinho.com / admin123
                    </p>
                  )}
                  {mode === 'mensalista' && (
                    <p className="text-xs text-muted-foreground">
                      Demo: use o e-mail cadastrado / {MENSALISTA_DEMO_PASSWORD}
                    </p>
                  )}
                </>
              )}

              <Button
                className="w-full mt-2"
                onClick={() => {
                  if (mode === 'guest') handleGuestLogin()
                  else if (mode === 'mensalista') handleMensalistaLogin()
                  else handleAdminLogin()
                }}
              >
                Entrar
              </Button>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
              >
                <ChevronLeft size={16} />
                Voltar
              </button>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Cadastro Mensalista</h2>
                <p className="text-muted-foreground text-sm mt-1">Taxa mensal: R$ 19,90</p>
              </div>

              {[
                { label: 'Nome completo *', key: 'nome', placeholder: 'Seu nome completo' },
                { label: 'E-mail *', key: 'email', placeholder: 'seu@email.com' },
                { label: 'CPF *', key: 'cpf', placeholder: '000.000.000-00' },
                { label: 'Telefone', key: 'telefone', placeholder: '(00) 00000-0000' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <Input
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}

              <Button className="w-full mt-2" onClick={handleRegister}>
                Cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
