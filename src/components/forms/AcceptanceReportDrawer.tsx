
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUploader } from "@/components/DocumentUploader";
import { RobbingRequest } from '@/types';
import { useRobbing } from '@/context/RobbingContext';

interface AcceptanceReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request?: RobbingRequest | null;
}

export function AcceptanceReportDrawer({ isOpen, onClose, request }: AcceptanceReportDrawerProps) {
  const { updateRequest, changeRequestStatus } = useRobbing();
  const [reportReference, setReportReference] = useState(request?.documentation.acceptanceReportReference || '');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reportFile, setReportFile] = useState<File | null>(null);
  
  const handleSubmit = () => {
    if (!request) return;
    
    setSubmitting(true);
    
    // First update the request with the new acceptance report details
    const updatedRequest = {
      ...request,
      documentation: {
        ...request.documentation,
        acceptanceReportReference: reportReference,
        acceptanceReportDocument: reportFile || request.documentation.acceptanceReportDocument
      }
    };
    
    updateRequest(updatedRequest);
    
    // Then change the status
    changeRequestStatus(
      request.requestId, 
      'Pending Removal from Donor',
      `Acceptance Report submitted. Reference: ${reportReference}. ${additionalNotes ? `Notes: ${additionalNotes}` : ''}`
    );
    
    setSubmitting(false);
    onClose();
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl">Submit Acceptance Report</DrawerTitle>
          {request && (
            <p className="text-sm text-muted-foreground">Request ID: {request.requestId}</p>
          )}
        </DrawerHeader>
        
        <div className="p-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="reportReference">Acceptance Report Reference *</Label>
              <Input
                id="reportReference"
                value={reportReference}
                onChange={(e) => setReportReference(e.target.value)}
                placeholder="e.g., AR-2024-0123"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <DocumentUploader
                label="Upload Acceptance Report *"
                onFileChange={setReportFile}
                description="Upload the signed Acceptance Report document (PDF format preferred)"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any additional information regarding this acceptance..."
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
            disabled={submitting || !reportReference || !reportFile}
          >
            {submitting ? 'Submitting...' : 'Submit Acceptance Report'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
