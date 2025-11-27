
import React from 'react';
import { TransactionData, TransactionStatus } from '../types';
import { IconCopy, IconLocation, IconCalendar, IconPOS, IconToken, IconClock, IconCheckCircle, IconAlertCircle, IconFileText, IconUser } from './Icons';

interface Props {
  data: TransactionData;
}

const InfoItem: React.FC<{ 
  label: string; 
  value: React.ReactNode; 
  icon?: React.ReactNode;
  isMono?: boolean;
  isCopyable?: boolean;
  highlight?: boolean;
  subValue?: string;
  className?: string;
}> = ({ label, value, icon, isMono, isCopyable, highlight, subValue, className }) => (
  <div className={`flex flex-col gap-1 px-4 py-3 border-r border-slate-100 last:border-r-0 ${className}`}>
    <dt className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-0.5 whitespace-nowrap">
      {icon} {label}
    </dt>
    <dd className="flex items-center justify-between gap-2 min-h-[20px]">
      <div className="flex flex-col min-w-0">
        <span className={`text-sm ${isMono ? 'font-mono' : 'font-medium'} ${highlight ? 'text-blue-600' : 'text-slate-900'} truncate`}>
          {value}
        </span>
        {subValue && <span className="text-xs text-slate-500 truncate">{subValue}</span>}
      </div>
      {isCopyable && <IconCopy className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600 flex-shrink-0" />}
    </dd>
  </div>
);

const TransactionInfo: React.FC<Props> = ({ data }) => {
  
  // Logic for Dynamic Time Field
  let timeLabel = 'Time info';
  let timeValue = '--';
  let timeIcon = <IconCalendar className="w-3 h-3" />;
  let timeSubValue = undefined;

  const isTerminalState = [
    TransactionStatus.APPROVED, 
    TransactionStatus.FAILED, 
    TransactionStatus.DECLINED
  ].includes(data.status);

  if (isTerminalState && data.completedDate) {
      timeLabel = 'Completion date';
      timeValue = data.completedDate;
      
      // Icon reflects the specific terminal state
      if (data.status === TransactionStatus.APPROVED) {
          timeIcon = <IconCheckCircle className="w-3 h-3 text-emerald-500" />;
      } else {
          timeIcon = <IconClock className="w-3 h-3 text-slate-500" />;
      }

  } else if (data.status === TransactionStatus.PENDING && data.expiryTime) {
      timeLabel = 'Expiry time';
      timeValue = data.expiryTime.split(' ')[0];
      timeSubValue = data.expiryTime.split(' ')[1];
      timeIcon = <IconClock className="w-3 h-3 text-amber-500" />;
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-4">
      
      {/* Row 1: Key Metadata (Dates & Refs) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 border-b border-slate-100">
         <InfoItem 
            label="Reference" 
            value={data.reference} 
            isMono 
            isCopyable 
            highlight 
         />
         <InfoItem 
            label="Creation date" 
            value={data.creationDate}
            icon={<IconCalendar className="w-3 h-3" />}
         />
         {/* Dynamic Time Field */}
         <InfoItem 
            label={timeLabel}
            value={timeValue}
            subValue={timeSubValue}
            icon={timeIcon}
         />
         <InfoItem 
            label="POS ID" 
            value={data.posId} 
            isMono 
            isCopyable
            icon={<IconPOS className="w-3 h-3" />}
         />
         <InfoItem 
            label="Token ID" 
            value={data.tokenId || '--'} 
            isMono
            icon={<IconToken className="w-3 h-3" />}
         />
      </div>

      {/* Row 2: Financials & Location */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-100">
         <InfoItem 
            label="Requested amount" 
            value={`${data.requestAmount.currency} ${data.requestAmount.amount.toLocaleString()}`} 
            isMono
            className="bg-blue-50/20"
         />
         <InfoItem 
            label="Gross amount" 
            value={`${data.grossAmount.currency} ${data.grossAmount.amount.toLocaleString()}`} 
            isMono
         />
         <InfoItem 
            label="Net amount" 
            value={`${data.amount.currency} ${data.amount.amount.toLocaleString()}`} 
            isMono
            className="bg-emerald-50/20"
         />

         <InfoItem 
            label="Location" 
            value={
              <a href="#" className="text-blue-600 hover:underline hover:text-blue-700 transition-colors text-xs font-medium">
                Show on map
              </a>
            }
            icon={<IconLocation className="w-3 h-3" />}
         />
      </div>

      {/* Row 3: Logs Area - Split View with Consistent UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-100 last:border-0 bg-slate-50">
         
         {/* User Remark */}
         <div className="px-4 py-3 border-r border-slate-200">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    Remark
                </span>
            </div>
            <div className="bg-white border border-slate-200 rounded p-2.5 font-mono text-xs text-slate-700 leading-relaxed break-all whitespace-pre-wrap max-h-24 overflow-y-auto custom-scrollbar shadow-inner min-h-[20px]">
                {data.remark || <span className="text-slate-400 italic font-normal font-mono">No remark provided</span>}
            </div>
         </div>

         {/* System Message */}
         <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    Message
                </span>
            </div>
            <div className="bg-white border border-slate-200 rounded p-2.5 font-mono text-xs text-slate-700 leading-relaxed break-all whitespace-pre-wrap max-h-24 overflow-y-auto custom-scrollbar shadow-inner min-h-[20px]">
                {data.message || 'No system message available.'}
            </div>
         </div>

      </div>
    </div>
  );
};

export default TransactionInfo;
