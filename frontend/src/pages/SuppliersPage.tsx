import { FormEvent, useMemo, useState } from 'react'
import ConfirmDeleteDialog from '../components/ui/ConfirmDeleteDialog'
import EntityTable from '../components/ui/EntityTable'
import { useCreateSupplier, useDeleteSupplier, useSuppliers } from '../hooks/useSuppliers'
import { Supplier } from '../types/supplier'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message)
  }
  return fallback
}

export default function SuppliersPage() {
  const { data, isLoading, error } = useSuppliers({ page: 1, page_size: 50 })
  const createSupplier = useCreateSupplier()
  const deleteSupplier = useDeleteSupplier()

  const [name, setName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [leadTimeDays, setLeadTimeDays] = useState('7')
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)

  const suppliers = data?.items ?? []

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        render: (supplier: Supplier) => <span className="font-medium text-gray-900">{supplier.name}</span>,
      },
      { header: 'Contact', render: (supplier: Supplier) => supplier.contact_name || '—' },
      { header: 'Email', render: (supplier: Supplier) => supplier.email || '—' },
      { header: 'Lead Time', render: (supplier: Supplier) => `${supplier.lead_time_days} days` },
      {
        header: 'Status',
        render: (supplier: Supplier) => (
          <span className={supplier.is_active ? 'text-green-700' : 'text-gray-500'}>
            {supplier.is_active ? 'Active' : 'Inactive'}
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

    const parsedLeadTime = Number(leadTimeDays)

    if (!name.trim()) {
      setFormError('Supplier name is required.')
      return
    }
    if (email.trim() && !emailPattern.test(email.trim())) {
      setFormError('Enter a valid supplier email address.')
      return
    }
    if (!Number.isInteger(parsedLeadTime) || parsedLeadTime < 0) {
      setFormError('Lead time must be a whole number of days.')
      return
    }

    try {
      await createSupplier.mutateAsync({
        name: name.trim(),
        contact_name: contactName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        lead_time_days: parsedLeadTime,
        is_active: true,
      })
      setName('')
      setContactName('')
      setEmail('')
      setPhone('')
      setLeadTimeDays('7')
      setSuccessMessage('Supplier created successfully.')
    } catch (err) {
      setFormError(getErrorMessage(err, 'Unable to create supplier.'))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteSupplier.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
      setSuccessMessage('Supplier deleted successfully.')
    } catch {
      // The dialog renders the mutation error below.
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
        <p className="mt-1 text-sm text-gray-600">Maintain supplier contacts used by purchasing and inventory.</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-900">Create Supplier</h3>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none" disabled={createSupplier.isPending} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Contact name</span>
            <input value={contactName} onChange={(event) => setContactName(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none" disabled={createSupplier.isPending} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none" disabled={createSupplier.isPending} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Phone</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none" disabled={createSupplier.isPending} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Lead time days</span>
            <input type="number" min="0" step="1" value={leadTimeDays} onChange={(event) => setLeadTimeDays(event.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none" disabled={createSupplier.isPending} />
          </label>
          <div className="md:col-span-2">
            <button type="submit" disabled={createSupplier.isPending} className="rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
              {createSupplier.isPending ? 'Creating...' : 'Create Supplier'}
            </button>
          </div>
        </form>

        {formError && <p className="mt-4 text-sm text-red-600">{formError}</p>}
        {successMessage && <p className="mt-4 text-sm text-green-700">{successMessage}</p>}
      </div>

      {error && <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Unable to load suppliers.</p>}

      <EntityTable
        columns={columns}
        items={suppliers}
        getKey={(supplier) => supplier.id}
        emptyMessage="No suppliers found."
        isLoading={isLoading}
        onDelete={setDeleteTarget}
      />

      <ConfirmDeleteDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete supplier"
        message={`Delete ${deleteTarget?.name ?? 'this supplier'}? This action cannot be undone.`}
        isLoading={deleteSupplier.isPending}
        error={deleteSupplier.error ? getErrorMessage(deleteSupplier.error, 'Unable to delete supplier.') : null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
