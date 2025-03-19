
import { useMemo, useState } from 'react';
import { RobbingRequest, TableColumn, RobbingStatus, ComponentStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { ActionButton } from './ActionButton';
import { formatDate } from '../utils/formatters';
import { getPriorityBadgeClass } from '../utils/formatters';
import { ChevronDown, ChevronUp, Search, X, ShieldCheck, ShieldX, AlertTriangle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RobbingRequestTableProps {
  requests: RobbingRequest[];
  loading: boolean;
  onRequestSelect: (request: RobbingRequest) => void;
  onActionSelect: (request: RobbingRequest, action: string) => void;
  sortField: keyof RobbingRequest | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof RobbingRequest) => void;
  groupBy?: 'none' | 'donorAircraft' | 'recipientAircraft' | 'component' | 'request';
}

export function RobbingRequestTable({
  requests,
  loading,
  onRequestSelect,
  onActionSelect,
  sortField,
  sortDirection,
  onSort,
  groupBy = 'none'
}: RobbingRequestTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const columns: TableColumn[] = [
    { id: 'requestId', label: 'Request ID', sortable: true },
    { id: 'status', label: 'Status' },
    { id: 'donorAircraft', label: 'Donor Aircraft', sortable: true },
    { id: 'recipientAircraft', label: 'Recipient Aircraft', sortable: true },
    { id: 'component', label: 'Component' },
    { id: 'componentStatus', label: 'Robbed Component Serviceable Status' },
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
  
  const renderComponentStatus = (status: ComponentStatus, componentRemoved: boolean, hasSLabel: boolean) => {
    if (!componentRemoved) {
      return null;
    }
    
    if (status === 'Serviceable') {
      return (
        <div className="flex items-center text-green-600">
          <ShieldCheck className="h-4 w-4 mr-1" />
          <span>Serviceable</span>
        </div>
      );
    } else if (status === 'Unserviceable') {
      return (
        <div className="flex items-center text-red-600">
          <ShieldX className="h-4 w-4 mr-1" />
          <span>Unserviceable</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-amber-600">
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span>Pending S Label</span>
        </div>
      );
    }
  };
  
  const groupedRequests = useMemo(() => {
    if (groupBy === 'none') return { 'All Requests': filteredRequests };
    
    return filteredRequests.reduce((acc, request) => {
      let key = '';
      
      if (groupBy === 'donorAircraft') {
        key = request.donorAircraft;
      } else if (groupBy === 'recipientAircraft') {
        key = request.recipientAircraft;
      } else if (groupBy === 'component') {
        key = `${request.component.description} (${request.component.partNumber})`;
      } else if (groupBy === 'request') {
        key = request.requestId;
      }
      
      if (!acc[key]) {
        acc[key] = [];
      }
      
      acc[key].push(request);
      return acc;
    }, {} as Record<string, RobbingRequest[]>);
  }, [filteredRequests, groupBy]);
  
  const renderTableContent = (requests: RobbingRequest[]) => (
    <div className="overflow-x-auto relative">
      <Table className="w-full">
        <TableHeader className="table-header-sticky">
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.id}
                className={`${column.align === 'right' ? 'text-right' : ''} ${column.sortable ? 'cursor-pointer' : ''}`}
                onClick={() => column.sortable && handleSort(column.id)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && getSortIcon(column.id)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                No requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow 
                key={request.requestId}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onRequestSelect(request)}
              >
                <TableCell>{request.requestId}</TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell>{request.donorAircraft}</TableCell>
                <TableCell>{request.recipientAircraft}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{request.component.description}</span>
                    <span className="text-xs text-gray-500">
                      P/N: {request.component.partNumber}, S/N: {request.component.serialNumber}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {renderComponentStatus(
                    request.component.status, 
                    ['Removed from Donor', 'Normalization Planned', 'Normalized'].includes(request.status),
                    !!request.documentation.sLabelReference
                  )}
                </TableCell>
                <TableCell>{formatDate(request.createdDate)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(request.priority)}`}>
                    {request.priority}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div onClick={(e) => e.stopPropagation()}>
                    <ActionButton
                      request={request}
                      onAction={(action) => onActionSelect(request, action)}
                      variant="outline"
                      size="sm"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
  
  const renderGroupedTable = () => (
    <Accordion type="multiple" defaultValue={Object.keys(groupedRequests)}>
      {Object.entries(groupedRequests).map(([group, groupRequests]) => (
        <AccordionItem key={group} value={group}>
          <AccordionTrigger className="hover:no-underline px-4 py-3 bg-gray-100 border-b">
            <div className="flex items-center justify-between w-full">
              <div className="font-medium">{group}</div>
              <div className="text-sm text-gray-500">{groupRequests.length} requests</div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-0">
            {renderTableContent(groupRequests)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
  
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
      
      <ScrollArea className="h-[calc(100vh-250px)]" style={{position: "relative"}}>
        {loading ? (
          <div className="p-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse mb-4">
                <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-16 bg-gray-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : groupBy === 'none' ? (
          renderTableContent(filteredRequests)
        ) : (
          renderGroupedTable()
        )}
      </ScrollArea>
      
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
