
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info } from 'lucide-react';

interface DeclarationsStepProps {
  declarations: Record<string, boolean>;
  handleDeclarationChange: (declarationKey: string, checked: boolean) => void;
  additionalRemarks: string;
  setAdditionalRemarks: (remarks: string) => void;
}

export function DeclarationsStep({
  declarations,
  handleDeclarationChange,
  additionalRemarks,
  setAdditionalRemarks
}: DeclarationsStepProps) {
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Declarations</h3>
      <div className="text-sm text-muted-foreground flex items-center mb-4">
        <Info size={16} className="mr-2" />
        Please confirm all declarations below that apply to this robbing request
      </div>
      
      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
        {declarationTexts.map((text, index) => {
          const declarationKey = `declaration${index + 1}`;
          
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
}
