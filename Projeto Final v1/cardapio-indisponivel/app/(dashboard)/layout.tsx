'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
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
      <main className="flex-1 overflow-auto min-w-0 pt-16 lg:pt-0 px-0">
        {children}
      </main>
    </div>
  )
}
