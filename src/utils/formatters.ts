
import { format, formatDistance } from 'date-fns';
import { RobbingStatus, PriorityLevel } from '../types';

// Date formatters
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

// Get CSS classes for priority levels
export const getPriorityBadgeClass = (priority: PriorityLevel): string => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Medium':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Get status badge class
export const getStatusBadgeClass = (status: RobbingStatus): string => {
  switch (status) {
    case 'Initiated':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'Pending SDS':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Awaiting FTAM Approval':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Pending AR':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Pending Removal from Donor':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Removed from Donor':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Normalization Planned':
      return 'bg-violet-100 text-violet-800 border-violet-200';
    case 'Normalized':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Generate a file URL from a File object
export const getFileUrl = (file: File | null): string => {
  if (!file) return '';
  return URL.createObjectURL(file);
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength = 50): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

// Convert string to title case
export const toTitleCase = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
