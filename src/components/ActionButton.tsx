
import { useState } from 'react';
import { RobbingRequest, RobbingStatus } from '../types';
import { useRobbing } from '../context/RobbingContext';
import { useAuth } from '../context/AuthContext';
import { getStatusTransitions } from '../utils/statusTransitions';
import { Button } from "@/components/ui/button";
import { PackageCheck, PackageX } from 'lucide-react';

interface ActionButtonProps {
  request: RobbingRequest;
  onAction: (action: string, formData?: any) => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ActionButton({ 
  request, 
  onAction, 
  variant = 'default',
  size = 'default'
}: ActionButtonProps) {
  const { canChangeStatus, getAvailableStatusTransitions } = useRobbing();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const availableTransitions = getAvailableStatusTransitions(request);
  
  // Special case for Material Store - Add S Label or Report Unserviceable
  if (currentUser?.role === 'Material Store' && request.status === 'Removed from Donor') {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size={size}
          onClick={() => onAction('SubmitSLabel')}
          className="flex items-center"
        >
          <PackageCheck className="h-4 w-4 mr-2" />
          Submit S Label
        </Button>
        <Button
          variant="outline"
          size={size}
          onClick={() => onAction('ReportUnserviceable')}
          className="flex items-center"
        >
          <PackageX className="h-4 w-4 mr-2" />
          Report Unserviceable
        </Button>
      </div>
    );
  }
  
  if (availableTransitions.length === 0) {
    return null;
  }
  
  // For Initiated status, show "Validate C of A" button for CAMO Planning
  if (request.status === 'Initiated') {
    return (
      <div className="relative inline-block text-left">
        <Button
          variant={variant}
          size={size}
          onClick={() => setIsOpen(!isOpen)}
        >
          Validate C of A Status
          <svg className="w-4 h-4 ml-2 -mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
        
        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {availableTransitions.map(nextStatus => {
                const transition = getStatusTransitions(request.status).transitions.find(
                  t => t.nextStatus === nextStatus
                );
                
                if (!transition) return null;
                
                return (
                  <button
                    key={nextStatus}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      onAction(nextStatus);
                      setIsOpen(false);
                    }}
                  >
                    {transition.label}
                    {transition.description && (
                      <p className="text-xs text-gray-500 mt-1">{transition.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // For single action for "Submit SDS", "Submit Acceptance Report", etc.
  if (availableTransitions.length === 1) {
    const nextStatus = availableTransitions[0];
    const transition = getStatusTransitions(request.status).transitions.find(
      t => t.nextStatus === nextStatus
    );
    
    if (!transition) return null;
    
    return (
      <Button 
        variant={variant}
        size={size}
        onClick={() => onAction(nextStatus)}
      >
        {transition.label}
      </Button>
    );
  }
  
  // For multiple actions, show dropdown
  return (
    <div className="relative inline-block text-left">
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(!isOpen)}
      >
        Available Actions
        <svg className="w-4 h-4 ml-2 -mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </Button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {availableTransitions.map(nextStatus => {
              const transition = getStatusTransitions(request.status).transitions.find(
                t => t.nextStatus === nextStatus
              );
              
              if (!transition) return null;
              
              return (
                <button
                  key={nextStatus}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    onAction(nextStatus);
                    setIsOpen(false);
                  }}
                >
                  {transition.label}
                  {transition.description && (
                    <p className="text-xs text-gray-500 mt-1">{transition.description}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
