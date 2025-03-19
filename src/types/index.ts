
export type RobbingStatus = 
  | 'Initiated'
  | 'Pending SDS'
  | 'Awaiting FTAM Approval'
  | 'Pending AR'
  | 'Pending Removal from Donor'
  | 'Removed from Donor'
  | 'Normalization Planned'
  | 'Normalized'
  | 'Rejected';

export type ComponentStatus = 'Serviceable' | 'Unserviceable';

export type UserRole = 
  | 'CAMO Planning'
  | 'FTAM'
  | 'CAMO Technical Services'
  | 'AMO 145'
  | 'Material Store'
  | 'Admin'
  | 'System';

export type PriorityLevel = 'Low' | 'Medium' | 'High';

export interface StatusHistoryEntry {
  status: RobbingStatus;
  timestamp: string;
  user: string;
  role: UserRole;
  comments?: string;
}

export interface Component {
  description: string;
  partNumber: string;
  serialNumber: string;
  ataChapter: string;
  status: ComponentStatus;
  physicalLocation: string;
}

export interface Documentation {
  sdsReference: string;
  sdsDocument: File | null;
  acceptanceReportReference: string;
  acceptanceReportDocument: File | null;
  caamForm1Reference: string;
  caamForm1Document: File | null;
  sLabelReference: string;
  sLabelDocument: File | null;
  normalizationEvidence: File | null;
  extensionApprovalDocument: File | null;
}

export interface Normalization {
  targetDate: string | null;
  actualCompletionDate: string | null;
  completionWorkOrder: string | null;
  completionEvidence: File | null;
}

export interface RobbingRequest {
  requestId: string;
  status: RobbingStatus;
  statusHistory: StatusHistoryEntry[];
  createdDate: string;
  requesterName: string;
  requesterDepartment: string;
  donorAircraft: string;
  donorHasValidCofA: boolean;
  recipientAircraft: string;
  reason: string;
  priority: PriorityLevel;
  workOrderNumber: string;
  component: Component;
  documentation: Documentation;
  normalization: Normalization;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
}

export interface TableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  align?: 'left' | 'center' | 'right';
}
