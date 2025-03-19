
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DocumentUploader } from '@/components/DocumentUploader';

interface LifeRemainingStepProps {
  lifeRemaining: {
    cycles: string;
    hours: string;
    calendarDays: string;
  };
  setLifeRemaining: (details: any) => void;
  documents: {
    sdsDocument: any;
    acceptanceReportDocument: any;
    sLabelDocument: any;
  };
  setDocuments: (docs: any) => void;
}

export function LifeRemainingStep({
  lifeRemaining,
  setLifeRemaining,
  documents,
  setDocuments
}: LifeRemainingStepProps) {
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
            <Label>SDS Document</Label>
            <DocumentUploader 
              label="SDS Document"
              value={documents.sdsDocument}
              onChange={(file) => setDocuments({...documents, sdsDocument: file})}
            />
          </div>
          
          <div>
            <Label>Acceptance Report</Label>
            <DocumentUploader 
              label="Acceptance Report"
              value={documents.acceptanceReportDocument}
              onChange={(file) => setDocuments({...documents, acceptanceReportDocument: file})}
            />
          </div>
          
          <div>
            <Label>S Label Document</Label>
            <DocumentUploader 
              label="S Label Document"
              value={documents.sLabelDocument}
              onChange={(file) => setDocuments({...documents, sLabelDocument: file})}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
