
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RobbingRequest } from '@/types';
import { DocumentUploader } from '../DocumentUploader';
import { useRobbing } from '@/context/RobbingContext';
import { toast } from 'sonner';
import { Check, Info } from 'lucide-react';

interface SDSSubmissionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request?: RobbingRequest | null;
}

export function SDSSubmissionDrawer({ isOpen, onClose, request }: SDSSubmissionDrawerProps) {
  const { changeRequestStatus } = useRobbing();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [componentDetails, setComponentDetails] = useState({
    partNo: request?.component?.partNumber || '',
    serialNo: request?.component?.serialNumber || '',
    description: request?.component?.description || '',
    ataChapter: request?.component?.ataChapter || '',
    physicalLocation: request?.component?.physicalLocation || '',
  });
  
  const [lifeRemaining, setLifeRemaining] = useState({
    cycles: '',
    hours: '',
    calendarDays: '',
  });
  
  const [robbingReason, setRobbingReason] = useState('');
  
  // Declaration states
  const [declarations, setDeclarations] = useState({
    declaration1: false,
    declaration2: false,
    declaration3: false,
    declaration4: false,
    declaration5: false,
    declaration6: false,
    declaration7: false,
    declaration8: false,
    declaration9: false,
    declaration10: false,
  });
  
  const [signature, setSignature] = useState({
    name: '',
    staffId: '',
    designation: '',
    date: '',
  });
  
  // Declarations content
  const declarationTexts = [
    "The component is serviceable and incorporated fitted modification service bulletins and has certification of conformity / release certificate.",
    "If the component is being robbed to fit this inspection and form-73 using a CAAM Part 145, it shall indicate only Form 'N'.",
    "The part number, serial number and model of the component has been confirmed to be the same as recorded. (as check for the subject).",
    "The shelf life limitations if any existing to the accessories, engines, component operational items, and special equipment has not expired.",
    "If the component was produced by an aerospace standard, theory, process or chemical does not have an expiration or use limitations will not apply. (i.e. electrical wire, hardware, rivets, chemicals, etc.)",
    "The shelf life limitations if any have applied to the manufacturer's time between overhaul unless stated official by authority.",
    "The shelf life limitations only applicable with current serviceable and retained.",
    "The component time/life total hours/cycles/landings or calendar days (as the subject) specified time is not exceeded. \"N\" Part Form for such landings shall be considered in this case.",
    "The component time/life total hours/cycles/landings or calendar days (as the subject) specified time is not exceeded. \"N\" Part Form for such landings shall be considered in this case.",
    "The component is fitted to GSE of the component shall installed directly, and specified time is not's exceeded and apply to the oil calendar."
  ];
  
  const [additionalRemarks, setAdditionalRemarks] = useState('');
  
  // Document uploads
  const [documents, setDocuments] = useState({
    sdsDocument: null,
    acceptanceReportDocument: null,
    sLabelDocument: null,
  });
  
  const totalSteps = 4;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (request) {
        // Update the request status to "Pending AR"
        changeRequestStatus(request.requestId, 'Pending AR', 'SDS submitted successfully');
      }
      
      toast.success('SDS submitted successfully');
      setLoading(false);
      onClose();
    }, 1000);
  };
  
  const handleDeclarationChange = (declarationKey: keyof typeof declarations, checked: boolean) => {
    setDeclarations({
      ...declarations,
      [declarationKey]: checked
    });
  };
  
  const renderProgressSteps = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep > index + 1 
                  ? 'bg-primary text-white border-primary' 
                  : currentStep === index + 1 
                  ? 'border-primary text-primary' 
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              {currentStep > index + 1 ? <Check size={16} /> : index + 1}
            </div>
            <span className={`text-xs mt-2 ${
              currentStep >= index + 1 ? 'text-primary' : 'text-gray-400'
            }`}>
              {index === 0 
                ? 'Component Details' 
                : index === 1 
                ? 'Life Remaining' 
                : index === 2 
                ? 'Declarations' 
                : 'Signature'}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  // Render the correct step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Component Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partNo">Part No.</Label>
                <Input 
                  id="partNo" 
                  value={componentDetails.partNo} 
                  onChange={(e) => setComponentDetails({...componentDetails, partNo: e.target.value})}
                  placeholder="Enter part number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serialNo">Serial No.</Label>
                <Input 
                  id="serialNo" 
                  value={componentDetails.serialNo} 
                  onChange={(e) => setComponentDetails({...componentDetails, serialNo: e.target.value})}
                  placeholder="Enter serial number"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Component Description</Label>
              <Input 
                id="description" 
                value={componentDetails.description} 
                onChange={(e) => setComponentDetails({...componentDetails, description: e.target.value})}
                placeholder="Enter component description"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ataChapter">ATA Chapter</Label>
                <Input 
                  id="ataChapter" 
                  value={componentDetails.ataChapter} 
                  onChange={(e) => setComponentDetails({...componentDetails, ataChapter: e.target.value})}
                  placeholder="Enter ATA chapter"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="physicalLocation">Physical Location</Label>
                <Input 
                  id="physicalLocation" 
                  value={componentDetails.physicalLocation} 
                  onChange={(e) => setComponentDetails({...componentDetails, physicalLocation: e.target.value})}
                  placeholder="Enter physical location"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="robbingReason">Robbing Reason</Label>
              <Textarea 
                id="robbingReason" 
                value={robbingReason} 
                onChange={(e) => setRobbingReason(e.target.value)}
                placeholder="Explain the reason for this robbing request"
                className="min-h-[100px]"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Life Remaining Before Expiry</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cycles">Cycles</Label>
                <Input 
                  id="cycles" 
                  type="text"
                  value={lifeRemaining.cycles} 
                  onChange={(e) => setLifeRemaining({...lifeRemaining, cycles: e.target.value})}
                  placeholder="Enter cycles"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hours">Flight Hours</Label>
                <Input 
                  id="hours" 
                  type="text"
                  value={lifeRemaining.hours} 
                  onChange={(e) => setLifeRemaining({...lifeRemaining, hours: e.target.value})}
                  placeholder="Enter flight hours"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="calendarDays">Calendar Days</Label>
                <Input 
                  id="calendarDays" 
                  type="text"
                  value={lifeRemaining.calendarDays} 
                  onChange={(e) => setLifeRemaining({...lifeRemaining, calendarDays: e.target.value})}
                  placeholder="Enter calendar days"
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Upload Documents</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sdsDoc">SDS Document</Label>
                  <DocumentUploader 
                    id="sdsDoc"
                    value={documents.sdsDocument}
                    onChange={(file) => setDocuments({...documents, sdsDocument: file})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="arDoc">Acceptance Report</Label>
                  <DocumentUploader 
                    id="arDoc"
                    value={documents.acceptanceReportDocument}
                    onChange={(file) => setDocuments({...documents, acceptanceReportDocument: file})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="slDoc">S Label Document</Label>
                  <DocumentUploader 
                    id="slDoc"
                    value={documents.sLabelDocument}
                    onChange={(file) => setDocuments({...documents, sLabelDocument: file})}
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Declarations</h3>
            <div className="text-sm text-muted-foreground flex items-center mb-4">
              <Info size={16} className="mr-2" />
              Please confirm all declarations below that apply to this robbing request
            </div>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              {declarationTexts.map((text, index) => {
                const declarationKey = `declaration${index + 1}` as keyof typeof declarations;
                
                return (
                  <div key={index} className="flex space-x-4 border-b pb-4">
                    <div className="flex-shrink-0 font-bold">{index + 1}.</div>
                    <div className="flex-1 space-y-2">
                      <p>{text}</p>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`declaration-${index}`}
                            checked={declarations[declarationKey] === true}
                            onChange={() => handleDeclarationChange(declarationKey, true)}
                            className="w-4 h-4 text-primary"
                          />
                          <span>Yes (Not Applicable / / N/A)</span>
                        </label>
                        
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`declaration-${index}`}
                            checked={declarations[declarationKey] === false}
                            onChange={() => handleDeclarationChange(declarationKey, false)}
                            className="w-4 h-4 text-primary"
                          />
                          <span>No</span>
                        </label>
                      </div>
                      
                      {declarations[declarationKey] === false && (
                        <div className="mt-2">
                          <Label htmlFor={`remarks-${index}`}>Enter remarks (if "No")</Label>
                          <Textarea 
                            id={`remarks-${index}`} 
                            placeholder="Enter your remarks"
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4">
              <Label htmlFor="additionalRemarks">Additional Remarks</Label>
              <Textarea 
                id="additionalRemarks" 
                value={additionalRemarks} 
                onChange={(e) => setAdditionalRemarks(e.target.value)}
                placeholder="Enter any additional remarks"
                className="mt-1"
              />
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Digital Signature Declaration</h3>
            <p className="text-sm text-muted-foreground">
              I certify that the FTAM Signature Declaration has been made in accordance with the requirements
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Digital Signature (Full Name)</Label>
                <Input 
                  id="name" 
                  value={signature.name} 
                  onChange={(e) => setSignature({...signature, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="staffId">Staff ID</Label>
                <Input 
                  id="staffId" 
                  value={signature.staffId} 
                  onChange={(e) => setSignature({...signature, staffId: e.target.value})}
                  placeholder="Enter your staff ID"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input 
                  id="designation" 
                  value={signature.designation} 
                  onChange={(e) => setSignature({...signature, designation: e.target.value})}
                  placeholder="Enter your designation"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={signature.date} 
                  onChange={(e) => setSignature({...signature, date: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
              <p>This component has been inspected by the authorized individual named in the digital signature attached. The document conforms to the requirements of the robbing process.</p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl">Submit SDS (Spares Declaration Statement)</DrawerTitle>
          {request && (
            <p className="text-sm text-muted-foreground">Request ID: {request.requestId}</p>
          )}
        </DrawerHeader>
        
        <div className="p-4 overflow-y-auto">
          {renderProgressSteps()}
          
          <div className="mt-4 pb-24">
            {renderStepContent()}
          </div>
        </div>
        
        <DrawerFooter className="flex flex-row justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          {currentStep > 1 && (
            <Button variant="secondary" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit SDS'}
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
