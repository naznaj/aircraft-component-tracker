
import { useState } from 'react';
import { RobbingRequest, RobbingStatus } from '../types';
import { Navbar } from '../components/Navbar';
import { StatusScorecards } from '../components/StatusScorecard';
import { RobbingRequestTable } from '../components/RobbingRequestTable';
import { DetailPanel } from '../components/DetailPanel';
import { RequestForm } from '../components/forms/RequestForm';
import { NormalizationPlanForm } from '../components/forms/NormalizationPlanForm';
import { SDSSubmissionDrawer } from '../components/forms/SDSSubmissionDrawer';
import { useRobbing } from '../context/RobbingContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Filter, ChevronDown, X, FileText } from 'lucide-react';
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
  const [normalizationRequest, setNormalizationRequest] = useState<RobbingRequest | null>(null);
  const [sdsRequest, setSdsRequest] = useState<RobbingRequest | null>(null);
  const [groupBy, setGroupBy] = useState<'none' | 'donorAircraft' | 'recipientAircraft' | 'component'>('none');
  
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
    if (action === 'Plan Normalization') {
      setNormalizationRequest(request);
      setShowNormalizationForm(true);
    } else if (action === 'Submit SDS') {
      setSdsRequest(request);
      setShowSDSDrawer(true);
    } else {
      changeRequestStatus(request.requestId, action as RobbingStatus);
      toast.success(`Request status updated to ${action}`);
    }
  };
  
  const handleNormalizationPlanComplete = () => {
    setShowNormalizationForm(false);
    setNormalizationRequest(null);
  };
  
  const handleSDSDrawerClose = () => {
    setShowSDSDrawer(false);
    setSdsRequest(null);
  };
  
  const showCreateButton = currentUser?.role === 'CAMO Planning' || currentUser?.role === 'Admin';
  const showSDSButton = currentUser?.role === 'CAMO Planning' || currentUser?.role === 'Admin';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-16 pb-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-none">
          <div className="mt-8 mb-6 flex justify-between items-center flex-wrap gap-4">
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
                    Group by: {groupBy === 'none' ? 'None' : 
                              groupBy === 'donorAircraft' ? 'Donor Aircraft' : 
                              groupBy === 'recipientAircraft' ? 'Recipient Aircraft' : 
                              'Component'} 
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setGroupBy('none')}>
                    None
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
              
              {showSDSButton && (
                <Button
                  onClick={() => setShowSDSDrawer(true)}
                  variant="secondary"
                  className="inline-flex items-center"
                >
                  <FileText className="mr-2 h-5 w-5" aria-hidden="true" />
                  Submit SDS
                </Button>
              )}
              
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
      </main>
      
      {selectedRequest && (
        <DetailPanel
          request={selectedRequest}
          onClose={handleCloseDetailPanel}
          onStatusChange={handleStatusChange}
        />
      )}
      
      {showCreateForm && (
        <RequestForm onClose={() => setShowCreateForm(false)} />
      )}
      
      {showNormalizationForm && normalizationRequest && (
        <NormalizationPlanForm 
          request={normalizationRequest} 
          onClose={handleNormalizationPlanComplete} 
        />
      )}
      
      <SDSSubmissionDrawer
        isOpen={showSDSDrawer}
        onClose={handleSDSDrawerClose}
        request={sdsRequest || selectedRequest}
      />
    </div>
  );
}
