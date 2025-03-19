
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SignatureStepProps {
  signature: {
    name: string;
    staffId: string;
    designation: string;
    date: string;
  };
  setSignature: (signature: any) => void;
}

export function SignatureStep({
  signature,
  setSignature
}: SignatureStepProps) {
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
}
