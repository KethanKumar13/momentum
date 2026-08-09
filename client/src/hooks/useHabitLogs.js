import { useMutation, useQueryClient } from '@tanstack/react-query'
import { habitLogService } from '../services/habitLogService'
import { HABITS_KEY } from './useHabits'
import { track } from '../lib/analytics'

export function useLogHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ habitId, status = 'done', note, date }) =>
      habitLogService.log(habitId, { status, note, date }),

    onMutate: async ({ habitId }) => {
      await qc.cancelQueries({
        queryKey: HABITS_KEY,
      })

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
      if (ctx?.prev) {
        qc.setQueryData(HABITS_KEY, ctx.prev)
      }
    },

    onSuccess: (_data, vars) => {
      track('habit_checked', {
        status: vars.status ?? 'done',
      })
    },

    onSettled: () => {
      qc.invalidateQueries({
        queryKey: HABITS_KEY,
      })

      qc.invalidateQueries({
        queryKey: ['goals'],
      })
    },
  })
}

export function useUnlogHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ habitId, date }) =>
      habitLogService.unlog(habitId, date),

    onSettled: () => {
      qc.invalidateQueries({
        queryKey: HABITS_KEY,
      })

      qc.invalidateQueries({
        queryKey: ['goals'],
      })
    },
  })
}
