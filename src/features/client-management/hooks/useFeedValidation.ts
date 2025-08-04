import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  feedValidationApi,
  type XMLValidationRequest,
  type CampaignSetupRequest, 
} from '../services/feedValidationApi';

export interface FeedValidationResult {
  isValid: boolean;
  detectedFormat: number; // Changed from string to number to match API contract
  totalNodes: number;
  totalRecords: number;
  errorMessage: string | null; // Added null type
  validationErrors: string[];
  processingTime: string;
  feedUrl: string; // Added feedUrl field
  contentLength: number; // Added contentLength field
  contentType: string;
  estimatedCounts: boolean; // Added estimatedCounts field
  validationId?: string; // Made optional with ?
}

export interface FieldMapping {
  centralField: string;
  feedField: string;
  isRequired: boolean;
}

// Query keys
const queryKeys = {
  validation: (feedUrl: string, clientId?: string) => ['feed-validation', feedUrl, clientId],
  feedValidation: (feedUrl: string) => ['feed-validation-direct', feedUrl],
  nodes: (validationId: string) => ['feed-nodes', validationId],
  availableFields: (validationId: string) => ['feed-available-fields', validationId],
  campaign: (request: CampaignSetupRequest) => ['campaign-setup', request],
};

export const useFeedValidation = () => {
  const queryClient = useQueryClient();

  // Mutation for XML validation
  const validateXMLMutation = useMutation({
    mutationFn: (request: XMLValidationRequest) => feedValidationApi.validateXMLFeed(request),
    onSuccess: () => {
      // Cache invalidation handled elsewhere
    },
  });

  // Query for getting nodes (only enabled when validationId is provided)
  const useNodes = (validationId?: string) => {
    return useQuery({
      queryKey: queryKeys.nodes(validationId || ''),
      queryFn: () => feedValidationApi.getNodes(validationId!),
      enabled: !!validationId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Query for getting available feed fields (only enabled when validationId is provided)
  const useAvailableFeedFields = (validationId?: string) => {
    return useQuery({
      queryKey: queryKeys.availableFields(validationId || ''),
      queryFn: () => feedValidationApi.getAvailableFeedFields(validationId!),
      enabled: !!validationId,
      staleTime: 10 * 60 * 1000, // 10 minutes - fields don't change often
    });
  };

  // Mutation for campaign setup
  const setupCampaignMutation = useMutation({
    mutationFn: (request: CampaignSetupRequest) => feedValidationApi.setupCampaign(request),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  // API function for feed validation
  const validateFeedApi = async (feedUrl: string): Promise<FeedValidationResult> => {
    const response = await fetch('https://localhost:5001/api/FeedAnalysis/validate', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer eyJraWQiOiJidmFJRTJXd1FzRGVNdFA1M3g5VWdsNnBXOU9RZHVYSE9WRFVFN0J0UmRjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4YWVmNjY2My0wY2M3LTQ0ODAtOGJkNy1mMmIyYzhmNGQ0ODciLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImVtYWlsIiwiYXV0aF90aW1lIjoxNzU0MTIwOTY3LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Db0JxNzBDdW8iLCJleHAiOjE3NTQxMjQ1NjcsImlhdCI6MTc1NDEyMDk2NywidmVyc2lvbiI6MiwianRpIjoiYTExYWU2ODItY2Y0Yy00NzdmLTllNGUtNTBjNGJkNTMwYTM0IiwiY2xpZW50X2lkIjoiMmpkcTd1NWQza3Q4dTVxcm92c21ubGlsbHQiLCJ1c2VybmFtZSI6IjhhZWY2NjYzLTBjYzctNDQ4MC04YmQ3LWYyYjJjOGY0ZDQ4NyJ9.i1zubb9muEboYml4SZ2cmZvBtMz6fCaq7XHXHojmWeL7Ake3-F6swNZUr3bBAeTzlm1gbtj26Mk7mkvTQb2dnuhMLWLDLQEFPANnKJsk517a2U8FzPjNx1hcG-Gqgzeauu63SPQ-Rv0TQJBih_lXU_DGdsI7k2RWMiOoGesQjjhkpTfHym0P3hivnkmYvcDRn3Vo2f4zb19OS8j2g7aWpZCE6RJHy1Ukg7QcqpKe1JpLut-dUnmEkyDopLeeqv7DdDhJvBKCtUSPhK3UDBywNluG0-9Yi3BM4eT1I0EuHQBXrwVVEwhRvSLXIfNlWBjrLxdA6XnZ_liMjRWvi36RMA',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedUrl
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  // Mutation for feed validation (new)
  const feedValidationMutation = useMutation({
    mutationFn: validateFeedApi,
    onSuccess: (result) => {
      // Cache the result for potential reuse
      queryClient.setQueryData(queryKeys.feedValidation(result.feedUrl), result);
    },
  });

  // Combined function: Validate XML then fetch nodes and available fields if successful
  const validateAndFetchData = async (feedUrl: string, clientId?: string) => {
    const validationResult = await validateXMLMutation.mutateAsync({ feedUrl, clientId });
    
    if (validationResult && validationResult.isValid) {
      // Fetch both nodes and available fields in parallel
      const [nodesResult, fieldsResult] = await Promise.all([
        queryClient.fetchQuery({
          queryKey: queryKeys.nodes(validationResult.validationId),
          queryFn: () => feedValidationApi.getNodes(validationResult.validationId),
        }),
        queryClient.fetchQuery({
          queryKey: queryKeys.availableFields(validationResult.validationId),
          queryFn: () => feedValidationApi.getAvailableFeedFields(validationResult.validationId),
        })
      ]);
      
      return {
        validationResult,
        nodes: nodesResult.nodes,
        feedStructure: nodesResult.feedStructure,
        availableFields: fieldsResult.fields,
      };
    } else {
      return {
        validationResult,
        nodes: [],
        feedStructure: null,
        availableFields: [],
      };
    }
  };

  // Reset all cached data
  const resetState = () => {
    queryClient.removeQueries({ queryKey: ['feed-validation'] });
    queryClient.removeQueries({ queryKey: ['feed-nodes'] });
    queryClient.removeQueries({ queryKey: ['feed-available-fields'] });
    queryClient.removeQueries({ queryKey: ['campaign-setup'] });
  };

  return {
    // Feed validation mutation (new)
    feedValidationMutation,
    validateFeed: feedValidationMutation.mutate,
    validateFeedAsync: feedValidationMutation.mutateAsync,
    
    // Legacy mutations
    validateXMLFeed: validateXMLMutation.mutateAsync,
    setupCampaign: setupCampaignMutation.mutateAsync,
    
    // Combined function
    validateAndFetchData,
    
    // Query hooks
    useNodes,
    useAvailableFeedFields,
    
    // Loading states
    isValidating: validateXMLMutation.isPending,
    isFeedValidating: feedValidationMutation.isPending,
    isSettingUpCampaign: setupCampaignMutation.isPending,
    
    // Data
    validationResult: validateXMLMutation.data,
    feedValidationResult: feedValidationMutation.data,
    campaignResult: setupCampaignMutation.data,
    
    // Errors
    validationError: validateXMLMutation.error,
    feedValidationError: feedValidationMutation.error,
    campaignError: setupCampaignMutation.error,
    
    // Status
    validationStatus: validateXMLMutation.status,
    feedValidationStatus: feedValidationMutation.status,
    campaignStatus: setupCampaignMutation.status,
    
    // Utilities
    resetState,
    
    // Raw mutations for advanced usage
    validateXMLMutation,
    setupCampaignMutation,
  };
};