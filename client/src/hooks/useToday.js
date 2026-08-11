import { useQuery } from '@tanstack/react-query'
import { todayService } from '../services/todayService'

export function useToday() {
  return useQuery({
    queryKey: ['today'],
    queryFn: todayService.get,
    staleTime: 30_000,
  })
}
