"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash, Check } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { PredictionOptionType } from "@/types/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormState {
  seconds: number | ""
  returnRate: number | ""
  capitalMin: number | ""
  capitalMax: number | ""
  currency: string
  pair?: string | null
  isActive?: boolean
  sortOrder?: number
}

export function PredictionsPanel() {
  const [options, setOptions] = useState<PredictionOptionType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ seconds: "", returnRate: "", capitalMin: "", capitalMax: "", currency: "USDT", pair: null, isActive: true, sortOrder: 0 })

  useEffect(() => {
    void load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/prediction-options`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) throw new Error("Failed to fetch prediction options")
      const data: PredictionOptionType[] = await res.json()
      setOptions(data)
    } catch (err) {
      console.error(err)
      alert("Failed to load prediction options")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => setForm({ seconds: "", returnRate: "", capitalMin: "", capitalMax: "", currency: "USDT", pair: null, isActive: true, sortOrder: 0 })

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this option?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/prediction-options/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) throw new Error("Delete failed")
      setOptions(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error(err)
      alert("Failed to delete option")
    }
  }

  const handleEdit = (opt: PredictionOptionType) => {
    setEditingId(opt.id)
    setForm({ seconds: opt.seconds, returnRate: opt.returnRate, capitalMin: opt.capitalMin, capitalMax: opt.capitalMax, currency: opt.currency || 'USDT', pair: opt.pair || null, isActive: opt.isActive, sortOrder: opt.sortOrder })
  }

  const handleSave = async () => {
    // validate
    if (!form.seconds || !Number(form.seconds) || Number(form.seconds) <= 0) return alert('Invalid seconds')
    if (!form.returnRate || !Number(form.returnRate) || Number(form.returnRate) <= 0) return alert('Invalid return rate')
    if (typeof form.capitalMin !== 'number' && !Number(form.capitalMin)) return alert('Invalid capital min')
    if (typeof form.capitalMax !== 'number' && !Number(form.capitalMax)) return alert('Invalid capital max')
    if (Number(form.capitalMax) < Number(form.capitalMin)) return alert('Capital max must be >= capital min')

    try {
      const token = localStorage.getItem("token")
      const body = {
        seconds: Number(form.seconds),
        returnRate: Number(form.returnRate),
        capitalMin: Number(form.capitalMin),
        capitalMax: Number(form.capitalMax),
        currency: form.currency,
        pair: form.pair || null,
        isActive: form.isActive ?? true,
        sortOrder: Number(form.sortOrder ?? 0),
      }

      if (editingId) {
        const res = await fetch(`/api/prediction-options/${editingId}`, { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } })
        if (!res.ok) throw new Error('Update failed')
        const updated = await res.json()
        setOptions(prev => prev.map(p => p.id === updated.id ? updated : p))
        setEditingId(null)
        resetForm()
      } else {
        const res = await fetch(`/api/prediction-options`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } })
        if (!res.ok) throw new Error('Create failed')
        const created = await res.json()
        setOptions(prev => [...prev, created].sort((a,b) => a.sortOrder - b.sortOrder || a.seconds - b.seconds))
        resetForm()
      }
    } catch (err) {
      console.error(err)
      alert('Failed to save option')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Prediction Options</h2>
        <div className="flex gap-2">
          <Button onClick={() => { resetForm(); setEditingId(null) }} variant="ghost"><Plus className="w-4 h-4" /> Add</Button>
          <Button onClick={() => void load()} variant="default">Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="card-premium p-4">
          <div className="grid grid-cols-12 gap-3 items-center py-2">
            <div className="col-span-1 text-xs font-semibold">Secs</div>
            <div className="col-span-2 text-xs font-semibold">Return</div>
            <div className="col-span-3 text-xs font-semibold">Capital Range</div>
            <div className="col-span-2 text-xs font-semibold">Currency</div>
            <div className="col-span-2 text-xs font-semibold">Pair</div>
            <div className="col-span-1 text-xs font-semibold">Order</div>
            <div className="col-span-1 text-xs font-semibold">Actions</div>
          </div>
          <div className="divide-y divide-border">
            {options.map(opt => (
              <div key={opt.id} className="grid grid-cols-12 gap-3 items-center py-3">
                <div className="col-span-1">{opt.seconds}</div>
                <div className="col-span-2">{opt.returnRate}%</div>
                <div className="col-span-3">${opt.capitalMin} - ${opt.capitalMax}</div>
                <div className="col-span-2">{opt.currency}</div>
                <div className="col-span-2">{opt.pair || 'All'}</div>
                <div className="col-span-1">{opt.sortOrder}</div>
                <div className="col-span-1 flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => handleEdit(opt)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="destructive" onClick={() => void handleDelete(opt.id)}><Trash className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
            {options.length === 0 && <div className="py-8 text-center text-muted-foreground">No prediction options yet</div>}
          </div>
        </div>

        <div className="card-premium p-4">
          <h3 className="text-lg font-semibold mb-2">{editingId ? 'Edit Option' : 'Create Option'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground">Seconds</label>
              <Input value={form.seconds as any} onChange={(e: any) => setForm(prev => ({ ...prev, seconds: Number(e.target.value) }))} type="number" placeholder="30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Return Rate (%)</label>
              <Input value={form.returnRate as any} onChange={(e: any) => setForm(prev => ({ ...prev, returnRate: Number(e.target.value) }))} type="number" placeholder="12.0" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Capital Min</label>
              <Input value={form.capitalMin as any} onChange={(e: any) => setForm(prev => ({ ...prev, capitalMin: Number(e.target.value) }))} type="number" placeholder="0" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Capital Max</label>
              <Input value={form.capitalMax as any} onChange={(e: any) => setForm(prev => ({ ...prev, capitalMax: Number(e.target.value) }))} type="number" placeholder="0" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Currency</label>
              <Input value={form.currency} onChange={(e: any) => setForm(prev => ({ ...prev, currency: e.target.value }))} placeholder="USDT" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Pair (optional)</label>
              <Input value={form.pair || ''} onChange={(e: any) => setForm(prev => ({ ...prev, pair: e.target.value || null }))} placeholder="BTC" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Sort Order</label>
              <Input value={form.sortOrder as any} onChange={(e: any) => setForm(prev => ({ ...prev, sortOrder: Number(e.target.value) }))} type="number" placeholder="0" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Active</label>
              <Select value={form.isActive ? "true" : "false"} onValueChange={(value) => setForm(prev => ({ ...prev, isActive: value === 'true' }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="ghost" onClick={() => { resetForm(); setEditingId(null) }}>Cancel</Button>
            <Button variant="default" onClick={() => void handleSave()}><Check className="w-4 h-4" /> Save</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
