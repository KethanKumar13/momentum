import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { journalService } from '../services/journalService'

export const JOURNAL_KEY = ['journal']
export const JOURNAL_CAL_KEY = (y, m) => ['journal', 'calendar', y, m]

export function useJournalEntries() {
  return useQuery({
    queryKey: JOURNAL_KEY,
    queryFn: journalService.list,
    staleTime: 1000 * 60 * 2,
  })
}

export function useJournalCalendar(year, month) {
  return useQuery({
    queryKey: JOURNAL_CAL_KEY(year, month),
    queryFn: () => journalService.calendar(year, month),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpsertJournal() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ date, data }) => journalService.upsert(date, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: JOURNAL_KEY })
      qc.invalidateQueries({ queryKey: ['insights'] })
    },
  })
}

export function useDeleteJournal() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (date) => journalService.delete(date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: JOURNAL_KEY })
      qc.invalidateQueries({ queryKey: ['insights'] })
    },
  })
}
