import { FiSearch, FiSliders } from 'react-icons/fi'
import { CATEGORIES } from '../utils/categories'
import { getMonthName } from '../utils/formatters'

export default function Filters({
  filterMonth,
  setFilterMonth,
  filterCategory,
  setFilterCategory,
  searchQuery,
  setSearchQuery,
  availableMonths,
  expenseCount,
}) {
  return (
    <div className="space-y-2.5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      {/* Search Input */}
      <div className="relative group">
        <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500" />
        <input
          type="text"
          placeholder="Cari pengeluaran..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2 sm:py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-700 outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-500"
        />
      </div>

      {/* Dropdown Filters & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {/* Symmetrical 2-column on mobile, inline on desktop */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {/* Month Filter */}
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium text-gray-600 outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 truncate"
          >
            <option value="all">Semua Bulan</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {getMonthName(month)}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium text-gray-600 outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 truncate"
          >
            <option value="all">Semua Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Transaction Count Badge */}
        <div className="flex items-center justify-between sm:justify-end shrink-0 pt-0.5 sm:pt-0">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50">
            <FiSliders className="h-3 w-3 text-gray-400" />
            <span>{expenseCount} transaksi</span>
          </span>
        </div>
      </div>
    </div>
  )
}
