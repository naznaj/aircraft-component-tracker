
import { useState } from 'react';
import { RobbingRequest, StatusHistoryEntry, UserRole } from '../types';
import { formatDateTime, formatRelativeTime, getStatusBadgeClass } from '../utils/formatters';
import { X, ChevronRight, ChevronDown, FileText, Calendar, Info } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { DocumentUploader } from './DocumentUploader';
import { useAuth } from '../context/AuthContext';
import { useRobbing } from '../context/RobbingContext';

interface DetailPanelProps {
  request: RobbingRequest;
  onClose: () => void;
  onStatusChange: (status: string) => void;
}

export function DetailPanel({ request, onClose, onStatusChange }: DetailPanelProps) {
  const { currentUser } = useAuth();
  const { canChangeStatus, getAvailableStatusTransitions, updateRequest } = useRobbing();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general']));
  const [comments, setComments] = useState('');
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };
  
  const isExpanded = (section: string) => expandedSections.has(section);
  
  const handleDocumentUpload = (documentType: keyof RobbingRequest['documentation'], file: File | null) => {
    const updatedRequest = {
      ...request,
      documentation: {
        ...request.documentation,
        [documentType]: file
      }
    };
    
    updateRequest(updatedRequest);
  };
  
  const handleReferenceChange = (documentType: string, value: string) => {
    const keyName = `${documentType}Reference` as keyof RobbingRequest['documentation'];
    
    const updatedRequest = {
      ...request,
      documentation: {
        ...request.documentation,
        [keyName]: value
      }
    };
    
    updateRequest(updatedRequest);
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn">
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="relative w-screen max-w-2xl">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll animate-slideInRight">
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                  Request Details
                </h2>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    type="button"
                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="flow-root">
                  <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{request.requestId}</h3>
                        <p className="text-sm text-gray-500">
                          Created {formatRelativeTime(request.createdDate)}
                        </p>
                      </div>
                      <StatusBadge status={request.status} size="lg" />
                    </div>
                    
                    {/* Collapsible Sections */}
                    <div className="space-y-4">
                      {/* General Information */}
                      <div className="border rounded-md overflow-hidden">
                        <button
                          className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                          onClick={() => toggleSection('general')}
                        >
                          <span className="font-medium text-gray-900">General Information</span>
                          {isExpanded('general') ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        
                        {isExpanded('general') && (
                          <div className="px-4 py-3 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Requester</h4>
                                <p className="mt-1 text-sm text-gray-900">{request.requesterName}</p>
                                <p className="text-xs text-gray-500">{request.requesterDepartment}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Priority</h4>
                                <p className="mt-1 text-sm text-gray-900">{request.priority}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Work Order</h4>
                                <p className="mt-1 text-sm text-gray-900">{request.workOrderNumber}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Reason</h4>
                                <p className="mt-1 text-sm text-gray-900">{request.reason}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Aircraft Information */}
                      <div className="border rounded-md overflow-hidden">
                        <button
                          className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                          onClick={() => toggleSection('aircraft')}
                        >
                          <span className="font-medium text-gray-900">Aircraft Information</span>
                          {isExpanded('aircraft') ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        
                        {isExpanded('aircraft') && (
                          <div className="px-4 py-3 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Donor Aircraft</h4>
                                <p className="mt-1 text-sm text-gray-900">{request.donorAircraft}</p>
                                <div className="mt-1 flex items-center">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    request.donorHasValidCofA ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {request.donorHasValidCofA ? 'Valid C of A' : 'No Valid C of A'}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Recipient Aircraft</h4>
                                <p className="mt-1 text-sm text-gray-900">{request.recipientAircraft}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Component Information */}
                      <div className="border rounded-md overflow-hidden">
                        <button
                          className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                          onClick={() => toggleSection('component')}
                        >
                          <span className="font-medium text-gray-900">Component Information</span>
                          {isExpanded('component') ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        
                        {isExpanded('component') && (
                          <div className="px-4 py-3 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Description</h4>
                              <p className="mt-1 text-sm text-gray-900">{request.component.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Part Number</h4>
                                <p className="mt-1 text-sm text-gray-900">{request.component.partNumber}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Serial Number</h4>
                                <p className="mt-1 text-sm text-gray-900">{request.component.serialNumber}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">ATA Chapter</h4>
                                <p className="mt-1 text-sm text-gray-900">{request.component.ataChapter}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                <p className="mt-1 text-sm text-gray-900">{request.component.status}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Documentation */}
                      <div className="border rounded-md overflow-hidden">
                        <button
                          className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                          onClick={() => toggleSection('documentation')}
                        >
                          <span className="font-medium text-gray-900">Documentation</span>
                          {isExpanded('documentation') ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        
                        {isExpanded('documentation') && (
                          <div className="px-4 py-3 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                              {request.documentation.sdsReference && (
                                <div className="flex items-start space-x-3">
                                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700">SDS Document</h4>
                                    <p className="text-xs text-gray-500">Reference: {request.documentation.sdsReference}</p>
                                  </div>
                                </div>
                              )}
                              
                              {request.documentation.acceptanceReportReference && (
                                <div className="flex items-start space-x-3">
                                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700">Acceptance Report</h4>
                                    <p className="text-xs text-gray-500">Reference: {request.documentation.acceptanceReportReference}</p>
                                  </div>
                                </div>
                              )}
                              
                              {request.documentation.caamForm1Reference && (
                                <div className="flex items-start space-x-3">
                                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700">CAAM Form 1</h4>
                                    <p className="text-xs text-gray-500">Reference: {request.documentation.caamForm1Reference}</p>
                                  </div>
                                </div>
                              )}
                              
                              {request.documentation.sLabelReference && (
                                <div className="flex items-start space-x-3">
                                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700">S-Label</h4>
                                    <p className="text-xs text-gray-500">Reference: {request.documentation.sLabelReference}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Normalization */}
                      {(request.status === 'Normalization Planned' || request.status === 'Normalized') && (
                        <div className="border rounded-md overflow-hidden">
                          <button
                            className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                            onClick={() => toggleSection('normalization')}
                          >
                            <span className="font-medium text-gray-900">Normalization</span>
                            {isExpanded('normalization') ? (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                          
                          {isExpanded('normalization') && (
                            <div className="px-4 py-3 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                {request.normalization.targetDate && (
                                  <div className="flex items-start space-x-3">
                                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-700">Target Date</h4>
                                      <p className="text-xs text-gray-500">{formatDateTime(request.normalization.targetDate)}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {request.normalization.actualCompletionDate && (
                                  <div className="flex items-start space-x-3">
                                    <Calendar className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-700">Completion Date</h4>
                                      <p className="text-xs text-gray-500">{formatDateTime(request.normalization.actualCompletionDate)}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {request.normalization.completionWorkOrder && (
                                <div className="flex items-start space-x-3">
                                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700">Completion Work Order</h4>
                                    <p className="text-xs text-gray-500">{request.normalization.completionWorkOrder}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Status History */}
                      <div className="border rounded-md overflow-hidden">
                        <button
                          className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                          onClick={() => toggleSection('history')}
                        >
                          <span className="font-medium text-gray-900">Status History</span>
                          {isExpanded('history') ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        
                        {isExpanded('history') && (
                          <div className="px-4 py-3">
                            <ul className="space-y-4">
                              {request.statusHistory.map((entry: StatusHistoryEntry, index: number) => (
                                <li key={index} className="relative pb-4">
                                  {index !== request.statusHistory.length - 1 && (
                                    <span className="absolute top-5 left-2.5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                  )}
                                  <div className="relative flex items-start space-x-3">
                                    <div>
                                      <div className={`relative px-1 ${getStatusBadgeClass(entry.status)} h-5 w-5 rounded-full flex items-center justify-center ring-4 ring-white`}>
                                        <Info className="h-3 w-3" aria-hidden="true" />
                                      </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div>
                                        <div className="text-sm">
                                          <span className="font-medium text-gray-900">{entry.status}</span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-gray-500">
                                          {formatDateTime(entry.timestamp)} by {entry.user} ({entry.role})
                                        </p>
                                      </div>
                                      {entry.comments && (
                                        <div className="mt-2 text-sm text-gray-700">
                                          <p>{entry.comments}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
