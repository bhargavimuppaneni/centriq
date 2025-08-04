import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFeedValidation } from '@/features/client-management/hooks/useFeedValidation';

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

// Separate schema for feed validation (only feedUrl required)
const feedValidationSchema = z.object({
  feedUrl: z.string().url('Please enter a valid URL'),
});

// Complete form schema including field mappings with simpler validation
const formSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Please enter a valid email address'),
  feedUrl: z.string().url('Please enter a valid URL'),
  // Simplified field mappings validation
  fieldMappings: z.array(z.object({
    centralField: z.string(),
    feedField: z.string(),
    isRequired: z.boolean(),
  }))
}).superRefine((data, ctx) => {
  // Custom validation for required field mappings
  data.fieldMappings.forEach((mapping, index) => {
    if (mapping.isRequired && !mapping.feedField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "This field mapping is required",
        path: ['fieldMappings', index, 'feedField'],
      });
    }
  });
});

type FormData = z.infer<typeof formSchema>;

// Form data type including all possible fields
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

export const FeedValidationComponent = () => {
  const [validationResult, setValidationResult] = useState<FeedValidationResult | null>(null);
  const [validationId, setValidationId] = useState<string>('');
  const [shouldValidateAll, setShouldValidateAll] = useState(false);
  
  // Use the feed validation hook
  const { 
    feedValidationMutation,
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

  // Initialize react-hook-form with complete schema including field mappings
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange', // Change to onChange for immediate validation
    defaultValues: {
      clientName: '',
      clientEmail: '',
      feedUrl: '',
      fieldMappings: CENTRIQ_SYSTEM_FIELDS
        .sort((a, b) => {
          // Sort by required fields first, then alphabetically
          if (a.required && !b.required) return -1;
          if (!a.required && b.required) return 1;
          return a.name.localeCompare(b.name);
        })
        .map(field => ({
          centralField: field.name,
          feedField: '',
          isRequired: field.required
        }))
    },
  });

  // Handle feed validation (only validates feedUrl)
  const handleFeedValidation = () => {
    const feedUrl = form.getValues('feedUrl');
    
    // Validate only the feedUrl using the separate schema
    const validationResult = feedValidationSchema.safeParse({ feedUrl });
    
    if (!validationResult.success) {
      // Set error on the feedUrl field
      form.setError('feedUrl', { 
        message: validationResult.error.issues[0]?.message || 'Please enter a valid URL' 
      });
      return;
    }

    // Clear any previous feed URL errors
    form.clearErrors('feedUrl');
    
    // Reset previous validation result
    setValidationResult(null);
    
    // Use the mutation from the hook
    feedValidationMutation.mutate(feedUrl, {
      onSuccess: (result) => {
        // Generate a validation ID if not provided in response
        const newValidationId = result.validationId || Math.random().toString(36).substr(2, 9);
        
        setValidationResult({
          ...result,
          validationId: newValidationId
        });
        setValidationId(newValidationId);
      },
      onError: (error: Error) => {
        console.error('Feed validation failed:', error);
        
        // Handle different types of errors
        if (error.message.includes('fetch')) {
          form.setError('feedUrl', { message: 'Network error. Please check if the API server is running.' });
        } else {
          form.setError('feedUrl', { message: `API Error: ${error.message}` });
        }
      },
    });
  };

  // Handle complete form submission for saving client (validates all fields)
  const handleSaveClient = async () => {
    // Trigger validation for the entire form including field mappings
    const isFormValid = await form.trigger();
    
    if (!isFormValid) {
      // Use multiple animation frames to ensure all DOM updates are complete
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            // Get fresh form values and manually check for errors
            const formValues = form.getValues();
            const { errors } = form.formState;
            console.log('Form errors:', errors); // Debug log
            console.log('Form values:', formValues); // Debug log
            
            let firstErrorElement: HTMLElement | null = null;
            
            // Check basic fields first - use manual validation
            if (!formValues.clientName) {
              firstErrorElement = document.querySelector(`[name="clientName"]`) as HTMLElement;
              console.log('Found empty clientName field'); // Debug log
            } else if (!formValues.clientEmail) {
              firstErrorElement = document.querySelector(`[name="clientEmail"]`) as HTMLElement;
              console.log('Found empty clientEmail field'); // Debug log
            } else if (!formValues.feedUrl) {
              firstErrorElement = document.querySelector(`[name="feedUrl"]`) as HTMLElement;
              console.log('Found empty feedUrl field'); // Debug log
            } else {
              // Check for field mapping errors if basic fields are filled
              console.log('Checking field mapping errors...'); // Debug log
              const fieldMappings = formValues.fieldMappings;
              
              for (let i = 0; i < fieldMappings.length; i++) {
                const mapping = fieldMappings[i];
                if (mapping.isRequired && !mapping.feedField) {
                  firstErrorElement = document.querySelector(`[data-mapping-index="${i}"]`) as HTMLElement;
                  console.log('Found unmapped required field at index:', i); // Debug log
                  break;
                }
              }
            }
            
            if (firstErrorElement) {
              console.log('Scrolling to error element:', firstErrorElement); // Debug log
              firstErrorElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
              // Small delay before focus to ensure scroll completes
              setTimeout(() => {
                firstErrorElement?.focus();
              }, 300);
            } else {
              console.log('No error element found to scroll to'); // Debug log
            }
          }, 50);
        });
      });
      return;
    }

    // Process the valid form data
    const formData = form.getValues();
    console.log('Saving client:', formData);
    // Add your save client logic here
  };

  // Handle campaign setup (validates all fields)
  const handleSetupCampaign = async () => {
    // Trigger validation for the entire form including field mappings
    const isFormValid = await form.trigger();
    
    if (!isFormValid) {
      // Use multiple animation frames to ensure all DOM updates are complete
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            // Get fresh form values and manually check for errors
            const formValues = form.getValues();
            const { errors } = form.formState;
            console.log('Form errors:', errors); // Debug log
            console.log('Form values:', formValues); // Debug log
            
            let firstErrorElement: HTMLElement | null = null;
            
            // Check basic fields first - use manual validation
            if (!formValues.clientName) {
              firstErrorElement = document.querySelector(`[name="clientName"]`) as HTMLElement;
              console.log('Found empty clientName field'); // Debug log
            } else if (!formValues.clientEmail) {
              firstErrorElement = document.querySelector(`[name="clientEmail"]`) as HTMLElement;
              console.log('Found empty clientEmail field'); // Debug log
            } else if (!formValues.feedUrl) {
              firstErrorElement = document.querySelector(`[name="feedUrl"]`) as HTMLElement;
              console.log('Found empty feedUrl field'); // Debug log
            } else {
              // Check for field mapping errors if basic fields are filled
              console.log('Checking field mapping errors...'); // Debug log
              const fieldMappings = formValues.fieldMappings;
              
              for (let i = 0; i < fieldMappings.length; i++) {
                const mapping = fieldMappings[i];
                if (mapping.isRequired && !mapping.feedField) {
                  firstErrorElement = document.querySelector(`[data-mapping-index="${i}"]`) as HTMLElement;
                  console.log('Found unmapped required field at index:', i); // Debug log
                  break;
                }
              }
            }
            
            if (firstErrorElement) {
              console.log('Scrolling to error element:', firstErrorElement); // Debug log
              firstErrorElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
              // Small delay before focus to ensure scroll completes
              setTimeout(() => {
                firstErrorElement?.focus();
              }, 300);
            } else {
              console.log('No error element found to scroll to'); // Debug log
            }
          }, 50);
        });
      });
      return;
    }

    // Process the valid form data
    const formData = form.getValues();
    console.log('Setting up campaign for client:', formData);
    // Add your campaign setup logic here
  };

  const updateFieldMapping = (index: number, value: string) => {
    const updatedMappings = [...form.getValues().fieldMappings];
    updatedMappings[index].feedField = value;
    form.setValue('fieldMappings', updatedMappings);
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
    // Filter out unmapped fields (those with empty feedField)
    const mappedFields = form.getValues().fieldMappings.filter(mapping => mapping.feedField !== '');
    
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
      unmappedFields: form.getValues().fieldMappings.filter(mapping => mapping.feedField === '').map(mapping => ({
        centriqField: mapping.centralField,
        isRequired: mapping.isRequired
      })),
      mappingCount: {
        total: form.getValues().fieldMappings.length,
        mapped: mappedFields.length,
        unmapped: form.getValues().fieldMappings.length - mappedFields.length,
        requiredMapped: mappedFields.filter(m => m.isRequired).length,
        requiredTotal: form.getValues().fieldMappings.filter(m => m.isRequired).length
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
  const requiredMappings = form.getValues().fieldMappings.filter(mapping => mapping.isRequired);
  const nonmappedRequiredFields = requiredMappings.filter(mapping => mapping.feedField === '');
  const allRequiredFieldsMapped = nonmappedRequiredFields.length === 0;
  
  const optionalMappings = form.getValues().fieldMappings.filter(mapping => !mapping.isRequired);
  const mappedOptionalFields = optionalMappings.filter(mapping => mapping.feedField !== '');
  const hasUnmappedOptionalFields = mappedOptionalFields.length < optionalMappings.length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="space-y-6">
          <div className="text-left">
            <h2 className="text-[20px] font-semibold text-gray-900 mb-2 text-left">Add a New Client</h2>
            <p className="text-[16px] text-gray-600 text-left">
              Match your job feed&apos;s fields to CentriQ&apos;s system fields. Required fields are marked with an asterisk (*). AI can suggest mappings to save you time.
            </p>
          </div>
          
          {/* Single form wrapping only the basic form fields */}
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Job Feed Source Section */}
              <div className="border border-gray-200 rounded-lg p-6 pb-12 pt-6 bg-white shadow-sm">
                <h3 className="text-[18px] font-semibold text-gray-900 text-left mb-4">Job Feed Source</h3>            
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-left text-[14px] text-[#333333] font-semibold">
                            Client Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., TechInnovate Solutions" className="h-12 text-[16px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-left text-[14px] text-[#333333] font-semibold">
                            Contact Email <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@client.com" className="h-12 text-[16px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                                disabled={feedValidationMutation.isPending}
                                {...field} 
                              />
                              <Button
                                type="button"
                                onClick={handleFeedValidation}
                                disabled={feedValidationMutation.isPending}
                                className="w-[156px] py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-[6px] flex items-center gap-2"
                              >
                                {feedValidationMutation.isPending && (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                )}
                                {feedValidationMutation.isPending ? 'Analyzing...' : 'Validate'}
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
                </div>
              </div>

              {/* Feed Mapping Section - Now using FormField components */}
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

                  {/* Mapping Rows - Now using FormField components */}
                  <div className="space-y-4">
                    {form.watch('fieldMappings').map((mapping, index) => (
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
                            className={mapping.feedField !== '' ? 'text-blue-500' : 'text-gray-400'}
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

                        {/* Feed Field Dropdown - Now using FormField */}
                        <div className="col-span-5">
                          <FormField
                            control={form.control}
                            name={`fieldMappings.${index}.feedField`}
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative">
                                    <select
                                      {...field}
                                      data-mapping-index={index}
                                      className={`w-full px-4 py-4 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white text-sm appearance-none ${
                                        fieldState.error
                                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                      }`}
                                    >
                                      {field.value === '' && (
                                        <option value="" disabled hidden>Select Node</option>
                                      )}
                                      {availableFeedFields.filter((fieldOption: string) => fieldOption !== 'Select Field').map((fieldOption: string) => (
                                        <option key={fieldOption} value={fieldOption}>
                                          {fieldOption}
                                        </option>
                                      ))}
                                    </select>
                                    {/* Custom dropdown arrow */}
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                      <ChevronDown className="w-4 h-4 text-gray-500" />
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status Messages */}
                  <div className="mt-8 space-y-3">
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
                          <span className="text-sm font-medium text-yellow-600">Optional fields unmapped. Consider mapping for richer job data.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Action Buttons - Now part of the form */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
                    <Button 
                      type="submit"
                      variant="outline" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleSaveClient();
                      }}
                      className="px-6 py-2 border-blue-600 text-blue-600 bg-white"
                    >
                      Save Client
                    </Button>
                    <Button 
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSetupCampaign();
                      }}
                      className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Save client and Set up Campaign →
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};