
import React, { useState } from 'react';
import { 
  IconFilePlus, 
  IconArrowRight, 
  IconUser, 
  IconUserPlus, 
  IconCalendarClock, 
  IconPercent, 
  IconPlusCircle, 
  IconTrash,
  IconChevronDown,
  IconBack,
  IconAlertCircle,
  IconFileText,
  IconEdit
} from './Icons';
import { ReviewInvoiceModal, SuccessInvoiceModal } from './InvoiceModals';

interface Props {
  onCancel: () => void;
}

type InvoiceType = 'Subscription' | 'Services or Products';

interface LineItem {
  id: number;
  description: string;
  unitPrice: number;
  quantity: number;
  fee: number;
  discount: number;
  tax: number;
}

const IssueInvoiceFlow: React.FC<Props> = ({ onCancel }) => {
  const [step, setStep] = useState<1 | 2>(1);
  
  // Form State
  const [invoiceName, setInvoiceName] = useState('');
  const [invoiceType, setInvoiceType] = useState<InvoiceType | null>(null);
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');
  const [issueType, setIssueType] = useState('Immediately');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [reminder, setReminder] = useState('');
  const [allowPartial, setAllowPartial] = useState(false);
  
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  
  // Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Step 1: Selection Handlers
  const handleSelectType = (type: InvoiceType) => {
    setInvoiceType(type);
  };

  const canProceedToStep2 = invoiceName.trim().length > 0 && invoiceType !== null;

  // Step 2: Line Item Handlers
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now(),
      description: '',
      unitPrice: 0,
      quantity: 1,
      fee: 0,
      discount: 0,
      tax: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: number) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: number, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Calculations
  const calculateTotals = () => {
    let totalFee = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let subtotal = 0;

    lineItems.forEach(item => {
      const itemTotal = item.unitPrice * item.quantity;
      subtotal += itemTotal;
      totalFee += item.fee;
      totalDiscount += item.discount;
      totalTax += item.tax;
    });

    const finalAmount = subtotal + totalFee + totalTax - totalDiscount;

    return { totalFee, totalDiscount, totalTax, finalAmount };
  };

  const totals = calculateTotals();
  
  // Handlers for Flow
  const handleNextClick = () => {
     setShowReviewModal(true);
  };
  
  const handleConfirmCreate = () => {
     setShowReviewModal(false);
     // Here you would typically make an API call
     setTimeout(() => {
        setShowSuccessModal(true);
     }, 300);
  };
  
  const handleSuccessClose = () => {
     setShowSuccessModal(false);
     onCancel(); // Reset flow / go back to list
  };

  return (
    <div className="h-full flex flex-col font-sans bg-slate-50/30">
      
      {/* Review Modal */}
      <ReviewInvoiceModal 
         isOpen={showReviewModal}
         onClose={() => setShowReviewModal(false)}
         onConfirm={handleConfirmCreate}
         data={{
            invoiceName,
            invoiceType,
            description,
            recipient,
            issueType,
            paymentTerms,
            reminder,
            allowPartial,
            lineItems,
            totals
         }}
      />
      
      {/* Success Modal */}
      <SuccessInvoiceModal 
         isOpen={showSuccessModal}
         onClose={handleSuccessClose}
      />
      
      {/* Header Area */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
              <IconBack className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 group cursor-pointer">
               <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                 {step === 1 ? 'Create new invoice template' : (invoiceName || 'Untitled Invoice')}
               </h1>
               {step === 2 && <IconEdit className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {step === 1 ? 'Start by naming your invoice and selecting a type.' : `${invoiceType} • Draft`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors">
            Cancel
          </button>
          {step === 1 ? (
            <button 
              onClick={() => canProceedToStep2 && setStep(2)}
              disabled={!canProceedToStep2}
              className={`px-5 py-2 text-sm font-bold text-white rounded-md shadow-sm transition-all flex items-center gap-2 ${canProceedToStep2 ? 'bg-slate-900 hover:bg-black hover:shadow-md' : 'bg-slate-200 cursor-not-allowed'}`}
            >
              Next <IconArrowRight className="w-4 h-4" />
            </button>
          ) : (
             <button 
                onClick={handleNextClick}
                className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm transition-all flex items-center gap-2"
             >
              Next <IconArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* STEP 1: SELECTION */}
          {step === 1 && (
            <div className="space-y-8 max-w-2xl mx-auto pt-8">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Template name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Monthly Tuition Fee, Q3 Services" 
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all text-slate-900 placeholder:text-slate-400 bg-white shadow-sm"
                  value={invoiceName}
                  onChange={(e) => setInvoiceName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Type Selection Cards */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">What kind of invoice would you like to create?</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Subscription Card */}
                  <div 
                    onClick={() => handleSelectType('Subscription')}
                    className={`cursor-pointer relative group p-6 rounded-lg border transition-all duration-200 flex flex-col items-center text-center gap-3 ${invoiceType === 'Subscription' ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/20 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'}`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors shadow-sm ${invoiceType === 'Subscription' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-700'}`}>
                      <IconFilePlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold mb-1 ${invoiceType === 'Subscription' ? 'text-blue-700' : 'text-slate-900'}`}>Subscription</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">Recurring invoices for memberships, tuition, or regular services.</p>
                    </div>
                  </div>

                  {/* Services/Products Card */}
                  <div 
                    onClick={() => handleSelectType('Services or Products')}
                    className={`cursor-pointer relative group p-6 rounded-lg border transition-all duration-200 flex flex-col items-center text-center gap-3 ${invoiceType === 'Services or Products' ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/20 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'}`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors shadow-sm ${invoiceType === 'Services or Products' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-700'}`}>
                      <IconFilePlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold mb-1 ${invoiceType === 'Services or Products' ? 'text-blue-700' : 'text-slate-900'}`}>Services or Products</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">One-time invoices for itemized goods or specific project work.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Config Bar */}
              <div className="bg-white px-6 py-5 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                   <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <IconFilePlus className="w-3 h-3" /> Issue Type
                   </label>
                   <div className="relative">
                      <select 
                        className="w-full appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 text-sm rounded-md px-3 py-2 focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all cursor-pointer font-medium"
                        value={issueType}
                        onChange={(e) => setIssueType(e.target.value)}
                      >
                        <option value="Immediately">Immediately</option>
                        <option value="Scheduled">Scheduled</option>
                      </select>
                      <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <IconCalendarClock className="w-3 h-3" /> Payment Terms
                   </label>
                   <div className="flex items-center gap-2 group relative">
                      <input 
                        type="number" 
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 text-sm rounded-md px-3 py-2 focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all placeholder:text-slate-400 font-medium"
                        placeholder="0"
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                      />
                      <span className="text-xs text-slate-500 font-medium absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">days</span>
                   </div>
                </div>
                <div className="space-y-1.5">
                   <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <IconAlertCircle className="w-3 h-3" /> Reminder (Overdue)
                   </label>
                   <div className="relative">
                      <select 
                        className="w-full appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 text-sm rounded-md px-3 py-2 focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all cursor-pointer font-medium"
                        value={reminder}
                        onChange={(e) => setReminder(e.target.value)}
                      >
                         <option value="">Select...</option>
                         <option value="1">Every day</option>
                         <option value="3">Every 3 days</option>
                         <option value="7">Every week</option>
                      </select>
                      <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                   </div>
                </div>
              </div>

              {/* Description & Recipient */}
              <div className="space-y-5 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-800">Description</label>
                    <textarea 
                      className="w-full p-3 text-sm border border-slate-200 rounded-md bg-slate-50/50 text-slate-800 focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none min-h-[80px] resize-y placeholder:text-slate-400 transition-all"
                      placeholder="Enter a detailed description for this invoice..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-800">Who will receive this invoice?</label>
                    <div className="relative">
                       <IconUserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                       {/* Changed to Select Dropdown */}
                       <select
                          className="w-full pl-9 pr-8 py-2.5 text-sm border border-slate-200 rounded-md bg-slate-50/50 text-slate-800 focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all appearance-none cursor-pointer"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                       >
                          <option value="" disabled>Select a recipient...</option>
                          <option value="student_1">John Doe (Student - Class 5A)</option>
                          <option value="guardian_1">Jane Smith (Guardian)</option>
                          <option value="group_all">All Grade 5 Students</option>
                       </select>
                       <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
              </div>

              {/* Options */}
              <div className="bg-white px-6 py-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">Allow partial payment</span>
                    <span className="text-xs text-slate-500 mt-0.5">Recipients can pay this invoice in installments.</span>
                 </div>
                 <div 
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${allowPartial ? 'bg-slate-900' : 'bg-slate-200'}`}
                    onClick={() => setAllowPartial(!allowPartial)}
                 >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${allowPartial ? 'translate-x-5' : ''}`}></div>
                 </div>
              </div>

              {/* Line Items */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                 <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                       <IconFileText className="w-4 h-4 text-slate-500" />
                       Invoice Items
                    </h3>
                    <button 
                      onClick={addLineItem}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
                    >
                       <IconPlusCircle className="w-3.5 h-3.5 text-slate-500" /> Add Item
                    </button>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50/50 border-b border-slate-100">
                          <tr>
                             <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[35%] pl-8">Description</th>
                             <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Unit Price</th>
                             <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right w-[8%]">Qty</th>
                             <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Fee</th>
                             <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Discount</th>
                             <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Tax</th>
                             <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Total</th>
                             <th className="px-4 py-3 w-[50px]"></th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {lineItems.length === 0 ? (
                             <tr>
                                <td colSpan={8} className="px-6 py-12 text-center">
                                   <div className="flex flex-col items-center justify-center text-slate-400">
                                      <IconFilePlus className="w-8 h-8 mb-2 opacity-50" />
                                      <p className="text-sm font-medium text-slate-400">No items added yet</p>
                                      <button onClick={addLineItem} className="mt-2 text-xs text-blue-600 hover:text-blue-700 hover:underline font-semibold">Add your first item</button>
                                   </div>
                                </td>
                             </tr>
                          ) : (
                             lineItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                   <td className="px-4 py-2 pl-8">
                                      <input 
                                        type="text" 
                                        className="w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:ring-0 p-1 text-sm font-medium text-slate-900 placeholder:text-slate-300 transition-all"
                                        placeholder="Item name..."
                                        value={item.description}
                                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                      />
                                   </td>
                                   <td className="px-4 py-2">
                                      <input 
                                        type="number" 
                                        className="w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:ring-0 p-1 text-sm text-right text-slate-600 placeholder:text-slate-300 transition-all font-mono"
                                        placeholder="0"
                                        value={item.unitPrice || ''}
                                        onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                      />
                                   </td>
                                   <td className="px-4 py-2">
                                      <input 
                                        type="number" 
                                        className="w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:ring-0 p-1 text-sm text-right text-slate-600 transition-all font-mono"
                                        value={item.quantity}
                                        onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                      />
                                   </td>
                                   <td className="px-4 py-2 text-right text-sm text-slate-500 font-mono">{item.fee}</td>
                                   <td className="px-4 py-2 text-right text-sm text-slate-500 font-mono">{item.discount}</td>
                                   <td className="px-4 py-2 text-right text-sm text-slate-500 font-mono">{item.tax}</td>
                                   <td className="px-4 py-2 text-right text-sm font-bold text-slate-900 font-mono">
                                      {((item.unitPrice * item.quantity) + item.fee + item.tax - item.discount).toLocaleString()}
                                   </td>
                                   <td className="px-2 py-2 text-center">
                                      <button 
                                        onClick={() => removeLineItem(item.id)}
                                        className="text-slate-300 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                      >
                                         <IconTrash className="w-4 h-4" />
                                      </button>
                                   </td>
                                </tr>
                             ))
                          )}
                       </tbody>
                    </table>
                 </div>
                 
                 {/* Summary Footer */}
                 <div className="bg-slate-50/50 px-8 py-6 border-t border-slate-100">
                    <div className="flex flex-col gap-2 items-end text-sm">
                       <div className="flex justify-between w-56 text-slate-500">
                          <span>Total Fee:</span>
                          <span className="font-mono">{totals.totalFee.toLocaleString()} UGX</span>
                       </div>
                       <div className="flex justify-between w-56 text-slate-500">
                          <span>Total Discount:</span>
                          <span className="font-mono">-{totals.totalDiscount.toLocaleString()} UGX</span>
                       </div>
                       <div className="flex justify-between w-56 text-slate-500">
                          <span>Total Tax:</span>
                          <span className="font-mono">{totals.totalTax.toLocaleString()} UGX</span>
                       </div>
                       <div className="flex justify-between w-56 pt-3 mt-2 border-t border-slate-200 text-lg font-bold text-slate-900">
                          <span>Total:</span>
                          <span>{totals.finalAmount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">UGX</span></span>
                       </div>
                    </div>
                 </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default IssueInvoiceFlow;
