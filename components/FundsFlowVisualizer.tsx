
import React, { useState } from 'react';
import { PartyDetails, MoneyValue, TransactionStatus } from '../types';
import { IconWallet, IconBuilding, IconChevronDown, IconCheckCircle, IconArrowRight, IconMinusCircle, IconPlusCircle, IconXCircle } from './Icons';

interface Props {
  payer: PartyDetails;
  payee: PartyDetails;
  grossAmount: MoneyValue;
  fee: MoneyValue;
  netAmount: MoneyValue;
  transactionType?: string;
  status?: TransactionStatus;
}

const formatMoney = (mv: MoneyValue) => {
  return `${mv.currency} ${mv.amount.toLocaleString()}`;
};

const FlowStep = ({ 
  title, 
  amount, 
  type, 
  details,
  isFailed
}: { 
  title: string; 
  amount: string; 
  type: 'in' | 'out' | 'fee';
  details?: React.ReactNode;
  isFailed?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Neutral logic: White background, slate border. Colors reserved for icons/text if needed.
  let bgClass = 'bg-white border-slate-200 hover:border-slate-300';
  let iconColor = 'text-slate-400'; 
  let Icon = IconCheckCircle;

  if (isFailed) {
      bgClass = 'bg-white border-red-200 hover:border-red-300 ring-1 ring-red-50';
      iconColor = 'text-red-600';
      Icon = IconXCircle;
  } else {
      // Use subtle colors for icons only to distinguish types, but keep containers neutral
      iconColor = 'text-emerald-600';
      Icon = IconCheckCircle;
  }

  return (
    <div className={`relative border rounded-lg p-3 transition-all ${bgClass} mb-3 last:mb-0 shadow-sm`}>
      {/* Connector Line */}
      <div className="absolute left-1/2 -top-4 w-px h-4 bg-slate-300 -z-10 last:hidden"></div>

      <div className="flex justify-between items-start cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          <div>
            <div className={`text-sm font-bold ${isFailed ? 'text-red-700' : 'text-slate-800'}`}>{title}</div>
            <div className={`text-[10px] font-medium mt-0.5 ${isFailed ? 'text-red-500' : 'text-slate-500'}`}>
                {isFailed ? 'Failed' : 'Processed'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold ${isFailed ? 'text-red-600 line-through decoration-red-400' : (type === 'fee' ? 'text-red-600' : 'text-slate-900')}`}>
            {type === 'fee' ? '-' : ''}{amount}
          </div>
          {details && (
             <button className="text-[10px] text-slate-500 flex items-center justify-end gap-1 w-full mt-1 hover:text-slate-700 font-medium">
                Details <IconChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
             </button>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      {isExpanded && details && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
          {details}
        </div>
      )}
    </div>
  );
};

const PartyCard = ({ 
  label, 
  walletId, 
  amount, 
  isSource 
}: { 
  label: string; 
  walletId: string; 
  amount: string; 
  isSource: boolean;
}) => (
  <div className={`flex flex-col h-full rounded-xl border border-slate-200 bg-white p-5 relative overflow-hidden shadow-sm`}>
    <div className={`absolute top-0 left-0 w-full h-1 ${isSource ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
    
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xs font-bold text-slate-600 mb-1">{label}</h3>
        <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 border border-slate-100 px-2 py-1 rounded">
          <IconWallet className="w-3.5 h-3.5 text-slate-400" />
          <span className="   text-xs font-medium">{walletId}</span>
        </div>
      </div>
      <div className={`p-2 rounded-full bg-slate-50 text-slate-500`}>
        <IconBuilding className="w-5 h-5" />
      </div>
    </div>

    <div className="mt-auto">
      <div className="flex justify-between items-end border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-600 font-semibold">{isSource ? 'Total Debited' : 'Total Credited'}</span>
        <span className={`text-xl font-bold    ${isSource ? 'text-indigo-700' : 'text-emerald-700'}`}>
          {amount}
        </span>
      </div>
    </div>
  </div>
);

const FundsFlowVisualizer: React.FC<Props> = ({ payer, payee, grossAmount, fee, netAmount, transactionType, status }) => {
  
  // Use simplified 2-step flow for Payments, Withdrawals, and Merchant Payments
  const isSimpleFlow = ['Payment', 'Withdrawal', 'Merchant Payment'].includes(transactionType || '');
  const isFailed = status === TransactionStatus.FAILED;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          Funds flow
        </h3>
        <div className="text-xs text-slate-500 font-medium">
          Ref: <span className="   text-slate-700">Ledger</span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Source */}
          <div className="lg:col-span-3">
            <PartyCard 
              label="Source (Payer)" 
              walletId={payer.walletId} 
              amount={formatMoney(grossAmount)} 
              isSource={true} 
            />
          </div>

          {/* Center: Processing Engine (The Bridge) */}
          <div className="lg:col-span-6 flex flex-col justify-center relative">
            {/* Visual Arrow Background */}
            <div className="absolute top-1/2 left-0 w-full h-px border-t border-dashed border-slate-200 -z-10 hidden lg:block"></div>
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 hidden lg:block text-slate-300">
               <IconArrowRight className="w-6 h-6" />
            </div>

            <div className="space-y-4 p-2">
              
              {/* CONDITIONAL FLOW RENDERING */}
              {isSimpleFlow ? (
                  // Simplified 2-Step Flow for Payments/Withdrawals
                  <>
                     <FlowStep 
                        title="1. Request" 
                        amount={formatMoney(grossAmount)} 
                        type="in"
                        details={
                          <div className="space-y-2">
                             <div className="flex justify-between">
                                <span className="text-slate-500">Method:</span>
                                <span className="font-medium text-slate-800">
                                    {transactionType === 'Withdrawal' ? 'Withdrawal Request' : 'External Transfer'}
                                </span>
                             </div>
                          </div>
                        }
                      />
                      
                      <FlowStep 
                        title="2. Transfer" 
                        amount={formatMoney(netAmount)} 
                        type="out"
                        isFailed={isFailed} // If failed, usually fails at transfer
                        details={
                          <div className="space-y-2">
                             <div className="flex justify-between">
                                <span className="text-slate-500">Provider:</span>
                                <span className="font-medium text-slate-800">VeryPay Internal</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500">To Account:</span>
                                <span className="text-slate-600">{payee.walletId}</span>
                             </div>
                          </div>
                        }
                      />
                  </>
              ) : (
                  // Standard 3-Step Flow for other transactions
                  <>
                      {/* Step 1: Collection */}
                      <FlowStep 
                        title="1. Collection" 
                        amount={formatMoney(grossAmount)} 
                        type="in"
                        isFailed={isFailed} // If failed, usually fails at collection for Funds In
                        details={
                          <div className="space-y-2">
                             <div className="flex justify-between">
                                <span className="text-slate-500">Provider:</span>
                                <span className="font-medium text-slate-800">Yo! Payments</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500">Method:</span>
                                <span className="font-medium text-slate-800">Mobile Money (External)</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500">Intermediate Acc:</span>
                                <span className="   text-slate-600">VeryPay OVA</span>
                             </div>
                          </div>
                        }
                      />

                      {/* Step 2: Fees */}
                      <FlowStep 
                        title="2. Fee Deduction" 
                        amount={formatMoney(fee)} 
                        type="fee"
                        details={
                           <div className="space-y-2">
                             <div className="flex justify-between">
                                <span className="text-slate-500">Processing Fee:</span>
                                <span className="   text-red-600">{formatMoney(fee)}</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500">Recipient:</span>
                                <span className="   text-slate-600">25611000000002</span>
                             </div>
                          </div>
                        }
                      />

                      {/* Step 3: Disbursement */}
                      <FlowStep 
                        title="3. Disbursement" 
                        amount={formatMoney(netAmount)} 
                        type="out"
                        details={
                          <div className="space-y-2">
                             <div className="flex justify-between">
                                <span className="text-slate-500">Provider:</span>
                                <span className="font-medium text-slate-800">VeryPay Internal</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500">From Account:</span>
                                <span className="   text-slate-600">VeryPay OVA</span>
                             </div>
                          </div>
                        }
                      />
                  </>
              )}

            </div>
          </div>

          {/* Right: Destination */}
          <div className="lg:col-span-3">
             <PartyCard 
              label="Destination (Payee)" 
              walletId={payee.walletId} 
              amount={formatMoney(netAmount)} 
              isSource={false} 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default FundsFlowVisualizer;
