import {
  FiShoppingCart,
  FiCoffee,
  FiTruck,
  FiHome,
  FiHeart,
  FiBook,
  FiFilm,
  FiWifi,
  FiGift,
  FiMoreHorizontal,
} from 'react-icons/fi'

export const CATEGORIES = [
  { id: 'makanan', name: 'Makanan & Minuman', icon: FiCoffee, color: '#F59E0B' },
  { id: 'belanja', name: 'Belanja', icon: FiShoppingCart, color: '#3B82F6' },
  { id: 'transportasi', name: 'Transportasi', icon: FiTruck, color: '#10B981' },
  { id: 'rumah', name: 'Rumah & Utilitas', icon: FiHome, color: '#8B5CF6' },
  { id: 'kesehatan', name: 'Kesehatan', icon: FiHeart, color: '#EF4444' },
  { id: 'pendidikan', name: 'Pendidikan', icon: FiBook, color: '#06B6D4' },
  { id: 'hiburan', name: 'Hiburan', icon: FiFilm, color: '#F97316' },
  { id: 'internet', name: 'Internet & Komunikasi', icon: FiWifi, color: '#6366F1' },
  { id: 'sosial', name: 'Sosial & Hadiah', icon: FiGift, color: '#EC4899' },
  { id: 'lainnya', name: 'Lainnya', icon: FiMoreHorizontal, color: '#6B7280' },
]

export const getCategoryById = (id) => {
  return CATEGORIES.find((cat) => cat.id === id) || CATEGORIES[CATEGORIES.length - 1]
}
