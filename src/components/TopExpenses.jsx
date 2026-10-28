import { FiAward, FiArrowUpRight } from 'react-icons/fi'
import { getCategoryById } from '../utils/categories'
import { formatRupiah, formatDate } from '../utils/formatters'

export default function TopExpenses({ topExpenses, totalFiltered }) {
  if (!topExpenses || topExpenses.length === 0) {
    return null
  }

  const rankBadges = [
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 ring-amber-400/30',
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-slate-400/30',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 ring-orange-400/30',
    'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-blue-400/30',
    'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400 ring-gray-400/30',
  ]

  return (
    <div className="animate-fade-in-up rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-amber-100 p-1.5 dark:bg-amber-900/40 transition-colors">
            <FiAward className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors">
              5 Pengeluaran Terbesar
            </h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Transaksi dengan nominal tertinggi
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {topExpenses.map((expense, index) => {
          const cat = getCategoryById(expense.category)
          const Icon = cat.icon
          const percent = totalFiltered > 0 ? ((expense.amount / totalFiltered) * 100).toFixed(1) : 0

          return (
            <div
              key={expense.id}
              className="flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-750 group border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ring-1 ${rankBadges[index] || rankBadges[4]}`}
              >
                #{index + 1}
              </span>

              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: cat.color + '18' }}
              >
                <Icon className="h-4 w-4" style={{ color: cat.color }} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {expense.description}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                  <span>{cat.name}</span>
                  {expense.qty && expense.qty > 1 && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {expense.qty} {cat.qtyUnit || 'item'}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span>{formatDate(expense.date)}</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white whitespace-nowrap">
                  {formatRupiah(expense.amount)}
                </p>
                <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                  {percent}% dari total
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
