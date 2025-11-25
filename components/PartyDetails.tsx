import React from 'react';
import { PartyDetails, CommissionDistribution, MoneyValue } from '../types';

interface Props {
  payer: PartyDetails;
  payee: PartyDetails;
  commissions: CommissionDistribution;
}

const formatMoney = (mv: MoneyValue) => {
  return `${mv.currency} ${mv.amount.toLocaleString()}`;
};

const Row: React.FC<{ label: string; leftValue: string; rightValue: string; isTotal?: boolean }> = ({ label, leftValue, rightValue, isTotal }) => (
  <div className={`grid grid-cols-2 text-sm py-1.5 ${isTotal ? 'font-bold text-slate-900 border-t border-slate-200 mt-1 pt-2' : 'text-slate-600'}`}>
    <div className="flex justify-between pr-4 border-r border-slate-100">
      <span className={isTotal ? 'text-slate-900' : 'text-slate-500'}>{label}:</span>
      <span className={isTotal ? '' : 'font-medium text-slate-900'}>{leftValue}</span>
    </div>
    <div className="flex justify-between pl-4">
      <span className={isTotal ? 'text-slate-900' : 'text-slate-500'}>{label}:</span>
      <span className={isTotal ? '' : 'font-medium text-slate-900'}>{rightValue}</span>
    </div>
  </div>
);

const PartyDetailsPanel: React.FC<Props> = ({ payer, payee, commissions }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800">Transaction Flow Breakdown</h3>
      </div>

      <div className="p-4">
        {/* Headers */}
        <div className="grid grid-cols-2 mb-3">
          <div className="pr-4 border-r border-slate-100">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-800 text-sm">Payer</h4>
              <div className="text-[11px] text-slate-500">Wallet ID: <span className="text-blue-600 cursor-pointer font-medium">{payer.walletId}</span></div>
            </div>
          </div>
          <div className="pl-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-800 text-sm">Payee</h4>
              <div className="text-[11px] text-slate-500">Wallet ID: <span className="text-blue-600 cursor-pointer font-medium">{payee.walletId}</span></div>
            </div>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-0.5">
          <Row label="Amount" leftValue={formatMoney(payer.amount)} rightValue={formatMoney(payee.amount)} />
          <Row label="Fee" leftValue={formatMoney(payer.fee)} rightValue={formatMoney(payee.fee)} />
          <Row label="Fixed fee" leftValue={formatMoney(payer.fixedFee)} rightValue={formatMoney(payee.fixedFee)} />
          <Row label="Percentage fee" leftValue={payer.percentageFee} rightValue={payee.percentageFee} />
          <Row label="Total" leftValue={formatMoney(payer.total)} rightValue={formatMoney(payee.total)} isTotal />
        </div>
      </div>

      {/* Footer Commissions */}
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wide font-bold mb-1.5">Client</div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Earned fee:</span>
              <span className="font-bold text-slate-900">{formatMoney(commissions.clientEarned)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Commission:</span>
              <span className="text-slate-700 font-medium">{commissions.clientCommission || '--'}</span>
            </div>
          </div>

          <div className="md:border-l md:border-slate-200 md:pl-6">
            <div className="text-[10px] text-slate-500 uppercase tracking-wide font-bold mb-1.5">Verysell</div>
             <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Earned fee:</span>
              <span className="font-bold text-slate-900">{formatMoney(commissions.veryPayEarned)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Commission:</span>
              <span className="text-slate-700 font-medium">{commissions.veryPayCommission || '--'}</span>
            </div>
          </div>

          <div className="md:border-l md:border-slate-200 md:pl-6">
            <div className="text-[10px] text-slate-500 uppercase tracking-wide font-bold mb-1.5">Partner</div>
             <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Earned fee:</span>
              <span className="font-bold text-slate-900">{formatMoney(commissions.partnerEarned)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Commission:</span>
              <span className="text-slate-700 font-medium">{commissions.partnerCommission || '--'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyDetailsPanel;