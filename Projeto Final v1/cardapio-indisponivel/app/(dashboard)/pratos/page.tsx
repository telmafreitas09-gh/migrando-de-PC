'use client'

import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight, CalendarDays } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SafeImage } from '@/components/safe-image'
import { CategoryBadge, CATEGORIES } from '@/components/category-badge'
import { DishModal } from '@/components/dish-modal'
import { useApp } from '@/lib/app-context'
import { toast } from 'sonner'
import type { Prato, Category } from '@/lib/types'

export default function PratosPage() {
  const { pratos, addPrato, updatePrato, deletePrato, cardapioDia, toggleCardapioDia, user } = useApp()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<Category | 'todas'>('todas')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Prato | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const isAdmin = user?.role === 'admin'

  const filtered = pratos.filter((p) => {
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'todas' || p.categoria === catFilter
    return matchSearch && matchCat
  })

  function handleSave(data: Omit<Prato, 'id'> | Prato) {
    if ('id' in data) {
      updatePrato(data)
      toast.success('Prato atualizado!')
    } else {
      addPrato(data)
      toast.success('Prato criado!')
    }
  }

  function handleDelete(id: string) {
    deletePrato(id)
    setDeleteConfirm(null)
    toast.success('Prato removido.')
  }

  function toggleDisponivel(prato: Prato) {
    updatePrato({ ...prato, disponivel: !prato.disponivel })
    toast.info(prato.disponivel ? 'Prato marcado como indisponível' : 'Prato disponibilizado')
  }

  function handleToggleCardapio(prato: Prato) {
    const noCardapio = cardapioDia.includes(prato.id)
    toggleCardapioDia(prato.id)
    toast.success(
      noCardapio
        ? `"${prato.nome}" removido do cardápio do dia`
        : `"${prato.nome}" adicionado ao cardápio do dia`
    )
  }

  const cardapioCount = pratos.filter((p) => cardapioDia.includes(p.id)).length

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Pratos</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {pratos.length} pratos cadastrados
            {isAdmin && cardapioCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-primary font-medium">
                · <CalendarDays size={13} /> {cardapioCount} no cardápio de hoje
              </span>
            )}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => { setEditing(null); setModalOpen(true) }} className="gap-2">
            <Plus size={16} />
            Novo Prato
          </Button>
        )}
      </div>

      {/* Admin info banner */}
      {isAdmin && (
        <div className="mb-6 flex items-start gap-3 bg-primary/8 border border-primary/20 rounded-2xl px-4 py-3 text-sm text-primary">
          <CalendarDays size={16} className="mt-0.5 flex-shrink-0" />
          <span>
            Use o checkbox <strong>Cardápio do dia</strong> em cada prato para compor o menu de hoje. Os pratos selecionados aparecem na página Cardápio do Dia.
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar prato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCatFilter('todas')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              catFilter === 'todas'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCatFilter(c.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                catFilter === c.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Nenhum prato encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((prato) => {
            const noCardapio = cardapioDia.includes(prato.id)
            return (
              <div
                key={prato.id}
                className={`bg-card rounded-2xl overflow-hidden border flex flex-col transition-all ${
                  noCardapio ? 'border-primary shadow-sm shadow-primary/20' : 'border-border'
                } ${!prato.disponivel ? 'opacity-60' : ''}`}
              >
                <div className="relative h-40 bg-muted overflow-hidden">
                  {prato.imagem ? (
                    <SafeImage src={prato.imagem} alt={prato.nome} fill />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl">
                      🍽
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <CategoryBadge category={prato.categoria} />
                  </div>
                  {noCardapio && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CalendarDays size={10} />
                      Hoje
                    </div>
                  )}
                  {!prato.disponivel && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <span className="text-xs font-semibold text-muted-foreground bg-card/80 px-2 py-1 rounded-full">
                        Indisponível
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-sm leading-tight">{prato.nome}</h3>
                  <p className="text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-2 flex-1">
                    {prato.descricao}
                  </p>
                  {prato.acompanhamentos.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      + {prato.acompanhamentos.join(', ')}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-primary text-base font-mono">
                      R$ {prato.preco.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkbox cardápio do dia — somente admin */}
                  {isAdmin && (
                    <label className={`flex items-center gap-2 mt-3 pt-3 border-t border-border cursor-pointer select-none group`}>
                      <div className="relative flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={noCardapio}
                          onChange={() => handleToggleCardapio(prato)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          noCardapio
                            ? 'bg-primary border-primary'
                            : 'border-border group-hover:border-primary/60'
                        }`}>
                          {noCardapio && (
                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none" className="text-primary-foreground">
                              <path d="M1 3.5L3.5 6L8 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-medium transition-colors ${
                        noCardapio ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                      }`}>
                        Cardápio do dia
                      </span>
                    </label>
                  )}

                  {/* Ações — somente admin */}
                  {isAdmin && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                      <button
                        onClick={() => toggleDisponivel(prato)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Alternar disponibilidade"
                      >
                        {prato.disponivel
                          ? <ToggleRight size={20} className="text-primary" />
                          : <ToggleLeft size={20} />
                        }
                      </button>
                      <button
                        onClick={() => { setEditing(prato); setModalOpen(true) }}
                        className="ml-auto text-muted-foreground hover:text-primary transition-colors p-1"
                        aria-label="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(prato.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label="Excluir"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Dish Modal */}
      {isAdmin && (
        <DishModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          prato={editing}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <ConfirmDialog
          open={Boolean(deleteConfirm)}
          title="Excluir prato?"
          description="Essa ação não pode ser desfeita."
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
        />
      )}
    </div>
  )
}
