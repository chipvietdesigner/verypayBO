
import React, { useState, useMemo } from 'react';
import TransactionFilters from './TransactionFilters';
import TransactionListTable from './TransactionListTable';
import Pagination from './Pagination';
import { TransactionListItem, TransactionStatus, TransactionType } from '../types';
import { IconDownload, IconRefresh } from './Icons';

interface Props {
  onRowClick: (id: string) => void;
}

// Helper to generate mock items
const generateMockTransactions = (count: number): TransactionListItem[] => {
  const types: TransactionType[] = ['Funds in', 'Wallet Top Up', 'Withdrawal', 'Payment', 'Bill Payment', 'Deactivation Transfer'];
  const statuses = [TransactionStatus.APPROVED, TransactionStatus.PENDING, TransactionStatus.FAILED, TransactionStatus.EXPIRED, TransactionStatus.DECLINED];
  const methods = ['External transfer', 'Physical card', 'QR code', 'Transfer', 'Mobile Money'];
  
  return Array.from({ length: count }).map((_, index) => {
    const id = (index + 1).toString();
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const amount = Math.floor(Math.random() * 1000000) + 1000;
    
    return {
      id,
      reference: `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      date: `24/11/25 ${String(Math.floor(Math.random() * 23)).padStart(2, '0')}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`,
      grossAmount: { currency: 'CFA', amount: amount },
      amount: { currency: 'CFA', amount: amount }, // Net amount same as gross for simplicity in mock
      type,
      payerWalletId: `221${Math.floor(Math.random() * 1000000000)}`,
      payeeWalletId: `251${Math.floor(Math.random() * 1000000000)}`,
      status,
      message: status === TransactionStatus.APPROVED ? 'Success' : 'Transaction failed or pending',
      school: '--',
      paymentMethod: method,
      serialNumber: Math.random() > 0.7 ? `SN-${Math.floor(Math.random() * 10000)}` : '--'
    };
  });
};

const TransactionListView: React.FC<Props> = ({ onRowClick }) => {
  const [itemsPerPage, setItemsPerPage] = useState(50);
  
  // Memoize data generation to avoid regeneration on every render, 
  // but update when itemsPerPage changes (simulating backend fetch)
  const transactionData = useMemo(() => {
    return generateMockTransactions(itemsPerPage);
  }, [itemsPerPage]);
  
  // Calculate totals for the footer
  const totals = useMemo(() => {
    return transactionData.reduce((acc, curr) => {
      return {
        gross: acc.gross + curr.grossAmount.amount,
        net: acc.net + curr.amount.amount,
        currency: curr.grossAmount.currency
      };
    }, { gross: 0, net: 0, currency: 'CFA' });
  }, [transactionData]);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-white font-sans">
      
      {/* 1. Page Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Transactions</h1>
           </div>
           {/* Actions moved to Filter Bar below */}
        </div>
      </div>

      {/* 2. Filters Toolbar with Actions */}
      <TransactionFilters 
        actions={
          <>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-sm">
              <IconDownload className="w-3.5 h-3.5" /> Export
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-sm">
              <IconRefresh className="w-3.5 h-3.5" /> Refresh data
            </button>
          </>
        }
      />

      {/* 3. Table Area */}
      <div className="flex-1 overflow-hidden bg-white relative">
          <div className="absolute inset-0 overflow-auto">
             <TransactionListTable 
                transactions={transactionData} 
                onRowClick={onRowClick} 
                totals={totals}
             />
          </div>
      </div>

      {/* 4. Pagination */}
      <div className="flex-shrink-0 z-10">
          <Pagination 
            itemsPerPage={itemsPerPage} 
            onItemsPerPageChange={setItemsPerPage}
          />
      </div>

    </div>
  );
};

export default TransactionListView;
