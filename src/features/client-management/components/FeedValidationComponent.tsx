import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFeedValidation } from '@/features/client-management/hooks/useFeedValidation';

interface FieldMapping {
  centralField: string;
  feedField: string;
  isRequired: boolean;
}

interface FeedValidationResult {
  isValid: boolean;
  detectedFormat: number;
  totalNodes: number;
  totalRecords: number;
  errorMessage: string | null;
  validationErrors: string[];
  processingTime: string;
  feedUrl: string;
  contentLength: number;
  contentType: string;
  estimatedCounts: boolean;
  validationId?: string;
}

// Static list of CentriQ System Fields based on AryaField values
const CENTRIQ_SYSTEM_FIELDS = [
  { name: 'CentriQ_ViewUrl', required: false },
  { name: 'CentriQ_Description', required: true },
  { name: 'CentriQ_ZipCode', required: false },
  { name: 'CentriQ_Title', required: true },
  { name: 'CentriQ_MaxExperience', required: false },
  { name: 'CentriQ_City', required: true },
  { name: 'CentriQ_ApplyUrl', required: true },
  { name: 'CentriQ_CampaignInfo', required: false },
  { name: 'CentriQ_CostPerApplicant', required: false },
  { name: 'CentriQ_JobCode', required: false },
  { name: 'CentriQ_State', required: false },
  { name: 'CentriQ_Client', required: false },
  { name: 'CentriQ_CountryCode', required: false },
  { name: 'CentriQ_MinExperience', required: false },
  { name: 'CentriQ_CostPerClick', required: false },
];

// Form validation schema using Zod
const formSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Please enter a valid email address'),
  feedUrl: z.string().url('Please enter a valid URL'),
});

type FormData = z.infer<typeof formSchema>;

