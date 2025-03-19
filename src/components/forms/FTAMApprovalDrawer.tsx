
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DocumentUploader } from "@/components/DocumentUploader";
import { RobbingRequest } from '@/types';
import { useRobbing } from '@/context/RobbingContext';

interface FTAMApprovalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request?: RobbingRequest | null;
}

export function FTAMApprovalDrawer({ isOpen, onClose, request }: FTAMApprovalDrawerProps) {
  const { updateRequest, changeRequestStatus } = useRobbing();
  const [approvalNotes, setApprovalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [approvalDocument, setApprovalDocument] = useState<File | null>(null);
  
  const handleApprove = () => {
    if (!request) return;
    
    setSubmitting(true);
    
    // Update the request with any approval documents
    if (approvalDocument) {
      const updatedRequest = {
        ...request,
        documentation: {
          ...request.documentation,
          extensionApprovalDocument: approvalDocument
        }
      };
      
      updateRequest(updatedRequest);
    }
    
    // Change the status to Pending SDS
    changeRequestStatus(
      request.requestId,
      'Pending SDS',
      `FTAM approved robbing from aircraft without valid C of A. ${approvalNotes ? `Notes: ${approvalNotes}` : ''}`
    );
    
    setSubmitting(false);
    onClose();
  };
  
  const handleReject = () => {
    if (!request) return;
    
    setSubmitting(true);
    
    // Change the status to Rejected
    changeRequestStatus(
      request.requestId,
      'Rejected',
      `FTAM rejected robbing from aircraft without valid C of A. ${approvalNotes ? `Reason: ${approvalNotes}` : ''}`
    );
    
    setSubmitting(false);
    onClose();
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl">FTAM Approval</DrawerTitle>
          {request && (
            <p className="text-sm text-muted-foreground">
              Request ID: {request.requestId} - Donor Aircraft: {request.donorAircraft}
            </p>
          )}
        </DrawerHeader>
        
        <div className="p-6">
          <div className="grid gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <p className="text-amber-800 text-sm">
                This request requires FTAM approval because the donor aircraft does not have a valid Certificate of Airworthiness.
              </p>
            </div>
            
            <div>
              <DocumentUploader
                label="Upload Approval Document (Optional)"
                onFileChange={setApprovalDocument}
                description="Upload any supporting approval documentation"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Comments</Label>
              <Textarea
                id="notes"
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Add your comments regarding this approval or rejection..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
        </div>
        
        <DrawerFooter className="flex justify-between">
          <Button variant="destructive" onClick={handleReject} disabled={submitting}>
            {submitting ? 'Processing...' : 'Reject Request'}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={submitting}
            >
              {submitting ? 'Approving...' : 'Approve Request'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
