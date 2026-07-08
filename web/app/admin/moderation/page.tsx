'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { conversationsApi, getErrorMessage } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { FlaggedConversations } from '@/components/FlaggedConversations'
import { Pagination } from '@/components/Pagination'
import { PageLoader } from '@/components/LoadingSpinner'
import { useToast } from '@/components/ToastProvider'
import type { Conversation, PaginatedResponse } from '@/types'

export default function AdminModerationPage() {
  const { isAuthenticated, hasRole } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [result, setResult] = useState<PaginatedResponse<Conversation> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return }
    if (!hasRole('admin', 'moderator')) router.replace('/')
  }, [isAuthenticated, hasRole, router])

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await conversationsApi.list({ status: 'flagged', page, limit: 20 })
      setResult(data)
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }, [page, toast])

  useEffect(() => {
    if (isAuthenticated && hasRole('admin', 'moderator')) fetch()
  }, [isAuthenticated, hasRole, fetch])

  const handleUpdate = async (id: string, status: 'closed') => {
    try {
      await conversationsApi.updateStatus(id, status)
      setResult((prev) =>
        prev
          ? { ...prev, data: prev.data.filter((c) => c.id !== id) }
          : prev
      )
      toast('Conversation closed', 'success')
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    }
  }

  if (!isAuthenticated || !hasRole('admin', 'moderator')) return null
  if (loading && !result) return <><Navbar /><PageLoader /></>

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Moderation</h1>
            <p className="text-sm text-gray-500 mt-0.5">Flagged conversations requiring action</p>
          </div>
          {result && (
            <span className="text-sm text-gray-400">{result.pagination.total} flagged</span>
          )}
        </div>

        <div className="card p-6">
          {loading ? (
            <PageLoader />
          ) : (
            <FlaggedConversations
              conversations={result?.data ?? []}
              onUpdate={handleUpdate}
            />
          )}
        </div>

        {result && <Pagination pagination={result.pagination} onPage={setPage} />}
      </main>
    </div>
  )
}
