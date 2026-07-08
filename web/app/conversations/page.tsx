'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { conversationsApi, getErrorMessage } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { ConversationItem } from '@/components/ConversationItem'
import { ConversationStatusBadge } from '@/components/ConversationStatusBadge'
import { Pagination } from '@/components/Pagination'
import { PageLoader } from '@/components/LoadingSpinner'
import { useToast } from '@/components/ToastProvider'
import type { Conversation, PaginatedResponse, ConversationStatus } from '@/types'

const STATUSES: { label: string; value: ConversationStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
  { label: 'Flagged', value: 'flagged' },
]

export default function ConversationListPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [result, setResult] = useState<PaginatedResponse<Conversation> | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<ConversationStatus | ''>('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router])

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page, limit: 20 }
      if (status) params.status = status
      const { data } = await conversationsApi.list(params)
      setResult(data)
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }, [page, status, toast])

  useEffect(() => {
    if (isAuthenticated) fetch()
  }, [isAuthenticated, fetch])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          {result && (
            <span className="text-sm text-gray-400">{result.pagination.total} conversation(s)</span>
          )}
        </div>

        {/* Status filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => { setStatus(s.value); setPage(1) }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                status === s.value
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="card">
          {loading ? (
            <PageLoader />
          ) : !result || result.data.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="font-medium text-gray-500">No conversations yet</p>
            </div>
          ) : (
            result.data.map((conv) => (
              <ConversationItem key={conv.id} conversation={conv} currentUid={user!.uid} />
            ))
          )}
        </div>

        {result && (
          <Pagination pagination={result.pagination} onPage={setPage} />
        )}
      </main>
    </div>
  )
}
