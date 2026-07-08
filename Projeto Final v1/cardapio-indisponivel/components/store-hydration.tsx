'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store/app-store'

export function StoreHydration({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAppStore((state) => state._hasHydrated)
  const setHasHydrated = useAppStore((state) => state.setHasHydrated)

  useEffect(() => {
    useAppStore.persist.rehydrate()
    setHasHydrated(true)
  }, [setHasHydrated])

  if (!hasHydrated) return null

  return <>{children}</>
}
