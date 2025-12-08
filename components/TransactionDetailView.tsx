
import React from 'react';
import TransactionInfo from './TransactionInfo';
import FundsFlowVisualizer from './FundsFlowVisualizer';
import LedgerTable from './LedgerTable';
import { IconBack } from './Icons';
import { TransactionData, TransactionStatus } from '../types';

interface Props {
  data: TransactionData;
  onBack: () => void;
}

const TransactionDetailView: React.FC<Props> = ({ data, onBack }) => {
  return (
    <div className="p-4 max-w-[1920px] mx-auto font-sans h-full flex flex-col">
      {/* 1. Compact Header Bar */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
         <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded text-slate-500 hover:text-slate-700 transition-all"
            >
              <IconBack className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col">
               <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Transactions / {data.reference}</span>
               </div>
               <div className="flex items-center gap-3">
                  <h1 className="text-lg font-bold text-slate-900 leading-none">{data.type}</h1>
                  <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider border ${
                      data.status === TransactionStatus.APPROVED 
                      ? 'border-emerald-200 text-emerald-700 bg-emerald-50' 
                      : data.status === TransactionStatus.PENDING
                      ? 'border-amber-200 text-amber-700 bg-amber-50'
                      : 'border-red-200 text-red-700 bg-red-50'
                   }`}>
                      {data.status}
                   </span>
               </div>
            </div>
         </div>
      </div>

      {/* 2. Content Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        
        {/* Compact Info Grid */}
        <TransactionInfo data={data} />
           
        {/* Visualizer - Passing full data object to ensure correct dynamic values */}
        <FundsFlowVisualizer transactionData={data} />

        {/* Ledger */}
        <div className="pb-6">
           <LedgerTable entries={data.ledger} />
        </div>

      </div>
    </div>
  );
};

export default TransactionDetailView;
