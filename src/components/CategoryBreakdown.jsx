import { getCategoryById } from '../utils/categories'
import { formatRupiah } from '../utils/formatters'
import { FiTrendingUp } from 'react-icons/fi'

export default function CategoryBreakdown({ categoryBreakdown, totalFiltered }) {
  if (categoryBreakdown.length === 0) {
    return (
      <div className="animate-fade-in-up rounded-2xl bg-white p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-lg bg-emerald-100 p-1.5 dark:bg-emerald-900/40">
            <FiTrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Detail Kategori
          </h3>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">Belum ada data</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="rounded-lg bg-emerald-100 p-1.5 dark:bg-emerald-900/40 transition-colors">
          <FiTrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors">
          Detail Kategori
        </h3>
      </div>

      <div className="space-y-3">
        {categoryBreakdown.map((item, index) => {
          const cat = getCategoryById(item.catId)
          const Icon = cat.icon
          return (
            <div
              key={item.catId}
              className="animate-fade-in-up group"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center gap-3 mb-1.5">
                {/* Icon */}
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: cat.color + '15' }}
                >
                  <Icon className="h-4 w-4" style={{ color: cat.color }} />
                </div>

                {/* Name & Stats */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate transition-colors">
                      {cat.name}
                    </p>
                    <p className="text-xs font-bold text-gray-800 dark:text-white whitespace-nowrap ml-2 transition-colors">
                      {formatRupiah(item.total)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {item.count}x transaksi · rata-rata {formatRupiah(item.avg)}
                    </span>
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: cat.color }}
                    >
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="ml-11 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden transition-colors">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
