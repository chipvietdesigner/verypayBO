
import React from 'react';
import { IconCheckCircle } from './Icons';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: any; // Ideally strictly typed, using any for rapid integration
}

export const ReviewInvoiceModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onConfirm, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 text-center bg-white">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Review Invoice Template</h2>
          <p className="text-sm text-slate-500 mt-1">Your invoice template is ready. Please review the details below.</p>
        </div>
        
        <div className="p-6 overflow-y-auto bg-slate-50/50">
           <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6">
              
              {/* Header Info Grid */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
                 <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                    <span className="font-bold text-slate-700">Type:</span>
                    <span className="text-slate-600">{data.invoiceType}</span>
                 </div>
                 <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                    <span className="font-bold text-slate-700">Issue type:</span>
                    <span className="text-slate-600">{data.issueType}</span>
                 </div>
                 <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                    <span className="font-bold text-slate-700">Issuer:</span>
                    <span className="text-slate-600">VeryPay UGANDA</span>
                 </div>
                 <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                    <span className="font-bold text-slate-700">Issue date:</span>
                    <span className="text-slate-600">{new Date().toLocaleDateString('en-GB')}</span>
                 </div>
                 <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                    <span className="font-bold text-slate-700">Recipients:</span>
                    <span className="text-blue-600 truncate max-w-[150px]">{data.recipient || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                    <span className="font-bold text-slate-700">Payment terms:</span>
                    <span className="text-slate-600">{data.paymentTerms || 0} days</span>
                 </div>
                 <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                    <span className="font-bold text-slate-700">Created by:</span>
                    <span className="text-slate-600">Nguyễn Nam</span>
                 </div>
              </div>

              {/* Description Preview */}
              <div className="text-sm text-slate-500 italic border-l-2 border-slate-200 pl-3 py-1 bg-slate-50/50 rounded-r">
                 {data.description || "No description provided."}
              </div>

              {/* Items Table Preview */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                 <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Invoice items
                 </div>
                 <table className="w-full text-left text-sm">
                    <thead className="bg-white border-b border-slate-100 text-xs text-slate-400">
                       <tr>
                          <th className="px-4 py-2 font-medium">Description</th>
                          <th className="px-4 py-2 font-medium text-right">Unit price</th>
                          <th className="px-4 py-2 font-medium text-right">Qty</th>
                          <th className="px-4 py-2 font-medium text-right">Price</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {data.lineItems && data.lineItems.length > 0 ? (
                          data.lineItems.map((item: any) => (
                             <tr key={item.id}>
                                <td className="px-4 py-2 text-slate-700">{item.description || 'Item'}</td>
                                <td className="px-4 py-2 text-right text-slate-600">{item.unitPrice?.toLocaleString()} UGX</td>
                                <td className="px-4 py-2 text-right text-slate-600">{item.quantity}</td>
                                <td className="px-4 py-2 text-right font-bold text-slate-800">
                                   {((item.unitPrice * item.quantity) + (item.fee || 0) + (item.tax || 0) - (item.discount || 0)).toLocaleString()} UGX
                                </td>
                             </tr>
                          ))
                       ) : (
                          <tr>
                             <td colSpan={4} className="px-4 py-4 text-center text-slate-400 italic text-xs">No items added</td>
                          </tr>
                       )}
                    </tbody>
                 </table>
                 <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
                    <div className="flex justify-end gap-8 text-xs text-slate-500">
                       <div className="flex justify-between w-32">
                          <span>Total fee:</span>
                          <span>{data.totals?.totalFee?.toLocaleString()} UGX</span>
                       </div>
                       <div className="flex justify-between w-32">
                          <span>Total tax:</span>
                          <span>{data.totals?.totalTax?.toLocaleString()} UGX</span>
                       </div>
                       <div className="flex justify-between w-40 font-bold text-slate-900">
                          <span>Invoice amount:</span>
                          <span>{data.totals?.finalAmount?.toLocaleString()} UGX</span>
                       </div>
                    </div>
                 </div>
              </div>

              {data.allowPartial && (
                 <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50 border border-blue-100 p-2 rounded">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Recipients are allowed to make partial payments for this invoice.
                 </div>
              )}

           </div>
        </div>

        <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white">
           <button 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
           >
              Go back to edit
           </button>
           <button 
              onClick={onConfirm}
              className="px-6 py-2.5 text-sm font-bold text-white bg-black hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
           >
              Create invoice template
           </button>
        </div>
      </div>
    </div>
  );
};

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessInvoiceModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <IconCheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Success!</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
             Invoice template has been created successfully. You can now use this template to issue invoices to your students.
          </p>
          <button 
             onClick={onClose}
             className="w-full py-3 text-sm font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition-colors shadow-sm"
          >
             Close
          </button>
       </div>
    </div>
  );
};
