import { FiSun, FiMoon, FiDollarSign } from 'react-icons/fi'

export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-800 animate-fade-in-down">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5 group cursor-default">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <FiDollarSign className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white transition-colors">
              CatatDuit
            </h1>
            <p className="hidden sm:block text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5 transition-colors">
              Pencatatan Pengeluaran Pribadi
            </p>
          </div>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="relative rounded-full p-2.5 text-gray-500 transition-all duration-300 hover:bg-gray-100 hover:scale-110 active:scale-95 dark:text-gray-400 dark:hover:bg-gray-800"
          title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
        >
          <div className="relative h-5 w-5">
            <FiSun
              className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
                darkMode
                  ? 'rotate-0 scale-100 opacity-100'
                  : 'rotate-90 scale-0 opacity-0'
              }`}
            />
            <FiMoon
              className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
                darkMode
                  ? '-rotate-90 scale-0 opacity-0'
                  : 'rotate-0 scale-100 opacity-100'
              }`}
            />
          </div>
        </button>
      </div>
    </header>
  )
}
