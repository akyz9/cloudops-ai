import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAlerts, acknowledgeAlert, resolveAlert, createAlert } from '../services/api';
import { Alert } from '../types';

export const useAlerts = (params?: object) => {
  return useQuery<Alert[]>({
    queryKey: ['alerts', params],
    queryFn: () => getAlerts(params),
    refetchInterval: 15000, // Refresh every 15 seconds
  });
};

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => acknowledgeAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useResolveAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resolveAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: object) => createAlert(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};