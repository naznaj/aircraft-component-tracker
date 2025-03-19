
import { useState } from 'react';
import { RobbingRequest, RobbingStatus } from '../types';
import { useRobbing } from '../context/RobbingContext';
import { getStatusTransitions } from '../utils/statusTransitions';
import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  request: RobbingRequest;
  onAction: (action: string, formData?: any) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function ActionButton({ 
  request, 
  onAction, 
  variant = 'primary',
  size = 'md'
}: ActionButtonProps) {
  const { canChangeStatus, getAvailableStatusTransitions } = useRobbing();
  const [isOpen, setIsOpen] = useState(false);
  
  const availableTransitions = getAvailableStatusTransitions(request);
  
  if (availableTransitions.length === 0) {
    return null;
  }
  
  const getButtonClass = () => {
    const baseClass = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';
    const sizeClass = {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }[size];
    
    switch (variant) {
      case 'primary':
        return `${baseClass} ${sizeClass} bg-primary text-white hover:bg-primary/90`;
      case 'secondary':
        return `${baseClass} ${sizeClass} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
      case 'outline':
        return `${baseClass} ${sizeClass} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;
      case 'ghost':
        return `${baseClass} ${sizeClass} text-gray-700 hover:bg-gray-100`;
      default:
        return `${baseClass} ${sizeClass} bg-primary text-white hover:bg-primary/90`;
    }
  };
  
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
