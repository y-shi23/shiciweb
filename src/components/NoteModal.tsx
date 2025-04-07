import { useState, useEffect } from 'react'
import { Poem } from '../data/poems'

interface Note {
  poemId: string
  content: string
  createdAt: string
}

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  poem: Poem
  onNotesUpdate?: () => void
}

const NoteModal = ({ isOpen, onClose, poem, onNotesUpdate }: NoteModalProps) => {
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const savedNotes = JSON.parse(localStorage.getItem('poemNotes') || '[]')
      setNotes(savedNotes.filter((n: Note) => n.poemId === poem.title))
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, poem.title])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (note.trim()) {
      const savedNotes = JSON.parse(localStorage.getItem('poemNotes') || '[]')
      const newNote = {
        poemId: poem.title,
        content: note.trim(),
        createdAt: new Date().toISOString()
      }
      savedNotes.push(newNote)
      localStorage.setItem('poemNotes', JSON.stringify(savedNotes))
      setNotes([...notes, newNote])
      setNote('')
      onNotesUpdate?.()
    }
  }

  const handleDeleteNote = (index: number) => {
    const savedNotes = JSON.parse(localStorage.getItem('poemNotes') || '[]')
    const updatedNotes = savedNotes.filter((_: Note, i: number) => i !== index)
    localStorage.setItem('poemNotes', JSON.stringify(updatedNotes))
    setNotes(updatedNotes.filter((n: Note) => n.poemId === poem.title))
    onNotesUpdate?.()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative z-10">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">笔记管理</h3>
            <button
              onClick={onClose}
              className="bg-button text-white p-2 rounded-lg hover:bg-button/90 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">{poem.title}</h4>
            <p className="text-gray-600">{poem.dynasty} · {poem.author}</p>
          </div>

          {/* 添加新笔记 */}
          <form onSubmit={handleSubmit} className="mb-8">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="忧劳可以兴国，逸豫可以亡身"
              className="w-full px-4 py-3 border border-button/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-button focus:border-transparent text-lg bg-block"
              rows={1}
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-button text-white rounded-lg hover:bg-button/90 focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2"
              >
                添加笔记
              </button>
            </div>
          </form>

          {/* 笔记列表 */}
          <div className="space-y-4">
            <h5 className="text-lg font-medium text-gray-900">已有笔记</h5>
            {notes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">暂无笔记</p>
            ) : (
              notes.map((note, index) => (
                <div key={index} className="bg-block rounded-lg p-4 relative group">
                  <button
                    onClick={() => handleDeleteNote(index)}
                    className="absolute top-2 right-2 text-button hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="删除笔记"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteModal 