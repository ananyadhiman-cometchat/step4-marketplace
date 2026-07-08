'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { CometChat } from '@cometchat/chat-sdk-javascript'
import { useAuth } from '@/contexts/AuthContext'
import { conversationsApi, listingsApi, getErrorMessage } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { ListingContextCard } from '@/components/ListingContextCard'
import { ConversationStatusBadge } from '@/components/ConversationStatusBadge'
import { PageLoader } from '@/components/LoadingSpinner'
import { useToast } from '@/components/ToastProvider'
import { useCometChat } from '@/components/CometChatProvider'
import type { Conversation, Listing } from '@/types'

// CometChat message components — dynamic to prevent SSR
const CometChatMessageHeader = dynamic(
  () => import('@cometchat/chat-uikit-react').then((m) => ({ default: m.CometChatMessageHeader })),
  { ssr: false }
)
const CometChatMessageList = dynamic(
  () => import('@cometchat/chat-uikit-react').then((m) => ({ default: m.CometChatMessageList })),
  { ssr: false }
)
const CometChatMessageComposer = dynamic(
  () => import('@cometchat/chat-uikit-react').then((m) => ({ default: m.CometChatMessageComposer })),
  { ssr: false }
)

export default function ConversationThreadPage() {
  const { isAuthenticated, user } = useAuth()
  const { isReady } = useCometChat()
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [ccUser, setCcUser] = useState<CometChat.User | null>(null)

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

  // Resolve the peer CometChat.User once the SDK is ready and conversation is loaded.
  // UIDs are namespaced mkt-<backend_uid> per project convention.
  useEffect(() => {
    if (!isReady || !conversation || !user) return
    const otherUid =
      conversation.buyer.uid === user.uid ? conversation.seller.uid : conversation.buyer.uid
    const mktUid = `mkt-${otherUid}`
    CometChat.getUser(mktUid)
      .then(setCcUser)
      .catch(() => {
        // Fallback: try un-namespaced UID (older backend or different convention)
        CometChat.getUser(otherUid).then(setCcUser).catch(() => {})
      })
  }, [isReady, conversation, user])

  if (!isAuthenticated) return null
  if (loading) return <><Navbar /><PageLoader /></>
  if (!conversation) return null

  const other =
    conversation.buyer.uid === user!.uid ? conversation.seller : conversation.buyer
  const isClosed = conversation.status === 'closed'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4">
        {/* Header */}
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

        {/* Listing context */}
        {listing && <ListingContextCard listing={listing} />}

        {/* CometChat message panel */}
        <div
          className="card flex flex-col flex-1 min-h-[400px] overflow-hidden"
          data-testid="cometchat-message-list"
        >
          {isReady && ccUser ? (
            <>
              <CometChatMessageHeader user={ccUser} />
              <div className="flex-1 overflow-hidden">
                <CometChatMessageList user={ccUser} hideReplyInThreadOption={true} />
              </div>
              {!isClosed && <CometChatMessageComposer user={ccUser} />}
            </>
          ) : (
            <PageLoader />
          )}
        </div>

        {isClosed && (
          <p className="text-center text-xs text-gray-400">This conversation is closed.</p>
        )}
      </main>
    </div>
  )
}
