'use client'

import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, UserCheck, UserX, X } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/app-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Mensalista, MensalistaStatus, RegistroStatus } from '@/lib/types'

const emptyForm = {
  nome: '', cpf: '', email: '', telefone: '',
  taxaMensal: 19.9,
  status: 'ativo' as MensalistaStatus,
  registroStatus: 'pendente' as RegistroStatus,
}

type MensalistaForm = Omit<Mensalista, 'id' | 'criadoEm' | 'totalGasto'>

function MensalistaModal({
  open, onClose, onSave, mensalista,
}: {
  open: boolean
  onClose: () => void
  onSave: (data: MensalistaForm) => void
  mensalista?: Mensalista | null
}) {
  const [form, setForm] = useState(() => mensalista
    ? { nome: mensalista.nome, cpf: mensalista.cpf, email: mensalista.email, telefone: mensalista.telefone, taxaMensal: mensalista.taxaMensal, status: mensalista.status, registroStatus: mensalista.registroStatus }
    : emptyForm
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-lg">{mensalista ? 'Editar Mensalista' : 'Novo Mensalista'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Nome *', key: 'nome', placeholder: 'Nome completo' },
            { label: 'CPF *', key: 'cpf', placeholder: '000.000.000-00' },
            { label: 'E-mail *', key: 'email', placeholder: 'email@exemplo.com' },
            { label: 'Telefone', key: 'telefone', placeholder: '(00) 00000-0000' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <Input
                placeholder={placeholder}
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as MensalistaStatus })}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Registro</label>
              <select
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                value={form.registroStatus}
                onChange={(e) => setForm({ ...form, registroStatus: e.target.value as RegistroStatus })}
              >
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
          <Button className="flex-1" onClick={() => { onSave(form); onClose() }} disabled={!form.nome || !form.cpf}>
            {mensalista ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function MensalistasPage() {
  const { mensalistas, addMensalista, updateMensalista, deleteMensalista } = useApp()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Mensalista | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = mensalistas.filter(
    (m) =>
      m.nome.toLowerCase().includes(search.toLowerCase()) ||
      m.cpf.includes(search) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  )

  function handleSave(data: MensalistaForm) {
    if (editing) {
      updateMensalista({ ...editing, ...data })
      toast.success('Mensalista atualizado!')
    } else {
      addMensalista(data)
      toast.success('Mensalista cadastrado!')
    }
  }

  function toggleStatus(m: Mensalista) {
    updateMensalista({ ...m, status: m.status === 'ativo' ? 'inativo' : 'ativo' })
    toast.info(m.status === 'ativo' ? 'Mensalista desativado' : 'Mensalista ativado')
  }

  const ativos = mensalistas.filter((m) => m.status === 'ativo').length
  const pendentes = mensalistas.filter((m) => m.registroStatus === 'pendente').length
  const receitaMensal = mensalistas.filter((m) => m.status === 'ativo').reduce((a, m) => a + m.taxaMensal, 0)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Mensalistas</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{mensalistas.length} clientes cadastrados</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true) }} className="gap-2">
          <Plus size={16} />
          Novo Mensalista
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Ativos</p>
          <p className="text-2xl font-bold mt-1">{ativos}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Pendentes</p>
          <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{pendentes}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Receita Mensal</p>
          <p className="text-2xl font-bold mt-1 text-primary font-mono">R$ {receitaMensal.toFixed(2)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por nome, CPF ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Nome</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">CPF</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Contato</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">Registro</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">Total gasto</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-semibold">{m.nome}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell font-mono text-xs">
                    {m.cpf}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden lg:table-cell text-xs">
                    {m.telefone}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      m.status === 'ativo'
                        ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {m.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      m.registroStatus === 'confirmado'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    )}>
                      {m.registroStatus === 'confirmado' ? 'Confirmado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-semibold text-primary">
                    R$ {m.totalGasto.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => toggleStatus(m)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Alternar status"
                      >
                        {m.status === 'ativo' ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button
                        onClick={() => { setEditing(m); setModalOpen(true) }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(m.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Excluir"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    Nenhum mensalista encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MensalistaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        mensalista={editing}
      />

      <ConfirmDialog
        open={Boolean(deleteConfirm)}
        title="Excluir mensalista?"
        description="Essa ação não pode ser desfeita."
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (!deleteConfirm) return
          deleteMensalista(deleteConfirm)
          setDeleteConfirm(null)
          toast.success('Mensalista removido.')
        }}
      />
    </div>
  )
}
