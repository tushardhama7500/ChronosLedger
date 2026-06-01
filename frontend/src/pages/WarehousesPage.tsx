import { FormEvent, useMemo, useState } from 'react'
import ConfirmDeleteDialog from '../components/ui/ConfirmDeleteDialog'
import EntityTable from '../components/ui/EntityTable'
import { useCreateWarehouse, useDeleteWarehouse, useWarehouses } from '../hooks/useWarehouses'
import { Warehouse } from '../types/warehouse'

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message)
  }
  return fallback
}

export default function WarehousesPage() {
  const { data, isLoading, error } = useWarehouses({ page: 1, page_size: 50 })
  const createWarehouse = useCreateWarehouse()
  const deleteWarehouse = useDeleteWarehouse()

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('US')
  const [address, setAddress] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Warehouse | null>(null)

  const warehouses = data?.items ?? []

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        render: (warehouse: Warehouse) => <span className="font-medium text-gray-900">{warehouse.name}</span>,
      },
      { header: 'Code', render: (warehouse: Warehouse) => warehouse.code },
      { header: 'City', render: (warehouse: Warehouse) => warehouse.city || '—' },
      { header: 'Country', render: (warehouse: Warehouse) => warehouse.country },
      {
        header: 'Status',
        render: (warehouse: Warehouse) => (
          <span className={warehouse.is_active ? 'text-green-700' : 'text-gray-500'}>
            {warehouse.is_active ? 'Active' : 'Inactive'}
          </span>
        ),
      },
    ],
    [],
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setSuccessMessage(null)

    if (!name.trim()) {
      setFormError('Warehouse name is required.')
      return
    }
    if (!code.trim()) {
      setFormError('Warehouse code is required.')
      return
    }
    if (!country.trim()) {
      setFormError('Country is required.')
      return
    }

    try {
      await createWarehouse.mutateAsync({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        city: city.trim() || undefined,
        country: country.trim().toUpperCase(),
        address: address.trim() || undefined,
        is_active: true,
      })
      setName('')
      setCode('')
      setCity('')
      setCountry('US')
      setAddress('')
      setSuccessMessage('Warehouse created successfully.')
    } catch (err) {
      setFormError(getErrorMessage(err, 'Unable to create warehouse.'))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteWarehouse.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
      setSuccessMessage('Warehouse deleted successfully.')
    } catch {
      // The dialog renders the mutation error below.
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Warehouses</h2>
        <p className="mt-1 text-sm text-gray-600">Track storage locations used by inventory records.</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-900">Create Warehouse</h3>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none" disabled={createWarehouse.isPending} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Code</span>
            <input value={code} onChange={(event) => setCode(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm uppercase focus:border-primary-600 focus:outline-none" disabled={createWarehouse.isPending} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">City</span>
            <input value={city} onChange={(event) => setCity(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none" disabled={createWarehouse.isPending} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Country</span>
            <input value={country} onChange={(event) => setCountry(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm uppercase focus:border-primary-600 focus:outline-none" disabled={createWarehouse.isPending} />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Address</span>
            <input value={address} onChange={(event) => setAddress(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none" disabled={createWarehouse.isPending} />
          </label>
          <div className="md:col-span-2">
            <button type="submit" disabled={createWarehouse.isPending} className="rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
              {createWarehouse.isPending ? 'Creating...' : 'Create Warehouse'}
            </button>
          </div>
        </form>

        {formError && <p className="mt-4 text-sm text-red-600">{formError}</p>}
        {successMessage && <p className="mt-4 text-sm text-green-700">{successMessage}</p>}
      </div>

      {error && <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Unable to load warehouses.</p>}

      <EntityTable
        columns={columns}
        items={warehouses}
        getKey={(warehouse) => warehouse.id}
        emptyMessage="No warehouses found."
        isLoading={isLoading}
        onDelete={setDeleteTarget}
      />

      <ConfirmDeleteDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete warehouse"
        message={`Delete ${deleteTarget?.name ?? 'this warehouse'}? This action cannot be undone.`}
        isLoading={deleteWarehouse.isPending}
        error={deleteWarehouse.error ? getErrorMessage(deleteWarehouse.error, 'Unable to delete warehouse.') : null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
