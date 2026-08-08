import { useQuery } from '@tanstack/react-query'
import { insightsService } from '../services/insightsService'

export const INSIGHTS_KEY = (days) => ['insights', days]

/**
 * Fetches the full insights payload from the API.
 * staleTime: 5 min - insights don't need to be realtime.
 */
export function useInsightsData(days = 35) {
  return useQuery({
    queryKey: INSIGHTS_KEY(days),
    queryFn: () => insightsService.get(days),
    staleTime: 1000 * 60 * 5,
  })
}
