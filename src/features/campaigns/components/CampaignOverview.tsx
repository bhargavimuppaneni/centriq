import React, { useState } from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { CampaignChart } from './CampaignChart';
import { CampaignHeader } from './CampaignHeader';
import { CampaignTabs } from './CampaignTabs';
import { CampaignMetrics } from './CampaignMetrics';
import { CampaignActions } from './CampaignActions';
import { BudgetGoals } from './BudgetGoals';
import { CampaignDetails } from './CampaignDetails';
import { useCampaign, useJobStats } from '../hooks/useCampaigns';

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
  campaignId?: string;
  // Keep existing props as fallback defaults
  campaignName?: string;
  clientName?: string;
  createdBy?: string;
  createdDate?: string;
  dateRange?: string;
  status?: 'Active' | 'Paused' | 'Completed' | 'Draft' | 'Review' | 'Pending';
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
  campaignId,
  // Fallback defaults if no campaignId is provided
  campaignName: fallbackCampaignName = "Drivers for Uber",
  clientName: fallbackClientName = "GlobalTech Solutions",
  createdBy: fallbackCreatedBy = "Sarah Mitchell",
  createdDate: fallbackCreatedDate = "June 10, 2025",
  status: fallbackStatus = "Active",
  totalSpend: fallbackTotalSpend = 2850,
  achievedCTAs: fallbackAchievedCTAs = 1500,
  averageCPA: fallbackAverageCPA = 5.70,
  ctr: fallbackCtr = 3.2,
  spendChange: fallbackSpendChange = 12.5,
  ctaChange: fallbackCtaChange = 8.3,
  cpaChange: fallbackCpaChange = -5.2,
  ctrChange: fallbackCtrChange = 15.7,
  chartData: propChartData = chartData,
  // Budget & Goals defaults
  totalBudget: fallbackTotalBudget = 4000,
  currentSpend: fallbackCurrentSpend = 1750,
  remainingBudget: fallbackRemainingBudget = 2250,
  budgetProgress: fallbackBudgetProgress = 43.75,
  targetApplications: fallbackTargetApplications = 2000,
  currentApplications: fallbackCurrentApplications = 845,
  applicationsNeeded: fallbackApplicationsNeeded = 1155,
  goalProgress: fallbackGoalProgress = 42.25,
  // Campaign Details defaults
  startDate: fallbackStartDate = "Sep 1, 2023",
  endDate: fallbackEndDate = "Sep 30, 2023",
  duration: fallbackDuration = "30 days",
  totalJobs: fallbackTotalJobs = 125,
  jobCategories: fallbackJobCategories = "Software Engineering",
  dataSource: fallbackDataSource = "XML Feed",
  lastModifiedBy: fallbackLastModifiedBy = "Sep 5, 2023",
  lastModifiedDate: fallbackLastModifiedDate = "Aug 25, 2023"
}) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [dateRangeStart, setDateRangeStart] = useState('2025-06-15');
  const [dateRangeEnd, setDateRangeEnd] = useState('2025-09-15');

  // Fetch campaign data if campaignId is provided
  const { data: campaign, isLoading, error } = useCampaign(campaignId || '');
  const jobStatsMutation = useJobStats();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Use fetched campaign data if available, otherwise use fallback props
  const campaignName = campaign?.name || fallbackCampaignName;
  const clientName = campaign?.clientName || fallbackClientName;
  const createdBy = campaign?.createdBy || fallbackCreatedBy;
  const createdDate = campaign ? formatDate(campaign.createdDate) : fallbackCreatedDate;
  const status = campaign?.status || fallbackStatus;
  const totalSpend = campaign?.currentSpend || fallbackTotalSpend;
  const achievedCTAs = campaign?.achievedCTAs || fallbackAchievedCTAs;
  const averageCPA = campaign?.costPerAction || fallbackAverageCPA;
  const ctr = fallbackCtr; // Not available in campaign data, use fallback
  const spendChange = fallbackSpendChange; // Not available in campaign data, use fallback
  const ctaChange = fallbackCtaChange; // Not available in campaign data, use fallback
  const cpaChange = fallbackCpaChange; // Not available in campaign data, use fallback
  const ctrChange = fallbackCtrChange; // Not available in campaign data, use fallback
  
  // Budget & Goals - use campaign data where available
  const totalBudget = campaign?.budget || fallbackTotalBudget;
  const currentSpend = campaign?.currentSpend || fallbackCurrentSpend;
  const remainingBudget = totalBudget - currentSpend;
  const budgetProgress = campaign?.budgetUtilized || fallbackBudgetProgress;
  const targetApplications = fallbackTargetApplications; // Not in campaign data
  const currentApplications = fallbackCurrentApplications; // Not in campaign data
  const applicationsNeeded = targetApplications - currentApplications;
  const goalProgress = (currentApplications / targetApplications) * 100;
  
  // Campaign Details - use campaign data where available
  const startDate = campaign ? formatDate(campaign.startDate) : fallbackStartDate;
  const endDate = campaign ? formatDate(campaign.endDate) : fallbackEndDate;
  const duration = fallbackDuration; // Calculate or use fallback
  const totalJobs = fallbackTotalJobs; // Not in campaign data
  const jobCategories = fallbackJobCategories; // Not in campaign data
  const dataSource = fallbackDataSource; // Not in campaign data
  const lastModifiedBy = campaign ? formatDate(campaign.modifiedDate) : fallbackLastModifiedBy;
  const lastModifiedDate = fallbackLastModifiedDate; // Use fallback

  if (campaignId && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (campaignId && error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-600 text-center">
            Error loading campaign: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  const handleDateRangeChange = async (newStartDate: string, newEndDate: string) => {
    setDateRangeStart(newStartDate);
    setDateRangeEnd(newEndDate);
    console.log('Date range changed to:', newStartDate, 'to', newEndDate);
    
    // Call job stats API with new date range if we have campaign data
    if (campaign) {
      try {
        await jobStatsMutation.mutateAsync({
          FromDate: newStartDate,
          ToDate: newEndDate,
          OrgId: campaign.orgId,
          CampaignName: campaign.name
        });
      } catch (error) {
        console.error('Error fetching job stats for date range:', newStartDate, 'to', newEndDate, error);
      }
    }
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
    <div className="min-h-screen bg-gray-50 p-6 page-transition">
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
          <div className="mb-6 lg:w-1/3">
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