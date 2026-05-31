import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, updateServiceStatus } from '../services/api';
import { Service } from '../types';

export const useServices = () => {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: getServices,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useUpdateServiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) =>
      updateServiceStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};