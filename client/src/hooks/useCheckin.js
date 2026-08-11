import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { checkinService } from '../services/checkinService'

export function useCheckin(date) {
  return useQuery({
    queryKey: ['checkin', date],
    queryFn: () => checkinService.get(date),
    staleTime: 30_000,
    retry: false,
  })
}

export function useUpsertCheckin(date) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: checkinService.upsert,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['checkin', date] })
      qc.invalidateQueries({ queryKey: ['today'] })
      qc.invalidateQueries({ queryKey: ['insights'] })
    },
  })
}
