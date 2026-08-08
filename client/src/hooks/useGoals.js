import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { goalService } from '../services/goalService'

export const GOALS_KEY = ['goals']

export function useGoals() {
  return useQuery({
    queryKey: GOALS_KEY,
    queryFn: goalService.list,
  })
}

export function useCreateGoal() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: goalService.create,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: GOALS_KEY }),
  })
}

export function useUpdateGoal() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) =>
      goalService.update(id, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: GOALS_KEY }),
  })
}

export function useDeleteGoal() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: goalService.delete,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: GOALS_KEY }),
  })
}