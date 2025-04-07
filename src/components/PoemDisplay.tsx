import { useState, useEffect } from 'react'
import { Poem } from '../data/poems'
import NoteModal from './NoteModal'

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

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('poemNotes') || '[]')
    setNotes(savedNotes.filter((n: Note) => n.poemId === poem.title))
  }, [poem.title, notesUpdateKey])

  const handleNotesUpdate = () => {
    setNotesUpdateKey(prev => prev + 1)
  }

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
        <div className="absolute top-4 right-4">
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
            {poem.content}
          </div>
        </div>
      </div>

      {/* 赏析部分 */}
      {poem.appreciation && (
        <div className="bg-block rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">鉴赏</h3>
          <div className="border-t border-button/20 pt-6">
            <div className="text-lg text-gray-700 leading-relaxed">
              {poem.appreciation}
            </div>
          </div>
        </div>
      )}

      {/* 已有笔记部分 */}
      {notes.length > 0 && (
        <div className="bg-block rounded-lg shadow-md p-6">
          <div className="border-t border-button/20 pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">我的笔记</h3>
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