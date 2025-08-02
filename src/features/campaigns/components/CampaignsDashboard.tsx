import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCampaigns } from '../hooks/useCampaigns';
import type { Campaign, CampaignFilters } from '../types';

export const CampaignsDashboard = () => {
  const [filters, setFilters] = useState<CampaignFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useCampaigns(filters);

  const handleCreateNewCampaign = () => {
    console.log('Creating new campaign...');
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

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-100 flex flex-col">
        <div className="flex-1 px-8 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-4 pt-8">
              <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-100 flex flex-col">
        <div className="flex-1 px-8 pb-12">
          <div className="max-w-6xl mx-auto pt-8">
            <div className="text-red-600 text-center">Error loading campaigns</div>
          </div>
        </div>
      </div>
    );
  }

  const campaigns = data?.campaigns || [];
  const totalCampaigns = data?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header - Dashboard breadcrumb and title */}
          <div className="mb-6">
            <div className="flex gap-2 text-sm text-gray-500 mb-2">
              <span>Dashboard</span>
              <span>›</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Campaigns Dashboard</h1>
            
            {/* Date Range and View Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 cursor-pointer">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">June 15, 2025 - September 15, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-gray-600">Convergence</Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Tabular</Button>
              </div>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="mb-4">
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
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                  
                  {/* Filter Buttons */}
                  <Button variant="outline" size="sm" className="text-gray-600">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter by Client
                  </Button>
                  
                  <Button variant="outline" size="sm" className="text-gray-600">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter by Status
                  </Button>
                  
                  <Button variant="outline" size="sm" className="text-gray-600">
                    All Types
                  </Button>
                </div>
                
                {/* Create Campaign Button */}
                <Button onClick={handleCreateNewCampaign} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Campaign
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left w-12">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Budget
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Spend
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget Utilized
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Achieved CTAs
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      Actions
                    </th>
                  </tr>
                </thead>
              </table>
              
              {/* Table Body with styling */}
              <div className="bg-gray-25 rounded-lg shadow-sm border border-gray-100 mt-2">
                <table className="w-full">
                  <tbody className="bg-white">
                    {campaigns.map((campaign, index) => (
                      <tr key={campaign.id} className={`hover:bg-gray-50 ${index < campaigns.length - 1 ? 'border-b border-gray-200' : ''} ${index === 0 ? 'first:rounded-t-lg' : ''} ${index === campaigns.length - 1 ? 'last:rounded-b-lg' : ''}`}>
                        <td className="px-6 py-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{campaign.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {campaign.clientName}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(campaign.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                          {formatDate(campaign.startDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                          {formatDate(campaign.endDate)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                          {formatCurrency(campaign.budget)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                          {formatCurrency(campaign.currentSpend || 0)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(campaign.budgetUtilized || 0, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 font-medium min-w-[2rem]">{campaign.budgetUtilized || 0}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm text-gray-900 font-medium">{(campaign.achievedCTAs || 0).toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{formatCurrency(campaign.costPerAction || 0)}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
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
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing 1-{campaigns.length} of {totalCampaigns} campaigns
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={currentPage === 1} className="h-8 w-8 p-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-600 text-white border-blue-600 h-8 min-w-[2rem]">1</Button>
                <Button variant="outline" size="sm" className="h-8 min-w-[2rem]">2</Button>
                <Button variant="outline" size="sm" className="h-8 min-w-[2rem]">3</Button>
                <Button variant="outline" size="sm" className="h-8 min-w-[2rem]">4</Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <select className="ml-4 text-sm border border-gray-300 rounded px-3 py-1 h-8">
                  <option>10 per page</option>
                  <option>25 per page</option>
                  <option>50 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};