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
    <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      {/* Search */}
      <div className="relative group">
        <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500" />
        <input
          type="text"
          placeholder="Cari pengeluaran..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-500"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="rounded-lg bg-gray-100 p-1.5 dark:bg-gray-700 transition-colors">
          <FiSliders className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
        </div>

        {/* Month Filter */}
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600"
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
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600"
        >
          <option value="all">Semua Kategori</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Count Badge */}
        <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 transition-all duration-300 dark:bg-gray-700 dark:text-gray-400">
          {expenseCount} transaksi
        </span>
      </div>
    </div>
  )
}
