
import React from 'react';
import { TransactionListItem, TransactionStatus } from '../types';

interface Props {
  transactions: TransactionListItem[];
  onRowClick: (id: string) => void;
  totals: {
    gross: number;
    net: number;
    currency: string;
  };
}

const TransactionListTable: React.FC<Props> = ({ transactions, onRowClick, totals }) => {
  
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
    <div className="w-full overflow-x-auto custom-scrollbar h-full flex flex-col font-sans">
      <table className="w-full text-left border-collapse min-w-[1500px]">
        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm border-b border-slate-200">
          <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {/* Financial & Time Context (First) */}
            <th className="px-3 py-2.5 whitespace-nowrap">Creation date</th>
            <th className="px-3 py-2.5 whitespace-nowrap">Reference number</th>
            <th className="px-3 py-2.5 whitespace-nowrap">Type</th>
            <th className="px-3 py-2.5 whitespace-nowrap text-right">Gross amount</th>
            <th className="px-3 py-2.5 whitespace-nowrap text-right">Amount</th>
            <th className="px-3 py-2.5 whitespace-nowrap">Status</th>
            
            {/* Counterparties (Second) */}
            <th className="px-3 py-2.5 whitespace-nowrap">Payer wallet ID</th>
            <th className="px-3 py-2.5 whitespace-nowrap">Payee wallet ID</th>
            
            {/* Metadata (Last) */}
            <th className="px-3 py-2.5 whitespace-nowrap">Payment method</th>
            <th className="px-3 py-2.5 whitespace-nowrap">School</th>
            <th className="px-3 py-2.5 whitespace-nowrap">Serial number</th>
            <th className="px-3 py-2.5 whitespace-nowrap">Message</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-xs">
          {transactions.map((tx) => (
            <tr 
              key={tx.id} 
              onClick={() => onRowClick(tx.id)}
              className="group hover:bg-blue-50/30 transition-colors cursor-pointer"
            >
              {/* Date */}
              <td className="px-3 py-2 text-slate-600 whitespace-nowrap font-mono">
                {tx.date}
              </td>

              {/* Reference */}
              <td className="px-3 py-2 font-medium text-blue-600 hover:underline">
                {tx.reference}
              </td>

               {/* Type */}
               <td className="px-3 py-2 text-slate-700 font-medium whitespace-nowrap">
                {tx.type}
              </td>

              {/* Gross Amount */}
              <td className="px-3 py-2 text-right font-medium text-slate-900 whitespace-nowrap font-mono">
                {tx.grossAmount.amount.toLocaleString()} <span className="text-[10px] text-slate-500">{tx.grossAmount.currency}</span>
              </td>

              {/* Amount */}
              <td className="px-3 py-2 text-right font-medium text-slate-900 whitespace-nowrap font-mono">
                {tx.amount.amount.toLocaleString()} <span className="text-[10px] text-slate-500">{tx.amount.currency}</span>
              </td>

              {/* Status */}
              <td className="px-3 py-2 whitespace-nowrap">
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(tx.status)}`}>
                  {tx.status}
                </span>
              </td>

              {/* Payer */}
              <td className="px-3 py-2 font-mono text-slate-600 whitespace-nowrap">
                {tx.payerWalletId}
              </td>

              {/* Payee */}
              <td className="px-3 py-2 font-mono text-slate-600 whitespace-nowrap">
                {tx.payeeWalletId}
              </td>

              {/* Payment Method */}
              <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                {tx.paymentMethod}
              </td>

              {/* School */}
              <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                {tx.school}
              </td>

              {/* Serial */}
              <td className="px-3 py-2 font-mono text-slate-600 whitespace-nowrap">
                {tx.serialNumber}
              </td>
              
               {/* Message */}
              <td className="px-3 py-2 text-slate-500 max-w-[200px] truncate" title={tx.message}>
                {tx.message}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-50 border-t-2 border-slate-200 sticky bottom-0 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
            <tr className="text-xs font-bold text-slate-800">
                <td className="px-3 py-2.5" colSpan={3}>TOTAL</td>
                <td className="px-3 py-2.5 text-right font-mono">
                    {totals.gross.toLocaleString()} <span className="text-[10px] text-slate-500">{totals.currency}</span>
                </td>
                <td className="px-3 py-2.5 text-right font-mono">
                    {totals.net.toLocaleString()} <span className="text-[10px] text-slate-500">{totals.currency}</span>
                </td>
                <td className="px-3 py-2.5" colSpan={7}></td>
            </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TransactionListTable;
