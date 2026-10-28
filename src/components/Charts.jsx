import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
  FiCalendar,
} from 'react-icons/fi'
import { getCategoryById } from '../utils/categories'
import { formatRupiah, formatDateShort, getMonthName } from '../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="animate-scale-in rounded-xl bg-white px-3.5 py-2.5 shadow-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
          {data.payload.name || data.payload.date || data.payload.day || label}
        </p>
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
          {formatRupiah(data.value)}
        </p>
        {data.payload.count !== undefined && (
          <p className="text-[10px] text-gray-400 mt-0.5">
            {data.payload.count} transaksi
          </p>
        )}
      </div>
    )
  }
  return null
}

function CategoryPieChart({ categoryTotals }) {
  const data = Object.entries(categoryTotals).map(([catId, amount]) => {
    const cat = getCategoryById(catId)
    return { name: cat.name, value: amount, color: cat.color }
  })

  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        Belum ada data pengeluaran
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center animate-scale-in">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1.5 max-h-24 overflow-y-auto px-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5 group cursor-default">
            <div
              className="h-2.5 w-2.5 rounded-full transition-transform duration-200 group-hover:scale-150"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[11px] text-gray-500 dark:text-gray-400 transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-200">
              {entry.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DailyAreaChart({ dailyTotals }) {
  if (dailyTotals.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        Belum ada data pengeluaran
      </div>
    )
  }

  const data = dailyTotals.map((d) => ({
    ...d,
    name: formatDateShort(d.date),
  }))

  return (
    <div className="animate-scale-in">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#3B82F6"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#dailyGradient)"
            animationBegin={100}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function WeekdayBarChart({ weekdayTotals }) {
  const hasData = weekdayTotals && weekdayTotals.some((w) => w.total > 0)

  if (!hasData) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        Belum ada data mingguan
      </div>
    )
  }

  return (
    <div className="animate-scale-in">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={weekdayTotals} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="total"
            fill="#10B981"
            radius={[6, 6, 0, 0]}
            animationBegin={200}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function MonthlyTrendChart({ monthlyTrend }) {
  if (!monthlyTrend || monthlyTrend.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        Belum ada riwayat bulanan
      </div>
    )
  }

  const data = monthlyTrend.map((m) => ({
    ...m,
    name: getMonthName(m.month).split(' ')[0],
  }))

  return (
    <div className="animate-scale-in">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#8B5CF6"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#monthlyGradient)"
            animationBegin={250}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function Charts({
  categoryTotals,
  dailyTotals,
  weekdayTotals,
  monthlyTrend,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Category Pie Chart */}
      <div className="animate-fade-in-up rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-violet-100 p-1.5 dark:bg-violet-900/40 transition-colors">
              <FiPieChart className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                Distribusi per Kategori
              </h3>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Porsi pengeluaran per kategori
              </p>
            </div>
          </div>
        </div>
        <CategoryPieChart categoryTotals={categoryTotals} />
      </div>

      {/* 2. Daily Area Chart */}
      <div
        className="animate-fade-in-up rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
        style={{ animationDelay: '100ms' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-1.5 dark:bg-blue-900/40 transition-colors">
              <FiBarChart2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                Tren Pengeluaran Harian
              </h3>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Fluktuasi pengeluaran setiap hari
              </p>
            </div>
          </div>
        </div>
        <DailyAreaChart dailyTotals={dailyTotals} />
      </div>

      {/* 3. Day of Week Chart */}
      <div
        className="animate-fade-in-up rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
        style={{ animationDelay: '150ms' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-1.5 dark:bg-emerald-900/40 transition-colors">
              <FiCalendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                Pola Hari (Senin - Minggu)
              </h3>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Kapan pengeluaran paling sering terjadi
              </p>
            </div>
          </div>
        </div>
        <WeekdayBarChart weekdayTotals={weekdayTotals} />
      </div>

      {/* 4. Monthly Trend Chart */}
      <div
        className="animate-fade-in-up rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
        style={{ animationDelay: '200ms' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-1.5 dark:bg-purple-900/40 transition-colors">
              <FiTrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                Tren 6 Bulan Terakhir
              </h3>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Pertumbuhan pengeluaran antar bulan
              </p>
            </div>
          </div>
        </div>
        <MonthlyTrendChart monthlyTrend={monthlyTrend} />
      </div>
    </div>
  )
}
