import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { weeklyReviewService } from '../services/weeklyReviewService'

export const REVIEWS_KEY = ['reviews']

export function useWeeklyReviews() {
  return useQuery({
    queryKey: REVIEWS_KEY,
    queryFn: weeklyReviewService.list,
    staleTime: 1000 * 60 * 5,
  })
}

export function useWeeklyReview(weekStart) {
  return useQuery({
    queryKey: [...REVIEWS_KEY, weekStart],
    queryFn: () => weeklyReviewService.get(weekStart),
    enabled: Boolean(weekStart),
    staleTime: 1000 * 60 * 2,
  })
}

export function useUpsertWeeklyReview() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ weekStart, data }) =>
      weeklyReviewService.upsert(weekStart, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: REVIEWS_KEY }),
  })
}
