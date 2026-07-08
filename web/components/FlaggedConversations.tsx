'use client'
import Link from 'next/link'
import type { Conversation } from '@/types'
import { ConversationStatusBadge } from './ConversationStatusBadge'
import { RemoveListingButton } from './RemoveListingButton'

interface Props {
  conversations: Conversation[]
  onUpdate: (id: string, status: 'closed') => void
}

export function FlaggedConversations({ conversations, onUpdate }: Props) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium text-gray-500">No flagged conversations</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conv) => (
        <div key={conv.id} className="py-4 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ConversationStatusBadge status={conv.status} />
              <span className="text-xs text-gray-400">ID: {conv.id}</span>
            </div>
            <p className="text-sm text-gray-900">
              <span className="font-medium">{conv.buyer.name}</span>
              {' ↔ '}
              <span className="font-medium">{conv.seller.name}</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Listing: {conv.listing_id}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href={`/conversations/${conv.id}`} className="btn-secondary text-xs py-1 px-2">
              View
            </Link>
            <RemoveListingButton listingId={conv.listing_id} />
            <button
              onClick={() => onUpdate(conv.id, 'closed')}
              className="btn-danger text-xs py-1 px-2"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
