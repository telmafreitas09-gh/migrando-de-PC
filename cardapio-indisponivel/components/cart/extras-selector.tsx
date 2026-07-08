import type { Extra } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ExtrasSelectorProps {
  extras: Extra[]
  selected: Extra[]
  onToggle: (extra: Extra) => void
  className?: string
}

export function ExtrasSelector({ extras, selected, onToggle, className }: ExtrasSelectorProps) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-muted-foreground mb-1">Extras:</p>
      <div className="flex flex-wrap gap-1.5">
        {extras.map((extra) => {
          const isSelected = selected.some((item) => item.id === extra.id)
          return (
            <button
              key={extra.id}
              type="button"
              onClick={() => onToggle(extra)}
              className={cn(
                'text-xs px-2 py-1 rounded-lg border transition-colors',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              )}
            >
              {extra.nome} +R${extra.preco.toFixed(2)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
