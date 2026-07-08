'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Mail, Database, UserCheck, Cookie, FileText } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { HOME_BY_ROLE } from '@/lib/routes'

const sections = [
  {
    icon: FileText,
    title: '1. Introdução',
    content:
      'Esta Política de Privacidade descreve como o Cantinho do Sabor trata os dados pessoais dos usuários do sistema de cardápio digital, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).',
  },
  {
    icon: Database,
    title: '2. Dados que coletamos',
    content:
      'Podemos coletar e processar: nome, e-mail, CPF, telefone, endereço de entrega (quando informado), histórico de pedidos, preferências de uso e dados de sessão necessários ao funcionamento do sistema.',
  },
  {
    icon: Shield,
    title: '3. Finalidade do tratamento',
    content:
      'Os dados são utilizados para autenticação, gestão de pedidos, controle de mensalistas, emissão de relatórios internos, melhoria da experiência do usuário e cumprimento de obrigações legais.',
  },
  {
    icon: Cookie,
    title: '4. Cookies e armazenamento local',
    content:
      'Utilizamos armazenamento local (localStorage) para manter sua sessão, carrinho, preferências de tema e consentimento de privacidade. Esses dados permanecem no seu dispositivo até serem removidos manualmente ou pela aplicação.',
  },
  {
    icon: UserCheck,
    title: '5. Seus direitos',
    content:
      'Você pode solicitar acesso, correção, exclusão, portabilidade ou revogação do consentimento dos seus dados pessoais. Para exercer esses direitos, entre em contato com o restaurante pelos canais indicados abaixo.',
  },
  {
    icon: Mail,
    title: '6. Contato do encarregado',
    content:
      'Para dúvidas sobre privacidade ou solicitações relacionadas à LGPD, entre em contato: admin@cantinho.com · Telefone: (31) 99999-0000 · Endereço: Rua das Flores, 123 — Belo Horizonte, MG.',
  },
]

export default function PrivacidadePage() {
  const { user } = useApp()
  const backHref = user ? HOME_BY_ROLE[user.role] : '/login'
  const backLabel = user ? 'Voltar ao sistema' : 'Voltar'

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10 lg:py-14">
        <div className="mb-8">
          <Link
            href={backHref}
            className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Shield size={22} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Política de Privacidade</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-relaxed text-foreground">
          O Cantinho do Sabor respeita a sua privacidade. Esta página explica de forma clara quais
          dados são tratados, por quê e quais são os seus direitos como titular de dados pessoais.
        </div>

        <div className="space-y-5">
          {sections.map(({ icon: Icon, title, content }) => (
            <section key={title} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex items-center gap-2">
                <Icon size={18} className="text-primary" />
                <h2 className="font-semibold">{title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-3 font-semibold">7. Retenção e segurança</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Os dados são mantidos pelo tempo necessário para as finalidades descritas ou conforme
            exigência legal. Adotamos medidas técnicas e organizacionais para proteger as informações
            contra acesso não autorizado, perda ou alteração indevida. Em ambiente de demonstração,
            os dados podem ser armazenados localmente no navegador do usuário.
          </p>
        </section>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Cantinho do Sabor · Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}
