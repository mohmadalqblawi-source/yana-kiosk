'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product, StoreSettings } from '@/types'
import { formatPrice, calculateVAT } from '@/lib/utils'
import { useUIStore } from '@/store/ui'
import { useAdminStore } from '@/store/admin'
import {
  Package, Plus, Search, Edit3, Trash2, X,
  AlertTriangle, Loader2, Image as ImageIcon,
  Type, Euro, Tag, Warehouse, CheckSquare, Square,
  ChevronDown, ChevronUp, Camera, Store, Grid3X3, List,
  Layers, Power, FolderOpen, Check,
} from 'lucide-react'

interface ProductForm {
  name: string
  description: string
  priceBrutto: string
  vatRate: string
  category: string
  image: string
  featured: boolean
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  priceBrutto: '',
  vatRate: '19',
  category: '',
  image: '',
  featured: false,
}

export default function AdminPage() {
  const { token } = useAdminStore()
  const addToast = useUIStore((s) => s.addToast)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [showImageField, setShowImageField] = useState(false)
  const [togglingActiveId, setTogglingActiveId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories'>('overview')

  // ── Categories state ──────────────────────────────────────────────────────
  interface CategoryRow { id: string; name: string }
  const [catList, setCatList] = useState<CategoryRow[]>([])
  const [catLoading, setCatLoading] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [addingCat, setAddingCat] = useState(false)
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [editingCatName, setEditingCatName] = useState('')
  const [savingCatId, setSavingCatId] = useState<string | null>(null)
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null)
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [toggleSaving, setToggleSaving] = useState(false)
  // Fallback isOpen — true until settings load; stays true if API fails so toggle always shows
  const isOpen = storeSettings?.isOpen ?? true

  const fetchStoreSettings = useCallback(async (authToken: string) => {
    setSettingsLoading(true)
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setStoreSettings({
        name: data.name ?? '',
        address: data.address ?? '',
        phone: data.phone ?? '',
        email: data.email ?? '',
        isOpen: data.isOpen !== false,
      })
    } catch {
      /* ignore */
    } finally {
      setSettingsLoading(false)
    }
  }, [])
  const fetchProducts = useCallback(async (authToken: string) => {
    if (!authToken) return
    try {
      const res = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!res.ok) {
        console.error('Auth failed or API error:', res.status)
        setProducts([])
        setCategories([])
        return
      }
      const data = await res.json()
      if (!Array.isArray(data)) {
        console.error('Unexpected response:', data)
        setProducts([])
        setCategories([])
        return
      }
      setProducts(data)
      const cats = [...new Set(data.map((p: Product) => p.category))] as string[]
      setCategories(cats)
    } catch (error) {
      console.error('Error:', error)
      setProducts([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) {
      fetchProducts(token)
      fetchStoreSettings(token)
    }
  }, [token, fetchProducts, fetchStoreSettings])

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products
    const q = searchQuery.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }, [products, searchQuery])

  const stats = useMemo(() => {
    const totalProducts = products.length
    const activeProducts = products.filter((p) => p.isActive).length
    const inactiveProducts = products.filter((p) => !p.isActive).length
    const avgPrice =
      totalProducts > 0
        ? products.reduce((sum, p) => sum + calculateVAT(p.priceNet, p.vatRate).gross, 0) / totalProducts
        : 0
    return { totalProducts, activeProducts, inactiveProducts, avgPrice }
  }, [products])

  const openCreateModal = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setShowImageField(false)
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    // Pre-fill with the brutto (gross) price so admin sees what customers pay
    const gross = calculateVAT(product.priceNet, product.vatRate).gross
    setForm({
      name: product.name,
      description: product.description,
      priceBrutto: gross.toFixed(2),
      vatRate: product.vatRate.toString(),
      category: product.category,
      image: product.image,
      featured: product.featured,
    })
    setShowImageField(!!product.image)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.priceBrutto || !form.category) {
      addToast('Bitte alle Pflichtfelder ausfüllen', 'error')
      return
    }

    setSaving(true)
    try {
      const url = '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'
      const body = editingProduct
        ? { ...form, id: editingProduct.id }
        : form

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Failed to save')

      addToast(
        editingProduct
          ? `${form.name} wurde aktualisiert`
          : `${form.name} wurde hinzugefügt`,
        'success'
      )
      setShowModal(false)
      setForm(emptyForm)
      if (token) fetchProducts(token)
    } catch (error) {
      addToast('Fehler beim Speichern', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleStoreOpenToggle = async (nextOpen: boolean) => {
    if (!token) return
    setToggleSaving(true)
    // Optimistic update so the UI responds immediately
    setStoreSettings(prev => prev
      ? { ...prev, isOpen: nextOpen }
      : { name: '', address: '', phone: '', email: '', isOpen: nextOpen }
    )
    try {
      const current = storeSettings ?? { name: '', address: '', phone: '', email: '' }
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...current, isOpen: nextOpen }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
      setStoreSettings({
        name: data.name ?? '',
        address: data.address ?? '',
        phone: data.phone ?? '',
        email: data.email ?? '',
        isOpen: data.isOpen !== false,
      })
      addToast(
        nextOpen ? '✅ Shop ist jetzt Online — Bestellungen möglich' : '⏸ Shop ist Offline — keine neuen Bestellungen',
        'success'
      )
    } catch (err: unknown) {
      // Revert optimistic update on failure
      setStoreSettings(prev => prev ? { ...prev, isOpen: !nextOpen } : null)
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
      addToast(`Fehler: ${msg}`, 'error')
    } finally {
      setToggleSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Sind Sie sicher, dass Sie "${name}" löschen möchten?`)) return

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete')
      addToast(`${name} wurde gelöscht`, 'success')
      if (token) fetchProducts(token)
    } catch (error) {
      addToast('Fehler beim Löschen', 'error')
    }
  }

  const handleToggleActive = async (id: string, current: boolean) => {
    setTogglingActiveId(id)
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !current } : p))
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, isActive: !current }),
      })
      if (!res.ok) throw new Error('Failed')
    } catch {
      // Revert on failure
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: current } : p))
      addToast('Fehler beim Aktualisieren des Status', 'error')
    } finally {
      setTogglingActiveId(null)
    }
  }

  // ── Categories CRUD ───────────────────────────────────────────────────────
  const fetchCategories = useCallback(async (authToken: string) => {
    setCatLoading(true)
    try {
      const res = await fetch('/api/admin/categories', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setCatList(Array.isArray(data) ? data : [])
    } catch { /* ignore */ }
    finally { setCatLoading(false) }
  }, [])

  useEffect(() => {
    if (activeTab === 'categories' && token && catList.length === 0 && !catLoading) {
      fetchCategories(token)
    }
  }, [activeTab, token, catList.length, catLoading, fetchCategories])

  const handleAddCategory = async () => {
    if (!newCatName.trim() || !token) return
    setAddingCat(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newCatName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { addToast(data.error || 'Fehler', 'error'); return }
      setCatList(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewCatName('')
      addToast(`"${data.name}" hinzugefügt`, 'success')
    } catch { addToast('Fehler beim Hinzufügen', 'error') }
    finally { setAddingCat(false) }
  }

  const handleSaveCategory = async (id: string) => {
    if (!editingCatName.trim() || !token) return
    setSavingCatId(id)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, name: editingCatName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { addToast(data.error || 'Fehler', 'error'); return }
      setCatList(prev =>
        prev.map(c => c.id === id ? data : c).sort((a, b) => a.name.localeCompare(b.name))
      )
      setEditingCatId(null)
      addToast('Kategorie aktualisiert', 'success')
    } catch { addToast('Fehler beim Speichern', 'error') }
    finally { setSavingCatId(null) }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Kategorie "${name}" wirklich löschen?`)) return
    setDeletingCatId(id)
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) { const d = await res.json(); addToast(d.error || 'Fehler', 'error'); return }
      setCatList(prev => prev.filter(c => c.id !== id))
      addToast(`"${name}" gelöscht`, 'success')
    } catch { addToast('Fehler beim Löschen', 'error') }
    finally { setDeletingCatId(null) }
  }

  return (
    <div className="space-y-6">
      {/* Shop online / offline — always visible */}
      {settingsLoading ? (
        <div className="h-[88px] bg-gray-100 rounded-2xl animate-pulse border border-gray-100" aria-hidden />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isOpen
              ? 'bg-emerald-50/60 border-emerald-200 shadow-sm shadow-emerald-500/10'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isOpen ? 'bg-emerald-100' : 'bg-gray-200'
              }`}
            >
              <Power className={`w-6 h-6 ${isOpen ? 'text-emerald-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Shop-Status</p>
              <p className="text-xs text-gray-500 mt-0.5 max-w-xl">
                {isOpen
                  ? 'Online — Kunden können Produkte kaufen und zur Kasse gehen.'
                  : 'Offline — der Shop wird angezeigt, aber neue Bestellungen und Zahlungen sind gesperrt.'}
              </p>
              <p className={`text-xs font-bold mt-2 ${isOpen ? 'text-emerald-600' : 'text-gray-400'}`}>
                {isOpen ? '● Online' : '● Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
              {isOpen ? 'Einschalten' : 'Ausschalten'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isOpen}
              aria-busy={toggleSaving}
              disabled={toggleSaving}
              onClick={() => handleStoreOpenToggle(!isOpen)}
              className={`relative w-[56px] h-8 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-60 ${
                isOpen ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300 ${
                  isOpen ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </motion.div>
      )}

      {/* Dashboard Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            {!loading && (
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                {products.length} Produkte
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Willkommen im YaNa Kiosk Admin Panel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Übersicht
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'products'
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Produkte
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Kategorien
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Neu
          </motion.button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-sm text-gray-400">Produkte werden geladen...</span>
          </div>
        </div>
      ) : activeTab === 'overview' && products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 sm:py-24"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-yellow-100 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Store className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Willkommen im YaNa Kiosk Admin!
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            Dein Shop ist noch leer. Klicke auf den Button, um deine ersten Produkte
            mit Namen, Preis und Kategorie hinzuzufügen.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCreateModal}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl text-base font-bold hover:shadow-xl hover:shadow-emerald-600/25 transition-all"
          >
            <Plus className="w-6 h-6" />
            Erstes Produkt hinzufügen
          </motion.button>
        </motion.div>
      ) : activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Produkte', value: stats.totalProducts, icon: Package, color: 'from-emerald-600 to-emerald-700' },
              { label: 'Aktiv', value: stats.activeProducts, icon: Layers, color: 'from-blue-500 to-indigo-500' },
              { label: 'Inaktiv', value: stats.inactiveProducts, icon: AlertTriangle, color: 'from-red-500 to-pink-500' },
              { label: 'Kategorien', value: categories.length, icon: X, color: 'from-gray-500 to-gray-600' },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => { setActiveTab('products'); setViewMode('list') }}
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                <List className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Produkte verwalten</p>
                <p className="text-xs text-gray-500 mt-0.5">Alle Produkte anzeigen, bearbeiten und löschen</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-300 -rotate-90" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onClick={() => openCreateModal()}
              className="flex items-center gap-4 p-5 bg-gradient-to-br from-emerald-50 to-yellow-50 rounded-2xl border border-emerald-100 hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-sm">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Neues Produkt</p>
                <p className="text-xs text-gray-500 mt-0.5">Ein neues Produkt zum Shop hinzufügen</p>
              </div>
              <Plus className="w-5 h-5 text-emerald-500" />
            </motion.button>
          </div>
        </div>
      ) : activeTab === 'categories' ? (
        /* ── Categories Tab ────────────────────────────────────────────────── */
        <motion.div
          key="categories"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Add new category */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              Neue Kategorie hinzufügen
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddCategory() }}
                placeholder="Kategoriename..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddCategory}
                disabled={addingCat || !newCatName.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-emerald-600/20 transition-all"
              >
                {addingCat ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Hinzufügen
              </motion.button>
            </div>
          </div>

          {/* Category list */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-emerald-600" />
                Alle Kategorien
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">
                {catList.length}
              </span>
            </div>

            {catLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              </div>
            ) : catList.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Noch keine Kategorien</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                <AnimatePresence initial={false}>
                  {catList.map(cat => (
                    <motion.li
                      key={cat.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 px-5 sm:px-6 py-3.5 hover:bg-gray-50/60 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center shrink-0">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      </div>

                      {editingCatId === cat.id ? (
                        <>
                          <input
                            autoFocus
                            value={editingCatName}
                            onChange={e => setEditingCatName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveCategory(cat.id)
                              if (e.key === 'Escape') setEditingCatId(null)
                            }}
                            className="flex-1 px-3 py-1.5 border border-emerald-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 bg-white"
                          />
                          <button
                            onClick={() => handleSaveCategory(cat.id)}
                            disabled={savingCatId === cat.id || !editingCatName.trim()}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                            title="Speichern"
                          >
                            {savingCatId === cat.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Check className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => setEditingCatId(null)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                            title="Abbrechen"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm font-medium text-gray-800">{cat.name}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name) }}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              title="Bearbeiten"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              disabled={deletingCatId === cat.id}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                              title="Löschen"
                            >
                              {deletingCatId === cat.id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </>
                      )}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Products Tab */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Search & Actions */}
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="relative flex-1 w-full sm:w-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Produkte durchsuchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* View Toggle */}
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                      title="Grid Ansicht"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                      title="Listen Ansicht"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                    {filteredProducts.length}/{products.length}
                  </span>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-600">Keine Produkte gefunden</p>
                <p className="text-xs text-gray-400 mt-1">Versuche andere Suchbegriffe</p>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4 sm:p-6">
                {filteredProducts.map((product, index) => {
                  const gross = calculateVAT(product.priceNet, product.vatRate).gross
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="group bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="aspect-square bg-gradient-to-br from-emerald-50 to-yellow-50 relative overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                        {/* Quick Actions Overlay */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={(e) => { e.stopPropagation(); openEditModal(product) }} className="p-1.5 bg-white rounded-lg shadow hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(product.id, product.name)} className="p-1.5 bg-white rounded-lg shadow hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Active/inactive indicator */}
                        {!product.isActive && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-t-xl">
                            <span className="px-2 py-1 bg-black/70 text-white text-[10px] font-bold rounded-lg">INAKTIV</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-400 font-medium mb-0.5">{product.category}</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm font-bold text-emerald-600">{formatPrice(gross)}</p>
                          <button
                            onClick={() => handleToggleActive(product.id, product.isActive)}
                            disabled={togglingActiveId === product.id}
                            title={product.isActive ? 'Aktiv — klicken zum Deaktivieren' : 'Inaktiv — klicken zum Aktivieren'}
                            className={`relative w-9 h-5 rounded-full transition-colors duration-300 shrink-0 ${
                              product.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                            } ${togglingActiveId === product.id ? 'opacity-50' : ''}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                              product.isActive ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              /* List View */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-4 sm:px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Produkt</th>
                      <th className="text-left px-4 sm:px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Kategorie</th>
                      <th className="text-right px-4 sm:px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Preis (brutto)</th>
                      <th className="text-right px-4 sm:px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">MwSt.</th>
                      <th className="text-right px-4 sm:px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Aktiv</th>
                      <th className="text-right px-4 sm:px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.map((product, index) => {
                      const gross = calculateVAT(product.priceNet, product.vatRate).gross
                      return (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="hover:bg-gray-50/80 transition-colors"
                        >
                          <td className="px-4 sm:px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-50 to-yellow-50 overflow-hidden shrink-0 flex items-center justify-center">
                                {product.image ? (
                                  <img src={product.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                  <Package className="w-4.5 h-4.5 text-gray-300" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                <p className="text-[11px] text-gray-400">{product.featured ? '⭐ Featured' : ''}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 hidden sm:table-cell">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-right">
                            <span className="text-sm font-semibold text-gray-900">{formatPrice(gross)}</span>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-right">
                            <span className="text-sm text-gray-500">{product.vatRate}%</span>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-right">
                            <button
                              onClick={() => handleToggleActive(product.id, product.isActive)}
                              disabled={togglingActiveId === product.id}
                              title={product.isActive ? 'Aktiv — klicken zum Deaktivieren' : 'Inaktiv — klicken zum Aktivieren'}
                              className={`relative inline-flex w-10 h-6 rounded-full transition-colors duration-300 ${
                                product.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                              } ${togglingActiveId === product.id ? 'opacity-50' : ''}`}
                            >
                              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                                product.isActive ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEditModal(product)}
                                className="p-2 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors"
                                title="Bearbeiten"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id, product.name)}
                                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                title="Löschen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal - Product Form */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-xl bg-white rounded-3xl shadow-2xl z-50 overflow-y-auto max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {editingProduct ? 'Produkt bearbeiten' : 'Neues Produkt'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {editingProduct ? 'Produktdaten aktualisieren' : 'Neues Produkt zum Shop hinzufügen'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Product Name */}
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Type className="w-4 h-5 text-emerald-500" />
                    Produktname <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                    placeholder="z.B. Snickers, Cola, Wasser..."
                    autoFocus
                  />
                </div>

                {/* Price & VAT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Euro className="w-4 h-5 text-emerald-500" />
                      Preis Brutto (&euro;) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">&euro;</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.priceBrutto}
                        onChange={(e) => setForm({ ...form, priceBrutto: e.target.value })}
                        className="w-full px-4 py-3 pl-9 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                        placeholder="2.50"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">Preis den der Kunde sieht (inkl. MwSt.)</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-5 text-emerald-500" />
                      Mehrwertsteuer
                    </label>
                    <select
                      value={form.vatRate}
                      onChange={(e) => setForm({ ...form, vatRate: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                    >
                      <option value="7">7% (Lebensmittel)</option>
                      <option value="19">19% (Standard)</option>
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                  <div className="bg-gray-50 rounded-2xl border-0 p-0">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-5 text-emerald-500" />
                      Kategorie <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all appearance-none"
                    >
                      <option value="">-- Kategorie auswählen --</option>
                      <optgroup label="🥗 Lebensmittel">
                        <option value="Süße Snacks">Süße Snacks</option>
                        <option value="Salzige Snacks">Salzige Snacks</option>
                        <option value="Lebensmittel">Lebensmittel</option>
                        <option value="Kaugummi">Kaugummi</option>
                        <option value="Kinderartikel">Kinderartikel</option>
                      </optgroup>
                      <optgroup label="🥤 Getränke">
                        <option value="Softdrinks">Softdrinks</option>
                        <option value="Energy Drinks">Energy Drinks</option>
                        <option value="Eistee">Eistee</option>
                        <option value="Saft">Saft</option>
                        <option value="Milch">Milch</option>
                        <option value="Wasser">Wasser</option>
                        <option value="Bier">Bier</option>
                        <option value="Sekt">Sekt</option>
                        <option value="Wein">Wein</option>
                        <option value="Spirituosen">Spirituosen</option>
                        <option value="Getränkekisten">Getränkekisten</option>
                      </optgroup>
                      <optgroup label="🚬 Rauchen">
                        <option value="Zigaretten">Zigaretten</option>
                        <option value="Vape / E-Zigaretten">Vape / E-Zigaretten</option>
                        <option value="Drehtabak & Zubehör">Drehtabak & Zubehör</option>
                        <option value="Feuerzeuge & Zubehör">Feuerzeuge & Zubehör</option>
                        <option value="Papers & Tips">Papers & Tips</option>
                        <option value="Rauchbedarf">Rauchbedarf</option>
                      </optgroup>
                      <optgroup label="🪬 Shisha">
                        <option value="Shisha / Wasserpfeife">Shisha / Wasserpfeife</option>
                      </optgroup>
                      <optgroup label="💨 Vape">
                        <option value="Vape / E-Zigaretten">Vape / E-Zigaretten</option>
                      </optgroup>
                      <optgroup label="🍦 Eis">
                        <option value="Eis / Speiseeis">Eis / Speiseeis</option>
                        <option value="Eiscreme">Eiscreme</option>
                      </optgroup>
                      <optgroup label="🧴 Drogerie">
                        <option value="Drogerie">Drogerie</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Type className="w-4 h-5 text-emerald-500" />
                    Beschreibung
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all resize-none"
                    placeholder="Kurze Beschreibung (optional)..."
                  />
                </div>

                {/* Image Toggle */}
                <div className="border border-dashed border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowImageField(!showImageField)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">Bild (optional)</span>
                    </div>
                    {showImageField ? (
                      <ChevronUp className="w-4 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-5 text-gray-400" />
                    )}
                  </button>

                  {showImageField && (
                    <div className="p-4 pt-2 space-y-3">
                      {/* Preview */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-white overflow-hidden shrink-0 flex items-center justify-center border border-gray-200">
                          {form.image ? (
                            <img src={form.image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          {/* File Upload */}
                          <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-50 border-2 border-emerald-200 border-dashed rounded-xl text-sm font-medium text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-all cursor-pointer">
                            <Camera className="w-4 h-4" />
                            <span>Vom Gerät hochladen</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                if (file.size > 5 * 1024 * 1024) {
                                  addToast('Datei zu groß (max 5MB)', 'error')
                                  return
                                }
                                try {
                                  const uploadForm = new FormData()
                                  uploadForm.append('file', file)
                                  const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: uploadForm,
                                  })
                                  const data = await res.json()
                                  if (!res.ok) throw new Error(data.error || 'Upload failed')
                                  setForm({ ...form, image: data.url })
                                  addToast('Bild hochgeladen', 'success')
                                } catch (err: any) {
                                  addToast(err.message || 'Upload fehlgeschlagen', 'error')
                                }
                              }}
                            />
                          </label>
                          {/* URL Input */}
                          <div className="relative">
                            <input
                              type="url"
                              value={form.image}
                              onChange={(e) => setForm({ ...form, image: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                              placeholder="oder Bild-URL eingeben..."
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 text-center">
                        Unterstützt JPG, PNG, WebP · Max 5MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setForm({ ...form, featured: !form.featured })}>
                  {form.featured ? (
                    <CheckSquare className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-300" />
                  )}
                  <span className="text-sm font-medium text-gray-700">Featured (Startseite anzeigen)</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 flex items-center justify-between gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => { setShowModal(false); setForm(emptyForm) }}
                  className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Abbrechen
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-emerald-600/25 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Speichern...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      {editingProduct ? 'Aktualisieren' : 'Produkt hinzufügen'}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
