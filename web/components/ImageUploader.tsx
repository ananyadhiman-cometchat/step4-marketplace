'use client'
import { useState } from 'react'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageUploader({ images, onChange }: Props) {
  const [urlInput, setUrlInput] = useState('')

  const addUrl = () => {
    const trimmed = urlInput.trim()
    if (!trimmed || images.includes(trimmed)) return
    onChange([...images, trimmed])
    setUrlInput('')
  }

  const remove = (url: string) => onChange(images.filter((img) => img !== url))

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
          placeholder="Paste image URL…"
          className="input flex-1"
        />
        <button type="button" onClick={addUrl} className="btn-secondary flex-shrink-0">
          Add
        </button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url) => (
            <div key={url} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full aspect-square object-cover rounded-lg border border-gray-200" />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        {images.length === 0 ? 'No images added. Paste a URL above.' : `${images.length} image(s) added.`}
      </p>
    </div>
  )
}
