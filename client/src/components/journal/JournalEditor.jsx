import { useEffect, useState } from 'react'
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
        className={`${styles.toolBtn} ${
          editor.isActive('bold') ? styles.toolActive : ''
        }`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
      >
        <Bold size={15} />
      </button>

      <button
        type="button"
        className={`${styles.toolBtn} ${
          editor.isActive('italic') ? styles.toolActive : ''
        }`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
      >
        <Italic size={15} />
      </button>

      <div className={styles.toolDivider} />

      <button
        type="button"
        className={`${styles.toolBtn} ${
          editor.isActive('bulletList') ? styles.toolActive : ''
        }`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet list"
      >
        <List size={15} />
      </button>

      <button
        type="button"
        className={`${styles.toolBtn} ${
          editor.isActive('orderedList') ? styles.toolActive : ''
        }`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Ordered list"
      >
        <ListOrdered size={15} />
      </button>
    </div>
  )
}

export function JournalEditor({ open, onClose, entry, date }) {
  const upsert = useUpsertJournal()
  const remove = useDeleteJournal()

  const targetDate = date ?? format(new Date(), 'yyyy-MM-dd')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write freely — this is just for you...',
      }),
    ],
    content: entry?.content ?? '',
  })

  useEffect(() => {
    if (editor && entry?.content !== undefined) {
      editor.commands.setContent(entry.content ?? '')
    }
  }, [editor, entry?.content])

  async function handleSave(mood, title, tags) {
    const html = editor?.getHTML() ?? ''

    if (!html || html === '<p></p>') return

    await upsert.mutateAsync({
      date: targetDate,
      data: {
        content: html,
        mood,
        title,
        tags,
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

  if (!open) return null

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <JournalForm
          editor={editor}
          entry={entry}
          targetDate={targetDate}
          onSave={handleSave}
          onDelete={entry ? handleDelete : null}
          onClose={onClose}
          isPending={upsert.isPending || remove.isPending}
        />
      </div>
    </div>
  )
}

function JournalForm({
  editor,
  entry,
  targetDate,
  onSave,
  onDelete,
  onClose,
  isPending,
}) {
  const [mood, setMood] = useState(entry?.mood ?? 'good')
  const [title, setTitle] = useState(entry?.title ?? '')

  useEffect(() => {
    setMood(entry?.mood ?? 'good')
    setTitle(entry?.title ?? '')
  }, [entry])

  const displayDate = targetDate
    ? format(new Date(`${targetDate}T00:00:00`), 'EEEE, MMMM d yyyy')
    : ''

  return (
    <>
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
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className={styles.body}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Title (optional)</span>

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
        {onDelete && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={onDelete}
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
          onClick={() => onSave(mood, title, '')}
        >
          {isPending
            ? 'Saving...'
            : entry
              ? 'Save changes'
              : 'Save entry'}
        </button>
      </div>
    </>
  )
}
