import type { ConversationStatus } from '@/types'

const styles: Record<ConversationStatus, string> = {
  open: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
  flagged: 'bg-red-100 text-red-700',
}

export function ConversationStatusBadge({ status }: { status: ConversationStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  )
}
