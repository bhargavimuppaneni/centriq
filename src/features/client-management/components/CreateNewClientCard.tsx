import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreateNewClientCardProps {
  onCreateClient: () => void;
}

export const CreateNewClientCard = ({ onCreateClient }: CreateNewClientCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Create a New Client</h3>
        </div>
        <Button
          onClick={onCreateClient}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Create
        </Button>
      </div>
      <p className="text-sm text-gray-600">
        Add a new client to manage their data sources and configurations.
      </p>
    </div>
  );
};