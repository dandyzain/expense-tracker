import { useState, useEffect } from 'react'
import { FiList, FiBarChart2, FiPieChart } from 'react-icons/fi'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import ExpenseForm from './components/ExpenseForm'
import Filters from './components/Filters'
import ExpenseList from './components/ExpenseList'
import Charts from './components/Charts'
import StatsOverview from './components/StatsOverview'
import CategoryBreakdown from './components/CategoryBreakdown'
import TopExpenses from './components/TopExpenses'
import ReportInsights from './components/ReportInsights'
import { useExpenses } from './hooks/useExpenses'

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('expense-tracker-dark')
    if (saved !== null) return JSON.parse(saved)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState('list') // 'list' | 'chart' | 'report'

  useEffect(() => {
    localStorage.setItem('expense-tracker-dark', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const {
    expenses,
    allExpenses,
    addExpense,
    deleteExpense,
    updateExpense,
    filterMonth,
    setFilterMonth,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    totalAll,
    totalFiltered,
    totalThisMonth,
    totalToday,
    categoryTotals,
    dailyTotals,
    availableMonths,
    monthlyTrend,
    weekdayTotals,
    topExpenses,
    categoryBreakdown,
    avgPerTransaction,
    avgDailySpending,
    highestExpense,
    weekComparison,
    monthComparison,
  } = useExpenses()

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900 pb-24">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">
        {/* Top Summary Cards */}
        <SummaryCards
          totalToday={totalToday}
          totalThisMonth={totalThisMonth}
          totalFiltered={totalFiltered}
          totalAll={totalAll}
        />

        {/* 3-Tab Navigation Switcher */}
        <div
          className="animate-fade-in-up flex rounded-xl bg-white p-1 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300"
          style={{ animationDelay: '150ms' }}
        >
          <button
            onClick={() => setActiveTab('list')}
            className={`relative flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === 'list'
                ? 'text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {activeTab === 'list' && (
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30 transition-all duration-300" />
            )}
            <FiList className="relative h-4 w-4" />
            <span className="relative">Transaksi</span>
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            className={`relative flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === 'chart'
                ? 'text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {activeTab === 'chart' && (
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30 transition-all duration-300" />
            )}
            <FiBarChart2 className="relative h-4 w-4" />
            <span className="relative">Grafik & Tren</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`relative flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === 'report'
                ? 'text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {activeTab === 'report' && (
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30 transition-all duration-300" />
            )}
            <FiPieChart className="relative h-4 w-4" />
            <span className="relative">Laporan & Statistik</span>
          </button>
        </div>

        {/* Filters */}
        <Filters
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          availableMonths={availableMonths}
          expenseCount={expenses.length}
        />

        {/* Content based on Active Tab */}
        <div className="transition-all duration-300">
          {activeTab === 'list' && (
            <ExpenseList
              expenses={expenses}
              onDelete={deleteExpense}
              onUpdate={updateExpense}
            />
          )}

          {activeTab === 'chart' && (
            <div className="space-y-4">
              <Charts
                categoryTotals={categoryTotals}
                dailyTotals={dailyTotals}
                weekdayTotals={weekdayTotals}
                monthlyTrend={monthlyTrend}
              />
            </div>
          )}

          {activeTab === 'report' && (
            <div className="space-y-4">
              {/* Key Metric Stats & Comparison Bars */}
              <StatsOverview
                totalFiltered={totalFiltered}
                filteredCount={expenses.length}
                avgPerTransaction={avgPerTransaction}
                avgDailySpending={avgDailySpending}
                highestExpense={highestExpense}
                weekComparison={weekComparison}
                monthComparison={monthComparison}
              />

              {/* Automated Insights & Export CSV */}
              <ReportInsights
                expenses={expenses}
                weekdayTotals={weekdayTotals}
                categoryBreakdown={categoryBreakdown}
                avgDailySpending={avgDailySpending}
                monthComparison={monthComparison}
              />

              {/* Top 5 Largest Expenses & Category Breakdown side-by-side or stacked */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TopExpenses
                  topExpenses={topExpenses}
                  totalFiltered={totalFiltered}
                />
                <CategoryBreakdown
                  categoryBreakdown={categoryBreakdown}
                  totalFiltered={totalFiltered}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Expense Form (FAB + Slide-up panel) */}
      <ExpenseForm
        onAdd={addExpense}
        isOpen={showForm}
        onToggle={() => setShowForm(!showForm)}
      />
    </div>
  )
}
