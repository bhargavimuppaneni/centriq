import React from 'react';
import { Button } from '@/components/ui/button';

interface CampaignActionsProps {
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  onPauseCampaign?: () => void;
  onResumeCampaign?: () => void;
  onEditCampaign?: () => void;
}

export const CampaignActions: React.FC<CampaignActionsProps> = ({
  status,
  onPauseCampaign,
  onResumeCampaign,
  onEditCampaign
}) => {
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Active': 'bg-green-100 text-green-800',
      'Paused': 'bg-red-100 text-red-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Draft': 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getActionButton = () => {
    switch (status) {
      case 'Active':
        return (
          <Button 
            onClick={onPauseCampaign}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Pause Campaign
          </Button>
        );
      case 'Paused':
        return (
          <Button 
            onClick={onResumeCampaign}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Resume Campaign
          </Button>
        );
      case 'Draft':
        return (
          <Button 
            onClick={onEditCampaign}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Edit Campaign
          </Button>
        );
      case 'Completed':
        return (
          <Button 
            disabled
            className="bg-gray-400 text-white cursor-not-allowed"
          >
            Campaign Completed
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Campaign Overview</h2>
        {getStatusBadge(status)}
      </div>
      {getActionButton()}
    </div>
  );
};