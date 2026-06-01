import { useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import { useWarehouses } from '../hooks/useWarehouses'
import { useSuppliers } from '../hooks/useSuppliers'
import { useCreateUser } from '../hooks/useUsers'
import { useCreateWarehouse } from '../hooks/useWarehouses'
import { useCreateSupplier } from '../hooks/useSuppliers'

function EntityList<T>({ title, items, render }: { title: string; items: T[]; render: (item: T) => React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No records found.</p>
        ) : (
          items.map((item, index) => <div key={index} className="rounded-lg border border-gray-100 p-3">{render(item)}</div>)
        )}
      </div>
    </div>
  )
}

export default function EntitiesPage() {
  const { data: usersData, isLoading: usersLoading } = useUsers()
  const { data: warehousesData, isLoading: warehousesLoading } = useWarehouses()
  const { data: suppliersData, isLoading: suppliersLoading } = useSuppliers()

  const createUserMutation = useCreateUser()
  const createWarehouseMutation = useCreateWarehouse()
  const createSupplierMutation = useCreateSupplier()

  const [userName, setUserName] = useState('')
  const [warehouseName, setWarehouseName] = useState('')
  const [supplierName, setSupplierName] = useState('')

  const isAnyLoading = usersLoading || warehousesLoading || suppliersLoading
  const users = usersData?.items ?? []
  const warehouses = warehousesData?.items ?? []
  const suppliers = suppliersData?.items ?? []

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <EntityList
          title="Users"
          items={users}
          render={(user) => (
            <div>
              <p className="font-semibold text-gray-900">{user.full_name || 'Unnamed User'}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          )}
        />

        <EntityList
          title="Warehouses"
          items={warehouses}
          render={(warehouse) => (
            <div>
              <p className="font-semibold text-gray-900">{warehouse.name}</p>
              <p className="text-sm text-gray-500">{warehouse.city ?? warehouse.country ?? 'No location'}</p>
            </div>
          )}
        />

        <EntityList
          title="Suppliers"
          items={suppliers}
          render={(supplier) => (
            <div>
              <p className="font-semibold text-gray-900">{supplier.name}</p>
              <p className="text-sm text-gray-500">{supplier.email ?? supplier.phone ?? 'No contact info'}</p>
            </div>
          )}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create User</h3>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              createUserMutation.mutate({
                full_name: userName,
                email: `${userName.replace(/\s+/g, '.').toLowerCase()}@example.com`,
                password: 'password123',
                role: 'staff',
              })
              setUserName('')
            }}
            className="space-y-4"
          >
            <input
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="User name"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              {createUserMutation.isPending ? 'Creating...' : 'Create User'}
            </button>
            {createUserMutation.error && <p className="text-sm text-red-600">Unable to create user.</p>}
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Warehouse</h3>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              createWarehouseMutation.mutate({
                name: warehouseName,
                code: warehouseName.replace(/\s+/g, '-').toUpperCase().slice(0, 12),
                country: 'US',
              })
              setWarehouseName('')
            }}
            className="space-y-4"
          >
            <input
              value={warehouseName}
              onChange={(event) => setWarehouseName(event.target.value)}
              placeholder="Warehouse name"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              {createWarehouseMutation.isPending ? 'Creating...' : 'Create Warehouse'}
            </button>
            {createWarehouseMutation.error && <p className="text-sm text-red-600">Unable to create warehouse.</p>}
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Supplier</h3>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              createSupplierMutation.mutate({ name: supplierName, email: 'contact@example.com' })
              setSupplierName('')
            }}
            className="space-y-4"
          >
            <input
              value={supplierName}
              onChange={(event) => setSupplierName(event.target.value)}
              placeholder="Supplier name"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              {createSupplierMutation.isPending ? 'Creating...' : 'Create Supplier'}
            </button>
            {createSupplierMutation.error && <p className="text-sm text-red-600">Unable to create supplier.</p>}
          </form>
        </div>
      </div>

      {isAnyLoading && <p className="text-sm text-gray-500">Loading current data...</p>}
    </div>
  )
}
