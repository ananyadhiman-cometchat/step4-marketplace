import Link from 'next/link'
import type { Conversation } from '@/types'
import { ConversationStatusBadge } from './ConversationStatusBadge'

interface Props {
  conversation: Conversation
  currentUid: string
}

export function ConversationItem({ conversation, currentUid }: Props) {
  const other =
    conversation.buyer.uid === currentUid ? conversation.seller : conversation.buyer
  const date = new Date(conversation.created_at).toLocaleDateString()

  return (
    <Link
      href={`/conversations/${conversation.id}`}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
    >
      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm flex-shrink-0">
        {other.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-gray-900 text-sm truncate">{other.name}</p>
          <span className="text-xs text-gray-400 flex-shrink-0">{date}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <ConversationStatusBadge status={conversation.status} />
          <span className="text-xs text-gray-400 truncate">re: listing {conversation.listing_id.slice(0, 8)}…</span>
        </div>
      </div>
      <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}
