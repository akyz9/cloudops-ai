import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDeployments, createDeployment, updateDeploymentStatus } from '../services/api';
import { Deployment } from '../types';

export const useDeployments = () => {
  return useQuery<Deployment[]>({
    queryKey: ['deployments'],
    queryFn: getDeployments,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useCreateDeployment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: object) => createDeployment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
    },
  });
};

export const useUpdateDeploymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateDeploymentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
    },
  });
};