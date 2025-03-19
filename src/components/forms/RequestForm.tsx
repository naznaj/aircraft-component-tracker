import { useState } from 'react';
import { PriorityLevel } from '../../types';
import { useRobbing } from '../../context/RobbingContext';
import { X } from 'lucide-react';

interface RequestFormProps {
  onClose: () => void;
}

export function RequestForm({ onClose }: RequestFormProps) {
  const { createRequest } = useRobbing();
  
  const [requesterName, setRequesterName] = useState('');
  const [requesterDepartment, setRequesterDepartment] = useState('CAMO-Planning');
  const [donorAircraft, setDonorAircraft] = useState('');
  const [donorHasValidCofA, setDonorHasValidCofA] = useState<boolean | null>(null);
  const [recipientAircraft, setRecipientAircraft] = useState('');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [workOrderNumber, setWorkOrderNumber] = useState('');
  
  const [componentDescription, setComponentDescription] = useState('');
  const [componentPartNumber, setComponentPartNumber] = useState('');
  const [componentSerialNumber, setComponentSerialNumber] = useState('');
  const [componentAtaChapter, setComponentAtaChapter] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const aircraftOptions = [
    '9M-XXD', '9M-XBH', '9M-AHQ', '9M-AHP', '9M-AGU', 
    '9M-AGT', '9M-AGQ', '9M-AGP', '9M-AXB', '9M-AXA', 
    '9M-AQA', '9M-AQB', '9M-MAC', '9M-MAD', '9M-MAE'
  ];
  
  const fillWithMockData = () => {
    setRequesterName('John Smith');
    setRequesterDepartment('CAMO-Planning');
    setDonorAircraft('9M-XXD');
    setDonorHasValidCofA(true);
    setRecipientAircraft('9M-XBH');
    setReason('AOG at Jakarta');
    setPriority('High');
    setWorkOrderNumber(`WO.${Math.floor(4000000 + Math.random() * 1000000)}`);
    setComponentDescription('Auxiliary Power Unit (APU)');
    setComponentPartNumber('3800454-6');
    setComponentSerialNumber(`SN-${100000 + Math.floor(Math.random() * 100000)}`);
    setComponentAtaChapter('49');
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!requesterName) newErrors.requesterName = 'Requester name is required';
    if (!requesterDepartment) newErrors.requesterDepartment = 'Department is required';
    if (!donorAircraft) newErrors.donorAircraft = 'Donor aircraft is required';
    if (donorHasValidCofA === null) newErrors.donorHasValidCofA = 'C of A status is required';
    if (!recipientAircraft) newErrors.recipientAircraft = 'Recipient aircraft is required';
    if (donorAircraft === recipientAircraft) newErrors.recipientAircraft = 'Recipient aircraft must be different from donor';
    if (!reason) newErrors.reason = 'Reason is required';
    if (!workOrderNumber) newErrors.workOrderNumber = 'Work order number is required';
    if (!componentDescription) newErrors.componentDescription = 'Component description is required';
    if (!componentPartNumber) newErrors.componentPartNumber = 'Part number is required';
    if (!componentSerialNumber) newErrors.componentSerialNumber = 'Serial number is required';
    if (!componentAtaChapter) newErrors.componentAtaChapter = 'ATA chapter is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    createRequest({
      requesterName,
      requesterDepartment,
      donorAircraft,
      donorHasValidCofA: donorHasValidCofA || false,
      recipientAircraft,
      reason,
      priority,
      workOrderNumber,
      component: {
        description: componentDescription,
        partNumber: componentPartNumber,
        serialNumber: componentSerialNumber,
        ataChapter: componentAtaChapter,
        status: 'Serviceable',
        physicalLocation: 'Donor Aircraft'
      },
      documentation: {
        sdsReference: '',
        sdsDocument: null,
        acceptanceReportReference: '',
        acceptanceReportDocument: null,
        caamForm1Reference: '',
        caamForm1Document: null,
        sLabelReference: '',
        sLabelDocument: null,
        normalizationEvidence: null,
        extensionApprovalDocument: null
      },
      normalization: {
        targetDate: null,
        actualCompletionDate: null,
        completionWorkOrder: null,
        completionEvidence: null
      },
      status: 'Initiated'
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn">
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
        <div className="w-screen max-w-2xl">
          <form 
            className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll animate-slideInRight"
            onSubmit={handleSubmit}
          >
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Create Robbing Request
                </h2>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    type="button"
                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={fillWithMockData}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Auto-fill with sample data
                  </button>
                </div>
                
                <div className="divide-y divide-gray-200">
                  <div className="py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Requester Information</h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="requesterName" className="block text-sm font-medium text-gray-700">
                          Requester Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="requesterName"
                            value={requesterName}
                            onChange={(e) => setRequesterName(e.target.value)}
                            className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.requesterName ? 'border-red-300' : ''
                            }`}
                          />
                          {errors.requesterName && (
                            <p className="mt-1 text-sm text-red-600">{errors.requesterName}</p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="requesterDepartment" className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="requesterDepartment"
                            value={requesterDepartment}
                            onChange={(e) => setRequesterDepartment(e.target.value)}
                            className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.requesterDepartment ? 'border-red-300' : ''
                            }`}
                          />
                          {errors.requesterDepartment && (
                            <p className="mt-1 text-sm text-red-600">{errors.requesterDepartment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Aircraft Information</h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="donorAircraft" className="block text-sm font-medium text-gray-700">
                          Donor Aircraft
                        </label>
                        <div className="mt-1">
                          <select
                            id="donorAircraft"
                            value={donorAircraft}
                            onChange={(e) => setDonorAircraft(e.target.value)}
                            className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.donorAircraft ? 'border-red-300' : ''
                            }`}
                          >
                            <option value="">Select Aircraft</option>
                            {aircraftOptions.map((aircraft) => (
                              <option key={aircraft} value={aircraft}>
                                {aircraft}
                              </option>
                            ))}
                          </select>
                          {errors.donorAircraft && (
                            <p className="mt-1 text-sm text-red-600">{errors.donorAircraft}</p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="recipientAircraft" className="block text-sm font-medium text-gray-700">
                          Recipient Aircraft
                        </label>
                        <div className="mt-1">
                          <select
                            id="recipientAircraft"
                            value={recipientAircraft}
                            onChange={(e) => setRecipientAircraft(e.target.value)}
                            className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.recipientAircraft ? 'border-red-300' : ''
                            }`}
                          >
                            <option value="">Select Aircraft</option>
                            {aircraftOptions.map((aircraft) => (
                              <option key={aircraft} value={aircraft} disabled={aircraft === donorAircraft}>
                                {aircraft} {aircraft === donorAircraft ? '(Donor)' : ''}
                              </option>
                            ))}
                          </select>
                          {errors.recipientAircraft && (
                            <p className="mt-1 text-sm text-red-600">{errors.recipientAircraft}</p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <fieldset>
                          <legend className="text-sm font-medium text-gray-700">
                            Does the donor aircraft have a valid Certificate of Airworthiness (C of A)?
                          </legend>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <input
                                id="cofaYes"
                                name="cofa"
                                type="radio"
                                checked={donorHasValidCofA === true}
                                onChange={() => setDonorHasValidCofA(true)}
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                              />
                              <label htmlFor="cofaYes" className="ml-3 block text-sm font-medium text-gray-700">
                                Yes
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="cofaNo"
                                name="cofa"
                                type="radio"
                                checked={donorHasValidCofA === false}
                                onChange={() => setDonorHasValidCofA(false)}
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                              />
                              <label htmlFor="cofaNo" className="ml-3 block text-sm font-medium text-gray-700">
                                No
                              </label>
                            </div>
                          </div>
                          {errors.donorHasValidCofA && (
                            <p className="mt-1 text-sm text-red-600">{errors.donorHasValidCofA}</p>
                          )}
                        </fieldset>
                      </div>
                    </div>
                  </div>

                  <div className="py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Request Details</h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                          Reason for Robbing
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., AOG at Jakarta"
                            className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.reason ? 'border-red-300' : ''
                            }`}
                          />
                          {errors.reason && (
                            <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <div className="mt-1">
                          <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="workOrderNumber" className="block text-sm font-medium text-gray-700">
                          Work Order Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="workOrderNumber"
                            value={workOrderNumber}
                            onChange={(e) => setWorkOrderNumber(e.target.value)}
                            placeholder="e.g., WO.4491076"
                            className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.workOrderNumber ? 'border-red-300' : ''
                            }`}
                          />
                          {errors.workOrderNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.workOrderNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Component Information</h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="componentDescription" className="block text-sm font-medium text-gray-700">
                          Component Description
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="componentDescription"
                            value={componentDescription}
                            onChange={(e) => setComponentDescription(e.target.value)}
                            className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.componentDescription ? 'border-red-300' : ''
                            }`}
                          />
                          {errors.componentDescription && (
                            <p className="mt-1 text-sm text-red-600">{errors.componentDescription}</p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="componentPartNumber" className="block text-sm font-medium text-gray-700">
                          Part Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="componentPartNumber"
                            value={componentPartNumber}
                            onChange={(e) => setComponentPartNumber(e.target.value)}
                            className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.componentPartNumber ? 'border-red-300' : ''
                            }`}
                          />
                          {errors.componentPartNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.componentPartNumber}</p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="componentSerialNumber" className="block text-sm font-medium text-gray-700">
                          Serial Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="componentSerialNumber"
                            value={componentSerialNumber}
                            onChange={(e) => setComponentSerialNumber(e.target.value)}
                            className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.componentSerialNumber ? 'border-red-300' : ''
                            }`}
                          />
                          {errors.componentSerialNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.componentSerialNumber}</p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="componentAtaChapter" className="block text-sm font-medium text-gray-700">
                          ATA Chapter
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="componentAtaChapter"
                            value={componentAtaChapter}
                            onChange={(e) => setComponentAtaChapter(e.target.value)}
                            className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.componentAtaChapter ? 'border-red-300' : ''
                            }`}
                          />
                          {errors.componentAtaChapter && (
                            <p className="mt-1 text-sm text-red-600">{errors.componentAtaChapter}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 px-4 py-4 flex justify-end border-t border-gray-200">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Create Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
