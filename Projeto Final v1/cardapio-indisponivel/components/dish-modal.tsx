'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CategoryBadge, CATEGORIES } from '@/components/category-badge'
import type { Prato, Category } from '@/lib/types'

interface DishModalProps {
  open: boolean
  onClose: () => void
  onSave: (prato: Omit<Prato, 'id'> | Prato) => void
  prato?: Prato | null
}

const empty: Omit<Prato, 'id'> = {
  nome: '',
  descricao: '',
  preco: 0,
  categoria: 'proteina',
  imagem: '',
  acompanhamentos: [],
  disponivel: true,
}

export function DishModal({ open, onClose, onSave, prato }: DishModalProps) {
  const [form, setForm] = useState<Omit<Prato, 'id'> | Prato>(empty)
  const [acompStr, setAcompStr] = useState('')

  useEffect(() => {
    if (prato) {
      setForm(prato)
      setAcompStr(prato.acompanhamentos.join(', '))
    } else {
      setForm(empty)
      setAcompStr('')
    }
  }, [prato, open])

  if (!open) return null

  function handleSave() {
    const acomp = acompStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    onSave({ ...form, acompanhamentos: acomp })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            {prato ? 'Editar Prato' : 'Novo Prato'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <Input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Nome do prato"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Descrição do prato"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Preço (R$)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.preco}
              onChange={(e) => setForm({ ...form, preco: parseFloat(e.target.value) || 0 })}
            />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <select
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value as Category })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL da Imagem</label>
            <Input
              value={form.imagem}
              onChange={(e) => setForm({ ...form, imagem: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Acompanhamentos <span className="text-muted-foreground font-normal">(separados por vírgula)</span>
            </label>
            <Input
              value={acompStr}
              onChange={(e) => setAcompStr(e.target.value)}
              placeholder="Arroz, Feijão, Salada"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="disponivel"
              type="checkbox"
              className="w-4 h-4 accent-primary"
              checked={form.disponivel}
              onChange={(e) => setForm({ ...form, disponivel: e.target.checked })}
            />
            <label htmlFor="disponivel" className="text-sm font-medium">
              Disponível
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.nome || form.preco <= 0}>
            {prato ? 'Salvar Alterações' : 'Criar Prato'}
          </Button>
        </div>
      </div>
    </div>
  )
}
