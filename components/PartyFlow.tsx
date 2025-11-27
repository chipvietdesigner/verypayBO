import React from 'react';
import { PartyDetails, MoneyValue } from '../types';
import { IconWallet, IconFlow } from './Icons';

interface Props {
  payer: PartyDetails;
  payee: PartyDetails;
}

const formatMoney = (mv: MoneyValue) => {
  return new Intl.NumberFormat('en-UG', { style: 'currency', currency: mv.currency }).format(mv.amount);
};

const PartyCard: React.FC<{ title: string; data: PartyDetails; type: 'payer' | 'payee' }> = ({ title, data, type }) => {
  const isPayer = type === 'payer';
  
  return (
    <div className={`flex-1 rounded-xl border ${isPayer ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50/50'} p-5`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
           <span className={`w-2 h-2 rounded-full ${isPayer ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
           {title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded cursor-pointer hover:bg-blue-100">
          <IconWallet />
          <span className="   max-w-[100px] truncate">{data.walletId}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Amount</span>
          <span className="font-medium text-slate-900">{formatMoney(data.amount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Processing Fee</span>
          <span className="text-slate-700">{formatMoney(data.fee)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Fixed Charge</span>
          <span className="text-slate-700">{formatMoney(data.fixedFee)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Percentage ({data.percentageFee})</span>
          <span className="text-slate-400 italic">Included</span>
        </div>
      </div>

      <div className={`mt-6 pt-4 border-t border-dashed border-slate-300 flex justify-between items-center ${isPayer ? 'bg-indigo-50/30 -mx-5 -mb-5 px-5 py-4 rounded-b-xl' : 'bg-emerald-50/30 -mx-5 -mb-5 px-5 py-4 rounded-b-xl'}`}>
        <span className="text-sm font-bold text-slate-700 uppercase">Total {isPayer ? 'Debited' : 'Credited'}</span>
        <span className={`text-lg font-bold ${isPayer ? 'text-indigo-700' : 'text-emerald-700'}`}>
          {formatMoney(data.total)}
        </span>
      </div>
    </div>
  );
};

const PartyFlow: React.FC<Props> = ({ payer, payee }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Transaction Flow Breakdown</h2>
      <div className="flex flex-col md:flex-row gap-4 relative">
        <PartyCard title="Payer (Source)" data={payer} type="payer" />
        
        {/* Visual Connector for Desktop */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white border border-slate-200 p-2 rounded-full shadow-sm text-slate-400">
           <IconFlow />
        </div>

        <PartyCard title="Payee (Destination)" data={payee} type="payee" />
      </div>
    </div>
  );
};

export default PartyFlow;
