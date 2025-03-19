
import { useState } from 'react';
import { RobbingRequest, RobbingStatus } from '../types';
import { Navbar } from '../components/Navbar';
import { StatusScorecards } from '../components/StatusScorecard';
import { RobbingRequestTable } from '../components/RobbingRequestTable';
import { DetailPanel } from '../components/DetailPanel';
import { RequestForm } from '../components/forms/RequestForm';
import { useRobbing } from '../context/RobbingContext';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { 
    filteredRequests, 
    statusCounts, 
    loading, 
    filterStatus, 
    setFilterStatus,
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
    changeRequestStatus(request.requestId, action as RobbingStatus);
    toast.success(`Request status updated to ${action}`);
  };
  
  const showCreateButton = currentUser?.role === 'CAMO Planning' || currentUser?.role === 'Admin';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-8 mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Aircraft Component Robbing System
            </h1>
            
            {showCreateButton && (
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create Robbing Request
              </button>
            )}
          </div>
          
          <StatusScorecards
            statusCounts={statusCounts}
            activeStatus={filterStatus}
            onStatusClick={setFilterStatus}
          />
          
          <RobbingRequestTable
            requests={filteredRequests}
            loading={loading}
            onRequestSelect={handleRequestSelect}
            onActionSelect={handleActionSelect}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
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
    </div>
  );
}
