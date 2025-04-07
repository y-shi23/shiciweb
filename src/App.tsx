import { useState, useEffect } from 'react'
import { getPoems, Poem } from './data/poems'
import SearchBar from './components/SearchBar'
import PoemDisplay from './components/PoemDisplay'
import SettingsModal from './components/SettingsModal'

function App() {
  const [poems, setPoems] = useState<Poem[]>([])
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="bg-button text-white p-2 rounded-lg hover:bg-button/90 transition-colors"
            title="设置"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {!selectedPoem ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-5xl font-bold text-gray-900 mb-12">詩苑</h1>
            <div className="w-full max-w-2xl">
              <SearchBar poems={poems} onSelect={setSelectedPoem} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <PoemDisplay poem={selectedPoem} onBack={() => setSelectedPoem(null)} />
            </div>
          </div>
        )}

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </div>
  )
}

export default App
