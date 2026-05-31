import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getIncidents, createIncident, updateIncidentStatus } from '../services/api';
import { Incident } from '../types';

export const useIncidents = () => {
  return useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: getIncidents,
    refetchInterval: 15000, // Refresh every 15 seconds
  });
};

export const useCreateIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: object) => createIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useUpdateIncidentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateIncidentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};