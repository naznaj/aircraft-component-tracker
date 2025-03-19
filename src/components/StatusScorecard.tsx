
import { useState } from 'react';
import { RobbingStatus } from '../types';
import { getStatusBadgeClass } from '../utils/formatters';
import { getStatusDescription, getAllStatuses } from '../utils/statusTransitions';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface StatusScorecardProps {
  status: RobbingStatus;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export function StatusScorecard({ status, count, isActive, onClick }: StatusScorecardProps) {
  const statusClass = getStatusBadgeClass(status);
  const description = getStatusDescription(status);
  
  return (
    <button
      onClick={onClick}
      className={`status-card ${
        isActive 
          ? 'ring-2 ring-primary ring-opacity-50 transform scale-105' 
          : 'hover:bg-gray-50'
      } min-w-[120px] bg-white rounded-md shadow p-3 transition-all duration-200`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className={`${statusClass} text-xs px-2 py-1 rounded-full`}>
          {status}
        </span>
        <span className="text-2xl font-bold">{count}</span>
      </div>
      <p className="text-xs text-gray-500 text-left">{description}</p>
    </button>
  );
}

interface StatusScorecardsProps {
  statusCounts: Record<RobbingStatus, number>;
  activeStatuses: RobbingStatus[];
  onStatusClick: (status: RobbingStatus) => void;
}

export function StatusScorecards({ statusCounts, activeStatuses, onStatusClick }: StatusScorecardsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleStatusClick = (status: RobbingStatus) => {
    onStatusClick(status);
  };
  
  // Custom ordering of the statuses with "Awaiting FTAM Approval" before "Pending AR"
  const orderedStatuses: RobbingStatus[] = [
    'Initiated', 
    'Awaiting FTAM Approval',
    'Pending AR', 
    'Pending SDS', 
    'Pending Removal from Donor', 
    'Removed from Donor', 
    'Normalization Planned', 
    'Normalized', 
    'Rejected'
  ];
  
  return (
    <div className="mb-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Status Summary</h3>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          {isCollapsed ? (
            <>
              <span>Expand</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              <span>Collapse</span>
              <ChevronUp className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {orderedStatuses.map(status => (
            <StatusScorecard
              key={status}
              status={status}
              count={statusCounts[status] || 0}
              isActive={activeStatuses.includes(status)}
              onClick={() => handleStatusClick(status)}
            />
          ))}
        </div>
      )}
      
      {isCollapsed && (
        <div className="flex flex-wrap gap-2 mb-2">
          {activeStatuses.map(status => (
            <div 
              key={status}
              className={`${getStatusBadgeClass(status)} text-xs px-2 py-1 rounded-full flex items-center`}
            >
              {status}
              <span className="ml-1 bg-white/30 rounded-full px-1.5 py-0.5 text-xs font-bold">
                {statusCounts[status] || 0}
              </span>
            </div>
          ))}
          {activeStatuses.length === 0 && (
            <span className="text-sm text-gray-500">No filters applied</span>
          )}
        </div>
      )}
    </div>
  );
}
