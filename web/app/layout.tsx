import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/ToastProvider'
import { CometChatProvider } from '@/components/CometChatProvider'

// Force dynamic rendering so CometChat's browser-only module graph
// (window/document at import time) never runs during static prerender.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Buy and sell with confidence',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <CometChatProvider>
              {children}
            </CometChatProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
