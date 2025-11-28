
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionFilters, { FilterState } from './TransactionFilters';
import TransactionListTable from './TransactionListTable';
import Pagination from './Pagination';
import { TransactionListItem } from '../types';
import { IconDownload, IconRefresh } from './Icons';
import { initialTransactions } from '../mockData';

interface Props {
  onRowClick?: (item: TransactionListItem) => void;
}

const TransactionListView: React.FC<Props> = ({ onRowClick }) => {
  const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);

  const handleRowClick = (item: TransactionListItem) => {
      if (onRowClick) {
        onRowClick(item);
      } else {
        // Navigate to the detail URL
        navigate(`/transactions/details/${item.reference}`);
      }
  };

  // Client-side filtering logic using shared initialData
  const filteredData = useMemo(() => {
    if (!activeFilters) return initialTransactions;

    return initialTransactions.filter(item => {
        // Filter by Type
        if (activeFilters.type && activeFilters.type.length > 0) {
            if (!activeFilters.type.includes(item.type)) return false;
        }
        // Filter by Status
        if (activeFilters.status && activeFilters.status.length > 0) {
             const itemStatusNormal = item.status.charAt(0) + item.status.slice(1).toLowerCase(); // 'Approved'
             if (!activeFilters.status.includes(itemStatusNormal)) return false;
        }
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
                onRowClick={handleRowClick} 
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
