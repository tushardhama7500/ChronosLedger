import { ReactNode } from 'react'
import { Trash2 } from 'lucide-react'

export interface EntityTableColumn<T> {
  header: string
  render: (item: T) => ReactNode
}

interface EntityTableProps<T> {
  columns: EntityTableColumn<T>[]
  items: T[]
  getKey: (item: T) => string | number
  emptyMessage: string
  isLoading?: boolean
  onDelete?: (item: T) => void
}

export default function EntityTable<T>({
  columns,
  items,
  getKey,
  emptyMessage,
  isLoading = false,
  onDelete,
}: EntityTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {column.header}
                </th>
              ))}
              {onDelete && (
                <th scope="col" className="w-20 px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading && (
              <tr>
                <td colSpan={columns.length + (onDelete ? 1 : 0)} className="px-6 py-8 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            )}

            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={columns.length + (onDelete ? 1 : 0)} className="px-6 py-8 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!isLoading &&
              items.map((item) => (
                <tr key={getKey(item)} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.header} className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {column.render(item)}
                    </td>
                  ))}
                  {onDelete && (
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        title="Delete"
                        className="inline-flex h-9 w-9 items-center justify-center rounded border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
