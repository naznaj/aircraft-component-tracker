
import { RobbingRequest, RobbingStatus, Component, User, UserRole } from '../types';

// Mock data generator
const generateMockComponent = (index: number): Component => {
  const components = [
    {
      description: 'Auxiliary Power Unit (APU)',
      partNumber: '3800454-6',
      ataChapter: '49',
    },
    {
      description: 'Flight Control Computer',
      partNumber: 'FCC-2100',
      ataChapter: '27',
    },
    {
      description: 'Main Landing Gear Actuator',
      partNumber: 'MLG-4520-A',
      ataChapter: '32',
    },
    {
      description: 'Weather Radar Transceiver',
      partNumber: 'WXR-2100',
      ataChapter: '34',
    },
    {
      description: 'Engine Fuel Control Unit',
      partNumber: 'FCU-5500',
      ataChapter: '73',
    },
    {
      description: 'Cabin Pressure Controller',
      partNumber: 'CPC-850',
      ataChapter: '21',
    },
    {
      description: 'Air Data Computer',
      partNumber: 'ADC-3300',
      ataChapter: '34',
    },
    {
      description: 'VHF Communication Transceiver',
      partNumber: 'VHF-2200',
      ataChapter: '23',
    },
    {
      description: 'Engine Starter Motor',
      partNumber: 'ESM-950',
      ataChapter: '80',
    },
    {
      description: 'Hydraulic Pump',
      partNumber: 'HYD-P-3000',
      ataChapter: '29',
    }
  ];
  
  const component = components[index % components.length];
  const serialNumber = `SN-${100000 + index * 57}`;
  
  return {
    ...component,
    serialNumber,
    status: Math.random() > 0.3 ? 'Serviceable' : 'Unserviceable',
    physicalLocation: 'Donor Aircraft'
  };
};

const generateRandomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const generateStatusHistory = (status: RobbingStatus, createdDate: string, hasValidCofA: boolean): any[] => {
  const startDate = new Date(createdDate);
  const history = [
    {
      status: 'Initiated',
      timestamp: createdDate,
      user: 'John Smith',
      role: 'CAMO Planning'
    }
  ];
  
  // Define possible status paths based on CofA validity
  let possibleStatuses: RobbingStatus[];
  
  if (hasValidCofA) {
    possibleStatuses = [
      'Initiated',
      'Pending SDS',
      'Pending Removal from Donor',
      'Removed from Donor',
      'Normalization Planned',
      'Normalized'
    ];
  } else {
    possibleStatuses = [
      'Initiated',
      'Awaiting FTAM Approval',
      'Pending SDS',
      'Pending AR',
      'Pending Removal from Donor',
      'Removed from Donor',
      'Normalization Planned',
      'Normalized'
    ];
  }
  
  // Find the index of the current status in the possible statuses
  const statusIndex = possibleStatuses.indexOf(status);
  
  // Add history entries for each status transition up to the current status
  for (let i = 1; i <= statusIndex; i++) {
    const nextStatus = possibleStatuses[i];
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * 2); // Add 2 days for each status change
    
    let user = '';
    let role: UserRole = 'Admin';
    
    switch (nextStatus) {
      case 'Pending SDS':
        user = 'System';
        role = 'Admin';
        break;
      case 'Awaiting FTAM Approval':
        user = 'System';
        role = 'Admin';
        break;
      case 'Pending AR':
        user = 'Ahmed Khalid';
        role = 'FTAM';
        break;
      case 'Pending Removal from Donor':
        user = 'John Smith';
        role = 'CAMO Planning';
        break;
      case 'Removed from Donor':
        user = 'Michael Chang';
        role = 'AMO 145';
        break;
      case 'Normalization Planned':
        user = 'John Smith';
        role = 'CAMO Planning';
        break;
      case 'Normalized':
        user = 'John Smith';
        role = 'CAMO Planning';
        break;
      default:
        user = 'System';
        role = 'Admin';
    }
    
    history.push({
      status: nextStatus,
      timestamp: date.toISOString(),
      user,
      role
    });
  }
  
  return history;
};

