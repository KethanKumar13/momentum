import { useMutation, useQueryClient } from '@tanstack/react-query'
import { habitLogService } from '../services/habitLogService'
import { HABITS_KEY } from './useHabits'

/**
 * Logs (or toggles) a habit for today.
 * Invalidates habits list so isDueToday + streak update instantly.
 */
export function useLogHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ habitId, status = 'done', note, date }) =>
      habitLogService.log(habitId, { status, note, date }),

    onMutate: async ({ habitId }) => {
      // Optimistic update — flip isDueToday / completedToday immediately
      await qc.cancelQueries({ queryKey: HABITS_KEY })

      const prev = qc.getQueryData(HABITS_KEY)

      qc.setQueryData(HABITS_KEY, (old) =>
        old?.map((h) =>
          h.id === habitId
            ? { ...h, isDueToday: !h.isDueToday }
            : h
        )
      )

      return { prev }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(HABITS_KEY, ctx.prev)
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: HABITS_KEY })
      qc.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

/**
 * Remove a log entry for a specific date.
 */
export function useUnlogHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ habitId, date }) =>
      habitLogService.unlog(habitId, date),

    onSettled: () => {
      qc.invalidateQueries({ queryKey: HABITS_KEY })
      qc.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}