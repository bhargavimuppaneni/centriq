import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  feedValidationApi,
  type XMLValidationRequest,
  type CampaignSetupRequest, 
} from '../services/feedValidationApi';

export interface FeedValidationResult {
  isValid: boolean;
  detectedFormat: string;
  totalNodes: number;
  totalRecords: number;
  processingTime: string;
  contentType: string;
  errorMessage?: string;
  validationErrors: string[];
  validationId: string;
}

export interface FieldMapping {
  centralField: string;
  feedField: string;
  isRequired: boolean;
}

// Query keys
const queryKeys = {
  validation: (feedUrl: string, clientId?: string) => ['feed-validation', feedUrl, clientId],
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
    // Mutations
    validateXMLFeed: validateXMLMutation.mutateAsync,
    setupCampaign: setupCampaignMutation.mutateAsync,
    
    // Combined function
    validateAndFetchData,
    
    // Query hooks
    useNodes,
    useAvailableFeedFields,
    
    // Loading states
    isValidating: validateXMLMutation.isPending,
    isSettingUpCampaign: setupCampaignMutation.isPending,
    
    // Data
    validationResult: validateXMLMutation.data,
    campaignResult: setupCampaignMutation.data,
    
    // Errors
    validationError: validateXMLMutation.error,
    campaignError: setupCampaignMutation.error,
    
    // Status
    validationStatus: validateXMLMutation.status,
    campaignStatus: setupCampaignMutation.status,
    
    // Utilities
    resetState,
    
    // Raw mutations for advanced usage
    validateXMLMutation,
    setupCampaignMutation,
  };
};