import { useState, useEffect } from 'react'
import { FiPlus, FiX, FiSave, FiEdit, FiLayers } from 'react-icons/fi'
import { CATEGORIES, getCategoryById } from '../utils/categories'
import { getToday, formatRupiah } from '../utils/formatters'

export default function ExpenseForm({ onAdd, isOpen, onToggle }) {
  const [form, setForm] = useState({
    description: '',
    unitPrice: '', // Harga satuan untuk kategori dengan Qty
    amount: '',    // Total nominal (untuk kategori tanpa Qty, atau dihitung otomatis)
    category: 'makanan',
    qty: '1',
    date: getToday(),
  })
  const [errors, setErrors] = useState({})

  const currentCat = getCategoryById(form.category)

  // Otomatis hitung total saat harga satuan atau qty berubah
  const computedTotal = currentCat.hasQty
    ? (Number(form.unitPrice) || 0) * (Math.max(1, parseInt(form.qty, 10) || 1))
    : Number(form.amount) || 0

  const validate = () => {
    const newErrors = {}
    if (!form.description.trim()) newErrors.description = 'Deskripsi wajib diisi'
    
    if (currentCat.hasQty) {
      if (!form.unitPrice || Number(form.unitPrice) <= 0) {
        newErrors.unitPrice = 'Harga satuan harus lebih dari 0'
      }
      if (!form.qty || Number(form.qty) <= 0) {
        newErrors.qty = 'Qty minimal 1'
      }
    } else {
      if (!form.amount || Number(form.amount) <= 0) {
        newErrors.amount = 'Jumlah harus lebih dari 0'
      }
    }

    if (!form.date) newErrors.date = 'Tanggal wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const finalQty = currentCat.hasQty ? Math.max(1, parseInt(form.qty, 10) || 1) : 1
    const finalUnitPrice = currentCat.hasQty
      ? Number(form.unitPrice)
      : Number(form.amount)
    const finalAmount = currentCat.hasQty ? computedTotal : Number(form.amount)

    onAdd({
      description: form.description.trim(),
      amount: finalAmount,
      unitPrice: finalUnitPrice,
      qty: finalQty,
      category: form.category,
      date: form.date,
    })

    setForm({
      description: '',
      unitPrice: '',
      amount: '',
      category: 'makanan',
      qty: '1',
      date: getToday(),
    })
    setErrors({})
    onToggle()
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCategoryChange = (catId) => {
    const targetCat = getCategoryById(catId)
    setForm((prev) => {
      // Jika beralih dari non-qty ke qty, gunakan amount sebagai unitPrice
      if (targetCat.hasQty && !prev.unitPrice && prev.amount) {
        return { ...prev, category: catId, unitPrice: prev.amount, qty: '1' }
      }
      // Jika beralih dari qty ke non-qty, gunakan computedTotal sebagai amount
      if (!targetCat.hasQty && computedTotal > 0) {
        return { ...prev, category: catId, amount: String(computedTotal) }
      }
      return { ...prev, category: catId }
    })
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/40 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/50 active:scale-95 ${
          isOpen ? 'rotate-[135deg]' : 'rotate-0 animate-bounce-in'
        }`}
      >
        {isOpen ? <FiX className="h-6 w-6" /> : <FiPlus className="h-6 w-6" />}
      </button>

      {/* Pulse ring on FAB */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center">
          <span className="absolute h-14 w-14 rounded-full bg-blue-400 opacity-30 animate-ping" />
        </div>
      )}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onToggle}
      />

      {/* Slide-up Form Panel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="mx-auto max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
          <div className="mb-1 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>

          <div className="mb-4 mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-1.5 dark:bg-blue-900/40">
                <FiEdit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Tambah Pengeluaran
              </h2>
            </div>
            <button
              onClick={onToggle}
              className="rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 hover:rotate-90 dark:hover:bg-gray-700"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Deskripsi */}
            <div className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
              <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
                Deskripsi
              </label>
              <input
                type="text"
                placeholder="Contoh: Makan siang nasi padang"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/20 focus:scale-[1.01] dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:bg-gray-600 ${
                  errors.description ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500 animate-fade-in">{errors.description}</p>
              )}
            </div>

            {/* Input Harga Satuan & Qty (Jika kategori mendukung Qty) */}
            {currentCat.hasQty ? (
              <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="grid grid-cols-2 gap-3">
                  {/* Harga Satuan */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
                      Harga Satuan (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="25000"
                      value={form.unitPrice}
                      onChange={(e) => handleChange('unitPrice', e.target.value)}
                      className={`w-full rounded-xl border bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/20 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:bg-gray-600 ${
                        errors.unitPrice ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.unitPrice && (
                      <p className="mt-1 text-xs text-red-500 animate-fade-in">{errors.unitPrice}</p>
                    )}
                  </div>

                  {/* Qty */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
                      Qty ({currentCat.qtyUnit})
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={form.qty}
                        onChange={(e) => handleChange('qty', e.target.value)}
                        className={`w-full rounded-xl border bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/20 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:bg-gray-600 ${
                          errors.qty ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.qty && (
                      <p className="mt-1 text-xs text-red-500 animate-fade-in">{errors.qty}</p>
                    )}
                  </div>
                </div>

                {/* Box Total Otomatis Muncul */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/60 p-3.5 border border-blue-100 dark:from-blue-950/40 dark:to-indigo-950/30 dark:border-blue-800/60 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Total Otomatis
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {form.qty || 1} {currentCat.qtyUnit} × {formatRupiah(Number(form.unitPrice) || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                        {formatRupiah(computedTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Kategori tanpa Qty (Hanya Total Langsung) */
              <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Jumlah Pengeluaran (Rp)
                </label>
                <input
                  type="number"
                  placeholder="50000"
                  value={form.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  className={`w-full rounded-xl border bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/20 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:bg-gray-600 ${
                    errors.amount ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.amount && (
                  <p className="mt-1 text-xs text-red-500 animate-fade-in">{errors.amount}</p>
                )}
              </div>
            )}

            {/* Tanggal */}
            <div className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
              <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
                Tanggal Transaksi
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/20 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:bg-gray-600"
              />
            </div>

            {/* Pilihan Kategori */}
            <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Kategori
                </label>
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  {currentCat.hasQty ? `(Satuan: ${currentCat.qtyUnit})` : '(Tagihan/Rutin)'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon
                  const isSelected = form.category === cat.id
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id)}
                      title={cat.name}
                      className={`relative flex flex-col items-center gap-1 rounded-xl p-2 text-xs transition-all duration-200 active:scale-90 ${
                        isSelected
                          ? 'bg-blue-50 ring-2 ring-blue-400 scale-105 shadow-sm dark:bg-blue-900/30'
                          : 'bg-gray-50 hover:bg-gray-100 hover:scale-105 dark:bg-gray-700 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 transition-all duration-200 ${isSelected ? 'scale-110' : ''}`}
                        style={{ color: isSelected ? cat.color : '#9CA3AF' }}
                      />
                      <span className="truncate w-full text-center text-[10px] text-gray-600 dark:text-gray-300">
                        {cat.name.split(' ')[0]}
                      </span>
                      {cat.hasQty && (
                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[8px] font-bold text-white shadow-sm">
                          ×
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="animate-fade-in-up flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0"
              style={{ animationDelay: '200ms' }}
            >
              <FiSave className="h-4 w-4" />
              Simpan ({formatRupiah(computedTotal)})
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
