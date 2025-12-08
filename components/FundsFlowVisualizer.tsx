
import React, { useState } from 'react';
import { PartyDetails, MoneyValue, TransactionStatus, TransactionData } from '../types';
import { IconWallet, IconBuilding, IconChevronDown, IconCheckCircle, IconArrowRight, IconMinusCircle, IconPlusCircle, IconXCircle } from './Icons';

interface Props {
  transactionData: TransactionData;
}

const formatMoney = (mv: MoneyValue) => {
  return `${mv.currency} ${mv.amount.toLocaleString()}`;
};

const FlowStep = ({ 
  title, 
  amount, 
  type, 
  details,
  isFailed,
  icon: CustomIcon
}: { 
  title: string; 
  amount: string; 
  type: 'in' | 'out' | 'fee' | 'transfer';
  details?: React.ReactNode;
  isFailed?: boolean;
  icon?: React.ElementType;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Neutral logic: White background, slate border.
  let bgClass = 'bg-white border-slate-200 hover:border-slate-300';
  let iconColor = 'text-slate-400'; 
  let Icon = CustomIcon || IconCheckCircle;

  if (isFailed) {
      bgClass = 'bg-white border-red-200 hover:border-red-300 ring-1 ring-red-50';
      iconColor = 'text-red-600';
      Icon = IconXCircle;
  } else {
      iconColor = type === 'in' ? 'text-emerald-600' : type === 'fee' ? 'text-amber-600' : 'text-blue-600';
      Icon = type === 'in' ? IconPlusCircle : type === 'fee' ? IconMinusCircle : IconCheckCircle;
  }

  return (
    <div className={`relative border rounded-lg p-3 transition-all ${bgClass} mb-3 last:mb-0 shadow-sm`}>
      {/* Connector Line */}
      <div className="absolute left-1/2 -top-4 w-px h-4 bg-slate-300 -z-10 last:hidden"></div>

      <div className="flex justify-between items-start">
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
        </div>
      </div>

      {/* Details Toggle */}
      {details && (
          <div className="mt-2">
             {isExpanded && (
                <div className="pt-2 border-t border-slate-100 text-xs mb-2 animate-in slide-in-from-top-1">
                   {details}
                </div>
             )}
             <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 py-1 rounded transition-colors font-medium uppercase tracking-wide"
             >
                {isExpanded ? 'Show less' : 'Details'}
                <IconChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
             </button>
          </div>
      )}
    </div>
  );
};

const PartyCard = ({ 
  label, 
  walletId, 
  amount,        
  fee,           
  total,
  isSource 
}: { 
  label: string; 
  walletId: string; 
  amount: MoneyValue; 
  fee: MoneyValue;
  total: MoneyValue;
  isSource: boolean;
}) => (
  <div className={`flex flex-col h-full rounded-xl border border-slate-200 bg-white p-5 relative overflow-hidden shadow-sm`}>
    <div className={`absolute top-0 left-0 w-full h-1 ${isSource ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
    
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xs font-bold text-slate-600 mb-1">{label}</h3>
        <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 border border-slate-100 px-2 py-1 rounded">
          <IconWallet className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium">{walletId}</span>
        </div>
      </div>
    </div>

    <div className="mt-auto space-y-2 border-t border-slate-100 pt-3">
       {/* Amount Line */}
       <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">Amount</span>
          <span className="font-medium text-slate-900">{formatMoney(amount)}</span>
       </div>
       {/* Fee Line */}
       <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">Fee</span>
          <span className="font-medium text-slate-900">{formatMoney(fee)}</span>
       </div>
       {/* Total Line */}
       <div className="flex justify-between items-center pt-2 border-t border-slate-100">
         <span className="text-xs text-slate-600 font-bold uppercase">
            Total {isSource ? 'Debited' : 'Credited'}
         </span>
         <span className={`text-lg font-bold ${isSource ? 'text-indigo-700' : 'text-emerald-700'}`}>
           {formatMoney(total)}
         </span>
      </div>
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="flex justify-between py-1 border-b border-slate-50 last:border-0">
        <span className="text-slate-500">{label}:</span>
        <span className="font-medium text-slate-800 text-right max-w-[180px] truncate">{value}</span>
    </div>
);

const FundsFlowVisualizer: React.FC<Props> = ({ transactionData }) => {
  
  const { type, status, payer, payee, grossAmount, amount: netAmount, requestAmount, providerReference, reference, creationDate, completedDate, message, paymentMethod } = transactionData;
  const isFailed = status === TransactionStatus.FAILED;

  // Logic to determine Flow Layout
  const isPaymentLike = ['Payment', 'Withdrawal', 'Pre-funded', 'Deactivation Transfer', 'Merchant Payment'].includes(type);
  const isFundsIn = type === 'Funds in';
  const isWalletTopUp = type === 'Wallet Top Up';
  const isFundsOut = type === 'Funds out';

  // Common Details Block
  const getCommonDetails = (provider: string) => (
      <div className="space-y-1">
         <DetailRow label="Provider" value={provider} />
         <DetailRow label="Provider Ref" value={providerReference || '--'} />
         <DetailRow label="From" value={payer.walletId} />
         <DetailRow label="To" value={payee.walletId} />
         <DetailRow label="Created" value={creationDate} />
         <DetailRow label="Completed" value={completedDate || '--'} />
         <DetailRow label="Ref ID" value={reference} />
         <DetailRow label="Message" value={message} />
      </div>
  );

  // Fee amount for displaying in flow
  // We use specific payer or payee fee depending on the transaction type logic.
  // Generally, if Payer Fee > 0, it's displayed (Funds In, Top Up). If Payee Fee > 0 (Funds Out), displayed.
   

  const feeDisplay = { currency: payer.fee.currency, amount: Math.floor(payer.fee.amount + payee.fee.amount)}; 
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          Funds flow
        </h3>
        <div className="text-xs text-slate-500 font-medium">
          Ref: <span className="text-slate-700">Ledger</span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Source */}
          <div className="lg:col-span-3">
            <PartyCard 
              label="Source (Payer)" 
              walletId={payer.walletId} 
              amount={payer.amount} // Nominal Amount
              fee={payer.fee}
              total={payer.total}   // Gross Amount (Debited)
              isSource={true} 
            />
          </div>

          {/* Center: Processing Engine */}
          <div className="lg:col-span-6 flex flex-col justify-center relative">
            <div className="absolute top-1/2 left-0 w-full h-px border-t border-dashed border-slate-200 -z-10 hidden lg:block"></div>
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 hidden lg:block text-slate-300">
               <IconArrowRight className="w-6 h-6" />
            </div>

            <div className="space-y-4 p-2 relative z-10">
              
              {/* 1. PAYMENT / WITHDRAWAL FLOW (2 Steps) */}
              {isPaymentLike && (
                  <>
                     <FlowStep 
                        title={`Request amount: ${formatMoney(requestAmount)}`}
                        amount=""
                        type="in"
                      />
                      {/* IMPORTANT: Transfer step uses nominal amount (payer.amount), NOT net amount */}
                      <FlowStep 
                        title={`Transfer ${formatMoney(payer.amount)}`} 
                        amount={formatMoney(payer.amount)} 
                        type="out"
                        isFailed={isFailed}
                        details={getCommonDetails('VeryPay Internal')}
                      />
                  </>
              )}

              {/* 2. WALLET TOP UP / FUNDS IN (3 Steps: Collect -> Fee -> Disburse) */}
              {(isWalletTopUp || isFundsIn) && (
                  <>
                      <FlowStep 
                        title={`Collect ${formatMoney(grossAmount)}`}
                        amount={formatMoney(grossAmount)} 
                        type="in"
                        isFailed={isFailed}
                        details={
                           <div className="space-y-1">
                             <DetailRow label="Provider" value="Yo! Payments" />
                             <DetailRow label="Method" value="Mobile Money" />
                             <DetailRow label="Intermediate" value="VeryPay OVA" />
                             <DetailRow label="Ref" value={providerReference} />
                           </div>
                        }
                      />
                      <FlowStep 
                        title={`Fee ${(feeDisplay)}`}
                        amount={formatMoney(feeDisplay)} 
                        type="fee"
                        details={
                           <div className="space-y-1">
                             <DetailRow label="Fee Account" value="25611000002" />
                             <DetailRow label="Type" value="Processing Fee" />
                           </div>
                        }
                      />
                      <FlowStep 
                        title={`Disburse ${formatMoney(netAmount)}`}
                        amount={formatMoney(netAmount)} 
                        type="out"
                        details={
                          <div className="space-y-1">
                             <DetailRow label="From" value="VeryPay OVA" />
                             <DetailRow label="To" value={payee.walletId} />
                          </div>
                        }
                      />
                  </>
              )}

              {/* 3. FUNDS OUT (3 Steps: Collect -> Disburse -> Fee) */}
              {isFundsOut && (
                  <>
                      <FlowStep 
                        title={`Collect ${formatMoney(grossAmount)}`}
                        amount={formatMoney(grossAmount)} 
                        type="in"
                        details={
                           <div className="space-y-1">
                             <DetailRow label="Source" value="Internal Account" />
                           </div>
                        }
                      />
                      <FlowStep 
                        title={`Disburse ${formatMoney(netAmount)}`}
                        amount={formatMoney(netAmount)} 
                        type="out"
                        isFailed={isFailed}
                        details={getCommonDetails(paymentMethod)}
                      />
                       <FlowStep 
                        title={`Fee ${formatMoney(feeDisplay)}`}
                        amount={formatMoney(feeDisplay)} 
                        type="fee"
                        details={
                           <div className="space-y-1">
                             <DetailRow label="Fee Account" value="Fee Wallet" />
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
              amount={payee.amount} // Nominal Amount
              fee={payee.fee}
              total={payee.total}   // Net Amount (Credited)
              isSource={false} 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default FundsFlowVisualizer;
