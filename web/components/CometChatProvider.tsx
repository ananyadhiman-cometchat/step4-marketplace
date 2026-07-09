'use client'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  CometChatUIKit,
  UIKitSettingsBuilder,
  CometChatIncomingCall,
  CometChatOutgoingCall,
} from '@cometchat/chat-uikit-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatCometChatError, logCometChatError } from '@/lib/cometchat/errors'

interface CometChatContextValue {
  isReady: boolean
}

const CometChatContext = createContext<CometChatContextValue>({ isReady: false })

export const useCometChat = () => useContext(CometChatContext)

let initialized = false
let loginInFlight: Promise<unknown> | null = null

async function ensureLoggedIn(authToken: string): Promise<void> {
  const existing = await CometChatUIKit.getLoggedinUser()
  if (existing) return
  if (loginInFlight) {
    await loginInFlight
    return
  }
  loginInFlight = CometChatUIKit.loginWithAuthToken(authToken)
  try {
    await loginInFlight
  } finally {
    loginInFlight = null
  }
}

export function CometChatProvider({ children }: { children: ReactNode }) {
  const { cometchatToken } = useAuth()
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = cometchatToken
    if (!token) {
      if (initialized) {
        CometChatUIKit.logout().catch(() => {})
      }
      setIsReady(false)
      return
    }

    async function setup() {
      try {
        if (!initialized) {
          initialized = true
          const settings = new UIKitSettingsBuilder()
            .setAppId(process.env.NEXT_PUBLIC_COMETCHAT_APP_ID!)
            .setRegion(process.env.NEXT_PUBLIC_COMETCHAT_REGION!)
            .setAuthKey(process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY!)
            .subscribePresenceForAllUsers()
            .build()
          await CometChatUIKit.init(settings)
        }
        await ensureLoggedIn(token as string)
        setIsReady(true)
      } catch (e) {
        logCometChatError(e)
        setError(formatCometChatError(e))
      }
    }

    setup()
  }, [cometchatToken]) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div
        role="alert"
        style={{
          color: '#b91c1c',
          padding: 16,
          fontFamily: 'ui-monospace, monospace',
          whiteSpace: 'pre-wrap',
        }}
      >
        <strong>CometChat failed to initialize.</strong>
        <div style={{ marginTop: 8 }}>{error}</div>
      </div>
    )
  }

  return (
    <CometChatContext.Provider value={{ isReady }}>
      {children}
      {isReady && (
        <div className="cc-call-overlay">
          <CometChatIncomingCall />
          <CometChatOutgoingCall />
        </div>
      )}
    </CometChatContext.Provider>
  )
}
