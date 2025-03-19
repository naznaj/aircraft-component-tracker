
import { useState } from 'react';
import { format } from 'date-fns';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUploader } from "@/components/DocumentUploader";
import { RobbingRequest } from '@/types';
import { useRobbing } from '@/context/RobbingContext';

interface NormalizedConfirmationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request?: RobbingRequest | null;
}

export function NormalizedConfirmationDrawer({ isOpen, onClose, request }: NormalizedConfirmationDrawerProps) {
  const { updateRequest, changeRequestStatus } = useRobbing();
  const [completionDate] = useState<Date>(new Date());
  const [workOrderReference, setWorkOrderReference] = useState(request?.normalization.completionWorkOrder || '');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  
  const handleSubmit = () => {
    if (!request) return;
    
    setSubmitting(true);
    
    // Update the request with the normalization completion details
    const updatedRequest = {
      ...request,
      normalization: {
        ...request.normalization,
        actualCompletionDate: completionDate.toISOString(),
        completionWorkOrder: workOrderReference,
        completionEvidence: evidenceFile || request.normalization.completionEvidence
      }
    };
    
    updateRequest(updatedRequest);
    
    // Change the status
    changeRequestStatus(
      request.requestId,
      'Normalized',
      `Aircraft normalized on ${format(completionDate, 'PPP')}. Work Order: ${workOrderReference}. ${additionalNotes ? `Notes: ${additionalNotes}` : ''}`
    );
    
    setSubmitting(false);
    onClose();
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl">Confirm Normalization Complete</DrawerTitle>
          {request && (
            <p className="text-sm text-muted-foreground">
              Request ID: {request.requestId} - Donor Aircraft: {request.donorAircraft}
            </p>
          )}
        </DrawerHeader>
        
        <div className="p-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="completionDate">Completion Date</Label>
              <Input
                id="completionDate"
                type="text"
                value={format(completionDate, 'PPP')}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
            
            <div>
              <Label htmlFor="workOrderReference">Work Order Reference *</Label>
              <Input
                id="workOrderReference"
                value={workOrderReference}
                onChange={(e) => setWorkOrderReference(e.target.value)}
                placeholder="e.g., WO.4491076"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <DocumentUploader
                label="Upload Normalization Evidence *"
                onFileChange={setEvidenceFile}
                description="Upload evidence of aircraft normalization (e.g., completed work orders, photos)"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any additional information about the normalization process..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
        </div>
        
        <DrawerFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={submitting || !workOrderReference || !evidenceFile}
          >
            {submitting ? 'Submitting...' : 'Confirm Normalization Complete'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
