
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { RobbingRequest, RobbingStatus, UserRole } from '../types';
import { mockRequests } from '../data/mockData';
import { getStatusTransitions } from '../utils/statusTransitions';
import { useAuth } from './AuthContext';

interface RobbingContextType {
  requests: RobbingRequest[];
  filteredRequests: RobbingRequest[];
  selectedRequest: RobbingRequest | null;
  statusCounts: Record<RobbingStatus, number>;
  loading: boolean;
  filterStatuses: RobbingStatus[];
  sortField: keyof RobbingRequest | null;
  sortDirection: 'asc' | 'desc';
  
  // Actions
  selectRequest: (request: RobbingRequest | null) => void;
  updateRequest: (updatedRequest: RobbingRequest) => void;
  createRequest: (newRequest: Omit<RobbingRequest, 'requestId' | 'createdDate' | 'statusHistory'>) => void;
  changeRequestStatus: (requestId: string, newStatus: RobbingStatus, comments?: string) => void;
  toggleFilterStatus: (status: RobbingStatus) => void;
  clearFilterStatuses: () => void;
  setSortField: (field: keyof RobbingRequest | null) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  canChangeStatus: (request: RobbingRequest, newStatus: RobbingStatus) => boolean;
  getAvailableStatusTransitions: (request: RobbingRequest) => RobbingStatus[];
}

const RobbingContext = createContext<RobbingContextType | undefined>(undefined);

