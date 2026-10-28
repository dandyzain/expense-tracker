import { FiTrendingUp, FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi'
import { formatRupiah } from '../utils/formatters'

const cards = [
  {
    key: 'today',
    label: 'Hari Ini',
    icon: FiClock,
    gradient: 'from-blue-500 to-blue-600',
    shadowColor: 'shadow-blue-500/30',
  },
  {
    key: 'month',
    label: 'Bulan Ini',
    icon: FiCalendar,
    gradient: 'from-emerald-500 to-emerald-600',
    shadowColor: 'shadow-emerald-500/30',
  },
  {
    key: 'filtered',
    label: 'Total Terfilter',
    icon: FiTrendingUp,
    gradient: 'from-violet-500 to-violet-600',
    shadowColor: 'shadow-violet-500/30',
  },
  {
    key: 'all',
    label: 'Total Keseluruhan',
    icon: FiDollarSign,
    gradient: 'from-amber-500 to-amber-600',
    shadowColor: 'shadow-amber-500/30',
  },
]

export default function SummaryCards({ totalToday, totalThisMonth, totalFiltered, totalAll }) {
  const values = {
    today: totalToday,
    month: totalThisMonth,
    filtered: totalFiltered,
    all: totalAll,
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger">
      {cards.map(({ key, label, icon: Icon, gradient, shadowColor }) => (
        <div
          key={key}
          className={`animate-fade-in-up relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4 sm:p-5 text-white shadow-lg ${shadowColor} transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] cursor-default`}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 h-20 w-20 rounded-full bg-white/5" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-white/20 p-1.5 backdrop-blur-sm">
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-white/80">{label}</p>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight truncate">
              {formatRupiah(values[key])}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
