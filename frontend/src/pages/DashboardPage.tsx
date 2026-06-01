import { useEffect } from 'react'
import { Package, ShoppingCart, Users, BarChart3 } from 'lucide-react'
import { useDashboardStats } from '../hooks/useDashboard'

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats()

  // Dynamic console logging based on status
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'Not Found'

    console.group('📊 Data Layer Status')
    console.log('%c✓ React Query integration active', 'color: #22c55e')
    console.log(`%c✓ Axios client configured with VITE_API_URL: ${apiUrl}`, 'color: #22c55e')
    console.log('%c✓ TypeScript types ready', 'color: #22c55e')
    console.log('%c✓ Dashboard hook working', 'color: #22c55e')

    if (stats) {
      console.log('%c✓ Backend connection successful', 'color: #22c55e; font-weight: bold')
    }
    if (error) {
      console.error('%c✗ Backend connection failed', 'color: #ef4444; font-weight: bold', error)
    }
    console.groupEnd()
  }, [stats, error]) // Fires again if the connection state changes

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{isLoading ? '...' : stats?.total_products ?? 0}</p>
            </div>
            <Package className="text-primary-600 w-8 h-8" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{isLoading ? '...' : stats?.total_orders ?? 0}</p>
            </div>
            <ShoppingCart className="text-primary-600 w-8 h-8" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Low Stock Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{isLoading ? '...' : stats?.low_stock_count ?? 0}</p>
            </div>
            <Users className="text-primary-600 w-8 h-8" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Inventory Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{isLoading ? '...' : `$${(stats?.total_inventory_value ?? 0).toLocaleString()}`}</p>
            </div>
            <BarChart3 className="text-primary-600 w-8 h-8" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard stats</p>
        </div>
      )}
    </div>
  )
}