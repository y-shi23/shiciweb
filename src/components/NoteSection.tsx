import { useState } from 'react'

interface Poem {
  title: string
  author: string
  content: string
  appreciation: string
}

interface Note {
  poemId: string
  content: string
  createdAt: string
}

interface NoteSectionProps {
  poem: Poem
  notes: Note[]
  onAddNote: (note: Note) => void
  onExportNotes: () => void
  onImportNotes: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const NoteSection = ({ poem, notes, onAddNote, onExportNotes, onImportNotes }: NoteSectionProps) => {
  const [newNote, setNewNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newNote.trim()) {
      onAddNote({
        poemId: poem.title,
        content: newNote.trim(),
        createdAt: new Date().toISOString()
      })
      setNewNote('')
    }
  }

  return (
    <div className="mt-12 bg-white rounded-lg shadow-md p-8">
      <h3 className="text-3xl font-semibold text-gray-900 mb-8 text-center">笔记</h3>
      
      <form onSubmit={handleSubmit} className="mb-12">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="添加笔记..."
          className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
          rows={4}
        />
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-lg"
          >
            添加笔记
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {notes.map((note, index) => (
          <div key={index} className="p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-700 text-lg">{note.content}</p>
            <p className="text-sm text-gray-500 mt-3 text-right">
              {new Date(note.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center space-x-6">
        <button
          onClick={onExportNotes}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-lg"
        >
          导出笔记
        </button>
        <label className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer text-lg">
          导入笔记
          <input
            type="file"
            accept=".json"
            onChange={onImportNotes}
            className="hidden"
          />
        </label>
      </div>
    </div>
  )
}

export default NoteSection 