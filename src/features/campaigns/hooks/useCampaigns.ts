import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Campaign, CreateCampaignRequest, CampaignsResponse, CampaignFilters } from '../types';

// Mock API functions - replace with actual API calls
const campaignsApi = {
  getCampaigns: async (filters?: CampaignFilters): Promise<CampaignsResponse> => {
    // Mock data matching the actual API response structure
    const mockCampaigns: Campaign[] = [
      {
        clientId: "ae6b4817-5c16-4b3d-8e44-ca468c67ef4f",
        clientName: "GlobalTech Solutions",
        id: "fd380c74-09a3-4f72-b527-b62afd7d64ec",
        name: "Test Centriq",
        description: "Q3 Software Hiring Drive Campaign",
        startDate: "2025-02-25T00:00:00Z",
        endDate: "2025-09-15T00:00:00Z",
        createdDate: "2025-08-02T12:31:22.194Z",
        modifiedDate: null,
        createdBy: "system",
        modifiedBy: "",
        orgId: 552499,
        priority: null,
        currencyCode: "USD",
        budget: 5000,
        threshold: 80,
        status: "Review",
        publishers: [],
        ruleGroups: [],
        markUp: 25,
        markDown: null,
        cpa: null,
        cpc: 15,
        isJobExpansionEnabled: true,
        isJobCodeRequired: true,
        preThresholdNotifiedAt: null,
        thresholdNotifiedAt: null,
        bidType: "CPC",
        subGroupName: "",
        subGroupPriority: null,
        applyType: null,
        // Calculated display fields
        currentSpend: 0,
        budgetUtilized: 0,
        achievedCTAs: 0,
        costPerAction: 0,
      },
      {
        clientId: "ae6b4817-5c16-4b3d-8e44-ca468c67ef4f",
        clientName: "GlobalTech Solutions",
        id: "2e450c85-19b4-5c83-b638-c73bfe8e75fd",
        name: "Drivers For Ubers",
        description: "Driver recruitment campaign for ride-sharing platform",
        startDate: "2025-06-15T00:00:00Z",
        endDate: "2025-09-15T00:00:00Z",
        createdDate: "2025-07-15T10:20:15.500Z",
        modifiedDate: "2025-07-20T14:30:22.750Z",
        createdBy: "admin",
        modifiedBy: "admin",
        orgId: 552499,
        priority: 1,
        currencyCode: "USD",
        budget: 8000,
        threshold: 75,
        status: "Active",
        publishers: ["Indeed", "LinkedIn"],
        ruleGroups: [],
        markUp: 20,
        markDown: null,
        cpa: 45.50,
        cpc: 12,
        isJobExpansionEnabled: true,
        isJobCodeRequired: false,
        preThresholdNotifiedAt: null,
        thresholdNotifiedAt: null,
        bidType: "CPC",
        subGroupName: "Driver Recruitment",
        subGroupPriority: 1,
        applyType: "external",
        // Calculated display fields
        currentSpend: 4560,
        budgetUtilized: 57,
        achievedCTAs: 1500,
        costPerAction: 3.04,
      },
      {
        clientId: "ae6b4817-5c16-4b3d-8e44-ca468c67ef4f",
        clientName: "TechCorp Inc",
        id: "3f561d96-20c5-6d94-c749-d84cff9f86ge",
        name: "Software Engineer Hiring",
        description: "Senior software engineer recruitment campaign",
        startDate: "2025-07-01T00:00:00Z",
        endDate: "2025-10-31T00:00:00Z",
        createdDate: "2025-06-25T08:15:30.200Z",
        modifiedDate: "2025-07-10T16:45:18.900Z",
        createdBy: "hr_manager",
        modifiedBy: "campaign_manager",
        orgId: 552499,
        priority: 2,
        currencyCode: "USD",
        budget: 12000,
        threshold: 85,
        status: "Active",
        publishers: ["Stack Overflow", "GitHub Jobs", "AngelList"],
        ruleGroups: [],
        markUp: 30,
        markDown: 5,
        cpa: 65.25,
        cpc: 18,
        isJobExpansionEnabled: false,
        isJobCodeRequired: true,
        preThresholdNotifiedAt: null,
        thresholdNotifiedAt: "2025-07-25T09:30:00.000Z",
        bidType: "CPA",
        subGroupName: "Tech Hiring",
        subGroupPriority: 1,
        applyType: "internal",
        // Calculated display fields
        currentSpend: 9180,
        budgetUtilized: 76.5,
        achievedCTAs: 2250,
        costPerAction: 4.08,
      }
    ];

    // Apply filters if provided
    let filteredCampaigns = mockCampaigns;
    
    if (filters?.client) {
      filteredCampaigns = filteredCampaigns.filter(campaign => 
        campaign.clientName.toLowerCase().includes(filters.client!.toLowerCase())
      );
    }
    
    if (filters?.status) {
      filteredCampaigns = filteredCampaigns.filter(campaign => 
        campaign.status === filters.status
      );
    }

    return {
      campaigns: filteredCampaigns,
      total: filteredCampaigns.length,
      page: 1,
      pageSize: 10,
    };
  },
  
  createCampaign: async (campaign: CreateCampaignRequest): Promise<Campaign> => {
    // TODO: Replace with actual API call to http://localhost:5000/api/centriqcampaign
    // const response = await fetch('http://localhost:5000/api/centriqcampaign', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(campaign),
    // });
    // return response.json();

    // Mock creation - replace with actual API call
    const newId = Math.random().toString(36).substr(2, 9);
    return {
      id: newId,
      clientId: campaign.ClientId || newId,
      clientName: campaign.ClientName,
      name: campaign.Name,
      description: "", // Not in create request, would come from API response
      startDate: campaign.StartDate,
      endDate: campaign.EndDate,
      createdDate: new Date().toISOString(),
      modifiedDate: null,
      createdBy: "current_user",
      modifiedBy: "",
      orgId: campaign.OrgId,
      priority: null,
      currencyCode: "USD",
      budget: campaign.Budget,
      threshold: campaign.Threshold,
      status: "Pending",
      publishers: [],
      ruleGroups: campaign.RuleGroups,
      markUp: campaign.MarkUp,
      markDown: campaign.MarkDown,
      cpa: campaign.CPA,
      cpc: campaign.CPC,
      isJobExpansionEnabled: true,
      isJobCodeRequired: true,
      preThresholdNotifiedAt: null,
      thresholdNotifiedAt: null,
      bidType: campaign.BidType,
      subGroupName: "",
      subGroupPriority: null,
      applyType: null,
      currentSpend: 0,
      budgetUtilized: 0,
      achievedCTAs: 0,
      costPerAction: 0,
    };
  },
};

export const useCampaigns = (filters?: CampaignFilters) => {
  return useQuery({
    queryKey: ['campaigns', filters],
    queryFn: () => campaignsApi.getCampaigns(filters),
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: campaignsApi.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};