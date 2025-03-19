
import { useState } from 'react';
import { X, Calendar, CalendarIcon, ChevronDown } from 'lucide-react';
import { RobbingRequest } from '../../types';
import { useRobbing } from '../../context/RobbingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DocumentUploader } from '../DocumentUploader';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface NormalizationPlanFormProps {
  request: RobbingRequest;
  onClose: () => void;
}

export function NormalizationPlanForm({ request, onClose }: NormalizationPlanFormProps) {
  const { updateRequest, changeRequestStatus } = useRobbing();
  const [targetDate, setTargetDate] = useState<Date | undefined>(
    request.normalization.targetDate ? new Date(request.normalization.targetDate) : undefined
  );
  const [approachType, setApproachType] = useState<string>('immediate');
  const [workOrderNumber, setWorkOrderNumber] = useState(request.normalization.completionWorkOrder || '');
  const [replacementPartNumber, setReplacementPartNumber] = useState('');
  const [replacementSerialNumber, setReplacementSerialNumber] = useState('');
  const [melReference, setMelReference] = useState('');
  const [notes, setNotes] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetDate) {
      alert('Please select a target date for normalization');
      return;
    }
    
    const updatedRequest = {
      ...request,
      normalization: {
        ...request.normalization,
        targetDate: targetDate.toISOString(),
        completionWorkOrder: workOrderNumber,
      }
    };
    
    updateRequest(updatedRequest);
    
    // Change the status to Normalization Planned
    changeRequestStatus(
      request.requestId, 
      'Normalization Planned', 
      `Normalization planned for ${format(targetDate, 'PPP')}. ` + 
      `Approach: ${approachType}. ` +
      (approachType === 'deferred' ? `MEL Reference: ${melReference}. ` : '') +
      (replacementPartNumber ? `Replacement P/N: ${replacementPartNumber}. ` : '') +
      (replacementSerialNumber ? `Replacement S/N: ${replacementSerialNumber}. ` : '') +
      (notes ? `Notes: ${notes}` : '')
    );
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white w-full max-w-3xl shadow-xl transition-all animate-slideInUp">
          <Card className="w-full">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Plan Normalization</CardTitle>
                  <CardDescription>
                    Plan normalization for request {request.requestId}: {request.component.description}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="pb-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="col-span-1">
                    <Label htmlFor="targetDate">Target Date for Normalization *</Label>
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-1"
                        >
                          {targetDate ? (
                            format(targetDate, "PPP")
                          ) : (
                            <span className="text-muted-foreground">Select a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={targetDate}
                          onSelect={(date) => {
                            setTargetDate(date);
                            setIsDatePickerOpen(false);
                          }}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="col-span-1">
                    <Label htmlFor="workOrderNumber">Work Order Number</Label>
                    <Input
                      id="workOrderNumber"
                      value={workOrderNumber}
                      onChange={(e) => setWorkOrderNumber(e.target.value)}
                      className="mt-1"
                      placeholder="e.g. WO.4567890"
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <Label htmlFor="approach">Normalization Approach</Label>
                    <Select value={approachType} onValueChange={setApproachType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select approach" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate Replacement</SelectItem>
                        <SelectItem value="deferred">Deferred with MEL</SelectItem>
                        <SelectItem value="serviceability">Serviceability Check Required</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {approachType === 'deferred' && (
                    <div className="col-span-1 md:col-span-2">
                      <Label htmlFor="melReference">MEL Reference</Label>
                      <Input
                        id="melReference"
                        value={melReference}
                        onChange={(e) => setMelReference(e.target.value)}
                        className="mt-1"
                        placeholder="e.g. MEL-2024-0123"
                      />
                    </div>
                  )}
                  
                  <div className="col-span-1">
                    <Label htmlFor="replacementPartNumber">Replacement Part Number</Label>
                    <Input
                      id="replacementPartNumber"
                      value={replacementPartNumber}
                      onChange={(e) => setReplacementPartNumber(e.target.value)}
                      className="mt-1"
                      placeholder="e.g. 3800454-6"
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <Label htmlFor="replacementSerialNumber">Replacement Serial Number</Label>
                    <Input
                      id="replacementSerialNumber"
                      value={replacementSerialNumber}
                      onChange={(e) => setReplacementSerialNumber(e.target.value)}
                      className="mt-1"
                      placeholder="e.g. R-576C"
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1"
                      placeholder="Add any additional information about the normalization plan..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <DocumentUploader
                      label="Upload Normalization Plan Document (Optional)"
                      onFileChange={(file) => {
                        if (request) {
                          updateRequest({
                            ...request,
                            documentation: {
                              ...request.documentation,
                              normalizationEvidence: file
                            }
                          });
                        }
                      }}
                      description="Upload any supporting documents for your normalization plan"
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Confirm Normalization Plan
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
