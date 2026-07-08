'use client'

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Vehicles', 'Books', 'Other']

interface Props {
  value: string
  onChange: (category: string) => void
}

export function CategoryFilter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const active = value === (cat === 'All' ? '' : cat)
        return (
          <button
            key={cat}
            onClick={() => onChange(cat === 'All' ? '' : cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              active
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400 hover:text-primary-600'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
