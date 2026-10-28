export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const formatDateShort = (dateStr) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export const getToday = () => {
  return new Date().toISOString().split('T')[0]
}

export const getMonthYear = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export const getCurrentMonthYear = () => {
  return getMonthYear(new Date().toISOString())
}

export const getMonthName = (dateStr) => {
  const date = new Date(dateStr + '-01')
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date)
}
