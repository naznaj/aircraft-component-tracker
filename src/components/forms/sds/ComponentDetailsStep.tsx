
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ComponentDetailsStepProps {
  componentDetails: {
    partNo: string;
    serialNo: string;
    description: string;
    ataChapter: string;
    physicalLocation: string;
  };
  setComponentDetails: (details: any) => void;
  robbingReason: string;
  setRobbingReason: (reason: string) => void;
  onAutoFill?: () => void;
}

export function ComponentDetailsStep({
  componentDetails,
  setComponentDetails,
  robbingReason,
  setRobbingReason,
  onAutoFill
}: ComponentDetailsStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Component Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="partNo">Part No.</Label>
          <Input 
            id="partNo" 
            value={componentDetails.partNo} 
            onChange={(e) => setComponentDetails({...componentDetails, partNo: e.target.value})}
            placeholder="Enter part number"
            className="border-gray-300"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="serialNo">Serial No.</Label>
          <Input 
            id="serialNo" 
            value={componentDetails.serialNo} 
            onChange={(e) => setComponentDetails({...componentDetails, serialNo: e.target.value})}
            placeholder="Enter serial number"
            className="border-gray-300"
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
          className="border-gray-300"
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
            className="border-gray-300"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="physicalLocation">Physical Location</Label>
          <Input 
            id="physicalLocation" 
            value={componentDetails.physicalLocation} 
            onChange={(e) => setComponentDetails({...componentDetails, physicalLocation: e.target.value})}
            placeholder="Enter physical location"
            className="border-gray-300"
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
          className="min-h-[100px] border-gray-300"
        />
      </div>
    </div>
  );
}
