export interface JobStatsRequest {
  FromDate: string;
  ToDate: string;
  OrgId: number;
  CampaignName: string; // Required field as shown in the curl example
}

export interface TopJob {
  JobGuid: string;
  JobCode: string;
  JobTitle: string;
  Location: string;
  Company: string;
  Campaign: string;
  TotalClicks: number;
  ValidClicks: number;
  ValidApplies: number;
  TotalApplies: number;
  BotClicks: number;
  InvalidClicks: number;
  LatentClicks: number;
  DuplicateClicks: number;
  TotalClickCost: number;
}

export interface CampaignStat {
  Click_count: number;
  Apply_count: number;
  InvalidClick_Count: number;
  BotClick_Count: number;
  LatentClick_Count: number;
  DuplicateClick_Count: number;
  Spent: number;
  Activity_date: string;
  Campaign_name: string;
}

export interface JobStatsResponse {
  OrgId: number;
  OrgName: string;
  Budget: number;
  Total_jobs: number;
  Active_jobs: number;
  TopJobs: TopJob[];
  TotalJobs: any[]; // Keep as any[] since it appears to be empty in the example
  CPC: number;
  CPA: number;
  Clicks: number;
  BotClicks: number;
  InvalidClicks: number;
  LatentClicks: number;
  DuplicateClicks: number;
  Applies: number;
  CR: number;
  ShowPublisherWiseGraph: boolean;
  Campaign_stats: CampaignStat[];
}

const API_BASE_URL = 'https://app-qa.goarya.com/api/v3';

// Store the authorization key for API calls
const AUTHORIZATION_KEY = 'AryaKey e1df5fba-62b0-11e9-a7da-0242ac110002;Ang04bKI.TWOUhprXHS0CNAUUv59oqFUcfHbj5bLIeYI;cmFnaGF2ZW5kZXIuZ291ZC5hZGVudGFsQGxlb2ZvcmNlLmNvbQ==';

export const jobStatsApi = {
  getJobStats: async (request: JobStatsRequest): Promise<JobStatsResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/programmatic/jobstats`, {
        method: 'POST',
        headers: {
          'Authorization': AUTHORIZATION_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job stats:', error);
      throw error;
    }
  },

  // Additional method for campaign stats using the same authorization
  getCampaignStats: async (request: Omit<JobStatsRequest, 'CampaignName'>): Promise<JobStatsResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/programmatic/campaignstats`, {
        method: 'POST',
        headers: {
          'Authorization': AUTHORIZATION_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
      throw error;
    }
  },
};