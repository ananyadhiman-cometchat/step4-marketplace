'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { usersApi, getErrorMessage } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { UserTable } from '@/components/UserTable'
import { Pagination } from '@/components/Pagination'
import { PageLoader } from '@/components/LoadingSpinner'
import { useToast } from '@/components/ToastProvider'
import type { User, PaginatedResponse } from '@/types'

export default function AdminUsersPage() {
  const { isAuthenticated, hasRole } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [result, setResult] = useState<PaginatedResponse<User> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return }
    if (!hasRole('admin')) router.replace('/')
  }, [isAuthenticated, hasRole, router])

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await usersApi.list({ page, limit: 20 })
      setResult(data)
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }, [page, toast])

  useEffect(() => {
    if (isAuthenticated && hasRole('admin')) fetch()
  }, [isAuthenticated, hasRole, fetch])

  const handleUpdate = (uid: string, status: 'active' | 'banned') => {
    setResult((prev) =>
      prev
        ? { ...prev, data: prev.data.map((u) => (u.uid === uid ? { ...u, status } : u)) }
        : prev
    )
  }

  if (!isAuthenticated || !hasRole('admin')) return null
  if (loading && !result) return <><Navbar /><PageLoader /></>

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          {result && (
            <span className="text-sm text-gray-400">{result.pagination.total} users</span>
          )}
        </div>

        <div className="card p-6">
          {loading ? (
            <PageLoader />
          ) : (
            <UserTable users={result?.data ?? []} onUpdate={handleUpdate} />
          )}
        </div>

        {result && <Pagination pagination={result.pagination} onPage={setPage} />}
      </main>
    </div>
  )
}
