import React from 'react';
import { 
  IconBuilding, 
  IconUsers, 
  IconMerchant, 
  IconSchool, 
  IconArrowRight, 
  IconBarChart, 
  IconTrendingUp,
  IconActivity,
  IconGlobe,
  IconZap
} from './Icons';

// Mock Data Types
interface TenantStats {
  id: string;
  name: string;
  country: string;
  onboarding: {
    schools: number;
    merchants: number;
  };
  users: {
    total: number;
    active: number;
    customers: number;
    members: number;
  };
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

const GlobalMetricCard = ({ title, value, icon, trend, color }: { title: string, value: string, icon: React.ReactNode, trend?: string, color: string }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
          <IconTrendingUp className="w-3 h-3" />
          <span>{trend} vs last month</span>
        </div>
      )}
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      {icon}
    </div>
  </div>
);

const TenantCard = ({ tenant }: { tenant: TenantStats }) => {
  const activationRate = Math.round((tenant.users.active / tenant.users.total) * 100) || 0;
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
            {tenant.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{tenant.name}</h4>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <IconGlobe className="w-3 h-3" />
              {tenant.country}
            </div>
          </div>
        </div>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
          View Details
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="p-5 grid grid-cols-2 gap-y-6 gap-x-4">
        
        {/* Onboarding Stats */}
        <div className="col-span-2 sm:col-span-1">
           <div className="flex items-center gap-2 mb-2">
              <IconBuilding className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Infrastructure</span>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Schools</span>
                <span className="font-bold text-slate-900">{tenant.onboarding.schools}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Merchants</span>
                <span className="font-bold text-slate-900">{tenant.onboarding.merchants}</span>
              </div>
           </div>
        </div>

        {/* User Stats */}
        <div className="col-span-2 sm:col-span-1 border-l border-slate-100 pl-4">
           <div className="flex items-center gap-2 mb-2">
              <IconUsers className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ecosystem</span>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Customers</span>
                <span className="font-bold text-slate-900">{tenant.users.customers}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Members</span>
                <span className="font-bold text-slate-900">{tenant.users.members}</span>
              </div>
           </div>
        </div>

        {/* Activity Bar */}
        <div className="col-span-2 pt-4 border-t border-slate-100">
           <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-xs text-slate-500 font-medium">Active Users</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-slate-900">{tenant.users.active}</span>
                  <span className="text-xs text-slate-400">/ {tenant.users.total}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold ${activationRate > 50 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {activationRate}% Rate
                </span>
              </div>
           </div>
           {/* Progress Bar */}
           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
             <div 
                className={`h-full rounded-full ${activationRate > 50 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                style={{ width: `${activationRate}%` }}
             ></div>
           </div>
        </div>
      </div>
    </div>
  );
};

const GlobalOverview = () => {
  // Mock Data
  const tenants: TenantStats[] = [
    {
      id: '1', name: 'AFTEL', country: 'Global',
      onboarding: { schools: 0, merchants: 4 },
      users: { total: 70, active: 12, customers: 66, members: 0 },
      trend: 'up', trendValue: '5%'
    },
    {
      id: '2', name: 'Cashless School Ivory Coast', country: 'Ivory Coast',
      onboarding: { schools: 11, merchants: 0 },
      users: { total: 83, active: 45, customers: 29, members: 54 },
      trend: 'up', trendValue: '12%'
    },
    {
      id: '3', name: 'Cashless School Senegal', country: 'Senegal',
      onboarding: { schools: 20, merchants: 0 },
      users: { total: 816, active: 620, customers: 506, members: 310 },
      trend: 'up', trendValue: '24%'
    },
    {
      id: '4', name: 'Sakkonet Retail Uganda', country: 'Uganda',
      onboarding: { schools: 0, merchants: 0 },
      users: { total: 3, active: 0, customers: 3, members: 0 },
      trend: 'neutral', trendValue: '0%'
    },
    {
      id: '5', name: 'VeryPay Cashless Schools', country: 'Vietnam',
      onboarding: { schools: 94, merchants: 12 },
      users: { total: 1240, active: 980, customers: 800, members: 440 },
      trend: 'up', trendValue: '15%'
    }
  ];

  return (
    <div className="h-screen bg-slate-50 font-sans flex flex-col overflow-hidden">
       {/* Header */}
       <div className="px-6 py-5 border-b border-slate-200 bg-white flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Global Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time monitoring of all active tenants</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                Last updated: Just now
             </span>
             <button className="flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                <IconBarChart className="w-4 h-4" /> Reports
             </button>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {/* 1. Global Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               <GlobalMetricCard 
                  title="Total Tenants" 
                  value="12" 
                  trend="2"
                  icon={<IconBuilding className="w-6 h-6 text-blue-600" />}
                  color="bg-blue-50"
               />
               <GlobalMetricCard 
                  title="Total Userbase" 
                  value="24.5k" 
                  trend="12.5%"
                  icon={<IconUsers className="w-6 h-6 text-purple-600" />}
                  color="bg-purple-50"
               />
               <GlobalMetricCard 
                  title="Active Schools" 
                  value="142" 
                  trend="8%"
                  icon={<IconSchool className="w-6 h-6 text-orange-600" />}
                  color="bg-orange-50"
               />
               <GlobalMetricCard 
                  title="Transactions (24h)" 
                  value="8,291" 
                  trend="5%"
                  icon={<IconActivity className="w-6 h-6 text-emerald-600" />}
                  color="bg-emerald-50"
               />
            </div>

            {/* 2. Tenant Grid */}
            <div>
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Active Tenants</h3>
                  <div className="flex gap-2">
                     <button className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm">Filter</button>
                     <button className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm">Sort by Activity</button>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tenants.map(tenant => (
                    <TenantCard key={tenant.id} tenant={tenant} />
                  ))}
               </div>
            </div>

          </div>
       </div>
    </div>
  );
};

export default GlobalOverview;
