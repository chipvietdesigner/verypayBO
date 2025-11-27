
import React, { useState } from 'react';
import { Wallet } from '../types';
import { IconRefresh, IconSearch, IconArrowRight } from './Icons';

interface Props {
  onWalletClick: (id: string) => void;
}

const WalletRow = ({ wallet, onClick }: { wallet: Wallet; onClick: () => void }) => {
  const isFeeAccount = wallet.type === 'Fee';
  const isNegative = wallet.balance.amount < 0;

  return (
    <tr 
      onClick={onClick}
      className="group hover:bg-slate-50 border-b border-slate-100 last:border-0 cursor-pointer transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex flex-col justify-center">
            <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
              {wallet.name}
            </div>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-xs    text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                 {wallet.accountNumber}
               </span>
               {isFeeAccount && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Fee Account</span>}
            </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
           <span className="text-sm font-medium text-slate-700">{wallet.provider}</span>
           <span className="text-xs text-slate-400 capitalize">{wallet.type} Ledger</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className={`   font-bold text-base ${isNegative ? 'text-red-600' : 'text-slate-900'}`}>
          {wallet.balance.amount.toLocaleString()} <span className="text-xs text-slate-500 font-medium">{wallet.balance.currency}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
         <div className="flex flex-col items-end">
            <span className="text-xs    text-slate-600">{wallet.lastReconciliation}</span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Reconciled
            </span>
         </div>
      </td>
      <td className="px-6 py-4 text-right">
         <IconArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 ml-auto transition-colors" />
      </td>
    </tr>
  );
};

const LiquidityOverview = ({ 
    total, 
    internal, 
    external, 
    currency 
}: { 
    total: number, 
    internal: number, 
    external: number, 
    currency: string 
}) => {
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            
            {/* Breakdown Cards */}
            <div className="lg:col-span-3 bg-white p-5 rounded-xl border-l-4 border-indigo-600 border-y border-r border-slate-200 shadow-sm flex flex-col justify-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Internal Float</span>
                <div className={`text-xl font-bold    mb-1 ${internal < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                    {currency} {internal.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">Operating Accounts</div>
            </div>

            <div className="lg:col-span-3 bg-white p-5 rounded-xl border-l-4 border-emerald-500 border-y border-r border-slate-200 shadow-sm flex flex-col justify-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">External Holdings</span>
                <div className={`text-xl font-bold    mb-1 ${external < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                    {currency} {external.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">Provider Accounts</div>
            </div>

        </div>
    );
};

const WalletsListView: React.FC<Props> = ({ onWalletClick }) => {
  const [filterType, setFilterType] = useState('All');

  // Updated Mock Data based on user request
  const wallets: Wallet[] = [
    // Internal (OVAs with negative balances usually represent float usage or liability)
    { id: '1', name: 'General OVA', accountNumber: 'GEN-OVA-001', provider: 'VeryPay', balance: { currency: 'UGX', amount: -347635687 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' },
    { id: '2', name: 'Pre-funded OVA', accountNumber: 'PRE-OVA-002', provider: 'VeryPay', balance: { currency: 'UGX', amount: -3999161 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' },
    
    // External (Invoice OVAs - often negative as they are payable accounts)
    { id: '3', name: 'Invoice OVA (MTN)', accountNumber: 'INV-MTN-001', provider: 'MTN', balance: { currency: 'UGX', amount: -11300 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '4', name: 'Invoice OVA (Airtel)', accountNumber: 'INV-AIR-002', provider: 'Airtel', balance: { currency: 'UGX', amount: -27639 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    
    // External (Provider OVAs - Positive balances represent liquid funds held at provider)
    { id: '5', name: 'Airtel OVA', accountNumber: 'AIR-OVA-001', provider: 'Airtel', balance: { currency: 'UGX', amount: 5458895 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '6', name: 'YO OVA (Airtel)', accountNumber: 'YO-AIR-001', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 13500 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '7', name: 'YO OVA (MTN)', accountNumber: 'YO-MTN-002', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 15763 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '8', name: 'YO OVA (Warid)', accountNumber: 'YO-WAR-003', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 116607794 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },

    // Fee Accounts
    { id: '9', name: 'Fee Distribution', accountNumber: 'FEE-DIST-01', provider: 'VeryPay', balance: { currency: 'UGX', amount: 286939 }, lastReconciliation: '18/09/25 14:52:10', type: 'Fee' },
    { id: '10', name: 'Fee Earning', accountNumber: 'FEE-EARN-01', provider: 'VeryPay', balance: { currency: 'UGX', amount: 594628 }, lastReconciliation: '18/09/25 14:52:10', type: 'Fee' },
    { id: '11', name: 'Airtel Fee Earning', accountNumber: 'FEE-AIR-01', provider: 'Airtel', balance: { currency: 'UGX', amount: 132798 }, lastReconciliation: '18/09/25 14:52:10', type: 'Fee' },
    { id: '12', name: 'YO Fee Earning', accountNumber: 'FEE-YO-01', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 112340 }, lastReconciliation: '18/09/25 14:52:10', type: 'Fee' },
  ];

  const filteredWallets = filterType === 'All' ? wallets : wallets.filter(w => w.type === filterType || (filterType === 'External' && w.provider !== 'VeryPay'));

  // Aggregation Logic
  const internalTotal = wallets.filter(w => w.type === 'Internal' || w.type === 'Fee').reduce((sum, w) => sum + w.balance.amount, 0);
  const externalTotal = wallets.filter(w => w.type === 'External').reduce((sum, w) => sum + w.balance.amount, 0);
  const totalLiquidity = internalTotal + externalTotal;

  return (
    <div className="p-6 h-full overflow-y-auto font-sans bg-slate-50/50">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Wallet Management</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor liquidity positions across internal and external accounts.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
             <IconRefresh className="w-4 h-4" /> Refresh data
           </button>
        </div>
      </div>

      {/* Enhanced Liquidity Overview */}
      <LiquidityOverview 
        total={totalLiquidity} 
        internal={internalTotal} 
        external={externalTotal} 
        currency="UGX" 
      />

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
           
           {/* Tabs */}
           <div className="flex p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
              {['All', 'Internal', 'External', 'Fee'].map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setFilterType(tab)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filterType === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                    {tab}
                 </button>
              ))}
           </div>

           {/* Search */}
           <div className="relative w-full sm:w-64">
              <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                 type="text" 
                 placeholder="Search wallets..." 
                 className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50"
              />
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
               <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Account Details</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Type / Provider</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Current Balance</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Last Reconciliation</th>
                  <th className="px-6 py-3"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {filteredWallets.map(wallet => (
                  <WalletRow key={wallet.id} wallet={wallet} onClick={() => onWalletClick(wallet.id)} />
               ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
           <span>Showing {filteredWallets.length} accounts</span>
           <div className="flex gap-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> VeryPay (Internal)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Provider (External)</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WalletsListView;
