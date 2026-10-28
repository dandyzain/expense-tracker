import {
  FiActivity,
  FiHash,
  FiArrowUp,
  FiArrowDown,
  FiMinus,
  FiZap,
  FiAward,
} from 'react-icons/fi'
import { formatRupiah } from '../utils/formatters'
import { getCategoryById } from '../utils/categories'

function MiniStatCard({ icon: Icon, label, value, sub, iconBg, iconColor }) {
  return (
    <div className="animate-fade-in-up flex items-center gap-2.5 sm:gap-3 rounded-2xl bg-white p-3 sm:p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 dark:bg-gray-800 dark:border-gray-700">
      <div className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] sm:text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider truncate">
          {label}
        </p>
        <p className="text-xs sm:text-base font-extrabold text-gray-800 dark:text-white whitespace-nowrap">
          {value}
        </p>
        {sub && (
          <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}

function ComparisonCard({ label, current, previous, change, currentLabel, previousLabel }) {
  const isUp = change > 0
  const isZero = change === 0
  return (
    <div className="animate-fade-in-up rounded-2xl bg-white p-3.5 sm:p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-bold ${
            isZero
              ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              : isUp
              ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
          }`}
        >
          {isZero ? (
            <FiMinus className="h-3 w-3" />
          ) : isUp ? (
            <FiArrowUp className="h-3 w-3" />
          ) : (
            <FiArrowDown className="h-3 w-3" />
          )}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-400 dark:text-gray-500 text-[11px] sm:text-xs">{currentLabel}</span>
          <span className="font-bold text-gray-800 dark:text-white">
            {formatRupiah(current)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-400 dark:text-gray-500 text-[11px] sm:text-xs">{previousLabel}</span>
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {formatRupiah(previous)}
          </span>
        </div>
        {/* Visual progress bar */}
        <div className="flex gap-1.5 pt-1">
          <div className="flex-1">
            <div className="h-1.5 sm:h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-700"
                style={{
                  width: `${Math.min(100, previous > 0 ? (current / Math.max(current, previous)) * 100 : current > 0 ? 100 : 0)}%`,
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="h-1.5 sm:h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gray-300 dark:bg-gray-500 transition-all duration-700"
                style={{
                  width: `${Math.min(100, current > 0 ? (previous / Math.max(current, previous)) * 100 : previous > 0 ? 100 : 0)}%`,
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="flex-1 flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="text-[9px] text-gray-400">{currentLabel}</span>
          </div>
          <div className="flex-1 flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-500" />
            <span className="text-[9px] text-gray-400">{previousLabel}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StatsOverview({
  totalFiltered,
  filteredCount,
  avgPerTransaction,
  avgDailySpending,
  highestExpense,
  weekComparison,
  monthComparison,
}) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Mini Stats (2 columns on mobile, 4 on desktop, nicely padded) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 stagger">
        <MiniStatCard
          icon={FiActivity}
          label="Rata-rata / Hari"
          value={formatRupiah(avgDailySpending)}
          iconBg="bg-cyan-50 dark:bg-cyan-900/30"
          iconColor="text-cyan-600 dark:text-cyan-400"
        />
        <MiniStatCard
          icon={FiHash}
          label="Rata / Transaksi"
          value={formatRupiah(avgPerTransaction)}
          sub={`${filteredCount} transaksi`}
          iconBg="bg-indigo-50 dark:bg-indigo-900/30"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
        <MiniStatCard
          icon={FiZap}
          label="Terbesar"
          value={highestExpense ? formatRupiah(highestExpense.amount) : '-'}
          sub={highestExpense ? highestExpense.description : ''}
          iconBg="bg-orange-50 dark:bg-orange-900/30"
          iconColor="text-orange-600 dark:text-orange-400"
        />
        <MiniStatCard
          icon={FiAward}
          label="Pos Teratas"
          value={
            highestExpense
              ? getCategoryById(highestExpense.category).name.split(' ')[0]
              : '-'
          }
          iconBg="bg-pink-50 dark:bg-pink-900/30"
          iconColor="text-pink-600 dark:text-pink-400"
        />
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        <ComparisonCard
          label="Perbandingan Mingguan"
          current={weekComparison.thisWeek}
          previous={weekComparison.lastWeek}
          change={weekComparison.change}
          currentLabel="Minggu ini"
          previousLabel="Minggu lalu"
        />
        <ComparisonCard
          label="Perbandingan Bulanan"
          current={monthComparison.thisMonth}
          previous={monthComparison.lastMonth}
          change={monthComparison.change}
          currentLabel="Bulan ini"
          previousLabel="Bulan lalu"
        />
      </div>
    </div>
  )
}
