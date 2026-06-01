interface ConfirmDeleteDialogProps {
  title: string
  message: string
  confirmLabel?: string
  isOpen: boolean
  isLoading?: boolean
  error?: string | null
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDeleteDialog({
  title,
  message,
  confirmLabel = 'Delete',
  isOpen,
  isLoading = false,
  error,
  onCancel,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>

        {error && (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
