
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Wallet, WalletLedgerItem, WalletStatementMetrics } from '../types';
import { IconBack, IconCalendar, IconFilter, IconSearch, IconChevronDown, IconCheckCircle, IconPlusCircle, IconMinusCircle } from './Icons';

interface Props {
  onBack: () => void;
  walletId: string;
}

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

const getWalletDataByRange = (walletId: string, range: string) => {
  let walletInfo: Wallet;

  switch (walletId) {
    case '1':
        walletInfo = { id: '1', name: 'General OVA', accountNumber: 'GEN-OVA-001', provider: 'VeryPay', balance: { currency: 'UGX', amount: -347635687 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' };
        break;
    case '2':
        walletInfo = { id: '2', name: 'Pre-funded OVA', accountNumber: 'PRE-OVA-002', provider: 'VeryPay', balance: { currency: 'UGX', amount: -3999161 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' };
        break;
    default:
        walletInfo = { id: walletId, name: 'Wallet ' + walletId, accountNumber: 'ACC-'+walletId, provider: 'Generic', balance: { currency: 'UGX', amount: 100000 }, lastReconciliation: 'N/A', type: 'External' };
  }

  const today = new Date();
  const dateStr = (d: Date, time: string) => `${d.toLocaleDateString('en-GB')} ${time}`;
  const getPastDate = (daysAgo: number) => { const d = new Date(today); d.setDate(d.getDate() - daysAgo); return d; };

  const rawTransactions = [
      { id: 't1', daysAgo: 0, time: '14:30', reference: 'REF-NOW-1', description: 'Merchant Settlement', counterparty: 'Kampala Store', type: 'Settlement', debit: 50000, status: 'Pending' },
      { id: 't2', daysAgo: 0, time: '11:15', reference: 'REF-NOW-2', description: 'Top Up', counterparty: 'Equity Bank', type: 'Funding', credit: 300000, status: 'Reconciled' },
      { id: 'w1', daysAgo: 2, time: '14:20', reference: 'REF-WK-1', description: 'Fee Payout', counterparty: 'Partner A', type: 'Fee', debit: 45000, status: 'Reconciled' },
      { id: 'm1', daysAgo: 10, time: '15:30', reference: 'REF-M-1', description: 'Monthly Server Fee', counterparty: 'AWS', type: 'OpEx', debit: 2500000, status: 'Reconciled' },
      { id: 'old1', daysAgo: 45, time: '12:00', reference: 'REF-OLD-1', description: 'Q3 Disbursement', counterparty: 'Multiple', type: 'Disbursement', debit: 45000000, status: 'Reconciled' },
  ];

  let filteredRaw = rawTransactions;
  if(range === 'Today') filteredRaw = rawTransactions.filter(t => t.daysAgo === 0);
  if(range === 'This Week') filteredRaw = rawTransactions.filter(t => t.daysAgo <= 7);
  if(range === 'This Month') filteredRaw = rawTransactions.filter(t => t.daysAgo <= 30);

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
          balance: { currency: walletInfo.balance.currency, amount: 0 },
          status: t.status as any
      };
  });

  let closingBalanceAmt = walletInfo.balance.amount;
  const openingBalanceAmt = closingBalanceAmt - totalCredits + totalDebits;
  let runningBal = closingBalanceAmt;
  
  const processedLedger = ledgerItems.map(item => {
      const rowBalance = runningBal;
      if (item.credit) runningBal -= item.credit.amount;
      if (item.debit) runningBal += item.debit.amount;
      return { ...item, balance: { currency: walletInfo.balance.currency, amount: rowBalance } };
  });

  return { 
      walletInfo, 
      metrics: {
          periodStart: '01/01/2025', periodEnd: dateStr(today, ''),
          openingBalance: { currency: walletInfo.balance.currency, amount: openingBalanceAmt },
          totalDebits: { currency: walletInfo.balance.currency, amount: totalDebits },
          totalCredits: { currency: walletInfo.balance.currency, amount: totalCredits },
          closingBalance: { currency: walletInfo.balance.currency, amount: closingBalanceAmt }
      }, 
      ledger: processedLedger 
  };
};

const WalletDetailView: React.FC<Props> = ({ onBack, walletId }) => {
  const [dateRange, setDateRange] = useState('This Month');
  const data = useMemo(() => getWalletDataByRange(walletId, dateRange), [walletId, dateRange]);
  const { walletInfo, metrics, ledger } = data;
  const isFeeAccount = walletInfo.type === 'Fee';

  return (
    <div className="p-6 h-full overflow-y-auto font-sans bg-slate-50/50">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors shadow-sm">
          <IconBack className="w-5 h-5" />
        </button>
        <div>
           <div className="flex items-center gap-2">
             <h1 className="text-xl font-bold text-slate-900 tracking-tight">{walletInfo.name}</h1>
             <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">{walletInfo.accountNumber}</span>
             {isFeeAccount && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Fee Account</span>}
           </div>
           <p className="text-sm text-slate-500 mt-1">{walletInfo.provider} • {walletInfo.type} Ledger</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-slate-500 uppercase mb-1">Opening Balance</p>
           <p className="text-lg font-bold text-slate-900">{metrics.openingBalance.currency} {metrics.openingBalance.amount.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Credits</p>
           <p className="text-lg font-bold text-emerald-600">{metrics.totalCredits.currency} {metrics.totalCredits.amount.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Debits</p>
           <p className="text-lg font-bold text-red-600">{metrics.totalDebits.currency} {metrics.totalDebits.amount.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm bg-gradient-to-br from-slate-50 to-white">
           <p className="text-xs font-bold text-slate-500 uppercase mb-1">Closing Balance</p>
           <p className="text-lg font-bold text-blue-700">{metrics.closingBalance.currency} {metrics.closingBalance.amount.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
           <h3 className="text-sm font-bold text-slate-800">Statement of Account</h3>
           <div className="flex items-center gap-3">
              <WalletDateRangePicker selectedRange={dateRange} onChange={setDateRange} />
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm">
                 <IconFilter className="w-4 h-4" /> Filter
              </button>
              <div className="relative">
                 <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                 <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 w-48"/>
              </div>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                 <th className="px-6 py-3 font-semibold text-slate-700 whitespace-nowrap">Date</th>
                 <th className="px-6 py-3 font-semibold text-slate-700 whitespace-nowrap">Transaction ID</th>
                 <th className="px-6 py-3 font-semibold text-slate-700">Description</th>
                 <th className="px-6 py-3 font-semibold text-slate-700">Counterparty</th>
                 <th className="px-6 py-3 font-semibold text-slate-700 text-right">Debit</th>
                 <th className="px-6 py-3 font-semibold text-slate-700 text-right">Credit</th>
                 <th className="px-6 py-3 font-semibold text-slate-700 text-right">Balance</th>
                 <th className="px-6 py-3 font-semibold text-slate-700 text-center">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {ledger.length > 0 ? (
                 ledger.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-3 text-slate-600 whitespace-nowrap text-xs">{item.date}</td>
                     <td className="px-6 py-3 text-blue-600 font-medium whitespace-nowrap text-xs hover:underline cursor-pointer">{item.transactionId}</td>
                     <td className="px-6 py-3 text-slate-800 font-medium">{item.description}</td>
                     <td className="px-6 py-3 text-slate-500">{item.counterparty}</td>
                     <td className="px-6 py-3 text-right font-medium text-slate-900">
                        {item.debit ? item.debit.amount.toLocaleString() : '-'}
                     </td>
                     <td className="px-6 py-3 text-right font-medium text-emerald-600">
                        {item.credit ? item.credit.amount.toLocaleString() : '-'}
                     </td>
                     <td className="px-6 py-3 text-right font-bold text-slate-800">
                        {item.balance.amount.toLocaleString()}
                     </td>
                     <td className="px-6 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                           {item.status}
                        </span>
                     </td>
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">No transactions found for this period.</td>
                 </tr>
               )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalletDetailView;
