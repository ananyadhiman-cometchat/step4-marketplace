'use client'
import { useState, FormEvent, KeyboardEvent } from 'react'

interface Props {
  onSend: (text: string) => Promise<void>
  disabled?: boolean
}

export function MessageComposer({ onSend, disabled }: Props) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async () => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setSending(true)
    try {
      await onSend(trimmed)
      setText('')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end p-4 border-t border-gray-200 bg-white">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message… (Enter to send)"
        rows={1}
        disabled={disabled || sending}
        className="input resize-none flex-1"
        style={{ minHeight: '40px', maxHeight: '120px' }}
        data-testid="message-composer"
      />
      <button
        type="submit"
        disabled={!text.trim() || sending || disabled}
        className="btn-primary flex-shrink-0"
        data-testid="send-button"
      >
        {sending ? '…' : 'Send'}
      </button>
    </form>
  )
}
