
import React from 'react';
import { IconAlertTriangle, IconCheckCircle, IconSearch } from './Icons';

const DiscrepanciesView: React.FC = () => {
  return (
    <div className="p-6 h-full overflow-y-auto font-sans">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 mb-2">Reconciliation Discrepancies</h1>
        <p className="text-sm text-slate-500">Monitor and resolve mismatches between internal ledgers and external provider records.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
         <IconAlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
         <div>
            <h3 className="text-sm font-bold text-amber-800">Attention Required</h3>
            <p className="text-xs text-amber-700 mt-1">There are 3 unresolved discrepancies from the last reconciliation run (18/09/25).</p>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
         <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <div className="relative">
               <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
               />
            </div>
            <div className="flex gap-2">
               <select className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-slate-50">
                  <option>All Statuses</option>
                  <option>Open</option>
                  <option>Resolved</option>
               </select>
            </div>
         </div>
         
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
               <tr>
                  <th className="px-6 py-3 font-semibold text-slate-700">ID</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Date Detected</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Wallet</th>
                  <th className="px-6 py-3 font-semibold text-slate-700 text-right">Internal Balance</th>
                  <th className="px-6 py-3 font-semibold text-slate-700 text-right">External Balance</th>
                  <th className="px-6 py-3 font-semibold text-slate-700 text-right">Difference</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4    text-xs">DISC-001</td>
                  <td className="px-6 py-4 text-slate-600">18/09/25</td>
                  <td className="px-6 py-4 font-medium text-slate-800">VERYPAY OVA YO (MTN)</td>
                  <td className="px-6 py-4 text-right   ">15,763</td>
                  <td className="px-6 py-4 text-right   ">15,500</td>
                  <td className="px-6 py-4 text-right    text-red-600 font-bold">-263</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase">Open</span></td>
                  <td className="px-6 py-4 text-blue-600 font-medium cursor-pointer hover:underline">Investigate</td>
               </tr>
               <tr className="hover:bg-slate-50 bg-slate-50/30">
                  <td className="px-6 py-4    text-xs">DISC-002</td>
                  <td className="px-6 py-4 text-slate-600">17/09/25</td>
                  <td className="px-6 py-4 font-medium text-slate-800">VERYPAY OVA AIRTEL</td>
                  <td className="px-6 py-4 text-right   ">5,458,895</td>
                  <td className="px-6 py-4 text-right   ">5,458,895</td>
                  <td className="px-6 py-4 text-right    text-slate-400">0</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">Resolved</span></td>
                  <td className="px-6 py-4 text-slate-400 cursor-not-allowed">View</td>
               </tr>
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default DiscrepanciesView;
