import { FormEvent, useMemo, useState } from 'react'
import ConfirmDeleteDialog from '../components/ui/ConfirmDeleteDialog'
import EntityTable from '../components/ui/EntityTable'
import { useCreateUser, useDeleteUser, useUsers } from '../hooks/useUsers'
import { User } from '../types/user'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message)
  }
  return fallback
}

export default function UsersPage() {
  const { data, isLoading, error } = useUsers({ page: 1, page_size: 50 })
  const createUser = useCreateUser()
  const deleteUser = useDeleteUser()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  const users = data?.items ?? []

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        render: (user: User) => <span className="font-medium text-gray-900">{user.full_name}</span>,
      },
      { header: 'Email', render: (user: User) => user.email },
      { header: 'Role', render: (user: User) => user.role },
      {
        header: 'Status',
        render: (user: User) => (
          <span className={user.is_active ? 'text-green-700' : 'text-gray-500'}>
            {user.is_active ? 'Active' : 'Inactive'}
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

    if (!fullName.trim()) {
      setFormError('Full name is required.')
      return
    }
    if (!emailPattern.test(email.trim())) {
      setFormError('Enter a valid email address.')
      return
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.')
      return
    }

    try {
      await createUser.mutateAsync({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role: role.trim() || 'staff',
        is_active: true,
      })
      setFullName('')
      setEmail('')
      setPassword('')
      setRole('staff')
      setSuccessMessage('User created successfully.')
    } catch (err) {
      setFormError(getErrorMessage(err, 'Unable to create user.'))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteUser.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
      setSuccessMessage('User deleted successfully.')
    } catch {
      // The dialog renders the mutation error below.
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <p className="mt-1 text-sm text-gray-600">Create staff accounts and manage access records.</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-900">Create User</h3>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Full name</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none"
              disabled={createUser.isPending}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none"
              disabled={createUser.isPending}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none"
              disabled={createUser.isPending}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Role</span>
            <input
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none"
              disabled={createUser.isPending}
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={createUser.isPending}
              className="rounded bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createUser.isPending ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>

        {formError && <p className="mt-4 text-sm text-red-600">{formError}</p>}
        {successMessage && <p className="mt-4 text-sm text-green-700">{successMessage}</p>}
      </div>

      {error && <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Unable to load users.</p>}

      <EntityTable
        columns={columns}
        items={users}
        getKey={(user) => user.id}
        emptyMessage="No users found."
        isLoading={isLoading}
        onDelete={setDeleteTarget}
      />

      <ConfirmDeleteDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete user"
        message={`Delete ${deleteTarget?.full_name ?? 'this user'}? This action cannot be undone.`}
        isLoading={deleteUser.isPending}
        error={deleteUser.error ? getErrorMessage(deleteUser.error, 'Unable to delete user.') : null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
