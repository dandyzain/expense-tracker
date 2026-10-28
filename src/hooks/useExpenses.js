import { useState, useEffect, useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { loadExpenses, saveExpenses } from '../utils/storage'
import { getMonthYear, getCurrentMonthYear, getToday } from '../utils/formatters'

export function useExpenses() {
  const [expenses, setExpenses] = useState(() => loadExpenses())
  const [filterMonth, setFilterMonth] = useState(getCurrentMonthYear())
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  const addExpense = useCallback((expense) => {
    const newExpense = {
      ...expense,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }
    setExpenses((prev) => [newExpense, ...prev])
  }, [])

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const updateExpense = useCallback((id, updatedData) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
    )
  }, [])

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => {
        const matchMonth = filterMonth === 'all' || getMonthYear(e.date) === filterMonth
        const matchCategory = filterCategory === 'all' || e.category === filterCategory
        const matchSearch =
          searchQuery === '' ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchMonth && matchCategory && matchSearch
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [expenses, filterMonth, filterCategory, searchQuery])

  const totalAll = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0)
  }, [expenses])

  const totalFiltered = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
  }, [filteredExpenses])

  const totalThisMonth = useMemo(() => {
    const currentMonth = getCurrentMonthYear()
    return expenses
      .filter((e) => getMonthYear(e.date) === currentMonth)
      .reduce((sum, e) => sum + e.amount, 0)
  }, [expenses])

  const totalToday = useMemo(() => {
    const today = getToday()
    return expenses
      .filter((e) => e.date === today)
      .reduce((sum, e) => sum + e.amount, 0)
  }, [expenses])

  const categoryTotals = useMemo(() => {
    const totals = {}
    filteredExpenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount
    })
    return totals
  }, [filteredExpenses])

  const dailyTotals = useMemo(() => {
    const totals = {}
    filteredExpenses.forEach((e) => {
      totals[e.date] = (totals[e.date] || 0) + e.amount
    })
    return Object.entries(totals)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [filteredExpenses])

  const availableMonths = useMemo(() => {
    const months = new Set(expenses.map((e) => getMonthYear(e.date)))
    months.add(getCurrentMonthYear())
    return Array.from(months).sort().reverse()
  }, [expenses])

  // ──────────────── Advanced Statistics ────────────────

  // Monthly totals for trend chart (all expenses, last 6 months)
  const monthlyTrend = useMemo(() => {
    const totals = {}
    expenses.forEach((e) => {
      const my = getMonthYear(e.date)
      totals[my] = (totals[my] || 0) + e.amount
    })
    return Object.entries(totals)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
  }, [expenses])

  // Spending by day of week (filtered)
  const weekdayTotals = useMemo(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const totals = Array(7).fill(0)
    const counts = Array(7).fill(0)
    filteredExpenses.forEach((e) => {
      const d = new Date(e.date).getDay()
      totals[d] += e.amount
      counts[d] += 1
    })
    // Reorder: Senin first
    const reorder = [1, 2, 3, 4, 5, 6, 0]
    return reorder.map((i) => ({
      day: days[i],
      total: totals[i],
      count: counts[i],
      avg: counts[i] > 0 ? Math.round(totals[i] / counts[i]) : 0,
    }))
  }, [filteredExpenses])

  // Top 5 expenses (filtered)
  const topExpenses = useMemo(() => {
    return [...filteredExpenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [filteredExpenses])

  // Category breakdown with counts and percentages (filtered)
  const categoryBreakdown = useMemo(() => {
    const map = {}
    filteredExpenses.forEach((e) => {
      if (!map[e.category]) map[e.category] = { total: 0, count: 0 }
      map[e.category].total += e.amount
      map[e.category].count += 1
    })
    const grand = totalFiltered || 1
    return Object.entries(map)
      .map(([catId, { total, count }]) => ({
        catId,
        total,
        count,
        percentage: (total / grand) * 100,
        avg: Math.round(total / count),
      }))
      .sort((a, b) => b.total - a.total)
  }, [filteredExpenses, totalFiltered])

  // Average per transaction (filtered)
  const avgPerTransaction = useMemo(() => {
    return filteredExpenses.length > 0
      ? Math.round(totalFiltered / filteredExpenses.length)
      : 0
  }, [filteredExpenses, totalFiltered])

  // Average daily spending (filtered)
  const avgDailySpending = useMemo(() => {
    if (filteredExpenses.length === 0) return 0
    const dates = new Set(filteredExpenses.map((e) => e.date))
    return Math.round(totalFiltered / dates.size)
  }, [filteredExpenses, totalFiltered])

  // Highest single expense (filtered)
  const highestExpense = useMemo(() => {
    if (filteredExpenses.length === 0) return null
    return filteredExpenses.reduce((max, e) => (e.amount > max.amount ? e : max), filteredExpenses[0])
  }, [filteredExpenses])

  // Week comparison: this week vs last week (all expenses)
  const weekComparison = useMemo(() => {
    const now = new Date()
    const dayOfWeek = now.getDay() || 7 // 1=Mon, 7=Sun
    const mondayThisWeek = new Date(now)
    mondayThisWeek.setDate(now.getDate() - dayOfWeek + 1)
    mondayThisWeek.setHours(0, 0, 0, 0)

    const mondayLastWeek = new Date(mondayThisWeek)
    mondayLastWeek.setDate(mondayThisWeek.getDate() - 7)

    const sundayLastWeek = new Date(mondayThisWeek)
    sundayLastWeek.setDate(mondayThisWeek.getDate() - 1)
    sundayLastWeek.setHours(23, 59, 59, 999)

    let thisWeek = 0
    let lastWeek = 0

    expenses.forEach((e) => {
      const d = new Date(e.date)
      if (d >= mondayThisWeek) thisWeek += e.amount
      else if (d >= mondayLastWeek && d <= sundayLastWeek) lastWeek += e.amount
    })

    const change = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : thisWeek > 0 ? 100 : 0

    return { thisWeek, lastWeek, change }
  }, [expenses])

  // Month comparison: this month vs last month
  const monthComparison = useMemo(() => {
    const now = new Date()
    const thisMonth = getMonthYear(now.toISOString())
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonth = getMonthYear(lastMonthDate.toISOString())

    let thisTotal = 0
    let lastTotal = 0

    expenses.forEach((e) => {
      const my = getMonthYear(e.date)
      if (my === thisMonth) thisTotal += e.amount
      else if (my === lastMonth) lastTotal += e.amount
    })

    const change = lastTotal > 0 ? ((thisTotal - lastTotal) / lastTotal) * 100 : thisTotal > 0 ? 100 : 0

    return { thisMonth: thisTotal, lastMonth: lastTotal, change }
  }, [expenses])

  // Hourly distribution based on createdAt (all expenses)
  const hourlyDistribution = useMemo(() => {
    const hours = Array(24).fill(0)
    expenses.forEach((e) => {
      if (e.createdAt) {
        const h = new Date(e.createdAt).getHours()
        hours[h] += 1
      }
    })
    return hours.map((count, hour) => ({
      hour: `${String(hour).padStart(2, '0')}:00`,
      count,
    }))
  }, [expenses])

  return {
    expenses: filteredExpenses,
    allExpenses: expenses,
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
    // Advanced
    monthlyTrend,
    weekdayTotals,
    topExpenses,
    categoryBreakdown,
    avgPerTransaction,
    avgDailySpending,
    highestExpense,
    weekComparison,
    monthComparison,
    hourlyDistribution,
  }
}
