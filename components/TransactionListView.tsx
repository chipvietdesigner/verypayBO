
import React, { useState, useMemo } from 'react';
import TransactionFilters from './TransactionFilters';
import TransactionListTable from './TransactionListTable';
import Pagination from './Pagination';
import { TransactionListItem, TransactionStatus, TransactionType } from '../types';
import { IconDownload, IconRefresh } from './Icons';

interface Props {
  onRowClick: (id: string) => void;
}

// Helper to generate 50 mock items
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

const MOCK_LIST_DATA = generateMockTransactions(50);

const TransactionListView: React.FC<Props> = ({ onRowClick }) => {
  
  // Calculate totals for the footer
  const totals = useMemo(() => {
    return MOCK_LIST_DATA.reduce((acc, curr) => {
      return {
        gross: acc.gross + curr.grossAmount.amount,
        net: acc.net + curr.amount.amount,
        currency: curr.grossAmount.currency
      };
    }, { gross: 0, net: 0, currency: 'CFA' });
  }, []);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-white font-sans">
      
      {/* 1. Page Header */}
      <div className="px-4 py-4 border-b border-slate-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Transactions</h1>
           </div>
           <div className="flex items-center gap-2">
               <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                  <IconDownload className="w-4 h-4" /> Export
               </button>
               <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                  <IconRefresh className="w-4 h-4" /> Refresh data
               </button>
           </div>
        </div>
      </div>

      {/* 2. Filters Toolbar */}
      <TransactionFilters />

      {/* 3. Table Area */}
      <div className="flex-1 overflow-hidden bg-white relative">
          <div className="absolute inset-0 overflow-auto">
             <TransactionListTable 
                transactions={MOCK_LIST_DATA} 
                onRowClick={onRowClick} 
                totals={totals}
             />
          </div>
      </div>

      {/* 4. Pagination */}
      <div className="border-t border-slate-200 bg-white px-2 py-2 flex-shrink-0 z-10">
          <Pagination />
      </div>

    </div>
  );
};

export default TransactionListView;
