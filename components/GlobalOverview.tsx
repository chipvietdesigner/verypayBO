
import React from 'react';
import { IconUsers, IconBuilding, IconActivity, IconChart, IconGlobe, IconArrowRight, IconTrendingUp } from './Icons';

const StatCard = ({ title, value, subtext, icon, trend }: { title: string; value: string; subtext?: string; icon: React.ReactNode; trend?: string }) => (
  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
      {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
      {trend && (
         <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-1.5 py-0.5 rounded">
            <IconTrendingUp className="w-3 h-3" />
            {trend}
         </div>
      )}
    </div>
    <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
      {icon}
    </div>
  </div>
);

const TenantOverviewCard = ({ 
  name, 
  schools, 
  users, 
  transacting, 
  code 
}: { 
  name: string; 
  schools: number; 
  users: number; 
  transacting: number;
  code: string;
}) => (
  <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="p-4 border-b border-slate-100 flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-slate-800">{name}</h3>
            <span className="text-[10px]    bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{code}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
           <span className="flex items-center gap-1"><IconBuilding className="w-3 h-3" /> {schools} Schools</span>
        </div>
      </div>
      <button className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
         Details <IconArrowRight className="w-3 h-3" />
      </button>
    </div>
    
    <div className="p-4 grid grid-cols-2 gap-4">
       <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Users</p>
          <p className="text-lg font-bold text-slate-900">{users.toLocaleString()}</p>
       </div>
       <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Active (30d)</p>
          <div className="flex items-end gap-2">
             <p className="text-lg font-bold text-slate-900">{transacting.toLocaleString()}</p>
             <span className="text-[10px] text-emerald-600 font-bold mb-1.5">
                {Math.round((transacting / users) * 100)}%
             </span>
          </div>
       </div>
    </div>
    
    {/* Visual Progress Bar */}
    <div className="px-4 pb-4">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
                className="bg-blue-600 h-full rounded-full" 
                style={{ width: `${(transacting / users) * 100}%` }}
            ></div>
        </div>
    </div>
  </div>
);

const GlobalOverview: React.FC = () => {
  return (
    <div className="p-6 h-full overflow-y-auto font-sans bg-slate-50/50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-slate-900">Global Overview</h1>
        <div className="flex gap-2 text-sm text-slate-500">
           <span>Last updated: <span className="font-bold text-slate-800">Just now</span></span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Tenants" 
          value="4" 
          icon={<IconGlobe className="w-5 h-5" />} 
        />
        <StatCard 
          title="Total Users" 
          value="1,245" 
          trend="+12% vs last month"
          icon={<IconUsers className="w-5 h-5" />} 
        />
        <StatCard 
          title="Active Schools" 
          value="142" 
          subtext="Across 4 regions"
          icon={<IconBuilding className="w-5 h-5" />} 
        />
        <StatCard 
          title="Total Volume (YTD)" 
          value="UGX 15.6B" 
          trend="+8.5%"
          icon={<IconActivity className="w-5 h-5" />} 
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
         <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Tenant Performance</h2>
      </div>

      {/* Tenant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         <TenantOverviewCard 
            name="Cashless School Uganda" 
            code="CSS-UG"
            schools={94} 
            users={816} 
            transacting={506} 
         />
         <TenantOverviewCard 
            name="VeryPay Kenya Ltd" 
            code="VP-KE"
            schools={28} 
            users={245} 
            transacting={180} 
         />
         <TenantOverviewCard 
            name="Tanzania Payments" 
            code="TZ-PAY"
            schools={11} 
            users={83} 
            transacting={29} 
         />
         <TenantOverviewCard 
            name="AFTEL Services" 
            code="AFT-01"
            schools={4} 
            users={70} 
            transacting={66} 
         />
         <TenantOverviewCard 
            name="Sakkonet Retail" 
            code="SR-UG"
            schools={5} 
            users={31} 
            transacting={3} 
         />
      </div>
    </div>
  );
};

export default GlobalOverview;
