
import { RobbingStatus, UserRole } from '../types';

interface StatusTransition {
  nextStatus: RobbingStatus;
  authorizedRoles: UserRole[];
  label: string;
  description?: string;
}

interface StatusConfig {
  status: RobbingStatus;
  transitions: StatusTransition[];
  description: string;
  color: string;
}

const statusConfigurations: Record<RobbingStatus, StatusConfig> = {
  'Initiated': {
    status: 'Initiated',
    description: 'Request has been created',
    color: 'bg-gray-200 text-gray-800',
    transitions: [
      {
        nextStatus: 'Pending SDS',
        authorizedRoles: ['System', 'Admin', 'CAMO Planning'],
        label: 'Move to Pending SDS',
        description: 'Donor aircraft has valid C of A'
      },
      {
        nextStatus: 'Awaiting FTAM Approval',
        authorizedRoles: ['System', 'Admin', 'CAMO Planning'],
        label: 'Request FTAM Approval',
        description: 'Donor aircraft does not have valid C of A'
      }
    ]
  },
  'Awaiting FTAM Approval': {
    status: 'Awaiting FTAM Approval',
    description: 'Waiting for FTAM to approve request',
    color: 'bg-amber-100 text-amber-800',
    transitions: [
      {
        nextStatus: 'Pending AR',
        authorizedRoles: ['FTAM', 'Admin'],
        label: 'Approve Request',
        description: 'Approve request and require Acceptance Report'
      },
      {
        nextStatus: 'Rejected',
        authorizedRoles: ['FTAM', 'Admin'],
        label: 'Reject Request',
        description: 'Reject the request'
      }
    ]
  },
  'Pending AR': {
    status: 'Pending AR',
    description: 'Waiting for Acceptance Report',
    color: 'bg-red-100 text-red-800',
    transitions: [
      {
        nextStatus: 'Pending SDS',
        authorizedRoles: ['CAMO Technical Services', 'Admin'],
        label: 'Submit AR',
        description: 'Submit Acceptance Report to proceed'
      }
    ]
  },
  'Pending SDS': {
    status: 'Pending SDS',
    description: 'Waiting for Spares Declaration Statement',
    color: 'bg-blue-100 text-blue-800',
    transitions: [
      {
        nextStatus: 'Pending Removal from Donor',
        authorizedRoles: ['CAMO Planning', 'Admin'],
        label: 'Submit SDS',
        description: 'Submit Spares Declaration Statement'
      }
    ]
  },
  'Pending Removal from Donor': {
    status: 'Pending Removal from Donor',
    description: 'Component ready for removal from donor aircraft',
    color: 'bg-emerald-100 text-emerald-800',
    transitions: [
      {
        nextStatus: 'Removed from Donor',
        authorizedRoles: ['AMO 145', 'Admin'],
        label: 'Confirm Removal',
        description: 'Confirm component has been removed from donor aircraft'
      }
    ]
  },
  'Removed from Donor': {
    status: 'Removed from Donor',
    description: 'Component has been removed from donor aircraft',
    color: 'bg-indigo-100 text-indigo-800',
    transitions: [
      {
        nextStatus: 'Normalization Planned',
        authorizedRoles: ['CAMO Planning', 'Admin'],
        label: 'Plan Normalization',
        description: 'Plan the normalization of the donor aircraft'
      }
    ]
  },
  'Normalization Planned': {
    status: 'Normalization Planned',
    description: 'Normalization of donor aircraft has been planned',
    color: 'bg-violet-100 text-violet-800',
    transitions: [
      {
        nextStatus: 'Normalized',
        authorizedRoles: ['CAMO Planning', 'Admin'],
        label: 'Confirm Normalization',
        description: 'Confirm donor aircraft has been normalized'
      }
    ]
  },
  'Normalized': {
    status: 'Normalized',
    description: 'Donor aircraft has been normalized',
    color: 'bg-green-100 text-green-800',
    transitions: []
  },
  'Rejected': {
    status: 'Rejected',
    description: 'Request has been rejected',
    color: 'bg-red-100 text-red-800',
    transitions: []
  }
};

export const getStatusTransitions = (status: RobbingStatus): StatusConfig => {
  return statusConfigurations[status];
};

export const getStatusColor = (status: RobbingStatus): string => {
  return statusConfigurations[status]?.color || 'bg-gray-200 text-gray-800';
};

export const getStatusDescription = (status: RobbingStatus): string => {
  return statusConfigurations[status]?.description || 'Unknown status';
};

export const getAllStatuses = (): RobbingStatus[] => {
  return Object.keys(statusConfigurations) as RobbingStatus[];
};
