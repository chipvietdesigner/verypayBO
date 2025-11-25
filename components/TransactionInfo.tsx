import React from 'react';
import { TransactionData } from '../types';
import { IconCopy } from './Icons';

interface Props {
  data: TransactionData;
}

const InfoItem: React.FC<{ label: string; value: React.ReactNode; isCopyable?: boolean; highlight?: boolean }> = ({ label, value, isCopyable, highlight }) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-xs font-semibold text-slate-500">{label}</dt>
    <dd className={`text-sm flex items-center gap-2 ${highlight ? 'text-blue-600 font-medium' : 'text-slate-900'}`}>
      <span className={highlight ? 'cursor-pointer hover:underline' : ''}>{value}</span>
      {isCopyable && <IconCopy className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />}
    </dd>
  </div>
);

const TransactionInfo: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-800">Transaction info</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
          <InfoItem label="Gross amount" value={`${data.grossAmount.currency} ${data.grossAmount.amount.toLocaleString()}`} />
          <InfoItem label="Amount" value={`${data.amount.currency} ${data.amount.amount.toLocaleString()}`} />
          <InfoItem label="POS ID" value={data.posId} highlight isCopyable />
          <InfoItem label="Token ID" value={data.tokenId || '--'} />

          <InfoItem label="Payment method" value={data.paymentMethod} />
          <InfoItem label="Service type" value={data.serviceType || '--'} />
          <InfoItem label="Remark" value={data.remark || '--'} />
          
          <div className="col-span-2 md:col-span-4 border-t border-slate-100 pt-3 mt-1">
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-slate-500 mt-0.5">Message:</span>
              <span className="text-sm text-slate-600 italic">{data.message}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfo;