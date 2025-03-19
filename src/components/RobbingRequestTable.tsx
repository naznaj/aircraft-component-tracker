
import { useMemo, useState } from 'react';
import { RobbingRequest, TableColumn, RobbingStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { ActionButton } from './ActionButton';
import { formatDate } from '../utils/formatters';
import { getPriorityBadgeClass } from '../utils/formatters';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';

interface RobbingRequestTableProps {
  requests: RobbingRequest[];
  loading: boolean;
  onRequestSelect: (request: RobbingRequest) => void;
  onActionSelect: (request: RobbingRequest, action: string) => void;
  sortField: keyof RobbingRequest | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof RobbingRequest) => void;
}

export function RobbingRequestTable({
  requests,
  loading,
  onRequestSelect,
  onActionSelect,
  sortField,
  sortDirection,
  onSort
}: RobbingRequestTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const columns: TableColumn[] = [
    { id: 'requestId', label: 'Request ID', sortable: true },
    { id: 'status', label: 'Status' },
    { id: 'donorAircraft', label: 'Donor Aircraft', sortable: true },
    { id: 'recipientAircraft', label: 'Recipient Aircraft', sortable: true },
    { id: 'component', label: 'Component' },
    { id: 'createdDate', label: 'Created Date', sortable: true },
    { id: 'priority', label: 'Priority' },
    { id: 'actions', label: 'Actions', align: 'right' }
  ];
  
  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column?.sortable) return;
    
    onSort(columnId as keyof RobbingRequest);
  };
  
  const filteredRequests = useMemo(() => {
    if (!searchTerm.trim()) return requests;
    
    const lowercasedTerm = searchTerm.toLowerCase();
    
    return requests.filter(request => {
      return (
        request.requestId.toLowerCase().includes(lowercasedTerm) ||
        request.donorAircraft.toLowerCase().includes(lowercasedTerm) ||
        request.recipientAircraft.toLowerCase().includes(lowercasedTerm) ||
        request.component.partNumber.toLowerCase().includes(lowercasedTerm) ||
        request.component.serialNumber.toLowerCase().includes(lowercasedTerm) ||
        request.component.description.toLowerCase().includes(lowercasedTerm) ||
        request.workOrderNumber.toLowerCase().includes(lowercasedTerm)
      );
    });
  }, [requests, searchTerm]);
  
  const getSortIcon = (columnId: string) => {
    if (sortField !== columnId) return null;
    
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Component Robbing Requests</h2>
        
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search requests..."
            className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.id}
                  className={`${column.align === 'right' ? 'text-right' : ''} ${column.sortable ? 'cursor-pointer' : ''}`}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.id)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {columns.map((column) => (
                    <td key={column.id}>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                  No requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr 
                  key={request.requestId}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onRequestSelect(request)}
                >
                  <td>{request.requestId}</td>
                  <td>
                    <StatusBadge status={request.status} />
                  </td>
                  <td>{request.donorAircraft}</td>
                  <td>{request.recipientAircraft}</td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{request.component.description}</span>
                      <span className="text-xs text-gray-500">
                        P/N: {request.component.partNumber}, S/N: {request.component.serialNumber}
                      </span>
                    </div>
                  </td>
                  <td>{formatDate(request.createdDate)}</td>
                  <td>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="text-right">
                    <div onClick={(e) => e.stopPropagation()}>
                      <ActionButton
                        request={request}
                        onAction={(action) => onActionSelect(request, action as RobbingStatus)}
                        variant="outline"
                        size="sm"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredRequests.length}</span>{' '}
            of <span className="font-medium">{requests.length}</span> requests
          </div>
        </div>
      </div>
    </div>
  );
}
