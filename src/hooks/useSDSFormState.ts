
import { useState } from 'react';
import { RobbingRequest } from '@/types';
import { useRobbing } from '@/context/RobbingContext';
import { toast } from 'sonner';

export const useSDSFormState = (request?: RobbingRequest | null, onClose?: () => void) => {
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
  
  const [additionalRemarks, setAdditionalRemarks] = useState('');
  
  // Documents state
  const [documents, setDocuments] = useState({
    sdsDocument: null,
    acceptanceReportDocument: null,
    sLabelDocument: null,
  });
  
  // Signature state
  const [signature, setSignature] = useState({
    name: '',
    staffId: '',
    designation: '',
    date: '',
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
      if (onClose) onClose();
    }, 1000);
  };
  
  const handleDeclarationChange = (declarationKey: keyof typeof declarations, checked: boolean) => {
    setDeclarations({
      ...declarations,
      [declarationKey]: checked
    });
  };

  return {
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
    handleSubmit
  };
};
