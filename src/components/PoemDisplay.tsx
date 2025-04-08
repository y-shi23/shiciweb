import { useState, useEffect } from 'react'
import { Poem } from '../data/poems'
import NoteModal from './NoteModal'
import { init } from '@waline/client'

interface Note {
  poemId: string
  content: string
  createdAt: string
}

interface PoemDisplayProps {
  poem: Poem
  onBack: () => void
}

const PoemDisplay = ({ poem, onBack }: PoemDisplayProps) => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [notesUpdateKey, setNotesUpdateKey] = useState(0)
  const [isAppreciationCollapsed, setIsAppreciationCollapsed] = useState(false)
  const [isNotesCollapsed, setIsNotesCollapsed] = useState(false)
  const [isCommentsCollapsed, setIsCommentsCollapsed] = useState(false)
  const [isContentHidden, setIsContentHidden] = useState(false)
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('poemNotes') || '[]')
    setNotes(savedNotes.filter((n: Note) => n.poemId === poem.title))
  }, [poem.title, notesUpdateKey])

  useEffect(() => {
    // 初始化 Waline
    init({
      el: '#waline',
      serverURL: 'https://waline.oneloved.cn',
      path: `/poem/${poem.title}`,
      lang: 'zh-CN',
      dark: 'auto',
      reaction: [],
      emoji: [
        'https://unpkg.com/@waline/emojis@1.2.0/tieba'
      ]
    })

    // 设置 Waline 样式变量
    const root = document.documentElement
    root.style.setProperty('--waline-bgcolor', 'transparent')
    root.style.setProperty('--waline-theme-color', '#4f46e5')
    root.style.setProperty('--waline-active-color', '#4338ca')
    root.style.setProperty('--waline-text-color', '#374151')
    root.style.setProperty('--waline-border-color', 'rgba(79, 70, 229, 0.2)')
    root.style.setProperty('--waline-badge-color', '#4f46e5')
    root.style.setProperty('--waline-info-bgcolor', 'transparent')
    root.style.setProperty('--waline-info-color', '#6b7280')
    root.style.setProperty('--waline-card-bgcolor', '#ffffff')
    root.style.setProperty('--waline-box-shadow', 'none')
  }, [poem.title])

  const handleNotesUpdate = () => {
    setNotesUpdateKey(prev => prev + 1)
  }

  const CollapseButton = ({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
      title={isCollapsed ? "展开" : "折叠"}
    >
      <svg
        className={`w-5 h-5 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )

  const ContentLine = ({ line, index }: { line: string, index: number }) => (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isContentHidden && hoveredLine !== index 
          ? 'opacity-0 translate-y-1' 
          : 'opacity-100 translate-y-0'
      }`}
      onMouseEnter={() => setHoveredLine(index)}
      onMouseLeave={() => setHoveredLine(null)}
    >
      {line}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* 标题和原文部分 */}
      <div className="bg-block rounded-lg shadow-md p-6 relative">
        <div className="absolute top-4 left-4">
          <button
            onClick={onBack}
            className="bg-button text-white p-2 rounded-lg hover:bg-button/90 transition-colors"
            title="返回搜索"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setIsContentHidden(!isContentHidden)}
            className={`p-2 rounded-lg transition-colors ${
              isContentHidden 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' 
                : 'bg-button text-white hover:bg-button/90'
            }`}
            title={isContentHidden ? "显示全文" : "隐藏全文"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="bg-button text-white p-2 rounded-lg hover:bg-button/90 transition-colors"
            title="管理笔记"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-[huiwen]">{poem.title}</h2>
          <p className="text-xl text-gray-600 font-[huiwen]">{poem.dynasty} · {poem.author}</p>
        </div>
        <div className="border-t border-button/20 pt-6">
          <div className="text-2xl text-gray-800 whitespace-pre-line leading-relaxed text-center font-[huiwen]">
            {poem.content.split('\n').map((line, index) => (
              <ContentLine key={index} line={line} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* 赏析部分 */}
      {poem.appreciation && (
        <div className="bg-block rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">鉴赏</h3>
            <CollapseButton
              isCollapsed={isAppreciationCollapsed}
              onToggle={() => setIsAppreciationCollapsed(!isAppreciationCollapsed)}
            />
          </div>
          <div className={`border-t border-button/20 pt-6 transition-all duration-300 overflow-hidden ${isAppreciationCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
            <div className="text-lg text-gray-700 leading-relaxed">
              {poem.appreciation}
            </div>
          </div>
        </div>
      )}

      {/* 已有笔记部分 */}
      {notes.length > 0 && (
        <div className="bg-block rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">我的笔记</h3>
            <CollapseButton
              isCollapsed={isNotesCollapsed}
              onToggle={() => setIsNotesCollapsed(!isNotesCollapsed)}
            />
          </div>
          <div className={`border-t border-button/20 pt-6 transition-all duration-300 overflow-hidden ${isNotesCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
            <div className="space-y-4">
              {notes.map((note, index) => (
                <div key={index} className="bg-card rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 评论区 */}
      <div className="bg-block rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">评论区</h3>
          <CollapseButton
            isCollapsed={isCommentsCollapsed}
            onToggle={() => setIsCommentsCollapsed(!isCommentsCollapsed)}
          />
        </div>
        <div className={`transition-all duration-300 overflow-hidden ${isCommentsCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
          <div id="waline" className="mt-4"></div>
        </div>
      </div>

      {/* 笔记弹窗 */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        poem={poem}
        onNotesUpdate={handleNotesUpdate}
      />
    </div>
  )
}

export default PoemDisplay 