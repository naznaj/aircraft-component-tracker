
import { useState } from 'react';
import { RobbingRequest, RobbingStatus } from '../types';
import { Navbar } from '../components/Navbar';
import { StatusScorecards } from '../components/StatusScorecard';
import { RobbingRequestTable } from '../components/RobbingRequestTable';
import { DetailPanel } from '../components/DetailPanel';
import { RequestForm } from '../components/forms/RequestForm';
import { NormalizationPlanForm } from '../components/forms/NormalizationPlanForm';
import { SDSSubmissionDrawer } from '../components/forms/SDSSubmissionDrawer';
import { AcceptanceReportDrawer } from '../components/forms/AcceptanceReportDrawer';
import { ComponentRemovalDrawer } from '../components/forms/ComponentRemovalDrawer';
import { FTAMApprovalDrawer } from '../components/forms/FTAMApprovalDrawer';
import { NormalizedConfirmationDrawer } from '../components/forms/NormalizedConfirmationDrawer';
import { SLabelSubmissionDrawer } from '../components/forms/SLabelSubmissionDrawer';
import { ReportUnserviceableDrawer } from '../components/forms/ReportUnserviceableDrawer';
import { useRobbing } from '../context/RobbingContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Filter, ChevronDown, X, ListTree } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { 
    filteredRequests, 
    statusCounts, 
    loading, 
    filterStatuses, 
    toggleFilterStatus,
    clearFilterStatuses,
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
    selectRequest,
    selectedRequest,
    changeRequestStatus
  } = useRobbing();
  
  const { currentUser } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showNormalizationForm, setShowNormalizationForm] = useState(false);
  const [showSDSDrawer, setShowSDSDrawer] = useState(false);
  const [showAcceptanceReportDrawer, setShowAcceptanceReportDrawer] = useState(false);
  const [showComponentRemovalDrawer, setShowComponentRemovalDrawer] = useState(false);
  const [showFTAMApprovalDrawer, setShowFTAMApprovalDrawer] = useState(false);
  const [showNormalizedConfirmationDrawer, setShowNormalizedConfirmationDrawer] = useState(false);
  const [showSLabelDrawer, setShowSLabelDrawer] = useState(false);
  const [showReportUnserviceableDrawer, setShowReportUnserviceableDrawer] = useState(false);
  const [activeRequest, setActiveRequest] = useState<RobbingRequest | null>(null);
  const [groupBy, setGroupBy] = useState<'none' | 'donorAircraft' | 'recipientAircraft' | 'component' | 'request'>('none');
  
  const handleSort = (field: keyof RobbingRequest) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleRequestSelect = (request: RobbingRequest) => {
    selectRequest(request);
  };
  
  const handleCloseDetailPanel = () => {
    selectRequest(null);
  };
  
  const handleStatusChange = (status: string) => {
    if (!selectedRequest) return;
    
    changeRequestStatus(selectedRequest.requestId, status as RobbingStatus);
    toast.success(`Request status updated to ${status}`);
  };
  
  const handleActionSelect = (request: RobbingRequest, action: string) => {
    setActiveRequest(request);
    
    if (action === 'Pending AR') {
      setShowSDSDrawer(true);
    } else if (action === 'Pending Removal from Donor') {
      setShowAcceptanceReportDrawer(true);
    } else if (action === 'Removed from Donor') {
      setShowComponentRemovalDrawer(true);
    } else if (action === 'Awaiting FTAM Approval') {
      setShowFTAMApprovalDrawer(true);
    } else if (action === 'Normalization Planned') {
      setShowNormalizationForm(true);
    } else if (action === 'Normalized') {
      setShowNormalizedConfirmationDrawer(true);
    } else if (action === 'SubmitSLabel') {
      setShowSLabelDrawer(true);
    } else if (action === 'ReportUnserviceable') {
      setShowReportUnserviceableDrawer(true);
    } else {
      changeRequestStatus(request.requestId, action as RobbingStatus);
      toast.success(`Request status updated to ${action}`);
    }
  };
  
  const handleFormClose = () => {
    setShowCreateForm(false);
    setShowNormalizationForm(false);
    setShowSDSDrawer(false);
    setShowAcceptanceReportDrawer(false);
    setShowComponentRemovalDrawer(false);
    setShowFTAMApprovalDrawer(false);
    setShowNormalizedConfirmationDrawer(false);
    setShowSLabelDrawer(false);
    setShowReportUnserviceableDrawer(false);
    setActiveRequest(null);
  };
  
  const showCreateButton = currentUser?.role === 'CAMO Planning' || currentUser?.role === 'Admin';
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="pt-16 pb-16 flex-1 flex flex-col">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-none flex-1 flex flex-col">
          <div className="mt-8 mb-4 flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Aircraft Component Robbing System
            </h1>
            
            <div className="flex items-center gap-4">
              {filterStatuses.length > 0 && (
                <div className="flex items-center">
                  <div className="flex flex-wrap gap-2 mr-2">
                    {filterStatuses.map(status => (
                      <Badge 
                        key={status} 
                        variant="secondary" 
                        className="flex items-center gap-1"
                      >
                        {status}
                        <button 
                          onClick={() => toggleFilterStatus(status)}
                          className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm" 
                    onClick={clearFilterStatuses}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ListTree className="h-4 w-4 mr-1" />
                    Group by: {groupBy === 'none' ? 'None' : 
                              groupBy === 'donorAircraft' ? 'Donor Aircraft' : 
                              groupBy === 'recipientAircraft' ? 'Recipient Aircraft' : 
                              groupBy === 'component' ? 'Component' :
                              'Request'} 
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setGroupBy('none')}>
                    None
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setGroupBy('request')}>
                    Request
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setGroupBy('donorAircraft')}>
                    Donor Aircraft
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setGroupBy('recipientAircraft')}>
                    Recipient Aircraft
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setGroupBy('component')}>
                    Component
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {showCreateButton && (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center"
                >
                  <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Create Robbing Request
                </Button>
              )}
            </div>
          </div>
          
          <StatusScorecards
            statusCounts={statusCounts}
            activeStatuses={filterStatuses}
            onStatusClick={toggleFilterStatus}
          />
          
          <div className="flex-1 flex flex-col">
            <RobbingRequestTable
              requests={filteredRequests}
              loading={loading}
              onRequestSelect={handleRequestSelect}
              onActionSelect={handleActionSelect}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              groupBy={groupBy}
            />
          </div>
        </div>
      </main>
      
      {selectedRequest && (
        <DetailPanel
          request={selectedRequest}
          onClose={handleCloseDetailPanel}
          onStatusChange={handleStatusChange}
        />
      )}
      
      {showCreateForm && (
        <RequestForm onClose={handleFormClose} />
      )}
      
      {showNormalizationForm && (
        <NormalizationPlanForm 
          request={activeRequest || selectedRequest!} 
          onClose={handleFormClose} 
        />
      )}
      
      <SDSSubmissionDrawer
        isOpen={showSDSDrawer}
        onClose={handleFormClose}
        request={activeRequest || selectedRequest}
      />
      
      <AcceptanceReportDrawer
        isOpen={showAcceptanceReportDrawer}
        onClose={handleFormClose}
        request={activeRequest || selectedRequest}
      />
      
      <ComponentRemovalDrawer
        isOpen={showComponentRemovalDrawer}
        onClose={handleFormClose}
        request={activeRequest || selectedRequest}
      />
      
      <FTAMApprovalDrawer
        isOpen={showFTAMApprovalDrawer}
        onClose={handleFormClose}
        request={activeRequest || selectedRequest}
      />
      
      <NormalizedConfirmationDrawer
        isOpen={showNormalizedConfirmationDrawer}
        onClose={handleFormClose}
        request={activeRequest || selectedRequest}
      />
      
      <SLabelSubmissionDrawer
        isOpen={showSLabelDrawer}
        onClose={handleFormClose}
        request={activeRequest || selectedRequest}
      />
      
      <ReportUnserviceableDrawer
        isOpen={showReportUnserviceableDrawer}
        onClose={handleFormClose}
        request={activeRequest || selectedRequest}
      />
    </div>
  );
}
