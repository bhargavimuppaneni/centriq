import React from 'react';

interface CampaignDetailsProps {
  startDate?: string;
  endDate?: string;
  duration?: string;
  totalJobs?: number;
  jobCategories?: string;
  dataSource?: string;
  createdBy?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  startDate = "Sep 1, 2023",
  endDate = "Sep 30, 2023",
  duration = "30 days",
  totalJobs = 125,
  jobCategories = "Software Engineering",
  dataSource = "XML Feed",
  createdBy = "Sarah Mitchell",
  lastModifiedBy = "Sep 5, 2023",
  lastModifiedDate = "Aug 25, 2023"
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Campaign Details</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Start Date</span>
          <span className="text-sm font-medium text-gray-900">{startDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">End Date</span>
          <span className="text-sm font-medium text-gray-900">{endDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Duration</span>
          <span className="text-sm font-medium text-gray-900">{duration}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Jobs</span>
          <span className="text-sm font-medium text-gray-900">{totalJobs}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Job Categories</span>
          <span className="text-sm font-medium text-gray-900">{jobCategories}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Data Source</span>
          <span className="text-sm font-medium text-gray-900">{dataSource}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Created By</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {createdBy?.charAt(0) || 'S'}
            </div>
            <span className="text-sm font-medium text-gray-900">{createdBy}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Created</span>
          <span className="text-sm font-medium text-gray-900">{lastModifiedDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Last Modified by</span>
          <span className="text-sm font-medium text-gray-900">{lastModifiedBy}</span>
        </div>
      </div>
    </div>
  );
};