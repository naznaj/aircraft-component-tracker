
import { CheckCircle } from "lucide-react";

interface FormProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

export function FormProgressSteps({ currentStep, totalSteps }: FormProgressStepsProps) {
  const steps = [
    'Component Details',
    'Life Remaining',
    'Declarations',
    'Signature'
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div 
                className={`flex items-center justify-center h-10 w-10 rounded-full border-2 
                  ${isActive ? 'border-primary bg-primary text-white' : 
                    isCompleted ? 'border-primary bg-primary text-white' : 
                    'border-gray-300 bg-white text-gray-500'}`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  stepNumber
                )}
              </div>
              <div className={`mt-2 text-xs font-medium ${isActive || isCompleted ? 'text-primary' : 'text-gray-500'}`}>
                {step}
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
        <div 
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
