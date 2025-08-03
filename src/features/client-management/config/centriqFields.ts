export interface CentriqSystemField {
  name: string;
  required: boolean;
  description?: string;
  dataType?: 'string' | 'number' | 'boolean' | 'date' | 'url' | 'email';
  category?: 'basic' | 'location' | 'experience' | 'financial' | 'metadata';
}

export const CENTRIQ_SYSTEM_FIELDS: CentriqSystemField[] = [
  // Required fields
  { 
    name: 'CentriQ_Title', 
    required: true, 
    description: 'Job title or position name',
    dataType: 'string',
    category: 'basic'
  },
  { 
    name: 'CentriQ_Description', 
    required: true, 
    description: 'Job description content',
    dataType: 'string',
    category: 'basic'
  },
  { 
    name: 'CentriQ_City', 
    required: true, 
    description: 'Job location city',
    dataType: 'string',
    category: 'location'
  },
  { 
    name: 'CentriQ_ApplyUrl', 
    required: true, 
    description: 'URL where candidates can apply',
    dataType: 'url',
    category: 'basic'
  },
  
  // Optional fields - Location
  { 
    name: 'CentriQ_State', 
    required: false, 
    description: 'Job location state/province',
    dataType: 'string',
    category: 'location'
  },
  { 
    name: 'CentriQ_ZipCode', 
    required: false, 
    description: 'Job location postal code',
    dataType: 'string',
    category: 'location'
  },
  { 
    name: 'CentriQ_CountryCode', 
    required: false, 
    description: 'Job location country code',
    dataType: 'string',
    category: 'location'
  },
  
  // Optional fields - Experience
  { 
    name: 'CentriQ_MinExperience', 
    required: false, 
    description: 'Minimum years of experience required',
    dataType: 'number',
    category: 'experience'
  },
  { 
    name: 'CentriQ_MaxExperience', 
    required: false, 
    description: 'Maximum years of experience preferred',
    dataType: 'number',
    category: 'experience'
  },
  
  // Optional fields - Financial
  { 
    name: 'CentriQ_CostPerClick', 
    required: false, 
    description: 'Cost per click for job posting',
    dataType: 'number',
    category: 'financial'
  },
  { 
    name: 'CentriQ_CostPerApplicant', 
    required: false, 
    description: 'Cost per applicant for job posting',
    dataType: 'number',
    category: 'financial'
  },
  
  // Optional fields - Metadata
  { 
    name: 'CentriQ_ViewUrl', 
    required: false, 
    description: 'URL to view job details',
    dataType: 'url',
    category: 'metadata'
  },
  { 
    name: 'CentriQ_JobCode', 
    required: false, 
    description: 'Internal job code or reference',
    dataType: 'string',
    category: 'metadata'
  },
  { 
    name: 'CentriQ_Client', 
    required: false, 
    description: 'Client identifier or name',
    dataType: 'string',
    category: 'metadata'
  },
  { 
    name: 'CentriQ_CampaignInfo', 
    required: false, 
    description: 'Campaign information or metadata',
    dataType: 'string',
    category: 'metadata'
  },
];

// Helper functions for working with system fields
export const getRequiredFields = (): CentriqSystemField[] => {
  return CENTRIQ_SYSTEM_FIELDS.filter(field => field.required);
};

export const getOptionalFields = (): CentriqSystemField[] => {
  return CENTRIQ_SYSTEM_FIELDS.filter(field => !field.required);
};

export const getFieldsByCategory = (category: CentriqSystemField['category']): CentriqSystemField[] => {
  return CENTRIQ_SYSTEM_FIELDS.filter(field => field.category === category);
};

export const getFieldByName = (name: string): CentriqSystemField | undefined => {
  return CENTRIQ_SYSTEM_FIELDS.find(field => field.name === name);
};