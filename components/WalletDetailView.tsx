
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Wallet, WalletLedgerItem, WalletStatementMetrics } from '../types';
import { IconBack, IconCalendar, IconFilter, IconSearch, IconChevronDown, IconCheckCircle, IconPlusCircle, IconMinusCircle } from './Icons';

interface Props {
  onBack: () => void;
  walletId: string;
}

// --- Sub-components ---

const WalletDateRangePicker = ({ selectedRange, onChange }: { selectedRange: string, onChange: (range: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ranges = [
    'Today',
    'Yesterday',
    'This Week',
    'This Month',
    'Last Month',
    'YTD'
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
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-900 bg-white shadow-sm transition-all min-w-[140px] justify-between"
      >
         <div className="flex items-center gap-2">
            <IconCalendar className="w-4 h-4 text-slate-400" />
            <span className="font-medium font-sans">{selectedRange}</span>
         </div>
         <IconChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
          {ranges.map((range) => (
            <div 
              key={range} 
              className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between ${selectedRange === range ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
              onClick={() => {
                onChange(range);
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

// --- Mock Data Generators ---

const getWalletDataByRange = (walletId: string, range: string) => {
  // 1. Identify Wallet Basics based on new ID list
  let walletInfo: Wallet;

  switch (walletId) {
    case '1':
        walletInfo = { id: '1', name: 'General OVA', accountNumber: 'GEN-OVA-001', provider: 'VeryPay', balance: { currency: 'UGX', amount: -347635687 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' };
        break;
    case '2':
        walletInfo = { id: '2', name: 'Pre-funded OVA', accountNumber: 'PRE-OVA-002', provider: 'VeryPay', balance: { currency: 'UGX', amount: -3999161 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' };
        break;
    case '3':
        walletInfo = { id: '3', name: 'Invoice OVA (MTN)', accountNumber: 'INV-MTN-001', provider: 'MTN', balance: { currency: 'UGX', amount: -11300 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' };
        break;
    case '4':
        walletInfo = { id: '4', name: 'Invoice OVA (Airtel)', accountNumber: 'INV-AIR-002', provider: 'Airtel', balance: { currency: 'UGX', amount: -27639 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' };
        break;
    case '5':
        walletInfo = { id: '5', name: 'Airtel OVA', accountNumber: 'AIR-OVA-001', provider: 'Airtel', balance: { currency: 'UGX', amount: 5458895 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' };
        break;
    case '6':
        walletInfo = { id: '6', name: 'YO OVA (Airtel)', accountNumber: 'YO-AIR-001', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 13500 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' };
        break;
    case '7':
        walletInfo = { id: '7', name: 'YO OVA (MTN)', accountNumber: 'YO-MTN-002', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 15763 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' };
        break;
    case '8':
        walletInfo = { id: '8', name: 'YO OVA (Warid)', accountNumber: 'YO-WAR-003', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 116607794 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' };
        break;
    case '9':
        walletInfo = { id: '9', name: 'Fee Distribution', accountNumber: 'FEE-DIST-01', provider: 'VeryPay', balance: { currency: 'UGX', amount: 286939 }, lastReconciliation: '18/09/25 14:52:10', type: 'Fee' };
        break;
    case '10':
        walletInfo = { id: '10', name: 'Fee Earning', accountNumber: 'FEE-EARN-01', provider: 'VeryPay', balance: { currency: 'UGX', amount: 594628 }, lastReconciliation: '18/09/25 14:52:10', type: 'Fee' };
        break;
    case '11':
        walletInfo = { id: '11', name: 'Airtel Fee Earning', accountNumber: 'FEE-AIR-01', provider: 'Airtel', balance: { currency: 'UGX', amount: 132798 }, lastReconciliation: '18/09/25 14:52:10', type: 'Fee' };
        break;
    case '12':
        walletInfo = { id: '12', name: 'YO Fee Earning', accountNumber: 'FEE-YO-01', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 112340 }, lastReconciliation: '18/09/25 14:52:10', type: 'Fee' };
        break;
    default:
        walletInfo = { id: '1', name: 'General OVA', accountNumber: 'GEN-OVA-001', provider: 'VeryPay', balance: { currency: 'UGX', amount: -347635687 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' };
  }

  // 2. Generate Master List of Transactions (Simulated Database)
  const today = new Date();
  const dateStr = (d: Date, time: string) => `${d.toLocaleDateString('en-GB')} ${time}`;
  
  const getPastDate = (daysAgo: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - daysAgo);
      return d;
  };

  const rawTransactions = [
      // TODAY (0 days ago)
      { id: 't1', daysAgo: 0, time: '14:30', reference: 'REF-NOW-1', description: 'Merchant Settlement', counterparty: 'Kampala Store', type: 'Settlement', debit: 50000, status: 'Pending' },
      { id: 't2', daysAgo: 0, time: '11:15', reference: 'REF-NOW-2', description: 'Top Up', counterparty: 'Equity Bank', type: 'Funding', credit: 300000, status: 'Reconciled' },
      { id: 't3', daysAgo: 0, time: '09:00', reference: 'REF-NOW-3', description: 'Opening Check', counterparty: 'System', type: 'Audit', status: 'Reconciled' },
      
      // YESTERDAY (1 day ago)
      { id: 'y1', daysAgo: 1, time: '16:45', reference: 'REF-YST-1', description: 'EOD Sweep', counterparty: 'Treasury', type: 'Transfer', debit: 1500000, status: 'Reconciled' },
      { id: 'y2', daysAgo: 1, time: '10:00', reference: 'REF-YST-2', description: 'Bulk Collection', counterparty: 'Aggregator', type: 'Collection', credit: 3000000, status: 'Reconciled' },
      
      // THIS WEEK (2-6 days ago)
      { id: 'w1', daysAgo: 2, time: '14:20', reference: 'REF-WK-1', description: 'Fee Payout', counterparty: 'Partner A', type: 'Fee', debit: 45000, status: 'Reconciled' },
      { id: 'w2', daysAgo: 3, time: '09:15', reference: 'REF-WK-2', description: 'Liquidity Injection', counterparty: 'Central Bank', type: 'Funding', credit: 5000000, status: 'Reconciled' },
      { id: 'w3', daysAgo: 4, time: '11:00', reference: 'REF-WK-3', description: 'Merchant Settlement', counterparty: 'City Supermarket', type: 'Settlement', debit: 120000, status: 'Reconciled' },
      
      // THIS MONTH (7-29 days ago)
      { id: 'm1', daysAgo: 10, time: '15:30', reference: 'REF-M-1', description: 'Monthly Server Fee', counterparty: 'AWS', type: 'OpEx', debit: 2500000, status: 'Reconciled' },
      { id: 'm2', daysAgo: 15, time: '08:45', reference: 'REF-M-2', description: 'Large Deposit', counterparty: 'Agent Network', type: 'Collection', credit: 12000000, status: 'Reconciled' },
      { id: 'm3', daysAgo: 20, time: '13:00', reference: 'REF-M-3', description: 'Tax Remittance', counterparty: 'URA', type: 'Tax', debit: 3400000, status: 'Reconciled' },
      { id: 'm4', daysAgo: 25, time: '10:00', reference: 'REF-M-4', description: 'System Adjustment', counterparty: 'Ops Team', type: 'Adjustment', credit: 500, status: 'Reconciled' },

      // OLDER (Last Month / YTD)
      { id: 'old1', daysAgo: 45, time: '12:00', reference: 'REF-OLD-1', description: 'Q3 Disbursement', counterparty: 'Multiple', type: 'Disbursement', debit: 45000000, status: 'Reconciled' },
      { id: 'old2', daysAgo: 60, time: '12:00', reference: 'REF-OLD-2', description: 'Capital Funding', counterparty: 'Investors', type: 'Funding', credit: 150000000, status: 'Reconciled' },
  ];

  // 3. Filter Transactions based on Range
  let filteredRaw = [];
  let periodStart = '';
  let periodEnd = dateStr(today, '');

  switch (range) {
      case 'Today':
          filteredRaw = rawTransactions.filter(t => t.daysAgo === 0);
          periodStart = dateStr(today, '');
          break;
      case 'Yesterday':
          filteredRaw = rawTransactions.filter(t => t.daysAgo === 1);
          const y = getPastDate(1);
          periodStart = dateStr(y, '');
          periodEnd = dateStr(y, '');
          break;
      case 'This Week':
          filteredRaw = rawTransactions.filter(t => t.daysAgo <= 7);
          periodStart = dateStr(getPastDate(7), '');
          break;
      case 'This Month':
          filteredRaw = rawTransactions.filter(t => t.daysAgo <= 30);
          periodStart = dateStr(getPastDate(30), '');
          break;
      case 'Last Month':
          filteredRaw = rawTransactions.filter(t => t.daysAgo > 30 && t.daysAgo <= 60);
          periodStart = dateStr(getPastDate(60), '');
          periodEnd = dateStr(getPastDate(30), '');
          break;
      case 'YTD':
          filteredRaw = rawTransactions; // All mock data
          periodStart = '01/01/2025';
          break;
      default:
          filteredRaw = rawTransactions.filter(t => t.daysAgo <= 30);
          periodStart = dateStr(getPastDate(30), '');
  }

  // 4. Transform to Ledger Items & Calculate Totals
  let totalCredits = 0;
  let totalDebits = 0;

  const ledgerItems: WalletLedgerItem[] = filteredRaw.map(t => {
      const d = getPastDate(t.daysAgo);
      if (t.credit) totalCredits += t.credit;
      if (t.debit) totalDebits += t.debit;
      
      return {
          id: t.id,
          transactionId: `TX-${t.id}`,
          reference: t.reference,
          date: dateStr(d, t.time),
          description: t.description,
          counterparty: t.counterparty,
          type: t.type,
          debit: t.debit ? { currency: walletInfo.balance.currency, amount: t.debit } : undefined,
          credit: t.credit ? { currency: walletInfo.balance.currency, amount: t.credit } : undefined,
          balance: { currency: walletInfo.balance.currency, amount: 0 }, // Placeholder, calc below
          status: t.status as any
      };
  });

  // 5. Calculate Opening Balance (Backwards from Current Closing Balance)
  let closingBalanceAmt = walletInfo.balance.amount;
  
  const minDaysAgo = Math.min(...filteredRaw.map(t => t.daysAgo), 999);
  const newerTransactions = rawTransactions.filter(t => t.daysAgo < minDaysAgo);
  
  let newerCredits = 0;
  let newerDebits = 0;
  newerTransactions.forEach(t => {
      if (t.credit) newerCredits += t.credit;
      if (t.debit) newerDebits += t.debit;
  });

  if (filteredRaw.length > 0) {
      closingBalanceAmt = walletInfo.balance.amount - newerCredits + newerDebits;
  }

  const openingBalanceAmt = closingBalanceAmt - totalCredits + totalDebits;

  // 6. Assign Running Balances to Ledger Rows
  let runningBal = closingBalanceAmt;
  
  const processedLedger = ledgerItems.map(item => {
      const rowBalance = runningBal;
      
      if (item.credit) runningBal -= item.credit.amount;
      if (item.debit) runningBal += item.debit.amount;
      
      return {
          ...item,
          balance: { currency: walletInfo.balance.currency, amount: rowBalance }
      };
  });

  const metrics: WalletStatementMetrics = {
      periodStart,
      periodEnd,
      openingBalance: { currency: walletInfo.balance.currency, amount: openingBalanceAmt },
      totalDebits: { currency: walletInfo.balance.currency, amount: totalDebits },
      totalCredits: { currency: walletInfo.balance.currency, amount: totalCredits },
      closingBalance: { currency: walletInfo.balance.currency, amount: closingBalanceAmt }
  };

  return { walletInfo, metrics, ledger: processedLedger };
};

// --- Main Component ---

const WalletDetailView: React.FC<Props> = ({ onBack, walletId }) => {
  const [dateRange, setDateRange] = useState('This Month');

  // Fetch data based on selected range and walletId
  const { walletInfo, metrics, ledger } = useMemo(() => getWalletDataByRange(walletId, dateRange), [walletId, dateRange]);

  // Determine Net Movement color
  const netMovement = metrics.totalCredits.amount - metrics.totalDebits.amount;
  const netMovementColor = netMovement >= 0 ? 'text-emerald-700' : 'text-red-700';
  const netMovementPrefix = netMovement >= 0 ? '+' : '';

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      
      {/* 1. Header Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
        <div>
           <button 
             onClick={onBack}
             className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-1 text-sm font-medium"
           >
             <IconBack className="w-4 h-4" /> Back to Wallets
           </button>
           <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              {walletInfo.name}
              <span className="text-sm    font-normal text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                {walletInfo.accountNumber}
              </span>
           </h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right mr-2">
              <div className="text-xs font-light text-slate-500 uppercase tracking-wide">Last Reconciled</div>
              <div className="text-sm    text-slate-900">{walletInfo.lastReconciliation}</div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
        
        {/* 2. Financial Position Statement (Reconciliation Strip) */}
        <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    Statement Summary
                    <span className="text-xs font-normal text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        {metrics.periodStart} - {metrics.periodEnd}
                    </span>
                </h3>
                {/* Net Change Indicator */}
                <div className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                    Net Change: <span className={`   font-bold ${netMovementColor}`}>{netMovementPrefix}{netMovement.toLocaleString()}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-0 overflow-hidden flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                
                {/* Opening */}
                <div className="flex-1 p-5 flex flex-col justify-center">
                    <span className="text-xs font-light text-slate-500 uppercase tracking-wide mb-1">Opening Balance</span>
                    <span className={`text-lg    font-bold ${metrics.openingBalance.amount < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                        {metrics.openingBalance.currency} {metrics.openingBalance.amount.toLocaleString()}
                    </span>
                </div>

                {/* Operator + */}
                <div className="hidden lg:flex items-center justify-center w-8 bg-white text-slate-300">
                    <IconPlusCircle className="w-5 h-5" />
                </div>

                {/* Money In */}
                <div className="flex-1 p-5 flex flex-col justify-center relative overflow-hidden">
                    <span className="text-xs font-light text-emerald-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        Money In <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 rounded-full font-normal lowercase">credits</span>
                    </span>
                    <span className="text-xl    font-bold text-emerald-700">
                        +{metrics.totalCredits.amount.toLocaleString()}
                    </span>
                </div>

                {/* Operator - */}
                <div className="hidden lg:flex items-center justify-center w-8 bg-white text-slate-300">
                    <IconMinusCircle className="w-5 h-5" />
                </div>

                {/* Money Out */}
                <div className="flex-1 p-5 flex flex-col justify-center relative overflow-hidden">
                     <span className="text-xs font-light text-red-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        Money Out <span className="text-[10px] text-red-600 bg-red-50 px-1.5 rounded-full font-normal lowercase">debits</span>
                    </span>
                    <span className="text-xl    font-bold text-red-700">
                        -{metrics.totalDebits.amount.toLocaleString()}
                    </span>
                </div>

                {/* Operator = */}
                <div className="hidden lg:flex items-center justify-center w-8 bg-white text-slate-300 font-light text-xl">
                    =
                </div>

                {/* Closing */}
                <div className="flex-1 p-5 flex flex-col justify-center bg-slate-50">
                    <span className="text-xs font-light text-slate-900 uppercase tracking-wide mb-1">Closing Balance</span>
                    <span className={`text-2xl    font-extrabold ${metrics.closingBalance.amount < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        {metrics.closingBalance.currency} {metrics.closingBalance.amount.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>

        {/* 3. Ledger Toolbar */}
        <div className="bg-white border border-slate-200 rounded-t-xl border-b-0 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
           
           <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Interactive Date Filter */}
              <WalletDateRangePicker 
                selectedRange={dateRange} 
                onChange={setDateRange} 
              />
              
              {/* Type Filter */}
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-900 bg-white shadow-sm">
                 <IconFilter className="w-4 h-4 text-slate-400" />
                 <span className="font-sans font-medium">All Types</span>
                 <IconChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
           </div>

           {/* Search */}
           <div className="relative w-full md:w-64">
              <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                 type="text" 
                 placeholder="Search transaction ref..." 
                 className="w-full pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400"
              />
           </div>

        </div>

        {/* 4. Ledger Table */}
        <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                       <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                       <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Ref / Type</th>
                       <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Description / Counterparty</th>
                       <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Debit</th>
                       <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Credit</th>
                       <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Running Balance</th>
                       <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {ledger.map(item => (
                       <tr key={item.id} className="hover:bg-slate-50 group transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap    text-xs text-slate-600">
                             {item.date}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                             <div className="flex flex-col">
                                <span className="text-xs    font-medium text-blue-600 cursor-pointer hover:underline">{item.reference}</span>
                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-0.5">{item.type}</span>
                             </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                             <div className="flex flex-col max-w-[200px]">
                                <span className="text-sm font-medium text-slate-900 truncate" title={item.description}>{item.description}</span>
                                <span className="text-xs text-slate-500 font-light truncate" title={item.counterparty}>{item.counterparty}</span>
                             </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right    text-sm font-medium text-slate-900">
                             {item.debit ? (
                                <span className="text-red-600">
                                   -{item.debit.amount.toLocaleString()} <span className="text-[10px] text-red-400">{item.debit.currency}</span>
                                </span>
                             ) : <span className="text-slate-300 font-light">-</span>}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right    text-sm font-medium text-slate-900">
                             {item.credit ? (
                                <span className="text-emerald-700">
                                   +{item.credit.amount.toLocaleString()} <span className="text-[10px] text-emerald-500">{item.credit.currency}</span>
                                </span>
                             ) : <span className="text-slate-300 font-light">-</span>}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right    text-sm font-bold text-slate-800 bg-slate-50/50 group-hover:bg-white border-l border-transparent group-hover:border-slate-100 transition-colors">
                             <span className={item.balance.amount < 0 ? 'text-red-600' : 'text-slate-900'}>
                                {item.balance.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{item.balance.currency}</span>
                             </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                             {item.status === 'Reconciled' && (
                                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600" title="Reconciled">
                                   <IconCheckCircle className="w-4 h-4" />
                                </div>
                             )}
                             {item.status === 'Pending' && (
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                   PENDING
                                </span>
                             )}
                             {item.status === 'Uncleared' && (
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                   UNCLEARED
                                </span>
                             )}
                          </td>
                       </tr>
                    ))}
                    
                    {ledger.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                                No transactions found for this period.
                            </td>
                        </tr>
                    )}
                 </tbody>
              </table>
           </div>
           
           {/* Footer Pagination */}
           <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-500 font-light">
              <div>Showing {ledger.length} transactions</div>
              <div className="flex gap-2">
                 <button disabled className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-300 cursor-not-allowed">Previous</button>
                 <button disabled className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-300 cursor-not-allowed">Next</button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default WalletDetailView;
