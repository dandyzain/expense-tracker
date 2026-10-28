import {
  FiDownload,
  FiCompass,
  FiAlertCircle,
  FiTrendingUp,
  FiCalendar,
  FiCheckCircle,
} from 'react-icons/fi'
import { formatRupiah, getMonthName } from '../utils/formatters'
import { getCategoryById } from '../utils/categories'

export default function ReportInsights({
  expenses,
  weekdayTotals,
  categoryBreakdown,
  avgDailySpending,
  monthComparison,
}) {
  // Find highest spending day
  const highestDay = [...weekdayTotals].sort((a, b) => b.total - a.total)[0]
  // Find top category
  const topCategory = categoryBreakdown[0]
  const topCatInfo = topCategory ? getCategoryById(topCategory.catId) : null

  const handleExportCSV = () => {
    if (!expenses || expenses.length === 0) return

    const headers = ['ID', 'Deskripsi', 'Kategori', 'Tanggal', 'Jumlah (Rp)']
    const rows = expenses.map((e) => [
      `"${e.id}"`,
      `"${(e.description || '').replace(/"/g, '""')}"`,
      `"${getCategoryById(e.category).name}"`,
      `"${e.date}"`,
      e.amount,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `laporan-pengeluaran-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="animate-fade-in-up rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-teal-100 p-1.5 dark:bg-teal-900/40 transition-colors">
            <FiCompass className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors">
              Analisis & Wawasan Finansial
            </h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Insight otomatis berdasarkan pola pengeluaran Anda
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={expenses.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-3.5 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-blue-600 hover:text-white disabled:opacity-40 disabled:pointer-events-none active:scale-95 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-600"
        >
          <FiDownload className="h-3.5 w-3.5" />
          Ekspor CSV / Excel
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Insight 1: Peak Day */}
        <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-gray-750/70 border border-slate-100 dark:border-gray-700/60 transition-colors">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1.5">
            <FiCalendar className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Hari Terboros</span>
          </div>
          {highestDay && highestDay.total > 0 ? (
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-white">
                Hari {highestDay.day}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Total: <span className="font-semibold text-gray-700 dark:text-gray-200">{formatRupiah(highestDay.total)}</span> ({highestDay.count}x)
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Belum ada data transaksi</p>
          )}
        </div>

        {/* Insight 2: Dominant Category */}
        <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-gray-750/70 border border-slate-100 dark:border-gray-700/60 transition-colors">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1.5">
            <FiAlertCircle className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pos Terbesar</span>
          </div>
          {topCatInfo ? (
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                {topCatInfo.name}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Menghabiskan <span className="font-semibold text-amber-600 dark:text-amber-400">{topCategory.percentage.toFixed(1)}%</span> dari anggaran
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Belum ada data kategori</p>
          )}
        </div>

        {/* Insight 3: Monthly Trend */}
        <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-gray-750/70 border border-slate-100 dark:border-gray-700/60 transition-colors">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1.5">
            <FiTrendingUp className="h-3.5 w-3.5 text-violet-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Tren Bulan Ini</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              {monthComparison.change === 0
                ? 'Stabil'
                : monthComparison.change > 0
                ? `Naik ${monthComparison.change.toFixed(1)}%`
                : `Turun ${Math.abs(monthComparison.change).toFixed(1)}%`}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              {monthComparison.change > 0
                ? 'Pengeluaran lebih tinggi dari bulan lalu'
                : monthComparison.change < 0
                ? 'Bagus! Pengeluaran lebih hemat dari bulan lalu'
                : 'Pengeluaran sama seperti bulan lalu'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