export const FeedValidationComponent = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationResult, setValidationResult] = useState<FeedValidationResult | null>(null);
  const [validationId, setValidationId] = useState<string>('');
  
  // Get the hook functions - only get what we actually use
  const { 
    useAvailableFeedFields,
  } = useFeedValidation();

  // Get available feed fields from API (only enabled when validationId exists)
  const { 
    data: availableFeedFieldsData, 
  } = useAvailableFeedFields(validationId);

  // Mock available feed fields - keep as fallback/default
  const mockAvailableFeedFields = [
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
    'contact_email'
  ];

  // Use API fields if available, otherwise use mock fields
  const availableFeedFields = availableFeedFieldsData?.fields || mockAvailableFeedFields;

  // Initialize react-hook-form with Zod validation
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      feedUrl: '',
    },
  });

  // Initialize field mappings based on static CentriQ system fields
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>(
    CENTRIQ_SYSTEM_FIELDS
      .sort((a, b) => {
        // Sort by required fields first, then alphabetically
        if (a.required && !b.required) return -1;
        if (!a.required && b.required) return 1;
        return a.name.localeCompare(b.name);
      })
      .map(field => ({
        centralField: field.name,
        feedField: 'Select Node',
        isRequired: field.required
      }))
  );

  const onSubmit = async (data: FormData) => {
    setIsAnalyzing(true);
    setValidationResult(null);

    try {
      // Mock API response for development
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockValidationId = Math.random().toString(36).substr(2, 9);
      const mockResult: FeedValidationResult = {
        isValid: true,
        detectedFormat: 1,
        totalNodes: 25955,
        totalRecords: 552,
        errorMessage: null,
        validationErrors: [],
        processingTime: "00:00:05.0488489",
        feedUrl: data.feedUrl,
        contentLength: 0,
        contentType: "application/xml",
        estimatedCounts: false,
        validationId: mockValidationId,
      };

      setValidationResult(mockResult);
      setValidationId(mockValidationId);

    } catch (err) {
      console.error('Feed validation failed:', err);
      
      // Handle different types of errors
      if (err instanceof TypeError && err.message.includes('fetch')) {
        form.setError('feedUrl', { message: 'Network error. Please check if the API server is running.' });
      } else if (err instanceof Error) {
        form.setError('feedUrl', { message: `API Error: ${err.message}` });
      } else {
        form.setError('feedUrl', { message: 'Failed to validate feed. Please try again.' });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateFieldMapping = (index: number, value: string) => {
    const updatedMappings = [...fieldMappings];
    updatedMappings[index].feedField = value;
    setFieldMappings(updatedMappings);
  };

  const getFormatName = (format: number): string => {
    switch (format) {
      case 1: return 'XML';
      case 2: return 'JSON';
      case 3: return 'CSV';
      default: return 'Unknown';
    }
  };

  const generateMappingJSON = () => {
    // Filter out unmapped fields (those still set to "Select Node")
    const mappedFields = fieldMappings.filter(mapping => mapping.feedField !== 'Select Node');
    
    // Create the JSON structure
    const mappingJSON = {
      clientInfo: {
        clientName: form.getValues('clientName'),
        clientEmail: form.getValues('clientEmail'),
        feedUrl: form.getValues('feedUrl')
      },
      validationInfo: validationResult ? {
        isValid: validationResult.isValid,
        detectedFormat: getFormatName(validationResult.detectedFormat),
        totalRecords: validationResult.totalRecords,
        totalNodes: validationResult.totalNodes,
        processingTime: validationResult.processingTime
      } : null,
      fieldMappings: mappedFields.map(mapping => ({
        centriqField: mapping.centralField,
        feedNode: mapping.feedField,
        isRequired: mapping.isRequired
      })),
      unmappedFields: fieldMappings.filter(mapping => mapping.feedField === 'Select Node').map(mapping => ({
        centriqField: mapping.centralField,
        isRequired: mapping.isRequired
      })),
      mappingCount: {
        total: fieldMappings.length,
        mapped: mappedFields.length,
        unmapped: fieldMappings.length - mappedFields.length,
        requiredMapped: mappedFields.filter(m => m.isRequired).length,
        requiredTotal: fieldMappings.filter(m => m.isRequired).length
      },
      timestamp: new Date().toISOString()
    };

    return mappingJSON;
  };

  const handleExportMapping = () => {
    const mappingData = generateMappingJSON();
    
    // Convert to JSON string with proper formatting
    const jsonString = JSON.stringify(mappingData, null, 2);
    
    // Create a blob and download the file
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `field-mapping-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Also log to console for debugging
    console.log('Field Mapping JSON:', mappingData);
  };

  const handleViewMapping = () => {
    const mappingData = generateMappingJSON();
    console.log('Current Field Mapping:', mappingData);
    
    // You could also show this in a modal or alert
    alert(`Field Mapping JSON:\n\n${JSON.stringify(mappingData, null, 2)}`);
  };

  // Calculate mapping status
  const requiredMappings = fieldMappings.filter(mapping => mapping.isRequired);
  const nonmappedRequiredFields = requiredMappings.filter(mapping => mapping.feedField === 'Select Node');
  const allRequiredFieldsMapped = nonmappedRequiredFields.length === 0;
  
  const optionalMappings = fieldMappings.filter(mapping => !mapping.isRequired);
  const mappedOptionalFields = optionalMappings.filter(mapping => mapping.feedField !== 'Select Node');
  const hasUnmappedOptionalFields = mappedOptionalFields.length < optionalMappings.length;

  return (
    <div className="flex flex-col h-full">
      {/* Main Content Area */}
      <div className="flex-1">
        <div className="space-y-6 ">
          <div className="text-left">
            <h2 className="text-[20px] font-semibold text-gray-900 mb-2 text-left">Add a New Client</h2>
            <p className="text-[16px] text-gray-600 text-left">
              Match your job feed&apos;s fields to CentriQ&apos;s system fields. Required fields are marked with an asterisk (*). AI can suggest mappings to save you time.
            </p>
          </div>

          {/* Job Feed Source Section with shadcn/ui Form */}
          <div className="border border-gray-200 rounded-lg p-6 pb-12 pt-6 bg-white shadow-sm">
            <h3 className="text-[18px] font-semibold text-gray-900 text-left mb-4">Job Feed Source</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Client Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Name Field */}
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left text-[14px] text-[#333333] font-semibold">Client Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., TechInnovate Solutions" className="h-12 text-[16px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Email Field */}
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left text-[14px] text-[#333333] font-semibold">Contact Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@client.com" className="h-12 text-[16px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Feed URL Field */}
                <div className="mt-6 border border-gray-300 rounded-md p-4">
                  <FormField
                    control={form.control}
                    name="feedUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left text-[14px] text-[#333333]">Job Feed URL</FormLabel>
                        <FormControl>
                          <div className="flex gap-3">
                            <Input 
                              type="url" 
                              placeholder="https://globaltech.com/jobs/feed.xml" 
                              className="flex-1"
                              disabled={isAnalyzing}
                              {...field} 
                            />
                            <Button
                              type="submit"
                              disabled={isAnalyzing}
                              className="w-[156px] py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-[6px]"
                            >
                              {isAnalyzing ? 'Analyzing...' : 'Validate'}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <p className="text-[14px] text-gray-600 mt-4 text-left">
                    Enter the complete URL to your job feed (XML, JSON format)
                  </p>
                </div>
              </form>
            </Form>

            {isAnalyzing && (
              <div className="flex items-center gap-2 text-sm text-blue-600 mt-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Analyzing feed structure and detecting fields...
              </div>
            )}
          </div>

          {/* Validation Results - Only show after validation */}
          {validationResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Validation Results</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  {validationResult.isValid ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="font-medium">Feed validation successful</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="font-medium">Feed validation failed</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Format:</span>
                    <span className="ml-2 font-medium">{getFormatName(validationResult.detectedFormat)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Records:</span>
                    <span className="ml-2 font-medium">{validationResult.totalRecords.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Nodes:</span>
                    <span className="ml-2 font-medium">{validationResult.totalNodes.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Content Type:</span>
                    <span className="ml-2 font-medium">{validationResult.contentType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Processing Time:</span>
                    <span className="ml-2 font-medium">{validationResult.processingTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Estimated:</span>
                    <span className="ml-2 font-medium">{validationResult.estimatedCounts ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                {validationResult.errorMessage && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">{validationResult.errorMessage}</p>
                  </div>
                )}

                {validationResult.validationErrors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Validation Errors:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {validationResult.validationErrors.map((error, index) => (
                        <li key={index} className="text-sm text-red-600">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Feed Mapping Section - Always show */}
          <div className="border border-gray-200 rounded-lg bg-white">
            <h3 className="text-[20px] font-semibold text-gray-900 text-left pt-6 pl-6 mb-0 pb-0">Feed Mapping</h3>
            <div className="p-6">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="col-span-5">
                  <h4 className="text-sm font-semibold text-gray-700 text-left">CentriQ System Fields</h4>
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-5">
                  <h4 className="text-sm font-semibold text-gray-700 text-left">Your Feed Nodes</h4>
                </div>
              </div>

              {/* Mapping Rows */}
              <div className="space-y-4">
                {fieldMappings.map((mapping, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center py-0.1">
                    {/* CentriQ Field */}
                    <div className="col-span-5">
                      <div className="flex items-center bg-gray-100 px-3 py-4 rounded-md">
                        <span className="text-sm font-medium text-gray-700">
                          {mapping.centralField}
                          {mapping.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="col-span-2 flex justify-center">
                      <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className={mapping.feedField !== 'Select Node' ? 'text-blue-500' : 'text-gray-400'}
                      >
                        <path 
                          d="M5 12H19M19 12L12 5M19 12L12 19" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* Feed Field Dropdown */}
                    <div className="col-span-5">
                      <select
                        value={mapping.feedField}
                        onChange={(e) => {
                          updateFieldMapping(index, e.target.value);
                        }}
                        className="w-full px-4 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      >
                        <option value="Select Node">Select Node</option>
                        {availableFeedFields.filter((field: string) => field !== 'Select Field').map((field: string) => (
                          <option key={field} value={field}>
                            {field}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Fields Section */}
              <div className="mt-8 space-y-4">
                {/* Status Messages */}
                <div className="space-y-3">
                  {/* Success Message - Only show when all required fields are actually mapped */}
                  {allRequiredFieldsMapped && (
                    <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-green-800">All required fields are mapped successfully.</span>
                      </div>
                    </div>
                  )}

                  {/* Warning Message - Only show when there are unmapped optional fields */}
                  {hasUnmappedOptionalFields && (
                    <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <svg className="h-5 w-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-yellow-800">Optional fields unmapped. Consider mapping for richer job data.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Breaking out of modal padding with negative margins */}
      <div className="-mx-8 -mb-4 mt-6 bg-gray-100 border-t border-gray-200 px-10 pt-6 pb-8 rounded-b-lg">
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            className="px-6 py-2 border-blue-600 text-blue-600 bg-white"
          >
            Save Client
          </Button>
          <Button 
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save client and Set up Campaign →
          </Button>
        </div>
      </div>
    </div>
  );
};