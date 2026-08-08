import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { habitService } from '../services/habitService'

export const HABITS_KEY = ['habits']

export function useHabits() {
  return useQuery({
    queryKey: HABITS_KEY,
    queryFn: habitService.list,
  })
}

export function useCreateHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: habitService.create,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: HABITS_KEY }),
  })
}

export function useUpdateHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) =>
      habitService.update(id, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: HABITS_KEY }),
  })
}

export function useDeleteHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: habitService.delete,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: HABITS_KEY }),
  })
}

export function useArchiveHabit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: habitService.archive,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: HABITS_KEY }),
  })
}