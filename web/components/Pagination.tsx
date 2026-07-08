'use client'
import type { Pagination as PaginationData } from '@/types'

interface Props {
  pagination: PaginationData
  onPage: (page: number) => void
}

export function Pagination({ pagination, onPage }: Props) {
  const { page, limit, total } = pagination
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="btn-secondary px-3 py-1 text-xs disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        className="btn-secondary px-3 py-1 text-xs disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}
