import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Client } from '../types';
import type { CreateClientRequest } from '../types';

// Mock API functions - replace with actual API calls
const clientsApi = {
  getClients: async (): Promise<Client[]> => {
    // Mock data for demonstration
    return [
      {
        id: '1',
        name: 'John Doe',
        type: 'individual',
        email: 'john@example.com',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  },
  
  createClient: async (client: CreateClientRequest): Promise<Client> => {
    // Mock creation - replace with actual API call
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...client,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
};

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.getClients,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientsApi.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};