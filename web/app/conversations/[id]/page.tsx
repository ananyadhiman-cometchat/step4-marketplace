'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { conversationsApi, listingsApi, getErrorMessage } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { MessageList } from '@/components/MessageList'
import { MessageComposer } from '@/components/MessageComposer'
import { CallButton } from '@/components/CallButton'
import { ListingContextCard } from '@/components/ListingContextCard'
import { ConversationStatusBadge } from '@/components/ConversationStatusBadge'
import { PageLoader } from '@/components/LoadingSpinner'
import { useToast } from '@/components/ToastProvider'
import type { Conversation, Listing, Message } from '@/types'

export default function ConversationThreadPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [listing, setListing] = useState<Listing | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated || !id) return
    conversationsApi
      .get(id)
      .then(({ data }) => {
        setConversation(data)
        return listingsApi.get(data.listing_id)
      })
      .then(({ data }) => setListing(data))
      .catch((err) => {
        toast(getErrorMessage(err), 'error')
        router.replace('/conversations')
      })
      .finally(() => setLoading(false))
  }, [isAuthenticated, id, toast, router])

  const handleSend = useCallback(async (text: string) => {
    // CometChat SDK send is wired in the integration phase.
    // For now, append optimistically as a local message.
    const mock: Message = {
      id: Date.now(),
      conversation_id: id,
      sender_uid: user!.uid,
      text,
      type: 'text',
      sent_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, mock])
  }, [id, user])

  if (!isAuthenticated) return null
  if (loading) return <><Navbar /><PageLoader /></>
  if (!conversation) return null

  const other = conversation.buyer.uid === user!.uid ? conversation.seller : conversation.buyer
  const isClosed = conversation.status === 'closed'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/conversations" className="text-gray-400 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm">
              {other.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{other.name}</p>
              <ConversationStatusBadge status={conversation.status} />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <CallButton type="audio" disabled={isClosed} />
            <CallButton type="video" disabled={isClosed} />
          </div>
        </div>

        {/* Listing context */}
        {listing && <ListingContextCard listing={listing} />}

        {/* Chat area */}
        <div className="card flex flex-col flex-1 min-h-[400px]">
          <MessageList messages={messages} currentUid={user!.uid} />
          <MessageComposer onSend={handleSend} disabled={isClosed} />
        </div>

        {isClosed && (
          <p className="text-center text-xs text-gray-400">This conversation is closed.</p>
        )}
      </main>
    </div>
  )
}
