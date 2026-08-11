import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { taskService } from '../services/taskService'

export function useTasks(date) {
  return useQuery({
    queryKey: ['tasks', date],
    queryFn: () => taskService.list(date),
    staleTime: 30_000,
  })
}

export function useTaskMutations(date) {
  const qc = useQueryClient()

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['tasks', date] })
    qc.invalidateQueries({ queryKey: ['today'] })
  }

  return {
    create: useMutation({
      mutationFn: taskService.create,
      onSuccess: invalidate,
    }),

    update: useMutation({
      mutationFn: ({ id, data }) => taskService.update(id, data),
      onSuccess: invalidate,
    }),

    remove: useMutation({
      mutationFn: taskService.delete,
      onSuccess: invalidate,
    }),
  }
}
