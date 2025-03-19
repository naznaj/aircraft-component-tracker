
import { RobbingStatus } from '../types';
import { getStatusBadgeClass } from '../utils/formatters';

interface StatusBadgeProps {
  status: RobbingStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors';
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  const statusClass = getStatusBadgeClass(status);
  
  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${statusClass} ${className}`}>
      {status}
    </span>
  );
}
