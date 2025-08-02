export interface Client {
  id: string;
  name: string;
  type: 'individual' | 'business';
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientRequest {
  name: string;
  type: 'individual' | 'business';
  email: string;
  phone?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'cloud';
  status: 'connected' | 'disconnected' | 'error';
  clientId: string;
  config: Record<string, string | number | boolean>;
  createdAt: Date;
  updatedAt: Date;
}