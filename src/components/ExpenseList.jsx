import { useState } from 'react'
import { FiTrash2, FiEdit3, FiCheck, FiX, FiInbox } from 'react-icons/fi'
import { getCategoryById, CATEGORIES } from '../utils/categories'
import { formatRupiah, formatDate } from '../utils/formatters'

function ExpenseItem({ expense, onDelete, onUpdate, index }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => onDelete(expense.id), 300)
  }

  const hasMultipleQty = expense.qty && expense.qty > 1 && category.hasQty
  const unitPrice =
    expense.unitPrice || (hasMultipleQty ? Math.round(expense.amount / expense.qty) : null)

  if (isEditing) {
    return (
      <div className="animate-scale-in rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-4 dark:bg-blue-900/20 dark:border-blue-800 transition-all">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Deskripsi"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Total Otomatis */}
              <div className="rounded-lg bg-blue-100/60 p-2 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 flex items-center justify-between">
                <span>
                  Total ({editForm.qty || 1} {editCategory.qtyUnit} × {formatRupiah(Number(editForm.unitPrice) || 0)}):
                </span>
                <span className="font-extrabold text-sm">{formatRupiah(editComputedTotal)}</span>
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
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <select
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 hover:bg-gray-300 hover:scale-105 active:scale-95 dark:bg-gray-600 dark:text-gray-200"
            >
              <FiX className="h-3.5 w-3.5" /> Batal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 rounded-lg bg-blue-500 px-3.5 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-blue-600 hover:scale-105 active:scale-95"
            >
              <FiCheck className="h-3.5 w-3.5" /> Simpan ({formatRupiah(editComputedTotal)})
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group flex items-center gap-3 rounded-2xl bg-white p-3 sm:p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 animate-fade-in-up ${
        isDeleting ? 'scale-95 opacity-0 -translate-x-10' : ''
      }`}
      style={{ animationDelay: `${Math.min(index * 60, 600)}ms` }}
    >
      {/* Category Icon */}
      <div
        className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
        style={{ backgroundColor: category.color + '15' }}
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 transition-colors" style={{ color: category.color }} />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-800 truncate dark:text-white transition-colors">
            {expense.description}
          </p>
          {hasMultipleQty && (
            <span className="shrink-0 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
              {expense.qty} {category.qtyUnit}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors"
            style={{ backgroundColor: category.color + '15', color: category.color }}
          >
            {category.name}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 transition-colors">
            {formatDate(expense.date)}
          </span>
        </div>
      </div>

      {/* Amount & Actions */}
      <div className="flex items-center gap-2 text-right">
        <div>
          <p className="text-sm sm:text-base font-bold text-gray-800 whitespace-nowrap dark:text-white transition-colors">
            {formatRupiah(expense.amount)}
          </p>
          {unitPrice !== null && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5">
              @{formatRupiah(unitPrice)}/{category.qtyUnit}
            </p>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-500 hover:scale-110 active:scale-90 dark:hover:bg-blue-900/30"
            title="Edit"
          >
            <FiEdit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg p-1.5 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 hover:scale-110 active:scale-90 dark:hover:bg-red-900/30"
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
  if (expenses.length === 0) {
    return (
      <div className="animate-scale-in flex flex-col items-center justify-center rounded-2xl bg-white p-8 sm:p-12 text-center shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors">
        <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-700 transition-colors">
          <FiInbox className="h-10 w-10 text-gray-300 dark:text-gray-500 animate-pulse-soft" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 transition-colors">
          Belum ada pengeluaran
        </h3>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 transition-colors">
          Tekan tombol + untuk menambah pengeluaran pertama Anda
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense, index) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onDelete={onDelete}
          onUpdate={onUpdate}
          index={index}
        />
      ))}
    </div>
  )
}
