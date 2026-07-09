'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { CometChat } from '@cometchat/chat-sdk-javascript'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'
import { useCometChat } from '@/components/CometChatProvider'
import { PageLoader } from '@/components/LoadingSpinner'

// CometChat components — dynamic ssr:false inside this Client Component
const CometChatConversations = dynamic(
  () => import('@cometchat/chat-uikit-react').then((m) => ({ default: m.CometChatConversations })),
  { ssr: false }
)
const CometChatMessageHeader = dynamic(
  () =>
    import('@cometchat/chat-uikit-react').then((m) => ({ default: m.CometChatMessageHeader })),
  { ssr: false }
)
const CometChatMessageList = dynamic(
  () =>
    import('@cometchat/chat-uikit-react').then((m) => ({ default: m.CometChatMessageList })),
  { ssr: false }
)
const CometChatMessageComposer = dynamic(
  () =>
    import('@cometchat/chat-uikit-react').then((m) => ({
      default: m.CometChatMessageComposer,
    })),
  { ssr: false }
)

export default function ConversationsPage() {
  const { isAuthenticated } = useAuth()
  const { isReady } = useCometChat()
  const router = useRouter()

  const [selectedUser, setSelectedUser] = useState<CometChat.User | undefined>()
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group | undefined>()

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  function handleConversationClick(conversation: CometChat.Conversation) {
    const entity = conversation.getConversationWith()
    if (entity instanceof CometChat.User) {
      setSelectedUser(entity)
      setSelectedGroup(undefined)
    } else if (entity instanceof CometChat.Group) {
      setSelectedUser(undefined)
      setSelectedGroup(entity)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 flex overflow-hidden">
        {isReady ? (
          <>
            {/* Conversation list panel */}
            <div
              className="w-80 flex-shrink-0 border-r border-gray-200 overflow-hidden"
              data-testid="cometchat-conversation-list"
            >
              <CometChatConversations onItemClick={handleConversationClick} />
            </div>

            {/* Message panel */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              {selectedUser || selectedGroup ? (
                <>
                  {selectedUser && <CometChatMessageHeader user={selectedUser} />}
                  {selectedGroup && <CometChatMessageHeader group={selectedGroup} />}
                  <div className="cc-msg-list">
                    {selectedUser && (
                      <CometChatMessageList
                        user={selectedUser}
                        hideReplyInThreadOption={true}
                      />
                    )}
                    {selectedGroup && (
                      <CometChatMessageList
                        group={selectedGroup}
                        hideReplyInThreadOption={true}
                      />
                    )}
                  </div>
                  {selectedUser && <CometChatMessageComposer user={selectedUser} />}
                  {selectedGroup && <CometChatMessageComposer group={selectedGroup} />}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500">
                      Select a conversation to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <PageLoader />
          </div>
        )}
      </main>
    </div>
  )
}
