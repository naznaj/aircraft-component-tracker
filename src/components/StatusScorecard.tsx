
import { RobbingStatus } from '../types';
import { getStatusBadgeClass } from '../utils/formatters';
import { getStatusDescription, getAllStatuses } from '../utils/statusTransitions';

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
  const handleStatusClick = (status: RobbingStatus) => {
    onStatusClick(status);
  };
  
  // Get all statuses in their proper transition order
  const orderedStatuses = getAllStatuses();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 animate-fadeIn">
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
  );
}
