import { Poem } from '../data/poems'
import { useState, useEffect } from 'react'

interface SearchResultsProps {
  query: string
  poems: Poem[]
  onSelect: (poem: Poem) => void
  onBack: () => void
}

// 名句列表
const FAMOUS_QUOTES = [
  { content: "人生自是有情痴，此恨不关风与月。", author: "欧阳修" },
  { content: "桃花潭水深千尺，不及汪伦送我情。", author: "李白" },
  { content: "人间万事消磨尽，只有清香似旧时。", author: "刘方平" },
  { content: "一片冰心在玉壶。", author: "王昌龄" },
  { content: "休对故人思故国，且将新火试新茶。", author: "苏轼" },
  { content: "此情可待成追忆，只是当时已惘然。", author: "李商隐" },
  { content: "醉后不知天在水，满船清梦压星河。", author: "唐温如" },
  { content: "落红不是无情物，化作春泥更护花。", author: "龚自珍" },
  { content: "人生如逆旅，我亦是行人。", author: "苏轼" },
  { content: "莫听穿林打叶声，何妨吟啸且徐行。", author: "王维" }
]

const SearchResults = ({ query, poems, onSelect, onBack }: SearchResultsProps) => {
  const [randomQuote, setRandomQuote] = useState(FAMOUS_QUOTES[0])

  useEffect(() => {
    // 随机选择一句名句
    const randomIndex = Math.floor(Math.random() * FAMOUS_QUOTES.length)
    setRandomQuote(FAMOUS_QUOTES[randomIndex])
  }, [query]) // 当搜索词变化时更新随机句子

  const filteredPoems = poems.filter(
    poem => poem.title.includes(query) || 
            poem.author.includes(query) || 
            poem.content.includes(query)
  )

  return (
    <div className="space-y-6 min-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="bg-button text-white p-2 rounded-lg hover:bg-button/90 transition-colors"
          title="返回搜索"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="text-lg">
          搜索结果：{query} ({filteredPoems.length})
        </div>
      </div>

      {filteredPoems.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-3xl font-medium text-gray-500">未找到相关诗词</div>
        </div>
      ) : (
        <div className="flex-grow grid gap-4">
          {filteredPoems.map((poem, index) => (
            <div
              key={index}
              onClick={() => onSelect(poem)}
              className="bg-block p-4 rounded-lg shadow-md hover:bg-button/10 cursor-pointer transition-colors"
            >
              <div className="font-medium text-lg">{poem.title}</div>
              <div className="text-gray-500">{poem.dynasty} · {poem.author}</div>
              <div className="mt-2 text-gray-700 line-clamp-2">{poem.content}</div>
            </div>
          ))}
        </div>
      )}

      {/* 随机名句显示 */}
      <div className="bg-block/50 p-6 rounded-lg text-center mt-auto">
        <div className="text-lg font-medium mb-2">{randomQuote.content}</div>
        <div className="text-gray-500">—— {randomQuote.author}</div>
      </div>
    </div>
  )
}

export default SearchResults 