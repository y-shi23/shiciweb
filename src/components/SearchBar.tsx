import { useState, useEffect, useRef } from 'react'
import { Poem } from '../data/poems'

interface SearchBarProps {
  poems: Poem[]
  onSelect: (poem: Poem) => void
  onShowAll: (query: string) => void
}

// 搜索框随机提示句
const PLACEHOLDER_QUOTES = [
  { text: "一蓑烟雨任平生。"},
  { text: "人间有味是清欢。"},
  { text: "衣带渐宽终不悔。"},
  { text: "此心安处是吾乡。"},
  { text: "寻寻觅觅，冷冷清清。"},
  { text: "最是人间留不住，朱颜辞镜花辞树。"},
  { text: "只恐双溪舴艋舟，载不动，许多愁。"},
  { text: "众里寻他千百度，蓦然回首，那人却在灯火阑珊处。"},
  { text: "人生如逆旅，我亦是行人。"},
  { text: "落花人独立，微雨燕双飞。"},
  { text: "天朗气清，惠风和畅。"},
]

const SearchBar = ({ poems, onSelect, onShowAll }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Poem[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [placeholder, setPlaceholder] = useState('')
  const [currentQuote, setCurrentQuote] = useState(PLACEHOLDER_QUOTES[0])
  const [typingIndex, setTypingIndex] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimer = useRef<NodeJS.Timeout>()

  // 自动聚焦
  useEffect(() => {
    // 短暂延迟以确保组件完全加载
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // 处理打字效果
  useEffect(() => {
    const startTypingEffect = () => {
      if (typingIndex < currentQuote.text.length) {
        typingTimer.current = setTimeout(() => {
          setPlaceholder(prev => prev + currentQuote.text[typingIndex])
          setTypingIndex(prev => prev + 1)
        }, 150) // 打字速度
      } else {
        // 等待一段时间后重新开始
        typingTimer.current = setTimeout(() => {
          setPlaceholder('')
          setTypingIndex(0)
          // 随机选择新的句子
          const newIndex = Math.floor(Math.random() * PLACEHOLDER_QUOTES.length)
          setCurrentQuote(PLACEHOLDER_QUOTES[newIndex])
        }, 3000) // 完成后等待时间
      }
    }

    startTypingEffect()

    return () => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current)
      }
    }
  }, [typingIndex, currentQuote])

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
    setSelectedIndex(-1)
    if (value.trim()) {
      const filtered = poems.filter(
        poem => poem.title.includes(value) || 
                poem.author.includes(value) || 
                poem.content.includes(value)
      ).slice(0, 3)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSelect = (poem: Poem) => {
    setQuery('')
    setSuggestions([])
    setSelectedIndex(-1)
    onSelect(poem)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > -1 ? prev - 1 : prev)
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex])
      } else if (query.trim()) {
        onShowAll(query)
      }
    }
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-lg border border-button/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-button focus:border-transparent bg-block"
        />
      </div>

      {isFocused && suggestions.length > 0 && (
        <div 
          className="absolute z-10 w-full mt-1 bg-block rounded-lg shadow-lg border border-button/20"
        >
          {suggestions.map((poem, index) => (
            <div
              key={index}
              onClick={() => handleSelect(poem)}
              className={`px-4 py-2 cursor-pointer transition-all duration-200 ${
                index === selectedIndex 
                  ? 'bg-button/20 border-l-4 border-button pl-3 font-medium'
                  : 'hover:bg-button/10'
              }`}
            >
              <div className={`${index === selectedIndex ? 'text-button' : ''}`}>
                {poem.title}
              </div>
              <div className={`text-sm ${
                index === selectedIndex ? 'text-button/80' : 'text-gray-500'
              }`}>
                {poem.dynasty} · {poem.author}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar 