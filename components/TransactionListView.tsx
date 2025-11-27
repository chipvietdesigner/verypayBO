
import React, { useState, useMemo, useEffect } from 'react';
import TransactionFilters, { FilterState } from './TransactionFilters';
import TransactionListTable from './TransactionListTable';
import Pagination from './Pagination';
import { TransactionListItem, TransactionStatus, TransactionType } from '../types';
import { IconDownload, IconRefresh } from './Icons';

interface Props {
  onRowClick: (item: TransactionListItem) => void;
}

// Helper to generate mock items
const generateMockTransactions = (count: number): TransactionListItem[] => {
  const types: TransactionType[] = ['Funds in', 'Wallet Top Up', 'Withdrawal', 'Payment', 'Deactivation Transfer'];
  
  // Weighted statuses: More Approved than others
  const statuses = [
      TransactionStatus.APPROVED, TransactionStatus.APPROVED, TransactionStatus.APPROVED, TransactionStatus.APPROVED, 
      TransactionStatus.APPROVED, TransactionStatus.APPROVED, TransactionStatus.APPROVED, 
      TransactionStatus.PENDING, 
      TransactionStatus.FAILED, 
      TransactionStatus.DECLINED
  ];
  
  const methods = ['External transfer', 'Physical card', 'QR code', 'Transfer', 'Mobile Money'];
  
  // Round numbers for "Request Amount" to simulate user input
  const amounts = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 150000, 200000, 500000, 1000000];

  return Array.from({ length: count }).map((_, index) => {
    const id = (index + 1).toString();
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    
    // Pick a "beautiful" round number
    const baseAmount = amounts[Math.floor(Math.random() * amounts.length)];
    const amount = baseAmount; 
    
    // Generate realistic error messages for failed txs
    let message = 'Success';
    if (status === TransactionStatus.FAILED) message = 'Insufficient funds';
    else if (status === TransactionStatus.DECLINED) message = 'Risk threshold exceeded';
    else if (status === TransactionStatus.PENDING) message = 'Awaiting provider confirmation';

    return {
      id,
      reference: `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      date: `24/11/25 ${String(Math.floor(Math.random() * 23)).padStart(2, '0')}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`,
      requestAmount: { currency: 'UGX', amount: amount },
      type,
      payerWalletId: `221${Math.floor(Math.random() * 1000000000)}`,
      payeeWalletId: `251${Math.floor(Math.random() * 1000000000)}`,
      status,
      message,
      school: '--',
      paymentMethod: method,
      serialNumber: Math.random() > 0.7 ? `SN-${Math.floor(Math.random() * 10000)}` : '--'
    };
  });
};

const initialData = generateMockTransactions(150); // Generate a stable large set once

const TransactionListView: React.FC<Props> = ({ onRowClick }) => {
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);

  // Client-side filtering logic
  const filteredData = useMemo(() => {
    if (!activeFilters) return initialData;

    return initialData.filter(item => {
        // Filter by Type
        if (activeFilters.type && activeFilters.type.length > 0) {
            if (!activeFilters.type.includes(item.type)) return false;
        }
        // Filter by Status
        if (activeFilters.status && activeFilters.status.length > 0) {
             // Map string status to enum if necessary, or ensure case matches
             const itemStatusNormal = item.status.charAt(0) + item.status.slice(1).toLowerCase(); // 'Approved'
             // Check if the capitalized version is in the list (assuming filter sends ['Approved', 'Failed'])
             if (!activeFilters.status.includes(itemStatusNormal)) return false;
        }
        // Add other filters (School, Method) here if needed
        return true;
    });
  }, [activeFilters]);
  
  // Pagination slice
  const currentData = useMemo(() => {
      return filteredData.slice(0, itemsPerPage);
  }, [filteredData, itemsPerPage]);

  // Calculate totals for the footer based on CURRENT view
  const totals = useMemo(() => {
    return currentData.reduce((acc, curr) => {
      return {
        amount: acc.amount + curr.requestAmount.amount,
        currency: curr.requestAmount.currency
      };
    }, { amount: 0, currency: 'UGX' });
  }, [currentData]);

  const handleApplyFilter = (filters: FilterState) => {
      setActiveFilters(filters);
  };

  const handleRefresh = () => {
      // In a real app, this would refetch. Here we could reset filters or shuffle data.
      setActiveFilters(null);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-white font-sans">
      
      {/* 1. Page Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Transactions</h1>
           </div>
        </div>
      </div>

      {/* 2. Filters Toolbar with Actions */}
      <TransactionFilters 
        onApply={handleApplyFilter}
        actions={
          <>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-sm">
              <IconDownload className="w-3.5 h-3.5" /> Export
            </button>
            <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-sm"
            >
              <IconRefresh className="w-3.5 h-3.5" /> Refresh data
            </button>
          </>
        }
      />

      {/* 3. Table Area */}
      <div className="flex-1 overflow-hidden bg-white relative">
          <div className="absolute inset-0 overflow-auto">
             <TransactionListTable 
                transactions={currentData} 
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
