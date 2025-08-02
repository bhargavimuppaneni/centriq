import { Users, Mail, Phone, Calendar } from 'lucide-react';
import type { Client } from '../types';

interface ClientListProps {
  clients: Client[];
  isLoading?: boolean;
}

export const ClientList = ({ clients, isLoading }: ClientListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="font-medium text-gray-900 mb-2">No clients yet</h3>
        <p className="text-sm text-gray-600">
          Create your first client to get started with data management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <div key={client.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{client.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {client.email}
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {client.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {client.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                client.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : client.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {client.status}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {client.type}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};