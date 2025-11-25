import React from 'react';
import { MoneyValue } from '../types';
import { IconPOS, IconMethod, IconCopy } from './Icons';

interface Props {
  gross: MoneyValue;
  net: MoneyValue;
  posId: string;
  paymentMethod: string;
  message: string;
}

const formatMoney = (mv: MoneyValue) => {
  return new Intl.NumberFormat('en-UG', { style: 'currency', currency: mv.currency }).format(mv.amount);
};

const FinancialSummary: React.FC<Props> = ({ gross, net, posId, paymentMethod, message }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Primary Figures */}
      <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
        <div className="relative z-10">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Gross Amount</h3>
          <p className="text-3xl font-bold text-slate-900">{formatMoney(gross)}</p>
        </div>
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-100 flex justify-between items-end">
          <div>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Net Settled</h3>
            <p className="text-xl font-semibold text-emerald-600">{formatMoney(net)}</p>
          </div>
          <div className="text-right">
             <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Success</span>
             <p className="text-xs text-slate-400 mt-1 italic">{message}</p>
          </div>
        </div>
      </div>

      {/* Meta Details */}
      <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-0 flex flex-col divide-y divide-slate-100">
         <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <IconPOS />
               </div>
               <div>
                  <p className="text-xs text-slate-500 font-medium">POS Terminal ID</p>
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">{posId}</a>
               </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600"><IconCopy /></button>
         </div>

         <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <IconMethod />
               </div>
               <div>
                  <p className="text-xs text-slate-500 font-medium">Payment Method</p>
                  <p className="text-sm font-semibold text-slate-700">{paymentMethod}</p>
               </div>
            </div>
         </div>
         
         <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
             <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-medium">Remark</span>
                <span className="text-sm text-slate-400">--</span>
             </div>
             <div className="flex flex-col text-right">
                <span className="text-xs text-slate-500 font-medium">Service Type</span>
                <span className="text-sm text-slate-400">--</span>
             </div>
         </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