// Generate mock requests
export const generateMockRequests = (count: number): RobbingRequest[] => {
  const requests: RobbingRequest[] = [];
  const startDate = new Date(2023, 0, 1); // Jan 1, 2023
  const endDate = new Date(); // Current date
  
  const validCofAStatuses: RobbingStatus[] = [
    'Initiated',
    'Pending SDS',
    'Pending Removal from Donor',
    'Removed from Donor',
    'Normalization Planned',
    'Normalized'
  ];
  
  const invalidCofAStatuses: RobbingStatus[] = [
    'Initiated',
    'Awaiting FTAM Approval',
    'Pending SDS',
    'Pending AR',
    'Pending Removal from Donor',
    'Removed from Donor',
    'Normalization Planned',
    'Normalized'
  ];
  
  const aircraftRegs = [
    '9M-XXD', '9M-XBH', '9M-AHQ', '9M-AHP', '9M-AGU', 
    '9M-AGT', '9M-AGQ', '9M-AGP', '9M-AXB', '9M-AXA', 
    '9M-AQA', '9M-AQB', '9M-MAC', '9M-MAD', '9M-MAE'
  ];
  
  for (let i = 0; i < count; i++) {
    // Determine if this request has a valid Certificate of Airworthiness
    const hasValidCofA = Math.random() > 0.4; // 60% chance of having valid CofA
    
    // Select appropriate status pool based on CofA validity
    const statuses = hasValidCofA ? validCofAStatuses : invalidCofAStatuses;
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdDate = generateRandomDate(startDate, endDate);
    const statusHistory = generateStatusHistory(status, createdDate, hasValidCofA);
    
    const donorIndex = Math.floor(Math.random() * aircraftRegs.length);
    let recipientIndex;
    do {
      recipientIndex = Math.floor(Math.random() * aircraftRegs.length);
    } while (recipientIndex === donorIndex);
    
    const requestId = `CR-${new Date(createdDate).getFullYear()}-${(i+1).toString().padStart(4, '0')}`;
    
    requests.push({
      requestId,
      status,
      statusHistory,
      createdDate,
      requesterName: 'John Smith',
      requesterDepartment: 'CAMO-Planning',
      donorAircraft: aircraftRegs[donorIndex],
      donorHasValidCofA: hasValidCofA,
      recipientAircraft: aircraftRegs[recipientIndex],
      reason: Math.random() > 0.7 ? 'AOG at Jakarta' : Math.random() > 0.5 ? 'Scheduled maintenance' : 'Component failure',
      priority: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
      workOrderNumber: `WO.${4000000 + i}`,
      component: generateMockComponent(i),
      documentation: {
        sdsReference: status === 'Initiated' ? '' : `SDS-${new Date().getFullYear()}-${1000 + i}`,
        sdsDocument: null,
        acceptanceReportReference: status === 'Pending AR' || status === 'Initiated' || 
                                 (hasValidCofA && ['Awaiting FTAM Approval', 'Pending SDS'].includes(status)) ? 
                                 '' : `AR-${new Date().getFullYear()}-${500 + i}`,
        acceptanceReportDocument: null,
        caamForm1Reference: status === 'Removed from Donor' || status === 'Normalization Planned' || status === 'Normalized' ? `CAAM-${1000 + i}` : '',
        caamForm1Document: null,
        sLabelReference: '',
        sLabelDocument: null,
        normalizationEvidence: null,
        extensionApprovalDocument: null
      },
      normalization: {
        targetDate: status === 'Normalization Planned' || status === 'Normalized' ? new Date(new Date().setDate(new Date().getDate() + 30)).toISOString() : null,
        actualCompletionDate: status === 'Normalized' ? new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() : null,
        completionWorkOrder: status === 'Normalized' ? `WO.${4100000 + i}` : null,
        completionEvidence: null
      }
    });
  }
  
  return requests;
};

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'CAMO Planning',
    department: 'CAMO-Planning'
  },
  {
    id: '2',
    name: 'Ahmed Khalid',
    role: 'FTAM',
    department: 'FTAM'
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    role: 'CAMO Technical Services',
    department: 'CAMO-Technical'
  },
  {
    id: '4',
    name: 'Michael Chang',
    role: 'AMO 145',
    department: 'AMO-145'
  },
  {
    id: '5',
    name: 'Lisa Wong',
    role: 'Material Store',
    department: 'Material-Store'
  },
  {
    id: '6',
    name: 'Admin User',
    role: 'Admin',
    department: 'Admin'
  }
];

export const mockRequests = generateMockRequests(50);
