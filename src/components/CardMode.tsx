import { useState, useEffect } from 'react'
import { Poem } from '../data/poems'

interface CardModeProps {
  poems: Poem[]
  onSelectPoem: (poem: Poem) => void
}

const CardMode = ({ poems, onSelectPoem }: CardModeProps) => {
  const [currentPoem, setCurrentPoem] = useState<Poem | null>(null)

  // 获取随机诗词
  const getRandomPoem = () => {
    const randomIndex = Math.floor(Math.random() * poems.length)
    return poems[randomIndex]
  }

  // 初始化随机诗词
  useEffect(() => {
    setCurrentPoem(getRandomPoem())
  }, [poems])

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setCurrentPoem(getRandomPoem())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [poems])

  if (!currentPoem) return null

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div 
        className="bg-block rounded-lg shadow-md p-8 max-w-[90vw] w-[600px] max-h-[65vh] cursor-pointer transform transition-transform hover:scale-105 flex flex-col"
        onClick={() => onSelectPoem(currentPoem)}
      >
        <div className="text-center flex-shrink-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-[huiwen] truncate">{currentPoem.title}</h2>
          <p className="text-xl text-gray-600 font-[huiwen] truncate">{currentPoem.dynasty} · {currentPoem.author}</p>
        </div>
        <div className="border-t border-button/20 pt-6 mt-6 flex-1 min-h-0">
          <div className="text-2xl text-gray-800 whitespace-pre-line leading-relaxed text-center font-[huiwen] line-clamp-[6] overflow-hidden h-full">
            {currentPoem.content}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardMode 