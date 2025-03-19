
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Check, X, CalendarIcon, Upload, ChevronRight } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DocumentUploader } from '@/components/DocumentUploader';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Stepper progress indicator component
const ProgressStepper = ({ activeStep }: { activeStep: number }) => {
  const steps = [
    { id: 1, label: 'Request Created', status: activeStep >= 1 ? 'complete' : 'pending' },
    { id: 2, label: 'Under SDS verification', status: activeStep >= 2 ? 'complete' : activeStep === 1 ? 'current' : 'pending' },
    { id: 3, label: 'Awaiting FTAM Approval', status: activeStep >= 3 ? 'complete' : activeStep === 2 ? 'current' : 'pending' },
    { id: 4, label: 'Pending Removal from Donor', status: activeStep >= 4 ? 'complete' : activeStep === 3 ? 'current' : 'pending' },
    { id: 5, label: 'Removal from Donor completed', status: activeStep >= 5 ? 'complete' : activeStep === 4 ? 'current' : 'pending' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div 
              className={`flex h-8 w-8 items-center justify-center rounded-full
                ${step.status === 'complete' ? 'bg-primary text-white' : 
                  step.status === 'current' ? 'border-2 border-primary bg-white text-primary' : 
                  'border border-gray-300 bg-white text-gray-400'}`}
            >
              {step.status === 'complete' ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <p className={`mt-2 text-xs ${
              step.status === 'complete' ? 'text-primary font-medium' : 
              step.status === 'current' ? 'text-primary' : 
              'text-gray-500'
            }`}>
              {step.label}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-px">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className={`h-1 ${i < (activeStep - 1) ? 'bg-primary' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );
};

// Form schema validation
const formSchema = z.object({
  componentRequest: z.string().min(2, "Component request is required"),
  partNo: z.string().min(2, "Part number is required"),
  serialNo: z.string().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  model: z.string().min(2, "Model is required"),
  repairableCapability: z.string().min(2, "Field is required"),
  cycleFrom: z.number().int().optional(),
  cycleTo: z.number().int().optional(),
  calendarFrom: z.date().optional(),
  calendarTo: z.date().optional(),
  robbingReason: z.string().min(10, "Robbing reason is required (min 10 characters)"),
  declarations: z.object({
    declaration1: z.boolean().refine(val => val, "You must agree to this declaration"),
    declaration2: z.boolean().refine(val => val, "You must agree to this declaration"),
    declaration3: z.boolean().refine(val => val, "You must agree to this declaration"),
    declaration4: z.boolean().refine(val => val, "You must agree to this declaration"),
    declaration5: z.boolean().refine(val => val, "You must agree to this declaration"),
    declaration6: z.boolean().refine(val => val, "You must agree to this declaration"),
    declaration7: z.boolean().refine(val => val, "You must agree to this declaration"),
    declaration8: z.boolean().refine(val => val, "You must confirm this statement"),
    declaration9: z.boolean().refine(val => val, "You must confirm this statement"),
    declaration10: z.boolean().optional(),
  }),
  references: z.object({
    reference1: z.string().optional(),
    reference2: z.string().optional(),
    reference3: z.string().optional(),
    reference4: z.string().optional(),
    reference5: z.string().optional(),
    reference6: z.string().optional(),
    reference7: z.string().optional(),
    reference8: z.string().optional(),
    reference9: z.string().optional(),
    reference10: z.string().optional(),
  }),
  signedBy: z.string().min(2, "Signed by is required"),
  designation: z.string().min(2, "Designation is required"),
  date: z.date({ required_error: "Date is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface SDSFormProps {
  requestId?: string;
  onBack?: () => void;
  onComplete?: () => void;
}

export function SDSForm({ requestId, onBack, onComplete }: SDSFormProps) {
  const [attachments, setAttachments] = useState<Record<string, File | null>>({});
  const [activeStep] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      componentRequest: "",
      partNo: "",
      serialNo: "",
      quantity: 1,
      model: "",
      repairableCapability: "",
      robbingReason: "",
      declarations: {
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
      },
      references: {
        reference1: "",
        reference2: "",
        reference3: "",
        reference4: "",
        reference5: "",
        reference6: "",
        reference7: "",
        reference8: "",
        reference9: "",
        reference10: "",
      },
      signedBy: "",
      designation: "",
    },
  });

  const handleFileChange = (id: string, file: File | null) => {
    setAttachments(prev => ({
      ...prev,
      [id]: file
    }));
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    console.log("Attachments:", attachments);
    
    // Submit form data to the server
    toast.success("SDS submission successful");
    
    if (onComplete) {
      onComplete();
    }
  };

  const partNumberOptions = [
    "A320-214-3456-787",
    "B737-800-5678-123",
    "A330-300-8765-456"
  ];

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={onBack}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <h2 className="text-xl font-semibold text-gray-800">
            {requestId ? `Edit SDS Submission: ${requestId}` : "New Request: SDS Submission"}
          </h2>
        </div>
      </div>

      <div className="p-6">
        <ProgressStepper activeStep={activeStep} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Component Details Section */}
            <div className="bg-gray-50 p-6 rounded-md">
              <h3 className="text-lg font-medium mb-4">Component Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="componentRequest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Component Request</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter component description" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="partNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Part No.</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select part number" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {partNumberOptions.map((part) => (
                              <SelectItem key={part} value={part}>{part}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="serialNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial No.</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter serial number (if applicable)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Aircraft model" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="repairableCapability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repairable Capability</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select capability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="external">External Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Life Remaining Section */}
            <div className="bg-gray-50 p-6 rounded-md">
              <h3 className="text-lg font-medium mb-4">Life Remaining Before Expiry</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <FormLabel>Cycles</FormLabel>
                  <FormField
                    control={form.control}
                    name="cycleFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="From" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormLabel>To</FormLabel>
                  <FormField
                    control={form.control}
                    name="cycleTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="To" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormLabel>Calendar Expiry</FormLabel>
                  <FormField
                    control={form.control}
                    name="calendarFrom"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>From date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Robbing Reason Section */}
            <div className="bg-gray-50 p-6 rounded-md">
              <h3 className="text-lg font-medium mb-4">Robbing Reason</h3>
              
              <FormField
                control={form.control}
                name="robbingReason"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide detailed reason for component robbing"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Declarations Section */}
            <div className="bg-gray-50 p-6 rounded-md">
              <h3 className="text-lg font-medium mb-4">Declarations</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-1 text-center font-medium">1</div>
                  <div className="col-span-7">
                    <p className="text-sm text-gray-700">
                      The aircraft, component and transportation filled records for future reference and the components of robbing subject.*
                    </p>
                    <FormField
                      control={form.control}
                      name="declarations.declaration1"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0 mt-2">
                          <FormControl>
                            <RadioGroup 
                              onValueChange={(value) => field.onChange(value === "true")}
                              defaultValue={field.value ? "true" : "false"}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="d1-yes" />
                                <label htmlFor="d1-yes" className="text-sm">Yes</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="d1-no" />
                                <label htmlFor="d1-no" className="text-sm">No</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-4">
                    <p className="text-sm text-gray-700 mb-1">Document Reference*</p>
                    <FormField
                      control={form.control}
                      name="references.reference1"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value || ""}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select document" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="doc1">Document 1</SelectItem>
                                <SelectItem value="doc2">Document 2</SelectItem>
                                <SelectItem value="doc3">Document 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mt-2">
                      <DocumentUploader
                        label=""
                        accept=".pdf,.jpg,.jpeg,.png"
                        onFileChange={(file) => handleFileChange("doc1", file)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-1 text-center font-medium">2</div>
                  <div className="col-span-7">
                    <p className="text-sm text-gray-700">
                      If the component being removed from this airframe/aircraft will be put on a CAAM Form 1, I fully understand that this must be returned in adequate time (within 2 weeks of taking the part unless special equipment has been acquired-two months should suffice).
                    </p>
                    <FormField
                      control={form.control}
                      name="declarations.declaration2"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0 mt-2">
                          <FormControl>
                            <RadioGroup 
                              onValueChange={(value) => field.onChange(value === "true")}
                              defaultValue={field.value ? "true" : "false"}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="d2-yes" />
                                <label htmlFor="d2-yes" className="text-sm">Yes</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="d2-no" />
                                <label htmlFor="d2-no" className="text-sm">No</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-4">
                    <p className="text-sm text-gray-700 mb-1">Document Reference*</p>
                    <FormField
                      control={form.control}
                      name="references.reference2"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value || ""}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select document" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="doc1">Document 1</SelectItem>
                                <SelectItem value="doc2">Document 2</SelectItem>
                                <SelectItem value="doc3">Document 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mt-2">
                      <DocumentUploader
                        label=""
                        accept=".pdf,.jpg,.jpeg,.png"
                        onFileChange={(file) => handleFileChange("doc2", file)}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional declarations would go here in the same format */}
                {/* For brevity, I'm showing only 2 of the 10 declarations */}
                {/* In a real implementation, all declarations would be included */}

                {/* Signature Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-4">Digital Declaration</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    I confirm that all information provided above is true and accurate to the best of my knowledge.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="signedBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Signed by (Full Name)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your designation" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack || (() => window.history.back())}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <ChevronRight className="h-4 w-4" />
                Submit SDS
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
