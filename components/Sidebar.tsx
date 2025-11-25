import React, { useState } from 'react';
import {
  IconDashboard, IconSettings, IconTenants, IconUsers, IconProcedure, IconAudit, IconChangeRequest,
  IconHome, IconSchool, IconAttendance, IconStudent, IconMerchant, IconTransaction, IconDocument,
  IconToken, IconPosDevice, IconDevice, IconInvoice, IconAccounting, IconLimits, IconRevenue,
  IconReport, IconNotification, IconAdmin, IconChevronDown, IconChevronRight
} from './Icons';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, hasSubmenu, isExpanded, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors
      ${isActive ? 'bg-red-50 text-red-600 border-l-4 border-red-500' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'}
    `}
  >
    <div className="flex items-center gap-3">
      <span className={isActive ? 'text-red-600' : 'text-slate-400'}>{icon}</span>
      <span>{label}</span>
    </div>
    {hasSubmenu && (
      <span className="text-slate-400">
        {isExpanded ? <IconChevronDown /> : <IconChevronRight />}
      </span>
    )}
  </div>
);

interface SidebarProps {
  onNavigate?: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const [studentsExpanded, setStudentsExpanded] = useState(false);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-3.5rem)] overflow-y-auto fixed top-14 left-0 hidden lg:block custom-scrollbar">
      <div className="py-4">
        <div className="px-4 mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Global</div>
        <nav className="space-y-0.5">
          <NavItem icon={<IconDashboard />} label="Overview" />
          <NavItem icon={<IconSettings />} label="Configuration" />
          <NavItem icon={<IconTenants />} label="Tenants" />
          <NavItem icon={<IconUsers />} label="Master admins" />
          <NavItem icon={<IconProcedure />} label="EoD procedure" />
          <NavItem icon={<IconAudit />} label="Audit log" />
          <NavItem icon={<IconChangeRequest />} label="Change requests" />
        </nav>

        <div className="mt-6 px-4 mb-2 flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
           <span>Tenant</span>
           <span className="h-px bg-slate-200 flex-1"></span>
        </div>
        
        <div className="px-4 mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center text-white text-xs font-bold">O</div>
            <span className="font-bold text-sm text-slate-800">Cashless School Uga...</span>
        </div>

        <nav className="space-y-0.5">
          <NavItem icon={<IconHome />} label="Home" />
          <NavItem icon={<IconSchool />} label="Schools" />
          <NavItem icon={<IconAttendance />} label="Attendance" hasSubmenu />
          
          <NavItem 
            icon={<IconStudent />} 
            label="Students" 
            hasSubmenu 
            isExpanded={studentsExpanded} 
            onClick={() => setStudentsExpanded(!studentsExpanded)}
          />
          {studentsExpanded && (
             <div className="bg-slate-50 py-1">
                <div className="pl-12 pr-4 py-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">List of students</div>
                <div className="pl-12 pr-4 py-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">Mass onboarding</div>
             </div>
          )}

          <NavItem icon={<IconUsers />} label="Guardians" />
          <NavItem icon={<IconMerchant />} label="Merchants & Agents" />
          <NavItem 
            icon={<IconTransaction />} 
            label="Transactions" 
            isActive 
            onClick={() => onNavigate && onNavigate('transactions')}
          />
          <NavItem icon={<IconDocument />} label="Documents submission" />
          <NavItem icon={<IconToken />} label="Payment tokens" />
          <NavItem icon={<IconPosDevice />} label="POS devices" />
          <NavItem icon={<IconDevice />} label="Devices" />
          
          <div className="my-2 h-px bg-slate-100 mx-4"></div>
          
          <NavItem icon={<IconInvoice />} label="Invoices" hasSubmenu />
          <NavItem icon={<IconAccounting />} label="Accounting" hasSubmenu />
          <NavItem icon={<IconLimits />} label="Limits" hasSubmenu />
          <NavItem icon={<IconRevenue />} label="Revenue sharing" hasSubmenu />
          <NavItem icon={<IconReport />} label="Reports" hasSubmenu />
          <NavItem icon={<IconNotification />} label="Notification service" />
          <NavItem icon={<IconChangeRequest />} label="Change requests" hasSubmenu />
          <NavItem icon={<IconSettings />} label="Configuration" hasSubmenu />
          <NavItem icon={<IconAdmin />} label="Administration" hasSubmenu />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;