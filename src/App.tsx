import { useState, useEffect } from 'react'
import { getPoems, Poem } from './data/poems'
import SearchBar from './components/SearchBar'
import PoemDisplay from './components/PoemDisplay'
import SettingsModal from './components/SettingsModal'
import SearchResults from './components/SearchResults'
import CardMode from './components/CardMode'

// 修改 ActionMenu 组件
const ActionMenu = ({ onCardMode, onSettings }: { onCardMode: () => void, onSettings: () => void }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center">
      <div className={`flex space-x-2 transition-all duration-300 transform origin-right ${isOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 pointer-events-none'}`}>
        <button
          onClick={() => {
            onCardMode()
            setIsOpen(false)
          }}
          className="p-2 rounded-full bg-transparent hover:bg-white/10 transition-colors"
          title="卡片模式"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          onClick={() => {
            onSettings()
            setIsOpen(false)
          }}
          className="p-2 rounded-full bg-transparent hover:bg-white/10 transition-colors"
          title="设置"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-transparent hover:bg-white/10 transition-colors"
        title="菜单"
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  )
}

function App() {
  const [poems, setPoems] = useState<Poem[]>([])
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [isCardMode, setIsCardMode] = useState(() => {
    const savedMode = localStorage.getItem('isCardMode')
    return savedMode ? JSON.parse(savedMode) : false
  })

  useEffect(() => {
    // 加载诗词数据
    getPoems().then(setPoems)

    // 应用保存的主题
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      const theme = JSON.parse(savedTheme)
      const root = document.documentElement
      root.style.setProperty('--primary-color', theme.colors.primary)
      root.style.setProperty('--secondary-color', theme.colors.secondary)
      root.style.setProperty('--accent-color', theme.colors.accent)
      root.style.setProperty('--background-color', theme.colors.background)
      root.style.setProperty('--text-color', theme.colors.text)
      root.style.setProperty('--button-color', theme.colors.button)
      root.style.setProperty('--card-color', theme.colors.card)
      root.style.setProperty('--block-color', theme.colors.block)
    }
  }, [])

  // 保存卡片模式状态到localStorage
  useEffect(() => {
    localStorage.setItem('isCardMode', JSON.stringify(isCardMode))
  }, [isCardMode])

  const handlePoemSelect = (poem: Poem) => {
    setSelectedPoem(poem)
    setSearchQuery(null)
    setIsCardMode(false)
  }

  const handleShowAllResults = (query: string) => {
    setSearchQuery(query)
    setSelectedPoem(null)
    setIsCardMode(false)
  }

  const handleBack = () => {
    setSelectedPoem(null)
    setSearchQuery(null)
    setIsCardMode(false)
  }

  const handleCardMode = () => {
    setIsCardMode(!isCardMode)
    setSelectedPoem(null)
    setSearchQuery(null)
  }

  return (
    <div className={`${isCardMode ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="relative">
          <div className="absolute top-0 right-0">
            <ActionMenu 
              onCardMode={handleCardMode}
              onSettings={() => setIsSettingsOpen(true)}
            />
          </div>

          {isCardMode ? (
            <CardMode 
              poems={poems} 
              onSelectPoem={handlePoemSelect}
            />
          ) : !selectedPoem && !searchQuery ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] mt-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-12">詩苑</h1>
              <div className="w-full max-w-2xl">
                <SearchBar 
                  poems={poems} 
                  onSelect={handlePoemSelect}
                  onShowAll={handleShowAllResults}
                />
              </div>
            </div>
          ) : selectedPoem ? (
            <div className="flex flex-col items-center mt-16">
              <div className="w-full max-w-2xl">
                <PoemDisplay poem={selectedPoem} onBack={handleBack} />
              </div>
            </div>
          ) : searchQuery ? (
            <div className="flex flex-col items-center mt-16">
              <div className="w-full max-w-2xl">
                <SearchResults
                  query={searchQuery}
                  poems={poems}
                  onSelect={handlePoemSelect}
                  onBack={handleBack}
                />
              </div>
            </div>
          ) : null}
        </div>

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </div>
  )
}

export default App
