'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { useApp } from '@/lib/app-context'
import { HOME_BY_ROLE, isRouteAllowed } from '@/lib/routes'

export { HOME_BY_ROLE }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, hasHydrated } = useApp()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!hasHydrated) return

    if (user === null) {
      router.replace('/login')
      return
    }

    if (!isRouteAllowed(user.role, pathname)) {
      router.replace(HOME_BY_ROLE[user.role])
    }
  }, [user, router, pathname, hasHydrated])

  if (!hasHydrated || user === null) return null

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-end border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:px-6">
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-auto px-0">
          {children}
        </main>
      </div>
    </div>
  )
}
