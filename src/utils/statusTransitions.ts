
import { RobbingStatus, UserRole } from '../types';

interface StatusTransition {
  nextStatus: RobbingStatus;
  label: string;
  description?: string;
  authorizedRoles: UserRole[];
}

interface StatusTransitionMap {
  transitions: StatusTransition[];
  description: string;
}

const statusTransitionMap: Record<RobbingStatus, StatusTransitionMap> = {
  'Initiated': {
    transitions: [
      {
        nextStatus: 'Pending SDS',
        label: 'Move to Pending SDS',
        authorizedRoles: ['CAMO Planning', 'Admin']
      },
      {
        nextStatus: 'Awaiting FTAM Approval',
        label: 'Request FTAM Approval',
        authorizedRoles: ['CAMO Planning', 'Admin']
      },
      {
        nextStatus: 'Rejected',
        label: 'Reject Request',
        authorizedRoles: ['CAMO Planning', 'Admin']
      }
    ],
    description: 'Request has been initiated and may proceed to next steps based on aircraft C of A status.'
  },
  'Pending SDS': {
    transitions: [
      {
        nextStatus: 'Pending AR',
        label: 'Submit SDS',
        description: 'Submit Spares Declaration Statement for this request',
        authorizedRoles: ['FTAM', 'Admin']
      },
      {
        nextStatus: 'Rejected',
        label: 'Reject Request',
        authorizedRoles: ['FTAM', 'Admin']
      }
    ],
    description: 'Waiting for Spares Declaration Statement to be submitted by FTAM.'
  },
  'Awaiting FTAM Approval': {
    transitions: [
      {
        nextStatus: 'Pending SDS',
        label: 'Approve Request',
        authorizedRoles: ['FTAM', 'Admin']
      },
      {
        nextStatus: 'Rejected',
        label: 'Reject Request',
        authorizedRoles: ['FTAM', 'Admin']
      }
    ],
    description: 'Waiting for FTAM approval because donor aircraft does not have valid C of A.'
  },
  'Pending AR': {
    transitions: [
      {
        nextStatus: 'Pending Removal from Donor',
        label: 'Submit Acceptance Report',
        authorizedRoles: ['CAMO Technical Services', 'Admin']
      },
      {
        nextStatus: 'Rejected',
        label: 'Reject Request',
        authorizedRoles: ['CAMO Technical Services', 'Admin']
      }
    ],
    description: 'Waiting for Acceptance Report to be submitted by CAMO Technical Services.'
  },
  'Pending Removal from Donor': {
    transitions: [
      {
        nextStatus: 'Removed from Donor',
        label: 'Mark as Removed',
        authorizedRoles: ['AMO 145', 'Admin']
      },
      {
        nextStatus: 'Rejected',
        label: 'Reject Request',
        authorizedRoles: ['AMO 145', 'Admin']
      }
    ],
    description: 'Component is pending physical removal from donor aircraft by AMO 145.'
  },
  'Removed from Donor': {
    transitions: [
      {
        nextStatus: 'Normalization Planned',
        label: 'Plan Normalization',
        description: 'Create a plan for normalizing the donor aircraft',
        authorizedRoles: ['CAMO Planning', 'Admin']
      }
    ],
    description: 'Component has been physically removed from donor aircraft. Normalization planning is required.'
  },
  'Normalization Planned': {
    transitions: [
      {
        nextStatus: 'Normalized',
        label: 'Mark as Normalized',
        authorizedRoles: ['AMO 145', 'Admin']
      }
    ],
    description: 'Normalization plan has been created. Waiting for normalization to be completed by AMO 145.'
  },
  'Normalized': {
    transitions: [],
    description: 'Donor aircraft has been normalized. This request is complete.'
  },
  'Rejected': {
    transitions: [],
    description: 'This request has been rejected and cannot proceed further.'
  }
};

export function getStatusTransitions(currentStatus: RobbingStatus): StatusTransitionMap {
  return statusTransitionMap[currentStatus];
}

export function getAllStatuses(): RobbingStatus[] {
  // Return statuses in the order of the workflow
  return [
    'Initiated',
    'Awaiting FTAM Approval',
    'Pending SDS',
    'Pending AR',
    'Pending Removal from Donor',
    'Removed from Donor',
    'Normalization Planned',
    'Normalized',
    'Rejected'
  ];
}
