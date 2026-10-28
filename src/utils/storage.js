const STORAGE_KEY = 'expense-tracker-data'

export const loadExpenses = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveExpenses = (expenses) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}
