'use client'
import { ReactNode } from 'react'

// Placeholder provider — CometChat SDK is wired up in the CometChat integration phase.
export function CometChatProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
