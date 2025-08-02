export interface XMLValidationRequest {
  feedUrl: string;
  clientId?: string;
}

export interface XMLValidationResponse {
  isValid: boolean;
  detectedFormat: string;
  totalNodes: number;
  totalRecords: number;
  processingTime: string;
  contentType: string;
  errorMessage?: string;
  validationErrors: string[];
  validationId: string; // Used for subsequent API calls
}

export interface NodesResponse {
  nodes: string[];
  validationId: string;
  feedStructure: {
    rootElement: string;
    itemElement: string;
    namespace?: string;
  };
}

export interface AvailableFeedFieldsResponse {
  fields: string[];
  feedUrl: string;
  validationId: string;
  detectedAt: string;
}

export interface CampaignSetupRequest {
  clientId: string;
  validationId: string;
  fieldMappings: Array<{
    centralField: string;
    feedField: string;
    isRequired: boolean;
  }>;
  campaignName: string;
  campaignSettings?: {
    frequency: 'hourly' | 'daily' | 'weekly';
    autoApprove: boolean;
    notifications: boolean;
  };
}

export interface CampaignSetupResponse {
  campaignId: string;
  status: 'pending' | 'active' | 'error';
  message: string;
  nextSteps?: string[];
}

// API Base URL - update this to your actual API endpoint
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Actual API functions
const actualApi = {
  async validateXMLFeed(request: XMLValidationRequest): Promise<XMLValidationResponse> {
    const response = await fetch(`${API_BASE_URL}/feed/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async getNodes(validationId: string): Promise<NodesResponse> {
    const response = await fetch(`${API_BASE_URL}/feed/nodes/${validationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async getAvailableFeedFields(validationId: string): Promise<AvailableFeedFieldsResponse> {
    const response = await fetch(`${API_BASE_URL}/feed/fields/${validationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  async setupCampaign(request: CampaignSetupRequest): Promise<CampaignSetupResponse> {
    const response = await fetch(`${API_BASE_URL}/campaign/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

// Mock API functions
const mockApi = {
  async validateXMLFeed(): Promise<XMLValidationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const isValid = Math.random() > 0.2; // 80% chance of being valid
    const validationId = Math.random().toString(36).substr(2, 9);

    return {
      isValid,
      detectedFormat: 'XML',
      totalNodes: 15,
      totalRecords: Math.floor(Math.random() * 1000) + 100,
      processingTime: `${(Math.random() * 3 + 1).toFixed(2)}s`,
      contentType: 'application/xml',
      errorMessage: isValid ? undefined : 'Invalid XML structure detected',
      validationErrors: isValid ? [] : [
        'Missing required element: <item>',
        'Invalid namespace declaration',
      ],
      validationId,
    };
  },

  async getNodes(): Promise<NodesResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockNodes = [
      'job_title',
      'company_name', 
      'location',
      'description',
      'apply_url',
      'employment_type',
      'salary',
      'date_posted',
      'experience_required',
      'category',
      'company_size',
      'contact_email',
      'job_id',
      'department',
      'skills_required'
    ];

    const validationId = Math.random().toString(36).substr(2, 9);

    return {
      nodes: mockNodes,
      validationId,
      feedStructure: {
        rootElement: 'jobs',
        itemElement: 'job',
        namespace: 'http://jobs.example.com/ns/1.0',
      },
    };
  },

  async getAvailableFeedFields(): Promise<AvailableFeedFieldsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockFields = [
      'job_title',
      'company_name',
      'location',
      'description',
      'apply_url',
      'employment_type',
      'salary',
      'date_posted',
      'experience_required',
      'category',
      'company_size',
      'contact_email',
      'job_id',
      'department',
      'skills_required',
      'education_level',
      'remote_work',
      'benefits'
    ];

    const validationId = Math.random().toString(36).substr(2, 9);

    return {
      fields: mockFields,
      feedUrl: `https://example.com/feed/${validationId}.xml`,
      validationId,
      detectedAt: new Date().toISOString(),
    };
  },

  async setupCampaign(): Promise<CampaignSetupResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const success = Math.random() > 0.1; // 90% success rate
    const campaignId = Math.random().toString(36).substr(2, 9);

    if (!success) {
      return {
        campaignId: '',
        status: 'error',
        message: 'Failed to setup campaign. Please check your field mappings.',
      };
    }

    return {
      campaignId,
      status: 'active',
      message: 'Campaign setup successful! Your feed is now being processed.',
      nextSteps: [
        'Monitor campaign performance in the dashboard',
        'Review automated product imports',
        'Configure additional campaign settings if needed',
      ],
    };
  },
};

// Fallback function that tries actual API first, then falls back to mock
export const feedValidationApi = {
  async validateXMLFeed(request: XMLValidationRequest): Promise<XMLValidationResponse> {
    try {
      return await actualApi.validateXMLFeed(request);
    } catch (error) {
      console.warn('Actual API failed, falling back to mock:', error);
      return await mockApi.validateXMLFeed();
    }
  },

  async getNodes(validationId: string): Promise<NodesResponse> {
    try {
      return await actualApi.getNodes(validationId);
    } catch (error) {
      console.warn('Actual API failed, falling back to mock:', error);
      return await mockApi.getNodes();
    }
  },

  async getAvailableFeedFields(validationId: string): Promise<AvailableFeedFieldsResponse> {
    try {
      return await actualApi.getAvailableFeedFields(validationId);
    } catch (error) {
      console.warn('Actual API failed, falling back to mock:', error);
      return await mockApi.getAvailableFeedFields();
    }
  },

  async setupCampaign(request: CampaignSetupRequest): Promise<CampaignSetupResponse> {
    try {
      return await actualApi.setupCampaign(request);
    } catch (error) {
      console.warn('Actual API failed, falling back to mock:', error);
      return await mockApi.setupCampaign();
    }
  },
};