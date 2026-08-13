import { useState } from 'react'
import { Bold, Italic, List, ListOrdered, X } from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { format } from 'date-fns'
import { MoodPicker } from './MoodPicker'
import { useUpsertJournal, useDeleteJournal } from '@/hooks/useJournal'
import styles from './JournalEditor.module.css'

function Toolbar({ editor }) {
  if (!editor) return null

  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        className={`${styles.toolBtn} ${editor.isActive('bold') ? styles.toolActive : ''}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
      >
        <Bold size={15} />
      </button>

      <button
        type="button"
        className={`${styles.toolBtn} ${editor.isActive('italic') ? styles.toolActive : ''}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
      >
        <Italic size={15} />
      </button>

      <div className={styles.toolDivider} />

      <button
        type="button"
        className={`${styles.toolBtn} ${editor.isActive('bulletList') ? styles.toolActive : ''}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet list"
      >
        <List size={15} />
      </button>

      <button
        type="button"
        className={`${styles.toolBtn} ${editor.isActive('orderedList') ? styles.toolActive : ''}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Ordered list"
      >
        <ListOrdered size={15} />
      </button>
    </div>
  )
}

export function JournalEditor({ open, onClose, entry, date }) {
  if (!open) return null

  // Wrapper uses `key` so a fresh entry/date fully remounts the form &
  // editor with new initial state — no useEffect setState needed.
  const targetDate = date ?? format(new Date(), 'yyyy-MM-dd')

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <JournalForm
        key={`${entry?.id ?? 'new'}-${targetDate}`}
        entry={entry}
        targetDate={targetDate}
        onClose={onClose}
      />
    </div>
  )
}

function JournalForm({ entry, targetDate, onClose }) {
  const upsert = useUpsertJournal()
  const remove = useDeleteJournal()

  const [mood, setMood] = useState(entry?.mood ?? 'good')
  const [title, setTitle] = useState(entry?.title ?? '')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write freely — this is just for you...',
      }),
    ],
    content: entry?.content ?? '',
  })

  async function handleSave() {
    const html = editor?.getHTML() ?? ''

    if (!html || html === '<p></p>' || html === '') return

    await upsert.mutateAsync({
      date: targetDate,
      data: {
        content: html,
        mood,
        title,
      },
    })

    onClose()
  }

  async function handleDelete() {
    if (confirm('Delete this journal entry?')) {
      await remove.mutateAsync(targetDate)
      onClose()
    }
  }

  const displayDate = targetDate
    ? format(
        new Date(`${targetDate}T00:00:00`),
        'EEEE, MMMM d yyyy'
      )
    : ''

  const isPending = upsert.isPending || remove.isPending

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <p className={styles.sub}>
            {entry ? 'Edit entry' : 'New entry'}
          </p>

          <h2 className={styles.heading}>Journal</h2>

          {displayDate && (
            <p className={styles.entryDate}>{displayDate}</p>
          )}
        </div>

        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className={styles.body}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            Title (optional)
          </span>

          <input
            className={styles.input}
            type="text"
            placeholder="What's on your mind?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus={!entry}
          />
        </label>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Entry</span>

          <div className={styles.editorWrap}>
            <Toolbar editor={editor} />
            <EditorContent
              editor={editor}
              className={styles.editor}
            />
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>
            How are you feeling?
          </span>

          <MoodPicker
            value={mood}
            onChange={setMood}
          />
        </div>
      </div>

      <div className={styles.footer}>
        {entry && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDelete}
          >
            Delete
          </button>
        )}

        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="button"
          className={styles.submitBtn}
          disabled={isPending}
          onClick={handleSave}
        >
          {isPending
            ? 'Saving…'
            : entry
            ? 'Save changes'
            : 'Save entry'}
        </button>
      </div>
    </div>
  )
}
