
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RobbingRequest, UserRole } from '@/types';
import { useRobbing } from '@/context/RobbingContext';

interface ReportUnserviceableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request?: RobbingRequest | null;
}

export function ReportUnserviceableDrawer({ isOpen, onClose, request }: ReportUnserviceableDrawerProps) {
  const { updateRequest } = useRobbing();
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = () => {
    if (!request) return;
    
    setSubmitting(true);
    
    // Update the request to mark component as unserviceable
    const updatedRequest = {
      ...request,
      component: {
        ...request.component,
        status: 'Unserviceable' as const
      },
      statusHistory: [
        ...request.statusHistory,
        {
          status: request.status,
          timestamp: new Date().toISOString(),
          user: 'Lisa Wong', // This would be currentUser.name in a real app
          role: 'Material Store' as UserRole,
          comments: `Component reported as Unserviceable. Reason: ${reason}`
        }
      ]
    };
    
    updateRequest(updatedRequest);
    setSubmitting(false);
    onClose();
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl">Report Component as Unserviceable</DrawerTitle>
          {request && (
            <p className="text-sm text-muted-foreground">
              Request ID: {request.requestId} - {request.component.description}
            </p>
          )}
        </DrawerHeader>
        
        <div className="p-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="reason">Reason for Unserviceable Status</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe why the component is being marked as unserviceable..."
                className="mt-1"
                rows={6}
                required
              />
            </div>
          </div>
        </div>
        
        <DrawerFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleSubmit}
            disabled={submitting || !reason}
          >
            {submitting ? 'Submitting...' : 'Mark as Unserviceable'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
