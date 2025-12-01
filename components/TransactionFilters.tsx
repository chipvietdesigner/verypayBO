
import React, { useState, useRef, useEffect } from 'react';
import { IconSearch, IconCalendar, IconFilter, IconChevronDown, IconXCircle } from './Icons';

export interface FilterState {
  search: string;
  dateRange: string;
  type: string[];
  status: string[];
  more: {
     school: string;
     method: string;
     minAmount: string;
     maxAmount: string;
  }
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  dateRange: 'This Month',
  type: [],
  status: [],
  more: {
      school: 'All Schools',
      method: 'All Methods',
      minAmount: '',
      maxAmount: ''
  }
};

interface TransactionFiltersProps {
  actions?: React.ReactNode;
  onApply: (filters: FilterState) => void;
  onClear: () => void;
  isFilterActive: boolean; // Controlled by parent to know if Clear button should show
}

// --- Sub-components ---

const DateRangeFilter = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ranges = ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month', 'This Year', 'YTD', 'Custom Range'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCustomPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (range: string) => {
    if (range === 'Custom Range') {
        setShowCustomPicker(true);
        // Don't close main dropdown yet, let user pick dates
    } else {
        onChange(range);
        setIsOpen(false);
        setShowCustomPicker(false);
    }
  };

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <button 
        onClick={() => { setIsOpen(!isOpen); setShowCustomPicker(false); }}
        className={`w-full sm:w-44 flex items-center justify-between px-3 py-1.5 text-sm border rounded-lg transition-colors shadow-sm bg-white hover:bg-slate-50 ${isOpen ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-200 text-slate-700'}`}
      >
        <div className="flex items-center gap-2 truncate">
           <IconCalendar className="w-4 h-4 text-slate-400" />
           <span className="font-medium truncate">{value}</span>
        </div>
        <IconChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-400 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
          {!showCustomPicker ? (
             ranges.map((range) => (
                <div 
                  key={range} 
                  className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between ${value === range ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                  onClick={() => handleSelect(range)}
                >
                  {range}
                  {value === range && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                </div>
              ))
          ) : (
              <div className="p-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Select Custom Range</h4>
                  <div className="space-y-3">
                      <div>
                          <label className="text-[10px] text-slate-400 block mb-1">From</label>
                          <input type="date" className="w-full text-sm border border-slate-200 rounded p-1.5 text-slate-700" />
                      </div>
                      <div>
                          <label className="text-[10px] text-slate-400 block mb-1">To</label>
                          <input type="date" className="w-full text-sm border border-slate-200 rounded p-1.5 text-slate-700" />
                      </div>
                      <div className="flex gap-2 pt-2">
                          <button onClick={() => setShowCustomPicker(false)} className="text-xs text-slate-500 px-2 py-1">Back</button>
                          <button onClick={() => { onChange('Custom: 01/11 - 05/11'); setIsOpen(false); }} className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Apply</button>
                      </div>
                  </div>
              </div>
          )}
        </div>
      )}
    </div>
  );
};

