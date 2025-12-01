
import React from 'react';
import { TransactionListItem, TransactionStatus } from '../types';
import { IconArrowRight, IconRefresh } from './Icons';

interface Props {
  transactions: TransactionListItem[];
  onRowClick: (item: TransactionListItem) => void;
  totals: {
    amount: number;
    currency: string;
  };
  isLoading?: boolean;
}

const TransactionListTable: React.FC<Props> = ({ transactions, onRowClick, totals, isLoading }) => {
  
  const getStatusStyle = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.APPROVED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case TransactionStatus.PENDING:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case TransactionStatus.FAILED:
      case TransactionStatus.DECLINED:
        return 'bg-red-50 text-red-700 border-red-200';
      case TransactionStatus.EXPIRED:
         return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full overflow-x-auto custom-scrollbar h-full flex flex-col font-sans relative">
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <IconRefresh className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-sm font-medium text-slate-600">Updating transactions...</span>
          </div>
        </div>
      )}

      <table className="w-full text-left border-collapse min-w-[1500px]">
        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm border-b border-slate-200">
          <tr className="text-xs font-bold text-slate-500">
            <th className="px-3 py-3 whitespace-nowrap font-semibold">Creation date</th>
            <th className="px-3 py-3 whitespace-nowrap font-semibold">Reference number</th>
            <th className="px-3 py-3 whitespace-nowrap font-semibold">Type</th>
            <th className="px-3 py-3 whitespace-nowrap text-right font-semibold">Requested amount</th>
            <th className="px-3 py-3 whitespace-nowrap font-semibold">Status</th>
            <th className="px-3 py-3 whitespace-nowrap font-semibold">Flow (Source → Destination)</th>
            <th className="px-3 py-3 whitespace-nowrap font-semibold">Payment method</th>
            <th className="px-3 py-3 whitespace-nowrap font-semibold">School</th>
            <th className="px-3 py-3 whitespace-nowrap font-semibold">Serial number</th>
            <th className="px-3 py-3 whitespace-nowrap font-semibold">Message</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-xs">
          {transactions.map((tx) => (
            <tr 
              key={tx.id} 
              onClick={() => onRowClick(tx)}
              className="group hover:bg-blue-50/30 transition-colors cursor-pointer"
            >
              <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{tx.date}</td>
              <td className="px-3 py-2 font-medium text-blue-600 hover:underline">{tx.reference}</td>
              <td className="px-3 py-2 text-slate-700 font-medium whitespace-nowrap">{tx.type}</td>
              <td className="px-3 py-2 text-right font-medium text-slate-900 whitespace-nowrap">
                {tx.requestAmount.amount.toLocaleString()} <span className="text-[10px] text-slate-500">{tx.requestAmount.currency}</span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(tx.status)}`}>
                  {tx.status}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="flex items-center gap-2 font-mono text-xs">
                   <span className="text-slate-500 max-w-[120px] truncate" title={tx.payerWalletId}>{tx.payerWalletId}</span>
                   <IconArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                   <span className="text-slate-900 font-medium max-w-[120px] truncate" title={tx.payeeWalletId}>{tx.payeeWalletId}</span>
                </div>
              </td>
              <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{tx.paymentMethod}</td>
              <td className="px-3 py-2 text-slate-600 whitespace-nowrap">{tx.school}</td>
              <td className="px-3 py-2 font-mono text-slate-600 whitespace-nowrap">{tx.serialNumber}</td>
              <td className="px-3 py-2 text-slate-500 max-w-[200px] truncate" title={tx.message}>{tx.message}</td>
            </tr>
          ))}
          
          {/* Empty State / No Results */}
          {!isLoading && transactions.length === 0 && (
            <tr>
              <td colSpan={10} className="px-6 py-12 text-center text-slate-400">
                No transactions found matching your filters.
              </td>
            </tr>
          )}
        </tbody>
        {!isLoading && transactions.length > 0 && (
            <tfoot className="bg-slate-50 border-t-2 border-slate-200 sticky bottom-0 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
                <tr className="text-xs font-bold text-slate-800">
                    <td className="px-3 py-2.5" colSpan={3}>TOTAL</td>
                    <td className="px-3 py-2.5 text-right font-mono">
                        {totals.amount.toLocaleString()} <span className="text-[10px] text-slate-500">{totals.currency}</span>
                    </td>
                    <td className="px-3 py-2.5" colSpan={6}></td>
                </tr>
            </tfoot>
        )}
      </table>
    </div>
  );
};

export default TransactionListTable;
