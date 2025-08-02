import React, { useState } from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { CampaignChart } from './CampaignChart';
import { CampaignHeader } from './CampaignHeader';
import { CampaignTabs } from './CampaignTabs';
import { CampaignMetrics } from './CampaignMetrics';
import { CampaignActions } from './CampaignActions';
import { BudgetGoals } from './BudgetGoals';
import { CampaignDetails } from './CampaignDetails';

// Sample data for the chart
const chartData = [
  { date: 'Jun 15', dailyCTAs: 45, dailySpend: 280 },
  { date: 'Jun 20', dailyCTAs: 52, dailySpend: 320 },
  { date: 'Jun 25', dailyCTAs: 48, dailySpend: 310 },
  { date: 'Jun 30', dailyCTAs: 58, dailySpend: 350 },
  { date: 'Jul 5', dailyCTAs: 55, dailySpend: 330 },
  { date: 'Jul 10', dailyCTAs: 65, dailySpend: 380 },
  { date: 'Jul 15', dailyCTAs: 72, dailySpend: 400 },
  { date: 'Jul 20', dailyCTAs: 68, dailySpend: 390 },
];

interface CampaignOverviewProps {
  campaignName?: string;
  clientName?: string;
  createdBy?: string;
  createdDate?: string;
  dateRange?: string;
  status?: 'Active' | 'Paused' | 'Completed' | 'Draft';
  totalSpend?: number;
  achievedCTAs?: number;
  averageCPA?: number;
  ctr?: number;
  spendChange?: number;
  ctaChange?: number;
  cpaChange?: number;
  ctrChange?: number;
  chartData?: typeof chartData;
  // Budget & Goals props
  totalBudget?: number;
  currentSpend?: number;
  remainingBudget?: number;
  budgetProgress?: number;
  targetApplications?: number;
  currentApplications?: number;
  applicationsNeeded?: number;
  goalProgress?: number;
  // Campaign Details props
  startDate?: string;
  endDate?: string;
  duration?: string;
  totalJobs?: number;
  jobCategories?: string;
  dataSource?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export const CampaignOverview: React.FC<CampaignOverviewProps> = ({
  campaignName = "Drivers for Uber",
  clientName = "GlobalTech Solutions",
  createdBy = "Sarah Mitchell",
  createdDate = "June 10, 2025",
  status = "Active",
  totalSpend = 2850,
  achievedCTAs = 1500,
  averageCPA = 5.70,
  ctr = 3.2,
  spendChange = 12.5,
  ctaChange = 8.3,
  cpaChange = -5.2,
  ctrChange = 15.7,
  chartData: propChartData = chartData,
  // Budget & Goals defaults
  totalBudget = 4000,
  currentSpend = 1750,
  remainingBudget = 2250,
  budgetProgress = 43.75,
  targetApplications = 2000,
  currentApplications = 845,
  applicationsNeeded = 1155,
  goalProgress = 42.25,
  // Campaign Details defaults
  startDate = "Sep 1, 2023",
  endDate = "Sep 30, 2023",
  duration = "30 days",
  totalJobs = 125,
  jobCategories = "Software Engineering",
  dataSource = "XML Feed",
  lastModifiedBy = "Sep 5, 2023",
  lastModifiedDate = "Aug 25, 2023"
}) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [dateRangeStart, setDateRangeStart] = useState('2025-06-15');
  const [dateRangeEnd, setDateRangeEnd] = useState('2025-09-15');

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    setDateRangeStart(newStartDate);
    setDateRangeEnd(newEndDate);
    console.log('Date range changed to:', newStartDate, 'to', newEndDate);
    // Here you can implement logic to filter the chart data based on the selected range
    // or make an API call to fetch new data for the selected date range
  };

  const handlePauseCampaign = () => {
    console.log('Pausing campaign...');
    // Implement pause campaign logic
  };

  const handleResumeCampaign = () => {
    console.log('Resuming campaign...');
    // Implement resume campaign logic
  };

  const handleEditCampaign = () => {
    console.log('Editing campaign...');
    // Implement edit campaign logic
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <CampaignHeader
          campaignName={campaignName}
          clientName={clientName}
          createdBy={createdBy}
          createdDate={createdDate}
        />

        <div className="mb-6">
          <CampaignTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Date Range Picker */}
          <div className="mb-6">
            <DateRangePicker
              startDate={dateRangeStart}
              endDate={dateRangeEnd}
              onDateChange={handleDateRangeChange}
            />
          </div>
        </div>

        {/* Campaign Overview Section */}
        <div className="mb-8">
          <CampaignActions
            status={status}
            onPauseCampaign={handlePauseCampaign}
            onResumeCampaign={handleResumeCampaign}
            onEditCampaign={handleEditCampaign}
          />

          {/* Metrics Grid */}
          <CampaignMetrics
            totalSpend={totalSpend}
            achievedCTAs={achievedCTAs}
            averageCPA={averageCPA}
            ctr={ctr}
            spendChange={spendChange}
            ctaChange={ctaChange}
            cpaChange={cpaChange}
            ctrChange={ctrChange}
          />
        </div>

        {/* Chart Section */}
        <div className="mb-8">
          <CampaignChart
            data={propChartData}
            title="Daily CTAs & Spend Trend"
            height={320}
            onDateRangeChange={handleDateRangeChange}
            ctaDomain={[40, 80]}
            spendDomain={[250, 450]}
          />
        </div>

        {/* Budget & Goals and Campaign Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BudgetGoals
            totalBudget={totalBudget}
            currentSpend={currentSpend}
            remainingBudget={remainingBudget}
            budgetProgress={budgetProgress}
            targetApplications={targetApplications}
            currentApplications={currentApplications}
            applicationsNeeded={applicationsNeeded}
            goalProgress={goalProgress}
          />

          <CampaignDetails
            startDate={startDate}
            endDate={endDate}
            duration={duration}
            totalJobs={totalJobs}
            jobCategories={jobCategories}
            dataSource={dataSource}
            createdBy={createdBy}
            lastModifiedBy={lastModifiedBy}
            lastModifiedDate={lastModifiedDate}
          />
        </div>
      </div>
    </div>
  );
};