export function RobbingProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<RobbingRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RobbingRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RobbingRequest | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<RobbingStatus, number>>({
    'Initiated': 0,
    'Pending SDS': 0,
    'Awaiting FTAM Approval': 0,
    'Pending AR': 0,
    'Pending Removal from Donor': 0,
    'Removed from Donor': 0,
    'Normalization Planned': 0,
    'Normalized': 0,
    'Rejected': 0
  });
  const [loading, setLoading] = useState(true);
  const [filterStatuses, setFilterStatuses] = useState<RobbingStatus[]>([]);
  const [sortField, setSortField] = useState<keyof RobbingRequest | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Load mock data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  // Update filtered requests when filters or sorts change
  useEffect(() => {
    let filtered = [...requests];
    
    // Apply status filters
    if (filterStatuses.length > 0) {
      filtered = filtered.filter(request => filterStatuses.includes(request.status));
    }
    
    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortDirection === 'asc' 
            ? aValue.getTime() - bValue.getTime() 
            : bValue.getTime() - aValue.getTime();
        }
        
        return 0;
      });
    }
    
    setFilteredRequests(filtered);
  }, [requests, filterStatuses, sortField, sortDirection]);

  // Update status counts
  useEffect(() => {
    const counts = {
      'Initiated': 0,
      'Pending SDS': 0,
      'Awaiting FTAM Approval': 0,
      'Pending AR': 0,
      'Pending Removal from Donor': 0,
      'Removed from Donor': 0,
      'Normalization Planned': 0,
      'Normalized': 0,
      'Rejected': 0
    };
    
    requests.forEach(request => {
      counts[request.status]++;
    });
    
    setStatusCounts(counts);
  }, [requests]);

  const selectRequest = (request: RobbingRequest | null) => {
    setSelectedRequest(request);
  };

  const updateRequest = (updatedRequest: RobbingRequest) => {
    setRequests(prev => prev.map(r => 
      r.requestId === updatedRequest.requestId ? updatedRequest : r
    ));
    
    if (selectedRequest?.requestId === updatedRequest.requestId) {
      setSelectedRequest(updatedRequest);
    }
    
    toast.success(`Request ${updatedRequest.requestId} updated successfully`);
  };

  const createRequest = (
    newRequest: Omit<RobbingRequest, 'requestId' | 'createdDate' | 'statusHistory'>
  ) => {
    if (!currentUser) return;
    
    const requestId = `CR-${new Date().getFullYear()}-${(requests.length + 1).toString().padStart(4, '0')}`;
    const createdDate = new Date().toISOString();
    
    const statusEntry = {
      status: 'Initiated' as RobbingStatus,
      timestamp: createdDate,
      user: currentUser.name,
      role: currentUser.role,
      comments: 'Request created'
    };
    
    const fullRequest: RobbingRequest = {
      ...newRequest,
      requestId,
      createdDate,
      statusHistory: [statusEntry],
      status: 'Initiated',
    };
    
    // Skip intermediate statuses based on C of A
    if (fullRequest.donorHasValidCofA) {
      fullRequest.status = 'Pending SDS';
      fullRequest.statusHistory.push({
        status: 'Pending SDS',
        timestamp: new Date().toISOString(),
        user: 'System',
        role: 'System',
        comments: 'Automatic transition: Donor aircraft has valid C of A'
      });
    } else {
      fullRequest.status = 'Awaiting FTAM Approval';
      fullRequest.statusHistory.push({
        status: 'Awaiting FTAM Approval',
        timestamp: new Date().toISOString(),
        user: 'System',
        role: 'System',
        comments: 'Automatic transition: Donor aircraft does not have valid C of A'
      });
    }
    
    setRequests(prev => [...prev, fullRequest]);
    toast.success(`Request ${requestId} created successfully`);
  };

  const changeRequestStatus = (
    requestId: string, 
    newStatus: RobbingStatus, 
    comments?: string
  ) => {
    if (!currentUser) return;
    
    setRequests(prev => prev.map(request => {
      if (request.requestId === requestId) {
        const statusEntry = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          user: currentUser.name,
          role: currentUser.role,
          comments
        };
        
        return {
          ...request,
          status: newStatus,
          statusHistory: [...request.statusHistory, statusEntry]
        };
      }
      return request;
    }));
    
    toast.success(`Request status updated to ${newStatus}`);
    
    // If we updated the selected request, refresh it
    if (selectedRequest?.requestId === requestId) {
      setSelectedRequest(prev => prev ? {
        ...prev,
        status: newStatus,
        statusHistory: [...prev.statusHistory, {
          status: newStatus,
          timestamp: new Date().toISOString(),
          user: currentUser.name,
          role: currentUser.role,
          comments
        }]
      } : null);
    }
  };

  const toggleFilterStatus = (status: RobbingStatus) => {
    setFilterStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };
  
  const clearFilterStatuses = () => {
    setFilterStatuses([]);
  };

  const canChangeStatus = (request: RobbingRequest, newStatus: RobbingStatus): boolean => {
    if (!currentUser) return false;
    
    // Get valid transitions from status transitions utility
    const { transitions } = getStatusTransitions(request.status);
    const validTransition = transitions.find(t => t.nextStatus === newStatus);
    
    if (!validTransition) return false;
    
    return validTransition.authorizedRoles.includes(currentUser.role);
  };

  const getAvailableStatusTransitions = (request: RobbingRequest): RobbingStatus[] => {
    if (!currentUser) return [];
    
    const { transitions } = getStatusTransitions(request.status);
    
    // Filter transitions by user role
    return transitions
      .filter(t => t.authorizedRoles.includes(currentUser.role))
      .map(t => t.nextStatus);
  };

  return (
    <RobbingContext.Provider
      value={{
        requests,
        filteredRequests,
        selectedRequest,
        statusCounts,
        loading,
        filterStatuses,
        sortField,
        sortDirection,
        selectRequest,
        updateRequest,
        createRequest,
        changeRequestStatus,
        toggleFilterStatus,
        clearFilterStatuses,
        setSortField,
        setSortDirection,
        canChangeStatus,
        getAvailableStatusTransitions
      }}
    >
      {children}
    </RobbingContext.Provider>
  );
}

export function useRobbing() {
  const context = useContext(RobbingContext);
  if (context === undefined) {
    throw new Error('useRobbing must be used within a RobbingProvider');
  }
  return context;
}
