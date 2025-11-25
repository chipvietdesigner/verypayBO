
import React from 'react';
import { IconChevronLeft, IconChevronRight, IconChevronDown } from './Icons';

interface Props {
  itemsPerPage?: number;
  onItemsPerPageChange?: (value: number) => void;
}

const Pagination: React.FC<Props> = ({ itemsPerPage = 50, onItemsPerPageChange }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-slate-200">
      <div className="flex items-center gap-4">
        {/* Rows per page selector */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>Rows per page:</span>
          <div className="relative">
            <select 
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange && onItemsPerPageChange(Number(e.target.value))}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded pl-2 pr-6 py-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <IconChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-medium text-slate-900">1</span> - <span className="font-medium text-slate-900">{itemsPerPage}</span> of <span className="font-medium text-slate-900">3,248</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <button className="p-1 border border-transparent rounded hover:bg-slate-50 text-slate-400 hover:text-slate-600 disabled:opacity-50">
          <IconChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-1 text-xs font-medium">
          <button className="min-w-[24px] h-6 flex items-center justify-center rounded bg-slate-900 text-white">1</button>
          <button className="min-w-[24px] h-6 flex items-center justify-center rounded text-slate-600 hover:bg-slate-50">2</button>
          <button className="min-w-[24px] h-6 flex items-center justify-center rounded text-slate-600 hover:bg-slate-50">3</button>
          <span className="text-slate-400 px-1">...</span>
          <button className="min-w-[24px] h-6 flex items-center justify-center rounded text-slate-600 hover:bg-slate-50">64</button>
        </div>

        <button className="p-1 border border-transparent rounded hover:bg-slate-50 text-slate-600 hover:text-slate-900">
          <IconChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
