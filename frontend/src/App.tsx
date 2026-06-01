import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { BarChart3, Building2, Truck, Users } from 'lucide-react'
import { Toaster } from 'sonner'
import DashboardPage from './pages/DashboardPage'
import SuppliersPage from './pages/SuppliersPage'
import UsersPage from './pages/UsersPage'
import WarehousesPage from './pages/WarehousesPage'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/warehouses', label: 'Warehouses', icon: Building2 },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
]

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ChronosLedger</h1>
            <p className="mt-2 text-gray-600">Smart Inventory & Order Intelligence</p>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    'inline-flex items-center gap-2 rounded border px-3 py-2 text-sm font-medium',
                    isActive
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
                  ].join(' ')
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/warehouses" element={<WarehousesPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
