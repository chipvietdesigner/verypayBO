
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
  <div className={`flex flex-col gap-1 px-4 py-3 border-r border-slate-100 last:border-r-0 ${className}`}>
    <dt className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-0.5">
      {icon} {label}
    </dt>
    <dd className="flex items-center justify-between gap-2">
      <div className="flex flex-col">
        <span className={`text-sm ${isMono ? 'font-mono' : 'font-medium'} ${highlight ? 'text-blue-600' : 'text-slate-900'} truncate`}>
          {value}
        </span>
        {subValue && <span className="text-xs text-slate-500">{subValue}</span>}
      </div>
      {isCopyable && <IconCopy className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600 flex-shrink-0" />}
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
            label="Creation date" 
            value={data.creationDate.split(' ')[0]}
            subValue={data.creationDate.split(' ')[1]}
            icon={<IconCalendar className="w-3 h-3" />}
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
            className="bg-emerald-50/30"
         />
         <InfoItem 
            label="Location" 
            value={
              <a href="#" className="text-blue-600 hover:underline hover:text-blue-700 transition-colors">
                Show on map
              </a>
            }
            icon={<IconLocation className="w-3 h-3" />}
            className="hidden lg:flex"
         />
      </div>

      {/* Row 2: Technical Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 bg-slate-50/30">
        <InfoItem 
            label="Payment method" 
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
            label="Service type" 
            value={data.serviceType || 'Standard'} 
        />
        {/* Message / Remark - Spans remaining columns if needed, here restricted to 1 for grid symmetry */}
        <InfoItem 
            label="System message" 
            value={data.message} 
            highlight={data.status !== 'APPROVED'}
            className="text-slate-500 italic"
        />
      </div>
    </div>
  );
};

export default TransactionInfo;
