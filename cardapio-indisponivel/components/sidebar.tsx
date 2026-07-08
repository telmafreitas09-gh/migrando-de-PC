'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  UtensilsCrossed,
  BookOpen,
  ShoppingBag,
  TrendingUp,
  Users,
  Settings,
  Image,
  LogOut,
  ChefHat,
  Menu,
  X,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/app-context'
import { HOME_BY_ROLE, ROLE_LABELS } from '@/lib/routes'
import { useState } from 'react'

type NavItem = { href: string; label: string; icon: React.ElementType; roles: string[] }

const navItems: NavItem[] = [
  { href: '/pratos',           label: 'Pratos',          icon: UtensilsCrossed, roles: ['admin'] },
  { href: '/cardapio',         label: 'Cardápio do Dia', icon: BookOpen,        roles: ['guest', 'admin'] },
  { href: '/pedidos',          label: 'Pedidos',         icon: ShoppingBag,     roles: ['admin'] },
  { href: '/vendas',           label: 'Vendas',          icon: TrendingUp,      roles: ['admin'] },
  { href: '/mensalistas',      label: 'Mensalistas',     icon: Users,           roles: ['admin'] },
  { href: '/minhas-despesas',  label: 'Minhas Despesas', icon: TrendingUp,      roles: ['mensalista'] },
  { href: '/cardapio-dia',     label: 'Cardápio do Dia', icon: BookOpen,        roles: ['mensalista'] },
  { href: '/arte',             label: 'Arte',            icon: Image,           roles: ['admin'] },
  { href: '/configuracoes',    label: 'Configurações',   icon: Settings,        roles: ['admin'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)

  const homeHref = user ? HOME_BY_ROLE[user.role] : '/cardapio'

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link
        href={homeHref}
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-3 px-5 py-6 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex-shrink-0">
          CS
        </div>
        <div>
          <p className="font-bold text-sidebar-foreground leading-tight text-sm">Cantinho</p>
          <p className="font-bold text-sidebar-foreground leading-tight text-sm">do Sabor</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.filter((item) => item.roles.includes(user?.role ?? 'guest')).map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-5 pt-3 border-t border-sidebar-border mt-3">
        <Link
          href="/privacidade"
          onClick={() => setMobileOpen(false)}
          className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Shield size={14} />
          Privacidade (LGPD)
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary flex-shrink-0">
            <ChefHat size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground text-xs font-semibold truncate">
              {user?.nome ?? 'Visitante'}
            </p>
            <p className="text-sidebar-foreground/50 text-xs capitalize">
              {ROLE_LABELS[user?.role ?? 'guest']}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-sidebar-foreground/50 hover:text-primary transition-colors"
            aria-label="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-sidebar min-h-screen flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-sidebar text-sidebar-foreground p-2 rounded-xl shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 bottom-0 z-40 w-56 bg-sidebar transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
