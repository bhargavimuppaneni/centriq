import React from 'react';

interface CampaignTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const CampaignTabs: React.FC<CampaignTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex items-center gap-6 mb-4">
      <button 
        onClick={() => onTabChange("Overview")}
        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "Overview" 
            ? "text-blue-600 border-blue-600" 
            : "text-gray-500 border-transparent hover:text-gray-700"
        }`}
      >
        Overview
      </button>
      <button 
        onClick={() => onTabChange("Reports")}
        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "Reports" 
            ? "text-blue-600 border-blue-600" 
            : "text-gray-500 border-transparent hover:text-gray-700"
        }`}
      >
        Reports
      </button>
    </div>
  );
};