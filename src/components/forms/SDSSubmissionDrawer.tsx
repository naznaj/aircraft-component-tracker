
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { RobbingRequest } from '@/types';
import { useSDSFormState } from "@/hooks/useSDSFormState";
import { FormProgressSteps } from "./sds/FormProgressSteps";
import { ComponentDetailsStep } from "./sds/ComponentDetailsStep";
import { LifeRemainingStep } from "./sds/LifeRemainingStep";
import { DeclarationsStep } from "./sds/DeclarationsStep";
import { SignatureStep } from "./sds/SignatureStep";
import { Wand2 } from "lucide-react";

interface SDSSubmissionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request?: RobbingRequest | null;
}

export function SDSSubmissionDrawer({ isOpen, onClose, request }: SDSSubmissionDrawerProps) {
  const {
    currentStep,
    loading,
    totalSteps,
    componentDetails,
    setComponentDetails,
    lifeRemaining,
    setLifeRemaining,
    robbingReason,
    setRobbingReason,
    declarations,
    handleDeclarationChange,
    additionalRemarks,
    setAdditionalRemarks,
    documents,
    setDocuments,
    signature,
    setSignature,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleAutoFill
  } = useSDSFormState(request, onClose);
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ComponentDetailsStep
            componentDetails={componentDetails}
            setComponentDetails={setComponentDetails}
            robbingReason={robbingReason}
            setRobbingReason={setRobbingReason}
            onAutoFill={handleAutoFill}
          />
        );
        
      case 2:
        return (
          <LifeRemainingStep
            lifeRemaining={lifeRemaining}
            setLifeRemaining={setLifeRemaining}
            documents={documents}
            setDocuments={setDocuments}
          />
        );
        
      case 3:
        return (
          <DeclarationsStep
            declarations={declarations}
            handleDeclarationChange={handleDeclarationChange}
            additionalRemarks={additionalRemarks}
            setAdditionalRemarks={setAdditionalRemarks}
          />
        );
        
      case 4:
        return (
          <SignatureStep
            signature={signature}
            setSignature={setSignature}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl">Submit Spares Declaration Statement</DrawerTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1" 
              onClick={handleAutoFill}
            >
              <Wand2 className="h-4 w-4" />
              Auto-fill
            </Button>
          </div>
          {request && (
            <div className="text-sm text-muted-foreground mt-1">
              <div>Request ID: {request.requestId}</div>
              <div>Donor Aircraft: {request.donorAircraft}</div>
              <div>Recipient Aircraft: {request.recipientAircraft}</div>
            </div>
          )}
        </DrawerHeader>
        
        <div className="p-4 overflow-y-auto bg-gray-50">
          <FormProgressSteps 
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
          
          <div className="mt-6 pb-24 bg-white p-6 rounded-lg shadow-sm">
            {renderStepContent()}
          </div>
        </div>
        
        <DrawerFooter className="flex flex-row justify-end gap-2 border-t pt-4 bg-white">
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
