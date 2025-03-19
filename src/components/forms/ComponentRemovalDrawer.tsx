
import { useState } from 'react';
import { format } from 'date-fns';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUploader } from "@/components/DocumentUploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RobbingRequest } from '@/types';
import { useRobbing } from '@/context/RobbingContext';

interface ComponentRemovalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request?: RobbingRequest | null;
}

export function ComponentRemovalDrawer({ isOpen, onClose, request }: ComponentRemovalDrawerProps) {
  const { updateRequest, changeRequestStatus } = useRobbing();
  const [removalDate] = useState<Date>(new Date());
  const [removalWorkOrder, setRemovalWorkOrder] = useState(request?.workOrderNumber || '');
  const [componentStatus, setComponentStatus] = useState<'Serviceable' | 'Unserviceable'>('Serviceable');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [caamForm1File, setCaamForm1File] = useState<File | null>(null);
  const [sLabelFile, setSLabelFile] = useState<File | null>(null);
  
  const handleSubmit = () => {
    if (!request) return;
    
    setSubmitting(true);
    
    // Update the request with the component removal details
    const updatedRequest = {
      ...request,
      component: {
        ...request.component,
        status: componentStatus,
        physicalLocation: 'Removed from Donor'
      },
      documentation: {
        ...request.documentation,
        caamForm1Document: caamForm1File || request.documentation.caamForm1Document,
        sLabelDocument: sLabelFile || request.documentation.sLabelDocument
      }
    };
    
    updateRequest(updatedRequest);
    
    // Change the status
    changeRequestStatus(
      request.requestId,
      'Removed from Donor',
      `Component removed on ${format(removalDate, 'PPP')}. Status: ${componentStatus}. ${additionalNotes ? `Notes: ${additionalNotes}` : ''}`
    );
    
    setSubmitting(false);
    onClose();
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl">Mark Component as Removed</DrawerTitle>
          {request && (
            <p className="text-sm text-muted-foreground">
              Request ID: {request.requestId} - {request.component.description}
            </p>
          )}
        </DrawerHeader>
        
        <div className="p-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="removalDate">Removal Date</Label>
              <Input
                id="removalDate"
                type="text"
                value={format(removalDate, 'PPP')}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>
            
            <div>
              <Label htmlFor="removalWorkOrder">Work Order Number</Label>
              <Input
                id="removalWorkOrder"
                value={removalWorkOrder}
                onChange={(e) => setRemovalWorkOrder(e.target.value)}
                placeholder="e.g., WO.4491076"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="componentStatus">Component Status</Label>
              <Select 
                value={componentStatus} 
                onValueChange={(value) => setComponentStatus(value as 'Serviceable' | 'Unserviceable')}
              >
                <SelectTrigger id="componentStatus" className="mt-1">
                  <SelectValue placeholder="Select component status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Serviceable">Serviceable</SelectItem>
                  <SelectItem value="Unserviceable">Unserviceable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <DocumentUploader
                label="Upload CAAM Form 1 (if applicable)"
                onFileChange={setCaamForm1File}
                description="Upload CAAM Form 1 if the component is serviceable"
              />
            </div>
            
            <div>
              <DocumentUploader
                label="Upload Serviceable Label (if applicable)"
                onFileChange={setSLabelFile}
                description="Upload Serviceable Label if available"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any additional information about the component removal..."
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
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Confirm Component Removal'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
