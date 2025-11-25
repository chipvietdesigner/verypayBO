import React from 'react';
import { LedgerEntry } from '../types';

interface Props {
  entries: LedgerEntry[];
}

const LedgerTable: React.FC<Props> = ({ entries }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-900">Accounting Journal & Ledger</h3>
        <p className="text-xs text-slate-500 mt-0.5">Detailed breakdown of all account movements related to this transaction.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Account</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Account Type</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transaction Type</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Indicator</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount-Currency</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Opening balance</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Closing balance</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Datetime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Account */}
                <td className="px-4 py-2.5">
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-mono text-xs hover:underline">
                    {entry.account}
                  </a>
                </td>
                
                {/* Account Type */}
                <td className="px-4 py-2.5 text-slate-600 text-xs">{entry.accountType}</td>
                
                {/* Transaction Type */}
                <td className="px-4 py-2.5 text-slate-600 text-xs">{entry.transactionType}</td>

                {/* Indicator */}
                <td className="px-4 py-2.5 text-xs">
                  <span className={`font-medium ${entry.indicator === 'Debit' ? 'text-slate-800' : 'text-slate-800'}`}>
                    {entry.indicator}
                  </span>
                </td>

                {/* Amount-Currency */}
                <td className="px-4 py-2.5 text-xs font-mono font-medium text-slate-800">
                   {entry.amount.amount.toLocaleString()} <span className="text-[10px] text-slate-500">{entry.amount.currency}</span>
                </td>

                {/* Opening Balance */}
                <td className="px-4 py-2.5 text-xs font-mono text-slate-500">
                  {entry.openingBalance ? entry.openingBalance.amount.toLocaleString() : '--'}
                </td>

                {/* Closing Balance */}
                <td className="px-4 py-2.5 text-xs font-mono text-slate-500">
                  {entry.closingBalance ? entry.closingBalance.amount.toLocaleString() : '--'}
                </td>

                {/* Status */}
                <td className="px-4 py-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                    {entry.status}
                  </span>
                </td>

                {/* Datetime */}
                <td className="px-4 py-2.5 text-slate-500 text-[10px] font-mono">{entry.dateTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerTable;