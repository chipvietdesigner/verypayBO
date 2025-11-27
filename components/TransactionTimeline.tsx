import React, { useState } from 'react';
import { IconSuccess, IconChevronDown, IconBuilding } from './Icons';

interface StepProps {
  title: React.ReactNode;
  content?: React.ReactNode;
  isLast?: boolean;
}

const TimelineStep: React.FC<StepProps> = ({ title, content, isLast }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative pl-6 pb-6 last:pb-0">
      {/* Line */}
      {!isLast && (
        <div className="absolute left-2.5 top-5 bottom-0 w-px border-l border-dashed border-slate-300"></div>
      )}
      
      {/* Icon */}
      <div className="absolute left-0 top-0.5 text-emerald-500 bg-white z-10 p-0.5">
        <IconSuccess />
      </div>

      {/* Content */}
      <div className="text-sm">
        <div className="font-semibold text-slate-900 mb-1 leading-tight">{title}</div>
        {content && (
           <div className="mt-1.5 text-slate-600">
             {content}
           </div>
        )}
      </div>
    </div>
  );
};

const TransactionTimeline = () => {
  const [showMoreCollect, setShowMoreCollect] = useState(false);
  const [showMoreFee, setShowMoreFee] = useState(false);
  const [showMoreDisburse, setShowMoreDisburse] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 h-full">
      <h3 className="text-sm font-bold text-slate-800 mb-4">Transaction details</h3>

      <div className="mt-1">
        {/* Step 1 */}
        <TimelineStep title="Request amount: UGX 1,000" />

        {/* Step 2 */}
        <TimelineStep 
          title="Collect UGX 990"
          content={
            <div className="bg-slate-50 rounded p-2.5 text-xs space-y-1.5 border border-slate-100">
               <div className="flex justify-between items-center">
                  <span className="text-slate-500">Provider</span>
                  <div className="flex items-center gap-1 font-bold text-indigo-800">
                    <span>Yo!</span>
                    <span>YO</span>
                  </div>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-500">From</span>
                  <span className="   text-slate-700">25056521346695</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-500">To</span>
                  <span className="text-slate-700">VeryPay OVA</span>
               </div>
               
               <button 
                  onClick={() => setShowMoreCollect(!showMoreCollect)}
                  className="w-full flex items-center justify-center gap-1 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 py-1 rounded transition-colors mt-1.5"
                >
                  <IconChevronDown className={`w-3 h-3 transition-transform ${showMoreCollect ? 'rotate-180' : ''}`} />
                  {showMoreCollect ? 'Show less' : 'Show more'}
               </button>
            </div>
          }
        />

        {/* Step 3 */}
        <TimelineStep 
          title="Fee UGX 10" 
          content={
            <div className="bg-slate-50 rounded p-2.5 text-xs space-y-1.5 border border-slate-100">
               <div className="flex justify-between items-center">
                  <span className="text-slate-500">Provider</span>
                   <div className="flex items-center gap-1 font-bold text-indigo-800">
                    <span>Yo!</span>
                    <span>YO</span>
                  </div>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-500">To</span>
                  <span className="   text-slate-700">25611000000002</span>
               </div>
               <button 
                  onClick={() => setShowMoreFee(!showMoreFee)}
                  className="w-full flex items-center justify-center gap-1 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 py-1 rounded transition-colors mt-1.5"
                >
                  <IconChevronDown className={`w-3 h-3 transition-transform ${showMoreFee ? 'rotate-180' : ''}`} />
                  {showMoreFee ? 'Show less' : 'Show more'}
               </button>
            </div>
          }
        />

        {/* Step 4 */}
        <TimelineStep 
          title="Disburse UGX 990" 
          isLast={true}
          content={
            <div className="bg-slate-50 rounded p-2.5 text-xs space-y-1.5 border border-slate-100">
               <div className="flex justify-between items-center">
                  <span className="text-slate-500">Provider</span>
                  <span className="font-bold text-red-600 flex items-center gap-1">
                     <IconBuilding /> VeryPay
                  </span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-500">From</span>
                  <span className="text-slate-700">VeryPay OVA</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-slate-500">To</span>
                  <span className="   text-slate-700">25056521346695</span>
               </div>
               <button 
                  onClick={() => setShowMoreDisburse(!showMoreDisburse)}
                  className="w-full flex items-center justify-center gap-1 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 py-1 rounded transition-colors mt-1.5"
                >
                  <IconChevronDown className={`w-3 h-3 transition-transform ${showMoreDisburse ? 'rotate-180' : ''}`} />
                  {showMoreDisburse ? 'Show less' : 'Show more'}
               </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default TransactionTimeline;