import React from 'react';
import { Settings, Users, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccountManagementOverviewProps {
  onOrganizationProfileClick?: () => void;
  onManageTeamClick?: () => void;
  onClientManagementClick?: () => void;
}

export const AccountManagementOverview: React.FC<AccountManagementOverviewProps> = ({
  onOrganizationProfileClick,
  onManageTeamClick,
  onClientManagementClick
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex gap-2 text-sm text-gray-500 mb-4">
          <span>Account Management</span>
          <span>›</span>
          <span className="text-gray-900">Account Overview</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Account Management Overview</h1>
          <p className="text-lg text-gray-600">
            Manage your organization's profile, team members and integrations from one place.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Organization Profile Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-start">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Organization Profile</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Update company details, branding, and settings.
              </p>
              
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={onOrganizationProfileClick}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Manage Your Team Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-start">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Manage Your Team</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Add, remove, and manage user access and roles.
              </p>
              
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={onManageTeamClick}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Client Management Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-start">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <UserCheck className="w-6 h-6 text-gray-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Client Management</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Create, and edit your clients.
              </p>
              
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={onClientManagementClick}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};