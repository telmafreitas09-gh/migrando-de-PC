import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'

const categoryConfig: Record<Category, { label: string; className: string }> = {
  proteina: { label: 'Proteína', className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' },
  carboidrato: { label: 'Carboidrato', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  graos: { label: 'Grãos', className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
  salada: { label: 'Salada', className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
  bebida: { label: 'Bebida', className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  sobremesa: { label: 'Sobremesa', className: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300' },
}

export function CategoryBadge({
  category,
  className,
}: {
  category: Category
  className?: string
}) {
  const config = categoryConfig[category]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}

export function getCategoryLabel(category: Category) {
  return categoryConfig[category]?.label ?? category
}

export const CATEGORIES = Object.entries(categoryConfig).map(([value, { label }]) => ({
  value: value as Category,
  label,
}))
