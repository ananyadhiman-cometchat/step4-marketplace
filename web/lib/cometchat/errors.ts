export function formatCometChatError(e: unknown): string {
  if (e == null) return 'Unknown CometChat error.'
  const err = e as Record<string, unknown>
  const code =
    (err.code as string | undefined) ?? (err.errorCode as string | undefined)
  const message =
    (err.message as string | undefined) ?? (err.errorDescription as string | undefined)
  if (code && message) return `[CometChat ${code}] ${message}`
  if (message) return `[CometChat] ${message}`
  try {
    return `[CometChat] ${JSON.stringify(e)}`
  } catch {
    return `[CometChat] ${String(e)}`
  }
}

const KNOWN_HINTS: Record<string, string> = {
  ERROR_API_KEY_NOT_FOUND:
    'Auth Key is missing or invalid. Check NEXT_PUBLIC_COMETCHAT_AUTH_KEY in .env.local.',
  ERR_UID_NOT_FOUND:
    'The UID does not exist in this CometChat app. Verify the mkt-prefixed UID is created on the backend.',
  ERR_AUTH_TOKEN_NOT_FOUND:
    'Auth token is empty or expired. Re-mint it from the backend via /api/auth/login.',
  AUTH_ERR_BOT:
    'This UID is a Bot in the dashboard — auth-key login is refused for bot users.',
}

export function logCometChatError(e: unknown): void {
  const formatted = formatCometChatError(e)
  console.error(formatted, e)
  const code =
    (e as { code?: string; errorCode?: string })?.code ??
    (e as { code?: string; errorCode?: string })?.errorCode
  if (code && KNOWN_HINTS[code]) {
    console.warn(`[CometChat hint] ${KNOWN_HINTS[code]}`)
  }
}
