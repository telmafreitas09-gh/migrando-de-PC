'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Sheet({ open, onOpenChange, title, children, footer, className }: SheetProps) {
  if (!open) return null

  return (
    <>
      <button
        type="button"
        aria-label="Fechar painel"
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-card shadow-xl',
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="font-semibold">{title}</div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="border-t border-border p-5">{footer}</div>}
      </div>
    </>
  )
}
