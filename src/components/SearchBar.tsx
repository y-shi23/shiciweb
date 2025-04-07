import { useState, useEffect, useRef } from 'react'
import { Poem } from '../data/poems'

interface SearchBarProps {
  poems: Poem[]
  onSelect: (poem: Poem) => void
}

const SearchBar = ({ poems, onSelect }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Poem[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      const filtered = poems.filter(
        poem => poem.title.includes(value) || poem.author.includes(value)
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSelect = (poem: Poem) => {
    setQuery('')
    setSuggestions([])
    onSelect(poem)
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="唯见月寒日暖，来煎人寿。"
          className="w-full px-4 py-3 text-lg border border-button/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-button focus:border-transparent bg-block"
        />
      </div>

      {isFocused && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-block rounded-lg shadow-lg border border-button/20 max-h-96 overflow-y-auto">
          {suggestions.map((poem, index) => (
            <div
              key={index}
              onClick={() => handleSelect(poem)}
              className="px-4 py-2 hover:bg-button/10 cursor-pointer"
            >
              <div className="font-medium">{poem.title}</div>
              <div className="text-sm text-gray-500">{poem.dynasty} · {poem.author}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar 