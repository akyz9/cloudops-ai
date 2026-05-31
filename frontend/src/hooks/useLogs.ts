import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLogs, createLog } from '../services/api';
import { Log } from '../types';

export const useLogs = (params?: object) => {
  return useQuery<Log[]>({
    queryKey: ['logs', params],
    queryFn: () => getLogs(params),
    refetchInterval: 10000, // Refresh every 10 seconds
  });
};

export const useCreateLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: object) => createLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
};