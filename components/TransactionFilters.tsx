
import React, { useState, useRef, useEffect } from 'react';
import { IconSearch, IconCalendar, IconFilter, IconChevronDown } from './Icons';

export interface FilterState {
  type: string[];
  status: string[];
}

interface TransactionFiltersProps {
  actions?: React.ReactNode;
  onApply: (filters: FilterState) => void;
}

// Date Range Picker Component
const DateRangePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('This Month');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ranges = [
    'Today',
    'Yesterday',
    'This Week',
    'Last Week',
    'This Month',
    'Last Month',
    'This Year',
    'YTD',
    'Custom Range'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full sm:w-48 flex items-center justify-between px-3 py-1.5 text-sm border rounded-lg transition-colors shadow-sm bg-white hover:bg-slate-50 ${isOpen ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-200 text-slate-700'}`}
      >
        <div className="flex items-center gap-2">
           <IconCalendar className="w-4 h-4 text-slate-400" />
           <span className="font-medium truncate">{selectedRange}</span>
        </div>
        <IconChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-400 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
          {ranges.map((range) => (
            <div 
              key={range} 
              className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between ${selectedRange === range ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
              onClick={() => {
                setSelectedRange(range);
                setIsOpen(false);
              }}
            >
              {range}
              {selectedRange === range && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterDropdown = ({ 
  label, 
  options, 
  isOpen, 
  onToggle, 
  onClose,
  currentSelection,
  onConfirm,
  icon
}: { 
  label: string; 
  options: string[]; 
  isOpen: boolean; 
  onToggle: () => void;
  onClose: () => void;
  currentSelection: string[];
  onConfirm: (items: string[]) => void;
  icon?: React.ReactNode;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [checkedItems, setCheckedItems] = useState<string[]>(currentSelection);

  useEffect(() => {
    if (isOpen) {
      setCheckedItems(currentSelection);
    }
  }, [isOpen, currentSelection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleCheck = (option: string) => {
    setCheckedItems(prev => 
      prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]
    );
  };

  const handleApply = () => {
    onConfirm(checkedItems);
    onClose();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors shadow-sm whitespace-nowrap ${isOpen || currentSelection.length > 0 ? 'bg-slate-50 border-blue-500 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
      >
        {icon}
        <span>{label}</span>
        {currentSelection.length > 0 && (
          <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full">{currentSelection.length}</span>
        )}
        <IconChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50 flex flex-col">
          <div className="p-2 max-h-60 overflow-y-auto space-y-0.5">
            {options.map((option, idx) => (
              <label 
                key={idx} 
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer rounded"
              >
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  checked={checkedItems.includes(option)}
                  onChange={() => handleCheck(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          
          <div className="p-3 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50 rounded-b-lg">
             <button 
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
             >
                Close
             </button>
             <button 
                onClick={handleApply}
                className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm"
             >
                OK
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Complex dropdown for multiple categories
const MoreFiltersDropdown = ({ 
  isOpen, 
  onToggle, 
  onClose 
}: { 
  isOpen: boolean; 
  onToggle: () => void;
  onClose: () => void;
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={onToggle}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors shadow-sm whitespace-nowrap ${isOpen ? 'bg-slate-50 border-blue-500 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
                <IconFilter className="w-4 h-4" />
                <span>More filters</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 w-72 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-4">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">School</label>
                            <select className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50">
                                <option>All Schools</option>
                                <option>Greenwood High</option>
                                <option>Sunrise Academy</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Payment Method</label>
                            <select className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50">
                                <option>All Methods</option>
                                <option>External transfer</option>
                                <option>Card</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Message</label>
                            <select className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50">
                                <option>All Messages</option>
                                <option>Success</option>
                                <option>Failed transaction</option>
                            </select>
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                            <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1">Reset</button>
                            <button onClick={onClose} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 shadow-sm">OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ actions, onApply }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    status: []
  });

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const updateFilter = (key: keyof FilterState, items: string[]) => {
    setFilters(prev => ({ ...prev, [key]: items }));
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-4 font-sans">
      
      {/* Left Group: Search, Date & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full xl:w-auto flex-wrap">
        <div className="relative w-full sm:w-64">
          <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search ref, wallet ID..." 
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Date Range Picker */}
        <DateRangePicker />

        {/* Filters moved to Left Side */}
         <FilterDropdown 
            label="Type" 
            isOpen={openDropdown === 'type'} 
            onToggle={() => toggleDropdown('type')}
            onClose={() => setOpenDropdown(null)}
            options={['Payment', 'Withdrawal', 'Funds in', 'Funds out', 'Wallet Top Up']}
            currentSelection={filters.type}
            onConfirm={(items) => updateFilter('type', items)}
         />
         
         <FilterDropdown 
            label="Status" 
            isOpen={openDropdown === 'status'} 
            onToggle={() => toggleDropdown('status')}
            onClose={() => setOpenDropdown(null)}
            options={['Approved', 'Pending', 'Failed', 'Declined', 'Expired']}
            currentSelection={filters.status}
            onConfirm={(items) => updateFilter('status', items)}
         />

         <MoreFiltersDropdown 
            isOpen={openDropdown === 'more'}
            onToggle={() => toggleDropdown('more')}
            onClose={() => setOpenDropdown(null)}
         />

         {/* Visual Separator & Apply Button */}
         <div className="h-8 w-px bg-slate-200 mx-1 hidden xl:block"></div>
         
         <button 
            onClick={() => onApply(filters)}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all active:scale-95"
         >
            Apply
         </button>
      </div>

      {/* Right Group: Actions (Export/Refresh) */}
      <div className="flex items-center gap-2 justify-end">
         {actions}
      </div>
    </div>
  );
};

export default TransactionFilters;
