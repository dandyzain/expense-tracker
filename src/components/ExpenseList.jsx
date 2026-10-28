import { useState, useEffect } from 'react'
import {
  FiTrash2,
  FiEdit3,
  FiCheck,
  FiX,
  FiInbox,
  FiAlertTriangle,
} from 'react-icons/fi'
import { getCategoryById, CATEGORIES } from '../utils/categories'
import { formatRupiah, formatDateShort } from '../utils/formatters'

function ExpenseItem({ expense, onRequestDelete, onUpdate, index }) {
  const [isEditing, setIsEditing] = useState(false)

  const category = getCategoryById(expense.category)
  const initialUnitPrice =
    expense.unitPrice ||
    (expense.qty && expense.qty > 0 ? Math.round(expense.amount / expense.qty) : expense.amount)

  const [editForm, setEditForm] = useState({
    description: expense.description,
    unitPrice: initialUnitPrice,
    amount: expense.amount,
    category: expense.category,
    qty: expense.qty || 1,
    date: expense.date,
  })

  const editCategory = getCategoryById(editForm.category)
  const Icon = category.icon

  // Hitung total otomatis di mode edit
  const editComputedTotal = editCategory.hasQty
    ? (Number(editForm.unitPrice) || 0) * Math.max(1, parseInt(editForm.qty, 10) || 1)
    : Number(editForm.amount) || 0

  const handleSave = () => {
    if (!editForm.description.trim()) return

    if (editCategory.hasQty) {
      if (!editForm.unitPrice || Number(editForm.unitPrice) <= 0) return
    } else {
      if (!editForm.amount || Number(editForm.amount) <= 0) return
    }

    const finalQty = editCategory.hasQty ? Math.max(1, parseInt(editForm.qty, 10) || 1) : 1
    const finalUnitPrice = editCategory.hasQty
      ? Number(editForm.unitPrice)
      : Number(editForm.amount)

    onUpdate(expense.id, {
      description: editForm.description.trim(),
      amount: editComputedTotal,
      unitPrice: finalUnitPrice,
      category: editForm.category,
      qty: finalQty,
      date: editForm.date,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({
      description: expense.description,
      unitPrice: initialUnitPrice,
      amount: expense.amount,
      category: expense.category,
      qty: expense.qty || 1,
      date: expense.date,
    })
    setIsEditing(false)
  }

  const hasMultipleQty = expense.qty && expense.qty > 1 && category.hasQty
  const unitPrice =
    expense.unitPrice || (hasMultipleQty ? Math.round(expense.amount / expense.qty) : null)

  if (isEditing) {
    return (
      <div className="animate-scale-in rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-3.5 sm:p-4 dark:bg-blue-900/20 dark:border-blue-800 transition-all">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Deskripsi"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />

          {editCategory.hasQty ? (
            /* Input Harga Satuan & Qty -> Total Otomatis */
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                    Harga Satuan (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="Harga Satuan"
                    value={editForm.unitPrice}
                    onChange={(e) => setEditForm({ ...editForm, unitPrice: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm outline-none transition-all duration-200 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                    Qty ({editCategory.qtyUnit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={editForm.qty}
                    onChange={(e) => setEditForm({ ...editForm, qty: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm outline-none transition-all duration-200 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Total Otomatis */}
              <div className="rounded-xl bg-blue-100/60 p-2 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 flex items-center justify-between">
                <span className="truncate mr-2">
                  Total ({editForm.qty || 1} {editCategory.qtyUnit} × {formatRupiah(Number(editForm.unitPrice) || 0)}):
                </span>
                <span className="font-extrabold text-xs sm:text-sm shrink-0">{formatRupiah(editComputedTotal)}</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                Jumlah (Rp)
              </label>
              <input
                type="number"
                placeholder="Jumlah (Rp)"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm outline-none transition-all duration-200 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <select
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              className="rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs outline-none transition-all duration-200 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white truncate"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              className="rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-xs outline-none transition-all duration-200 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 rounded-xl bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-gray-300 hover:scale-105 active:scale-95 dark:bg-gray-600 dark:text-gray-200"
            >
              <FiX className="h-3.5 w-3.5" /> Batal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 rounded-xl bg-blue-500 px-3.5 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-blue-600 hover:scale-105 active:scale-95"
            >
              <FiCheck className="h-3.5 w-3.5" /> Simpan
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group flex items-center gap-2.5 sm:gap-3 rounded-2xl bg-white p-3 sm:p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      {/* Category Icon */}
      <div
        className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
        style={{ backgroundColor: category.color + '15' }}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 transition-colors" style={{ color: category.color }} />
      </div>

      {/* Info Section (Protected against wrapping) */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white truncate transition-colors">
            {expense.description}
          </p>
          {hasMultipleQty && (
            <span className="shrink-0 rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 whitespace-nowrap">
              {expense.qty} {category.qtyUnit}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-medium whitespace-nowrap truncate max-w-[100px] sm:max-w-none"
            style={{ backgroundColor: category.color + '15', color: category.color }}
          >
            {category.name}
          </span>
          <span>•</span>
          <span className="whitespace-nowrap shrink-0">
            {formatDateShort(expense.date)}
          </span>
        </div>
      </div>

      {/* Amount & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-right shrink-0">
        <div>
          <p className="text-xs sm:text-base font-bold text-gray-800 whitespace-nowrap dark:text-white transition-colors">
            {formatRupiah(expense.amount)}
          </p>
          {unitPrice !== null && (
            <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap -mt-0.5">
              @{formatRupiah(unitPrice)}/{category.qtyUnit}
            </p>
          )}
        </div>

        <div className="flex gap-0.5 sm:gap-1 opacity-70 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-500 active:scale-90 dark:hover:bg-blue-900/30"
            title="Edit"
          >
            <FiEdit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onRequestDelete(expense)}
            className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 active:scale-90 dark:hover:bg-red-900/30"
            title="Hapus"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ExpenseList({ expenses, onDelete, onUpdate }) {
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Tutup popup konfirmasi saat tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && itemToDelete && !isDeleting) {
        setItemToDelete(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [itemToDelete, isDeleting])

  const handleConfirmDelete = () => {
    if (!itemToDelete) return
    setIsDeleting(true)
    setTimeout(() => {
      onDelete(itemToDelete.id)
      setItemToDelete(null)
      setIsDeleting(false)
    }, 200)
  }

  if (expenses.length === 0) {
    return (
      <div className="animate-scale-in flex flex-col items-center justify-center rounded-2xl bg-white p-8 sm:p-12 text-center shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors">
        <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-700 transition-colors">
          <FiInbox className="h-10 w-10 text-gray-300 dark:text-gray-500 animate-pulse-soft" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 transition-colors">
          Belum ada pengeluaran
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-400 dark:text-gray-500 transition-colors">
          Tekan tombol + untuk menambah pengeluaran pertama Anda
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {expenses.map((expense, index) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onRequestDelete={(item) => setItemToDelete(item)}
            onUpdate={onUpdate}
            index={index}
          />
        ))}
      </div>

      {/* Modal Popup Konfirmasi Persetujuan Hapus */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => !isDeleting && setItemToDelete(null)}
          />

          {/* Dialog Modal Card */}
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 sm:p-6 shadow-2xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-scale-in text-center">
            {/* Warning Icon Badge */}
            <div className="mx-auto mb-3.5 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
              <FiAlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 animate-bounce-in" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">
              Hapus Transaksi?
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Apakah Anda yakin ingin menghapus transaksi{' '}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                "{itemToDelete.description}"
              </span>{' '}
              senilai{' '}
              <span className="font-bold text-red-600 dark:text-red-400">
                {formatRupiah(itemToDelete.amount)}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>

            {/* Tombol Aksi */}
            <div className="mt-5 sm:mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition-all duration-200 hover:from-red-600 hover:to-rose-700 active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
