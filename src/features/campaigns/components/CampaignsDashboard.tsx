import { useState } from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { useCampaigns } from '../hooks/useCampaigns';
import { CampaignTable } from './CampaignTable';
import type { CampaignFilters } from '../types';

export const CampaignsDashboard = () => {
  const [filters, setFilters] = useState<CampaignFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('2025-06-15');
  const [endDate, setEndDate] = useState('2025-09-15');
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useCampaigns(filters);

  const handleCreateNewCampaign = () => {
    console.log('Creating new campaign...');
  };

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    // Here you can add logic to filter campaigns based on date range
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
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

  return (
    <div className="min-h-screen page-transition" style={{ backgroundColor: 'rgb(241, 242, 244)' }}>
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
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateRangeChange}
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-gray-600">Convergence</Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Tabular</Button>
              </div>
            </div>
          </div>

          {/* Campaign Table */}
          <CampaignTable
            campaigns={campaigns}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onCreateNewCampaign={handleCreateNewCampaign}
          />
        </div>
      </div>
    </div>
  );
};