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
  {
    id: 'makanan',
    name: 'Makanan & Minuman',
    icon: FiCoffee,
    color: '#F59E0B',
    hasQty: true,
    qtyUnit: 'porsi',
    placeholderQty: '1',
  },
  {
    id: 'belanja',
    name: 'Belanja',
    icon: FiShoppingCart,
    color: '#3B82F6',
    hasQty: true,
    qtyUnit: 'pcs',
    placeholderQty: '1',
  },
  {
    id: 'transportasi',
    name: 'Transportasi',
    icon: FiTruck,
    color: '#10B981',
    hasQty: false,
  },
  {
    id: 'rumah',
    name: 'Rumah & Utilitas',
    icon: FiHome,
    color: '#8B5CF6',
    hasQty: false,
  },
  {
    id: 'kesehatan',
    name: 'Kesehatan',
    icon: FiHeart,
    color: '#EF4444',
    hasQty: false,
  },
  {
    id: 'pendidikan',
    name: 'Pendidikan',
    icon: FiBook,
    color: '#06B6D4',
    hasQty: false,
  },
  {
    id: 'hiburan',
    name: 'Hiburan',
    icon: FiFilm,
    color: '#F97316',
    hasQty: true,
    qtyUnit: 'tiket',
    placeholderQty: '1',
  },
  {
    id: 'internet',
    name: 'Internet & Komunikasi',
    icon: FiWifi,
    color: '#6366F1',
    hasQty: false,
  },
  {
    id: 'sosial',
    name: 'Sosial & Hadiah',
    icon: FiGift,
    color: '#EC4899',
    hasQty: true,
    qtyUnit: 'item',
    placeholderQty: '1',
  },
  {
    id: 'lainnya',
    name: 'Lainnya',
    icon: FiMoreHorizontal,
    color: '#6B7280',
    hasQty: false,
  },
]

export const getCategoryById = (id) => {
  return CATEGORIES.find((cat) => cat.id === id) || CATEGORIES[CATEGORIES.length - 1]
}