const FilterDropdown = ({ 
  label, 
  options, 
  currentSelection,
  onUpdate
}: { 
  label: string; 
  options: string[]; 
  currentSelection: string[];
  onUpdate: (items: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCheck = (option: string) => {
    const newSelection = currentSelection.includes(option) 
        ? currentSelection.filter(i => i !== option) 
        : [...currentSelection, option];
    onUpdate(newSelection);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors shadow-sm whitespace-nowrap ${isOpen || currentSelection.length > 0 ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
      >
        <span>{label}</span>
        {currentSelection.length > 0 && (
          <span className="bg-blue-200 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{currentSelection.length}</span>
        )}
        <IconChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50 flex flex-col p-1">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <label 
                key={option} 
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer rounded select-none"
              >
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  checked={currentSelection.includes(option)}
                  onChange={() => handleCheck(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MoreFiltersDropdown = ({ 
  values, 
  onUpdate 
}: { 
  values: FilterState['more']; 
  onUpdate: (newMore: FilterState['more']) => void; 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Calculate if any filter inside is active
    const isActive = values.school !== 'All Schools' || values.method !== 'All Methods' || values.minAmount !== '' || values.maxAmount !== '';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (field: keyof FilterState['more'], value: string) => {
        onUpdate({ ...values, [field]: value });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors shadow-sm whitespace-nowrap ${isOpen || isActive ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
                <IconFilter className="w-4 h-4" />
                <span>More filters</span>
                {isActive && <div className="w-2 h-2 bg-blue-500 rounded-full ml-1"></div>}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-4">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">School</label>
                            <select 
                                className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none"
                                value={values.school}
                                onChange={(e) => handleChange('school', e.target.value)}
                            >
                                <option>All Schools</option>
                                <option>Greenwood High</option>
                                <option>Sunrise Academy</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Payment Method</label>
                            <select 
                                className="w-full text-sm border border-slate-200 rounded p-2 bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none"
                                value={values.method}
                                onChange={(e) => handleChange('method', e.target.value)}
                            >
                                <option>All Methods</option>
                                <option>External transfer</option>
                                <option>Card</option>
                                <option>Mobile Money</option>
                            </select>
                        </div>
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Amount Range (UGX)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    className="w-1/2 text-sm border border-slate-200 rounded p-2 bg-slate-50"
                                    value={values.minAmount}
                                    onChange={(e) => handleChange('minAmount', e.target.value)}
                                />
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    className="w-1/2 text-sm border border-slate-200 rounded p-2 bg-slate-50"
                                    value={values.maxAmount}
                                    onChange={(e) => handleChange('maxAmount', e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="pt-2 flex justify-end">
                             <button 
                                onClick={() => onUpdate({ school: 'All Schools', method: 'All Methods', minAmount: '', maxAmount: '' })}
                                className="text-xs text-slate-500 hover:text-slate-800 underline"
                             >
                                Reset section
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ actions, onApply, onClear, isFilterActive }) => {
  // Internal Local State (Decoupled from parent until Apply is clicked)
  const [localFilters, setLocalFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Sync internal state if parent forces a reset (e.g. navigating away and back)
  // Note: In this specific requirement, we strictly control via buttons, so we init once.
  
  const handleLocalApply = () => {
    onApply(localFilters);
  };

  const handleLocalClear = () => {
    setLocalFilters(DEFAULT_FILTERS); // Reset UI immediately
    onClear(); // Trigger parent reset logic
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-4 font-sans">
      
      {/* Left Group: Filter Inputs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full xl:w-auto flex-wrap">
        
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search ref, wallet ID..." 
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            value={localFilters.search}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>

        {/* Date */}
        <DateRangeFilter 
            value={localFilters.dateRange}
            onChange={(val) => setLocalFilters(prev => ({ ...prev, dateRange: val }))}
        />

        {/* Dropdowns */}
         <FilterDropdown 
            label="Type" 
            options={['Payment', 'Withdrawal', 'Funds in', 'Funds out', 'Wallet Top Up']}
            currentSelection={localFilters.type}
            onUpdate={(items) => setLocalFilters(prev => ({ ...prev, type: items }))}
         />
         
         <FilterDropdown 
            label="Status" 
            options={['Approved', 'Pending', 'Failed', 'Declined', 'Expired']}
            currentSelection={localFilters.status}
            onUpdate={(items) => setLocalFilters(prev => ({ ...prev, status: items }))}
         />

         <MoreFiltersDropdown 
            values={localFilters.more}
            onUpdate={(newMore) => setLocalFilters(prev => ({ ...prev, more: newMore }))}
         />

         {/* Divider */}
         <div className="h-6 w-px bg-slate-200 mx-1 hidden xl:block"></div>
         
         {/* ACTION BUTTONS */}
         <div className="flex items-center gap-2">
             <button 
                onClick={handleLocalApply}
                className="px-4 py-1.5 text-sm font-bold text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all active:scale-95"
             >
                Apply
             </button>

             {isFilterActive && (
                 <button 
                    onClick={handleLocalClear}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                 >
                    <IconXCircle className="w-4 h-4" />
                    Clear
                 </button>
             )}
         </div>
      </div>

      {/* Right Group: Actions (Export/Refresh) */}
      <div className="flex items-center gap-2 justify-end">
         {actions}
      </div>
    </div>
  );
};

export default TransactionFilters;
