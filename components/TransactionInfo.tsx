import React from 'react';
import { TransactionData } from '../types';
import { IconCopy, IconLocation, IconCalendar, IconPOS, IconToken } from './Icons';

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
  <div className={`flex flex-col gap-0.5 px-4 py-3 border-r border-slate-100 last:border-r-0 ${className}`}>
    <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
      {icon} {label}
    </dt>
    <dd className="flex items-center justify-between gap-2">
      <div className="flex flex-col">
        <span className={`text-sm ${isMono ? 'font-mono' : 'font-medium'} ${highlight ? 'text-blue-600' : 'text-slate-900'} truncate`}>
          {value}
        </span>
        {subValue && <span className="text-[10px] text-slate-400">{subValue}</span>}
      </div>
      {isCopyable && <IconCopy className="w-3 h-3 text-slate-300 cursor-pointer hover:text-slate-500 flex-shrink-0" />}
    </dd>
  </div>
);

const TransactionInfo: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-4">
      {/* Row 1: Key Identifiers */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 border-b border-slate-100">
         <InfoItem 
            label="Reference" 
            value={data.reference} 
            isMono 
            isCopyable 
            highlight 
         />
         <InfoItem 
            label="Creation Date" 
            value={data.creationDate.split(' ')[0]}
            subValue={data.creationDate.split(' ')[1]}
            icon={<IconCalendar className="w-3 h-3" />}
         />
         <InfoItem 
            label="Gross Amount" 
            value={`${data.grossAmount.currency} ${data.grossAmount.amount.toLocaleString()}`} 
            isMono
         />
         <InfoItem 
            label="Net Amount" 
            value={`${data.amount.currency} ${data.amount.amount.toLocaleString()}`} 
            isMono
            className="bg-emerald-50/30"
         />
         <InfoItem 
            label="Location" 
            value={data.location} 
            icon={<IconLocation className="w-3 h-3" />}
            className="hidden lg:flex"
         />
      </div>

      {/* Row 2: Technical Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 bg-slate-50/30">
        <InfoItem 
            label="Payment Method" 
            value={data.paymentMethod} 
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
        <InfoItem 
            label="Service Type" 
            value={data.serviceType || 'Standard'} 
        />
        {/* Message / Remark - Spans remaining columns if needed, here restricted to 1 for grid symmetry */}
        <InfoItem 
            label="System Message" 
            value={data.message} 
            highlight={data.status !== 'APPROVED'}
            className="text-slate-500 italic"
        />
      </div>
    </div>
  );
};

export default TransactionInfo;