
import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUploader } from "@/components/DocumentUploader";
import { RobbingRequest, UserRole } from '@/types';
import { useRobbing } from '@/context/RobbingContext';

interface SLabelSubmissionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request?: RobbingRequest | null;
}

export function SLabelSubmissionDrawer({ isOpen, onClose, request }: SLabelSubmissionDrawerProps) {
  const { updateRequest } = useRobbing();
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [sLabelFile, setSLabelFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isUpdate = request?.documentation.sLabelReference ? true : false;
  
  // Load existing data if updating
  useEffect(() => {
    if (request && isOpen && isUpdate) {
      setReferenceNumber(request.documentation.sLabelReference || '');
    }
  }, [request, isOpen, isUpdate]);
  
  const handleSubmit = () => {
    if (!request) return;
    
    setSubmitting(true);
    
    // Update the request with S Label details
    const updatedRequest = {
      ...request,
      component: {
        ...request.component,
        status: 'Serviceable' as const
      },
      documentation: {
        ...request.documentation,
        sLabelReference: referenceNumber,
        sLabelDocument: sLabelFile || request.documentation.sLabelDocument
      },
      statusHistory: [
        ...request.statusHistory,
        {
          status: request.status,
          timestamp: new Date().toISOString(),
          user: 'Lisa Wong', // This would be currentUser.name in a real app
          role: 'Material Store' as UserRole,
          comments: `${isUpdate ? 'S Label updated' : 'S Label submitted'}. Reference: ${referenceNumber}. Component marked as Serviceable. ${notes ? `Notes: ${notes}` : ''}`
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
          <DrawerTitle className="text-xl">{isUpdate ? 'Update S Label' : 'Submit S Label'}</DrawerTitle>
          {request && (
            <p className="text-sm text-muted-foreground">
              Request ID: {request.requestId} - {request.component.description}
            </p>
          )}
        </DrawerHeader>
        
        <div className="p-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="referenceNumber">S Label Reference Number</Label>
              <Input
                id="referenceNumber"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g., SL-2024-001"
                className="mt-1"
              />
            </div>
            
            <div>
              <DocumentUploader
                label="Upload S Label Document"
                onFileChange={setSLabelFile}
                description="Upload Serviceable Label document (PDF, JPG, PNG)"
              />
              {isUpdate && !sLabelFile && request?.documentation.sLabelDocument && (
                <p className="text-sm text-muted-foreground mt-1">
                  Current document will be kept if you don't upload a new one
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information about the S Label..."
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
            disabled={submitting || !referenceNumber || (!sLabelFile && !isUpdate)}
          >
            {submitting ? 'Submitting...' : isUpdate ? 'Update S Label' : 'Submit S Label'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
