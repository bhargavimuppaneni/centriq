import React from 'react';
import { Calendar } from 'lucide-react';

interface CampaignHeaderProps {
  campaignName: string;
  clientName: string;
  createdBy: string;
  createdDate: string;
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  campaignName,
  clientName,
  createdBy,
  createdDate
}) => {
  return (
    <>
      {/* Breadcrumb */}
      <div className="flex gap-2 text-sm text-gray-500 mb-2">
        <span>Dashboard</span>
        <span>›</span>
        <span>Campaigns</span>
        <span>›</span>
        <span className="text-gray-900">{campaignName}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">{campaignName}</h1>
          <p className="text-lg text-gray-600 mb-3">{clientName}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span>👤</span>
              <span>Created by {createdBy}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created on {createdDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            S
          </div>
        </div>
      </div>
    </>
  );
};