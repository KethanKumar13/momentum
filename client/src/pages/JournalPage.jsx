import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, LayoutList, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { useJournalEntries } from '@/hooks/useJournal'
import { JournalEntryCard } from '@/components/journal/JournalEntryCard'
import { JournalEditor } from '@/components/journal/JournalEditor'
import { JournalCalendar } from '@/components/journal/JournalCalendar'
import { JournalSearchBar } from '@/components/journal/JournalSearchBar'
import styles from './JournalPage.module.css'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export default function JournalPage() {
  const { data: entries = [], isLoading } = useJournalEntries()

  const [view, setView] = useState('list')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [editorDate, setEditorDate] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)

  const today = format(new Date(), 'yyyy-MM-dd')

  const filtered = entries.filter((entry) => {
    if (!query.trim()) return true

    const q = query.toLowerCase()

    const text = [
      entry.title,
      entry.content?.replace(/<[^>]*>/g, ''),
      entry.tags,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return text.includes(q)
  })

  function openNew() {
    setEditingEntry(null)
    setEditorDate(today)
    setEditorOpen(true)
  }

  function handleEdit(entry) {
    setEditingEntry(entry)
    setEditorDate(entry.date)
    setEditorOpen(true)
  }

  function handleCalendarSelect(dateStr) {
    setSelectedDate(dateStr)

    const entry = entries.find(
      (entry) => entry.date === dateStr
    )

    setEditingEntry(entry ?? null)
    setEditorDate(dateStr)
    setEditorOpen(true)
  }

  function handleClose() {
    setEditorOpen(false)
    setEditingEntry(null)
    setEditorDate(null)
  }

  return (
    <>
      <motion.div
        className={styles.inner}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.header
          className={styles.header}
          variants={fadeUp}
        >
          <div>
            <p className={styles.sub}>
              Your daily journal
            </p>

            <h1 className={styles.heading}>
              Journal
            </h1>

            <p className={styles.meta}>
              {entries.length}{' '}
              {entries.length === 1 ? 'entry' : 'entries'}
            </p>
          </div>

          <div className={styles.headerRight}>
            {/* View toggle */}
            <div className={styles.viewToggle}>
              <button
                type="button"
                className={`${styles.viewBtn} ${
                  view === 'list'
                    ? styles.viewActive
                    : ''
                }`}
                onClick={() => setView('list')}
                aria-label="List view"
              >
                <LayoutList size={15} />
              </button>

              <button
                type="button"
                className={`${styles.viewBtn} ${
                  view === 'calendar'
                    ? styles.viewActive
                    : ''
                }`}
                onClick={() => setView('calendar')}
                aria-label="Calendar view"
              >
                <CalendarDays size={15} />
              </button>
            </div>

            <button
              type="button"
              className={styles.addBtn}
              onClick={openNew}
            >
              <Plus size={16} />
              Write today
            </button>
          </div>
        </motion.header>

        {/* Calendar view */}
        {view === 'calendar' && (
          <motion.div
            className={styles.calendarWrap}
            variants={fadeUp}
          >
            <JournalCalendar
              onSelectDate={handleCalendarSelect}
              selectedDate={selectedDate}
            />
          </motion.div>
        )}

        {/* List view */}
        {view === 'list' && (
          <>
            <motion.div variants={fadeUp}>
              <JournalSearchBar
                value={query}
                onChange={setQuery}
              />
            </motion.div>

            <motion.div
              className={styles.list}
              variants={stagger}
            >
              {isLoading ? (
                <p className={styles.empty}>
                  Loading entries...
                </p>
              ) : filtered.length === 0 ? (
                <motion.p
                  className={styles.empty}
                  variants={fadeUp}
                >
                  {query
                    ? 'No entries match your search.'
                    : 'No entries yet. Write your first one!'}
                </motion.p>
              ) : (
                filtered.map((entry) => (
                  <motion.div
                    key={entry.id}
                    variants={fadeUp}
                  >
                    <JournalEntryCard
                      entry={entry}
                      onEdit={handleEdit}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </>
        )}
      </motion.div>

      <JournalEditor
        open={editorOpen}
        onClose={handleClose}
        entry={editingEntry}
        date={editorDate}
      />
    </>
  )
}
