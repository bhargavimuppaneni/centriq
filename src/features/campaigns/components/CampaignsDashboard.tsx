import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { useCampaigns } from '../hooks/useCampaigns';
import type { Campaign, CampaignFilters } from '../types';

export const CampaignsDashboard = () => {
  const [filters, setFilters] = useState<CampaignFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('2025-06-15');
  const [endDate, setEndDate] = useState('2025-09-15');
  const [pageSize, setPageSize] = useState(10);

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

  const formatDateRange = (start: string, end: string) => {
    const startFormatted = new Date(start).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const endFormatted = new Date(end).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    return `${startFormatted} - ${endFormatted}`;
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const applyDateRange = () => {
    setShowDatePicker(false);
    // Here you can add logic to filter campaigns based on date range
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
  // const totalCampaigns = data?.total || 0;
  // const totalPages = Math.ceil(totalCampaigns / pageSize);
  // const startItem = (currentPage - 1) * pageSize + 1;
  // const endItem = Math.min(currentPage * pageSize, totalCampaigns);

  // Filter campaigns based on search term
  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate filtered campaigns
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(241, 242, 244)' }}>
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
              <div className="relative">
                <div 
                  className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-gray-300"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{formatDateRange(startDate, endDate)}</span>
                </div>
                
                {/* Date Picker Dropdown */}
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => handleDateChange('start', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => handleDateChange('end', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowDatePicker(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={applyDateRange}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
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
          <div className=""></div>
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
                      <tr key={campaign.id} className={`hover:bg-gray-50 ${index < paginatedCampaigns.length - 1 ? 'border-b border-gray-200' : ''} ${index === 0 ? 'first:rounded-t-lg' : ''} ${index === paginatedCampaigns.length - 1 ? 'last:rounded-b-lg' : ''}`}>
                        <td className="px-6 py-4 w-12">
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
                        <td className="px-6 py-4 text-center w-16">
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
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              itemName="campaigns"
            />
          </div>
        </div>
      </div>
  );
};