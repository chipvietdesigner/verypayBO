import React from 'react';
import { CommissionDistribution } from '../types';

interface Props {
  fees: CommissionDistribution;
}

const FeeDistribution: React.FC<Props> = ({ fees }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Fee Distribution Logic</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 mb-1">Org Manager Earned</p>
          <p className="font-semibold text-slate-800">{fees.clientEarned.currency} {fees.clientEarned.amount}</p>
        </div>
        <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 mb-1">VeryPay Earned</p>
          <p className="font-semibold text-slate-800">{fees.veryPayEarned.currency} {fees.veryPayEarned.amount}</p>
        </div>
        <div className="bg-white p-3 rounded shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 mb-1">Provider Earned</p>
          <p className="font-semibold text-slate-800">{fees.partnerEarned.currency} {fees.partnerEarned.amount}</p>
        </div>
      </div>
    </div>
  );
};

export default FeeDistribution;