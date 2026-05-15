'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Order, OrderItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useAdminStore } from '@/store/admin'
import { useUIStore } from '@/store/ui'
import {
  Search,
  Eye,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  X,
  Truck,
  AlertCircle,
  CreditCard,
  User,
  Calendar,
  Hash,
  Euro,
  Download,
  ListOrdered,
} from 'lucide-react'

export default function AdminOrdersPage() {
  const { token } = useAdminStore()
  const addToast = useUIStore((s) => s.addToast)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewOrder, setViewOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        console.error('Failed to fetch orders:', res.status)
        setOrders([])
        return
      }
      const data = await res.json()
      if (!Array.isArray(data)) {
        console.error('Unexpected orders response:', data)
        setOrders([])
        return
      }
      setOrders(data as Order[])
    } catch (error) {
      console.error('Error:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchOrders()
  }, [token])

  const filteredOrders = useMemo(() => {
    let result = orders
    if (filterStatus !== 'all') {
      result = result.filter((o) => o.status === filterStatus)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
      )
    }
    return result
  }, [orders, searchQuery, filterStatus])

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
    revenue: orders.filter((o) => o.status === 'completed').reduce((sum, o) => sum + o.totalGross, 0),
  }), [orders])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error('Failed')
      addToast(
        status === 'completed' ? 'Bestellung abgeschlossen' :
        status === 'cancelled' ? 'Bestellung storniert' : 'Status aktualisiert',
        'success'
      )
      fetchOrders()
    } catch (error) {
      addToast('Fehler beim Aktualisieren', 'error')
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Ausstehend', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' }
      case 'completed':
        return { label: 'Abgeschlossen', icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' }
      case 'cancelled':
        return { label: 'Storniert', icon: XCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' }
      default:
        return { label: status, icon: Package, bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500' }
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bestellungen</h1>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total} Bestellungen · {stats.pending} ausstehend
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchOrders}
          className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
        >
          <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Aktualisieren
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Ausstehend', value: stats.pending, icon: Clock, color: 'from-amber-500 to-yellow-500', bg: 'bg-amber-50' },
          { label: 'Abgeschlossen', value: stats.completed, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
          { label: 'Storniert', value: stats.cancelled, icon: XCircle, color: 'from-red-500 to-pink-500', bg: 'bg-red-50' },
          { label: 'Gesamt', value: stats.total, icon: ListOrdered, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                  <Icon className="w-4.5 h-4.5 text-white" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Bestellungen durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'completed', 'cancelled'].map((s) => {
                const config = getStatusConfig(s)
                const Icon = s === 'all' ? Package : config.icon
                return (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      filterStatus === s
                        ? s === 'all' ? 'bg-gray-900 text-white' : `${config.bg} ${config.text} border ${config.border}`
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    {s !== 'all' && <Icon className="w-3.5 h-3.5" />}
                    {s === 'all' ? 'Alle' : config.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-4 sm:px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Bestellung</th>
                <th className="text-left px-4 sm:px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Kunde</th>
                <th className="text-right px-4 sm:px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Artikel</th>
                <th className="text-right px-4 sm:px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Summe</th>
                <th className="text-center px-4 sm:px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 sm:px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <span className="text-sm">Bestellungen werden geladen...</span>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Package className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Keine Bestellungen gefunden</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchQuery ? 'Versuche andere Suchbegriffe' : 'Es wurden noch keine Bestellungen aufgegeben'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => {
                  const StatusIcon = getStatusConfig(order.status).icon
                  const statusBg = getStatusConfig(order.status).bg
                  const statusText = getStatusConfig(order.status).text
                  const statusDot = getStatusConfig(order.status).dot
                  const statusLabel = getStatusConfig(order.status).label
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                      onClick={() => setViewOrder(order)}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <div>
                            <p className="text-sm font-mono font-medium text-gray-900">
                              #{order.id.slice(0, 8)}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-400">
                              <Calendar className="w-3 h-3" />
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right hidden sm:table-cell">
                        <p className="text-sm text-gray-700 font-medium">{order.items.length}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[160px] ml-auto">
                          {order.items.map((i: OrderItem) => i.productName).join(', ')}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <p className="text-sm font-bold text-gray-900">{formatPrice(order.totalGross)}</p>
                        <p className="text-[11px] text-gray-400">{formatPrice(order.totalNet)} netto</p>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusBg} ${statusText}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                            <StatusIcon className="w-3 h-3" />
                            {statusLabel}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={(e) => { e.stopPropagation(); setViewOrder(order) }}
                            className="p-2 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors"
                            title="Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'completed') }}
                                className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                              >
                                Erledigt
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'cancelled') }}
                                className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                              >
                                Stornieren
                              </button>
                            </>
                          )}
                          {order.status === 'completed' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, 'pending') }}
                              className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors"
                            >
                              Öffnen
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {viewOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewOrder(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-3xl shadow-2xl z-50 overflow-y-auto max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <ListOrdered className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Bestellung #{viewOrder.id.slice(0, 8)}
                    </h2>
                    <p className="text-xs text-gray-500">{formatDate(viewOrder.createdAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewOrder(null)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${getStatusConfig(viewOrder.status).bg} ${getStatusConfig(viewOrder.status).text} border ${getStatusConfig(viewOrder.status).border}`}>
                    {(() => {
                      const Icon = getStatusConfig(viewOrder.status).icon
                      return <Icon className="w-4 h-4" />
                    })()}
                    {getStatusConfig(viewOrder.status).label}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-500" />
                    Kundeninformationen
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Name</p>
                        <p className="text-sm font-medium text-gray-900">{viewOrder.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <Mail className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">E-Mail</p>
                        <p className="text-sm font-medium text-gray-900">{viewOrder.customerEmail}</p>
                      </div>
                    </div>
                    {viewOrder.customerPhone && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                          <Phone className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Telefon</p>
                          <p className="text-sm font-medium text-gray-900">{viewOrder.customerPhone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-500" />
                    Versandinformationen
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <Truck className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Versandart</p>
                        <p className="text-sm font-medium text-gray-900">
                          {viewOrder.shippingMethod === 'pickup' ? 'Abholung' :
                           viewOrder.shippingMethod === 'delivery' ? 'Lieferung durch uns' :
                           viewOrder.shippingMethod === 'dhl' ? 'DHL' :
                           viewOrder.shippingMethod === 'hermes' ? 'Hermes' : viewOrder.shippingMethod}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <Euro className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Versandkosten</p>
                        <p className="text-sm font-medium text-gray-900">{formatPrice(viewOrder.shippingCost)}</p>
                      </div>
                    </div>
                    {viewOrder.customerAddress && (
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Lieferadresse</p>
                          <p className="text-sm font-medium text-gray-900">{viewOrder.customerAddress}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                      Bestellte Artikel ({viewOrder.items.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {viewOrder.items.map((item: OrderItem) => (
                      <div key={item.id} className="flex items-center justify-between px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-50 to-yellow-50 flex items-center justify-center">
                            <Package className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                            <p className="text-xs text-gray-400">
                              {item.quantity}x · {formatPrice(item.priceNet)}/Stück · MwSt. {item.vatRate}%
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatPrice(item.priceNet * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Nettosumme</span>
                      <span className="font-medium text-gray-700">{formatPrice(viewOrder.totalNet)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">MwSt.</span>
                      <span className="font-medium text-gray-700">{formatPrice(viewOrder.totalVat)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Gesamtsumme</span>
                      <span>{formatPrice(viewOrder.totalGross)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  {viewOrder.status === 'pending' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { handleStatusChange(viewOrder.id, 'completed'); setViewOrder(null) }}
                        className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-green-500/20 transition-all"
                      >
                        Als erledigt markieren
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { handleStatusChange(viewOrder.id, 'cancelled'); setViewOrder(null) }}
                        className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-red-500/20 transition-all"
                      >
                        Stornieren
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
