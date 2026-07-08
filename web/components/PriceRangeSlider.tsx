'use client'
import { useState, useEffect } from 'react'

interface Props {
  min: number
  max: number
  onCommit: (min: number, max: number) => void
}

export function PriceRangeSlider({ min, max, onCommit }: Props) {
  const [localMin, setLocalMin] = useState(min)
  const [localMax, setLocalMax] = useState(max)

  useEffect(() => { setLocalMin(min) }, [min])
  useEffect(() => { setLocalMax(max) }, [max])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
        <span>Price range</span>
        <span>
          {localMin === 0 && localMax === 0 ? 'Any' : `$${localMin} – $${localMax === 0 ? '∞' : localMax}`}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500 mb-0.5 block">Min ($)</label>
          <input
            type="number"
            min={0}
            value={localMin || ''}
            onChange={(e) => setLocalMin(Number(e.target.value))}
            onBlur={() => onCommit(localMin, localMax)}
            placeholder="0"
            className="input text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-0.5 block">Max ($)</label>
          <input
            type="number"
            min={0}
            value={localMax || ''}
            onChange={(e) => setLocalMax(Number(e.target.value))}
            onBlur={() => onCommit(localMin, localMax)}
            placeholder="Any"
            className="input text-sm"
          />
        </div>
      </div>
    </div>
  )
}
