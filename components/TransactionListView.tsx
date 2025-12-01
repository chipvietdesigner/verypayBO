
import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
import TransactionFilters, { FilterState, DEFAULT_FILTERS } from './TransactionFilters';
import TransactionListTable from './TransactionListTable';
import Pagination from './Pagination';
import { TransactionListItem } from '../types';
import { IconDownload, IconRefresh } from './Icons';
import { initialTransactions } from '../mockData';

interface Props {
  onRowClick?: (item: TransactionListItem) => void;
}

const TransactionListView: React.FC<Props> = ({ onRowClick }) => {
 //// const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState(50);
  
  // State for data filtering and loading
  const [activeFilters, setActiveFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);

  // Check if current filters differ from default
  const isFilterActive = useMemo(() => {
      return JSON.stringify(activeFilters) !== JSON.stringify(DEFAULT_FILTERS);
  }, [activeFilters]);

  const handleRowClick = (item: TransactionListItem) => {
      if (onRowClick) {
        onRowClick(item);
      } else {
       // navigate(`/transactions/details/${item.reference}`);
      }
  };

  // Client-side filtering logic based on activeFilters
  const filteredData = useMemo(() => {
    // Note: In a real app, this would likely be a backend query.
    // Here we filter 'initialTransactions' based on 'activeFilters'.
    
    // If loading, we might want to show previous data or empty, but the table handles the loading overlay.
    return initialTransactions.filter(item => {
        // 1. Search
        if (activeFilters.search) {
            const s = activeFilters.search.toLowerCase();
            if (!item.reference.toLowerCase().includes(s) && !item.payerWalletId.includes(s)) {
                return false;
            }
        }
        // 2. Type
        if (activeFilters.type.length > 0) {
            if (!activeFilters.type.includes(item.type)) return false;
        }
        // 3. Status
        if (activeFilters.status.length > 0) {
             const itemStatusNormal = item.status.charAt(0) + item.status.slice(1).toLowerCase();
             if (!activeFilters.status.includes(itemStatusNormal)) return false;
        }
        // 4. More Filters - School
        if (activeFilters.more.school !== 'All Schools') {
             // Mock logic: assumes we had school data on item, strictly checking generic property here for demo
             if (item.school !== activeFilters.more.school && item.school !== '--') return false; 
        }
        // 5. More Filters - Payment Method
        if (activeFilters.more.method !== 'All Methods') {
             if (item.paymentMethod !== activeFilters.more.method) return false;
        }
        
        return true;
    });
  }, [activeFilters]); // Only re-calculate when activeFilters changes (which happens after Apply click)
  
  const currentData = useMemo(() => {
      return filteredData.slice(0, itemsPerPage);
  }, [filteredData, itemsPerPage]);

  const totals = useMemo(() => {
    return currentData.reduce((acc, curr) => {
      return {
        amount: acc.amount + curr.requestAmount.amount,
        currency: curr.requestAmount.currency
      };
    }, { amount: 0, currency: 'UGX' });
  }, [currentData]);

  // --- Handler Logic ---

  const handleApplyFilter = (newFilters: FilterState) => {
      setIsLoading(true);
      
      // Simulate network request duration (1 - 1.5s)
      setTimeout(() => {
          setActiveFilters(newFilters);
          setIsLoading(false);
      }, 1200);
  };

  const handleClearFilter = () => {
      setIsLoading(true);

      // Simulate shorter reset duration (0.5 - 1s)
      setTimeout(() => {
          setActiveFilters(DEFAULT_FILTERS);
          setIsLoading(false);
      }, 800);
  };

  const handleRefresh = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-white font-sans">
      
      <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Transactions</h1>
           </div>
        </div>
      </div>

      <TransactionFilters 
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
        isFilterActive={isFilterActive}
        actions={
          <>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-sm">
              <IconDownload className="w-3.5 h-3.5" /> Export
            </button>
            <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors shadow-sm"
            >
              <IconRefresh className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh data
            </button>
          </>
        }
      />

      <div className="flex-1 overflow-hidden bg-white relative">
          <div className="absolute inset-0 overflow-auto">
             <TransactionListTable 
                transactions={currentData} 
                onRowClick={handleRowClick} 
                totals={totals}
                isLoading={isLoading}
             />
          </div>
      </div>

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
