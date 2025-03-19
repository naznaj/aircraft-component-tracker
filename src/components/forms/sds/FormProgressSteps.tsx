
import { Check } from 'lucide-react';

interface FormProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

export function FormProgressSteps({ currentStep, totalSteps }: FormProgressStepsProps) {
  const stepLabels = [
    'Component Details',
    'Life Remaining',
    'Declarations',
    'Signature'
  ];

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
            {stepLabels[index]}
          </span>
        </div>
      ))}
    </div>
  );
}
