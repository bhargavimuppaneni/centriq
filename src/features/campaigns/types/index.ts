export interface Campaign {
    id: string;
    name: string;
    description: string;
    clientId: string;
    clientName: string;
    status: 'Review' | 'Active' | 'Paused' | 'Completed' | 'Pending';
    startDate: string; // ISO date string from API
    endDate: string | null; // ISO date string from API, can be null
    createdDate: string; // ISO date string from API
    modifiedDate: string | null;
    createdBy: string;
    modifiedBy: string;
    orgId: number;
    priority: number | null;
    currencyCode: string;
    budget: number; // renamed from totalBudget
    threshold: number;
    publishers: any[];
    ruleGroups: any[];
    markUp: number;
    markDown: number | null;
    cpa: number | null;
    cpc: number;
    isJobExpansionEnabled: boolean;
    isJobCodeRequired: boolean;
    preThresholdNotifiedAt: string | null;
    thresholdNotifiedAt: string | null;
    bidType: string;
    subGroupName: string;
    subGroupPriority: number | null;
    applyType: string | null;
    
    // Calculated fields for display
    currentSpend?: number;
    budgetUtilized?: number; // percentage
    achievedCTAs?: number;
    costPerAction?: number;
  }
  
  // Rule interfaces for campaign targeting
  export interface CampaignRule {
    Field: string;
    Operation: string;
    Value: string;
  }
  
  export interface CampaignRuleGroup {
    Operation: string; // "And" or "Or"
    Rules: CampaignRule[];
  }
  
  export interface CreateCampaignRequest {
    OrgId: number;
    Name: string;
    StartDate: string; // ISO date string
    EndDate: string | null;
    Budget: number;
    Threshold: number;
    MarkUp: number;
    MarkDown: number | null;
    CPA: number | null;
    CPC: number;
    Status: string | null;
    BidType: string;
    Id: string | null;
    ClientId: string | null;
    ClientName: string;
    RuleGroups: CampaignRuleGroup[];
  }
  
  export interface CampaignFilters {
    client?: string;
    status?: Campaign['status'];
    dateRange?: {
      start: Date;
      end: Date;
    };
  }
  
  export interface CampaignsResponse {
    campaigns: Campaign[];
    total: number;
    page: number;
    pageSize: number;
  }