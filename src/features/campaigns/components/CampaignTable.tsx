import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { useNavigate } from '@tanstack/react-router';
import type { Campaign } from '../types';
import { useJobStats } from '../hooks/useCampaigns';

interface CampaignTableProps {
  campaigns: Campaign[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onCreateNewCampaign: () => void;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({
  campaigns,
  searchTerm,
  onSearchChange,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onCreateNewCampaign
}) => {
  const navigate = useNavigate();
  const jobStatsMutation = useJobStats();
  const [statusFilter, setStatusFilter] = useState<string>('All States');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statusOptions = [
    'All States',
    'Active',
    'In Review',
    'Alerts',
    'Warning',
    'Paused'
  ];

  const handleCampaignClick = async (campaignId: string) => {
    // Find the campaign to get its details
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) {
      console.error('Campaign not found:', campaignId);
      navigate({ to: '/campaignOverview/$id', params: { id: campaignId } });
      return;
    }

    // Format dates for the API call
    const formatDateForAPI = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    };

    // Get current date for toDate
    const getCurrentDate = () => {
      const today = new Date();
      return today.toISOString().split('T')[0]; // YYYY-MM-DD format
    };

    const fromDate = formatDateForAPI(campaign.startDate);
    const toDate = getCurrentDate(); // Use current date

    // Make the job stats API call
    try {
      await jobStatsMutation.mutateAsync({
        FromDate: fromDate,
        ToDate: toDate,
        OrgId: campaign.orgId,
        CampaignName: campaign.name
      });
    } catch (error) {
      console.error('Error fetching job stats for campaign:', campaign.name, error);
      // Continue with navigation even if API call fails
    }

    // Navigate to campaign overview
    navigate({ to: '/campaignOverview/$id', params: { id: campaignId } });
  };

  const getStatusBadge = (status: Campaign['status']) => {
    const statusStyles = {
      'Active': 'bg-green-100 text-green-800',
      'Review': 'bg-yellow-100 text-yellow-800',
      'Pending': 'bg-gray-100 text-gray-800',
      'Paused': 'bg-red-100 text-red-800',
      'Completed': 'bg-blue-100 text-blue-800',
    };

    const statusLabels = {
      'Active': 'Active',
      'Review': 'In Review',
      'Pending': 'Pending',
      'Paused': 'Paused',
      'Completed': 'Completed',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Filter campaigns based on search term and status
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All States' || 
      (statusFilter === 'Active' && campaign.status === 'Active') ||
      (statusFilter === 'In Review' && campaign.status === 'Review') ||
      (statusFilter === 'Paused' && campaign.status === 'Paused') ||
      (statusFilter === 'Alerts' && campaign.status === 'Pending') ||
      (statusFilter === 'Warning' && campaign.status === 'Completed');
    
    return matchesSearch && matchesStatus;
  });

  // Paginate filtered campaigns
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {/* Data Table Section */}
      <div className="mb-4 flex">
        <h2 className="text-lg font-semibold text-gray-900">Data Table</h2>
      </div>

      {/* Data Table Card */}
      <div className="">
        {/* Search and Filters */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Filter Buttons */}
              <Button variant="outline" size="sm" className="text-gray-600">
                <Filter className="w-4 h-4 mr-2" />
                Filter by Client
              </Button>
              
              {/* Status Filter Dropdown */}
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-gray-600 flex items-center gap-2"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <Filter className="w-4 h-4" />
                  Filter by Status
                  <ChevronDown className="w-4 h-4" />
                </Button>
                
                {showStatusDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setStatusFilter(option);
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          statusFilter === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Button variant="outline" size="sm" className="text-gray-600">
                All Types
              </Button>
            </div>
            
            {/* Create Campaign Button */}
            <Button onClick={onCreateNewCampaign} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Campaign
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead 
              className="border-b"
              style={{ 
                background: 'rgba(248, 248, 248, 1)',
                height: '73px',
                opacity: 1
              }}
            >
              <tr>
                <th className="px-6 py-1 text-left w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-1 text-left text-xs font-bold text-gray-500 tracking-wider w-64">
                  Campaign Name
                </th>
                <th className="px-6 py-1 text-left text-xs font-bold text-gray-500 tracking-wider w-40">
                  Client Name
                </th>
                <th className="px-6 py-1 text-center text-xs font-bold text-gray-500 tracking-wider w-28">
                  Status
                </th>
                <th className="px-6 py-1 text-center text-xs font-bold text-gray-500 tracking-wider w-32">
                  Start Date
                </th>
                <th className="px-6 py-1 text-center text-xs font-bold text-gray-500 tracking-wider w-32">
                  End Date
                </th>
                <th className="px-6 py-1 text-right text-xs font-bold text-gray-500 tracking-wider w-32">
                  Total Budget
                </th>
                <th className="px-6 py-1 text-right text-xs font-bold text-gray-500 tracking-wider w-32">
                  Current Spend
                </th>
                <th className="px-6 py-1 text-center text-xs font-bold text-gray-500 tracking-wider w-36">
                  Budget Utilized
                </th>
                <th className="px-6 py-1 text-right text-xs font-bold text-gray-500 tracking-wider w-32">
                  Achieved CTAs
                </th>
                <th className="px-3 py-1 text-center text-xs font-bold text-gray-500 tracking-wider w-16">
                  Actions
                </th>
              </tr>
            </thead>
          </table>
          
          {/* Table Body with styling */}
          <div className="bg-gray-25 rounded-lg shadow-sm border border-gray-100 mt-2">
            <table className="w-full table-fixed">
              <tbody className="bg-white">
                {paginatedCampaigns.map((campaign, index) => (
                  <tr 
                    key={campaign.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${index < paginatedCampaigns.length - 1 ? 'border-b border-gray-200' : ''} ${index === 0 ? 'first:rounded-t-lg' : ''} ${index === paginatedCampaigns.length - 1 ? 'last:rounded-b-lg' : ''}`}
                    onClick={() => handleCampaignClick(campaign.id)}
                  >
                    <td className="px-6 py-4 w-12" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 w-64">
                      <div className="min-w-0">
                        <div className="text-sm font-normal text-gray-900 truncate">{campaign.name}</div>
                        <div className="text-xs text-gray-500 truncate">{campaign.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-900 w-40 truncate">
                      {campaign.clientName}
                    </td>
                    <td className="px-6 py-4 text-center w-28">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-900 text-center w-32">
                      {formatDate(campaign.startDate)}
                    </td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-900 text-center w-32">
                      {formatDate(campaign.endDate)}
                    </td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-900 text-right w-32">
                      {formatCurrency(campaign.budget)}
                    </td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-900 text-right w-32">
                      {formatCurrency(campaign.currentSpend || 0)}
                    </td>
                    <td className="px-6 py-4 w-36">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(campaign.budgetUtilized || 0, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-normal text-gray-600 min-w-[2rem]">{campaign.budgetUtilized || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right w-32">
                      <div className="text-sm font-normal text-gray-900">{(campaign.achievedCTAs || 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(campaign.costPerAction || 0)}</div>
                    </td>
                    <td className="px-6 py-4 text-center w-16" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <DataTablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCampaigns.length / pageSize)}
          totalItems={filteredCampaigns.length}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          itemName="campaigns"
        />
      </div>
    </>
  );
};