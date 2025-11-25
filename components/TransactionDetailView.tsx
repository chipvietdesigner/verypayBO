import React from 'react';
import TransactionInfo from './TransactionInfo';
import FundsFlowVisualizer from './FundsFlowVisualizer';
import LedgerTable from './LedgerTable';
import { IconBack, IconLocation, IconCopy } from './Icons';
import { TransactionData, TransactionStatus } from '../types';

interface Props {
  data: TransactionData;
  onBack: () => void;
}

const TransactionDetailView: React.FC<Props> = ({ data, onBack }) => {
  return (
    <div className="p-4 max-w-[1920px] mx-auto">
      {/* Breadcrumbs */}
      <div className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-2">
         <span onClick={onBack} className="cursor-pointer hover:text-slate-900 hover:underline">Transactions</span> 
         <span className="text-slate-300">/</span> 
         <span className="text-slate-900">{data.reference}</span>
      </div>

      {/* Header with Metadata */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 mb-4">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <button 
                onClick={onBack}
                className="p-1.5 hover:bg-slate-50 border border-slate-200 shadow-sm rounded text-slate-600 transition-colors"
               >
                 <IconBack />
               </button>
               <div>
                  <div className="flex items-center gap-3">
                     <h1 className="text-xl font-bold text-slate-900 leading-none">Payment</h1>
                     <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border ${
                        data.status === TransactionStatus.APPROVED 
                        ? 'border-emerald-200 text-emerald-700 bg-emerald-50' 
                        : 'border-red-200 text-red-700 bg-red-50'
                     }`}>
                        {data.status === TransactionStatus.DECLINED ? 'Declined' : 'Approved'}
                     </span>
                  </div>
               </div>
            </div>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-600">
                <div className="flex flex-col gap-0.5">
                   <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Ref Number</span>
                   <div className="flex items-center gap-1 font-mono font-medium">
                      {data.reference}
                      <IconCopy className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                   </div>
                </div>

                <div className="w-px h-8 bg-slate-100 hidden md:block"></div>

                <div className="flex flex-col gap-0.5">
                   <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Creation Date</span>
                   <span className="font-medium">{data.creationDate}</span>
                </div>

                <div className="w-px h-8 bg-slate-100 hidden md:block"></div>

                <div className="flex flex-col gap-0.5">
                   <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Location</span>
                   <span className="flex items-center gap-1 text-red-500 font-medium cursor-pointer hover:underline">
                      <IconLocation /> {data.location}
                   </span>
                </div>
            </div>
         </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-2">
        
        {/* Main Info */}
        <div className="xl:col-span-12 flex flex-col gap-4">
           <TransactionInfo data={data} />
           
           <FundsFlowVisualizer 
              payer={data.payer}
              payee={data.payee}
              grossAmount={data.grossAmount}
              fee={{ currency: 'UGX', amount: 10 }} // Hardcoded fee for demo based on mock
              netAmount={data.amount}
           />
        </div>

      </div>

      {/* Ledger */}
      <div className="mb-2">
         <LedgerTable entries={data.ledger} />
      </div>

    </div>
  );
};

export default TransactionDetailView;