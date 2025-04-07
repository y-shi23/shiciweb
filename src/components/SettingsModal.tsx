import { useState, useEffect } from 'react'
import { themes, Theme } from '../data/themes'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? JSON.parse(savedTheme) : themes[0]
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme)
    localStorage.setItem('theme', JSON.stringify(theme))
    applyTheme(theme)
  }

  const applyTheme = (theme: Theme) => {
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

  const handleExport = () => {
    const notes = JSON.parse(localStorage.getItem('poemNotes') || '[]')
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'poem-notes.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const notes = JSON.parse(event.target?.result as string)
            localStorage.setItem('poemNotes', JSON.stringify(notes))
            alert('笔记导入成功！')
          } catch (error) {
            alert('导入失败，请检查文件格式！')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative z-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">设置</h3>
            <button
              onClick={onClose}
              className="bg-button text-white p-2 rounded-lg hover:bg-button/90 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 主题选择 */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">主题设置</h4>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    currentTheme.name === theme.name
                      ? 'border-button ring-2 ring-button ring-opacity-50'
                      : 'border-gray-200 hover:border-button'
                  }`}
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: theme.colors.text }}>{theme.name}</span>
                    {currentTheme.name === theme.name && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: theme.colors.text }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.button }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.card }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.block }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 笔记导入导出 */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">笔记管理</h4>
            <div className="flex space-x-4">
              <button
                onClick={() => handleExport()}
                className="px-4 py-2 bg-button text-white rounded-lg hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2"
              >
                导出笔记
              </button>
              <button
                onClick={() => handleImport()}
                className="px-4 py-2 bg-button text-white rounded-lg hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2"
              >
                导入笔记
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal 