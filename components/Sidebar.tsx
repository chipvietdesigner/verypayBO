
import React, { useState, useEffect } from 'react';
import {
  IconDashboard, IconSettings, IconTenants, IconUsers, IconProcedure, IconAudit, IconChangeRequest,
  IconHome, IconSchool, IconAttendance, IconStudent, IconMerchant, IconTransaction, IconDocument,
  IconToken, IconPosDevice, IconDevice, IconInvoice, IconAccounting, IconLimits, IconRevenue,
  IconReport, IconNotification, IconAdmin, IconChevronDown, IconChevronRight, IconWallet, IconAlertTriangle,
  IconFilePlus
} from './Icons';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, hasSubmenu, isExpanded, onClick, children }) => (
  <div>
    <div 
      onClick={onClick}
      className={`
        flex items-center justify-between px-4 py-2 cursor-pointer text-sm font-regular text-slate-800 border-l-4 transition-colors
        ${isActive ? 'bg-red-50 text-red-700 border-red-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent'}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Icon Wrapper to enforce size and color consistency */}
        <span className={`transition-colors ${isActive ? 'text-red-600' : 'text-slate-600 group-hover:text-slate-800'}`}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {hasSubmenu && (
        <span className="text-slate-400">
          {isExpanded ? <IconChevronDown className="w-3.5 h-3.5" /> : <IconChevronRight className="w-3.5 h-3.5" />}
        </span>
      )}
    </div>
    {/* Submenu rendering */}
    {hasSubmenu && isExpanded && children}
  </div>
);

const SubNavItem = ({ label, isActive, onClick, icon }: { label: string, isActive?: boolean, onClick: () => void, icon?: React.ReactNode }) => (
  <div 
    onClick={onClick}
    className={`pl-11 pr-4 py-2 cursor-pointer text-xs font-medium flex items-center gap-2 border-l-4 border-transparent hover:bg-slate-50 ${isActive ? 'text-blue-700 bg-blue-50' : 'text-slate-500 hover:text-slate-800'}`}
  >
    {icon}
    {label}
  </div>
);

const GroupHeader = ({ title, isExpanded, onToggle }: { title: string, isExpanded: boolean, onToggle: () => void }) => (
  <div 
    onClick={onToggle}
    className="px-4 mt-6 mb-2 flex items-center justify-between cursor-pointer group select-none"
  >
    <div className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider group-hover:text-black transition-colors">
      {title}
    </div>
    <IconChevronDown 
      className={`w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`} 
    />
  </div>
);

const TenantSelector = () => {
  const tenant = { name: 'Cashless School Uganda', code: 'CSS-UG' };

  return (
    <div className="px-4 mb-2 pt-2 border-t border-slate-200">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
            {tenant.code.split('-')[1]}
          </div>
          <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-slate-900 truncate">{tenant.name}</div>
              <div className="text-[10px] text-slate-500   ">{tenant.code}</div>
          </div>
        </div>
    </div>
  );
};

interface SidebarProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView = 'transactions' }) => {
  const [studentsExpanded, setStudentsExpanded] = useState(false);
  const [accountingExpanded, setAccountingExpanded] = useState(false);
  const [invoicesExpanded, setInvoicesExpanded] = useState(false);
  
  // State for group expansion
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    global: true,
    general: true,
    financials: true,
    operations: true,
    system: true
  });

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Standard icon size for sidebar
  const iconClass = "w-[18px] h-[18px]";

  useEffect(() => {
     if (currentView?.includes('accounting')) {
         setAccountingExpanded(true);
     }
     if (currentView?.includes('invoice')) {
         setInvoicesExpanded(true);
     }
  }, [currentView]);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-3.5rem)] overflow-y-auto fixed top-14 left-0 hidden lg:block custom-scrollbar font-sans z-40">
      <div className="py-4 pb-20">
        
        {/* Global Context */}
        <div 
            onClick={() => toggleGroup('global')}
            className="px-4 mb-2 flex items-center justify-between cursor-pointer group select-none"
        >
            <div className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider group-hover:text-black transition-colors">Global</div>
            <IconChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${expandedGroups.global ? '' : '-rotate-90'}`} />
        </div>
        
        {expandedGroups.global && (
          <nav className="space-y-0.5 mb-4 transition-all duration-300">
            <NavItem icon={<IconDashboard className={iconClass} />} label="Overview" onClick={() => onNavigate && onNavigate('overview')} />
            <NavItem icon={<IconSettings className={iconClass} />} label="Configuration" />
            <NavItem icon={<IconTenants className={iconClass} />} label="Tenants" />
            <NavItem icon={<IconUsers className={iconClass} />} label="Master admins" />
          </nav>
        )}

        {/* Static Tenant Selector */}
        <TenantSelector />

        {/* GROUP: General */}
        <GroupHeader 
          title="General" 
          isExpanded={expandedGroups.general} 
          onToggle={() => toggleGroup('general')} 
        />
        {expandedGroups.general && (
          <nav className="space-y-0.5 transition-all duration-300">
            <NavItem icon={<IconHome className={iconClass} />} label="Home" />
          </nav>
        )}

        {/* GROUP: Operations (Merged) */}
        <GroupHeader 
          title="Operations" 
          isExpanded={expandedGroups.operations} 
          onToggle={() => toggleGroup('operations')} 
        />
        {expandedGroups.operations && (
          <nav className="space-y-0.5 transition-all duration-300">
          <NavItem icon={<IconSchool className={iconClass} />} label="Schools" />
            {/* Academic Operations */}
            <NavItem 
              icon={<IconStudent className={iconClass} />} 
              label="Students" 
              hasSubmenu 
              isExpanded={studentsExpanded} 
              onClick={() => setStudentsExpanded(!studentsExpanded)}
            >
               <SubNavItem label="List of students" onClick={() => {}} />
               <SubNavItem label="Mass onboarding" onClick={() => {}} />
            </NavItem>
            <NavItem icon={<IconUsers className={iconClass} />} label="Guardians" />
            <NavItem icon={<IconAttendance className={iconClass} />} label="Attendance" hasSubmenu />
            
            {/* Payment Infrastructure */}
            <NavItem icon={<IconMerchant className={iconClass} />} label="Merchants & Agents" />
            <NavItem icon={<IconToken className={iconClass} />} label="Payment tokens" />
            <NavItem icon={<IconPosDevice className={iconClass} />} label="POS devices" />
            <NavItem icon={<IconDevice className={iconClass} />} label="Devices" />
          </nav>
        )}

        {/* GROUP: Financials */}
        <GroupHeader 
          title="Financials" 
          isExpanded={expandedGroups.financials} 
          onToggle={() => toggleGroup('financials')} 
        />
        {expandedGroups.financials && (
          <nav className="space-y-0.5 transition-all duration-300">
            <NavItem 
              icon={<IconTransaction className={iconClass} />} 
              label="Transactions" 
              isActive={currentView === 'transactions'} 
              onClick={() => onNavigate && onNavigate('transactions')}
            />
            <NavItem 
               icon={<IconInvoice className={iconClass} />} 
               label="Invoices" 
               hasSubmenu
               isExpanded={invoicesExpanded}
               onClick={() => setInvoicesExpanded(!invoicesExpanded)}
            >
               <SubNavItem 
                  icon={<IconFilePlus className="w-3.5 h-3.5" />}
                  label="Issue invoice" 
                  isActive={currentView === 'issue-invoice'}
                  onClick={() => onNavigate && onNavigate('issue-invoice')} 
               />
               <SubNavItem label="Invoice Issuance" onClick={() => {}} />
               <SubNavItem label="Invoices List" onClick={() => {}} />
            </NavItem>
            
            <NavItem icon={<IconReport className={iconClass} />} label="Reports" hasSubmenu />
            
            <NavItem 
              icon={<IconAccounting className={iconClass} />} 
              label="Accounting" 
              hasSubmenu 
              isExpanded={accountingExpanded}
              onClick={() => setAccountingExpanded(!accountingExpanded)}
            >
               <SubNavItem 
                  icon={<IconWallet className="w-3.5 h-3.5" />}
                  label="System Wallets" 
                  isActive={currentView?.includes('wallet')}
                  onClick={() => onNavigate && onNavigate('accounting-wallets')} 
               />
               <SubNavItem 
                  icon={<IconAlertTriangle className="w-3.5 h-3.5" />}
                  label="Discrepancies" 
                  isActive={currentView === 'accounting-discrepancies'}
                  onClick={() => onNavigate && onNavigate('accounting-discrepancies')} 
               />
            </NavItem>

            <NavItem icon={<IconRevenue className={iconClass} />} label="Revenue sharing" hasSubmenu />
            <NavItem icon={<IconLimits className={iconClass} />} label="Limits" hasSubmenu />
            <NavItem icon={<IconDocument className={iconClass} />} label="Documents submission" />
          </nav>
        )}

        {/* GROUP: System */}
        <GroupHeader 
          title="System" 
          isExpanded={expandedGroups.system} 
          onToggle={() => toggleGroup('system')} 
        />
        {expandedGroups.system && (
          <nav className="space-y-0.5 transition-all duration-300">
            <NavItem icon={<IconNotification className={iconClass} />} label="Notification service" />
            <NavItem icon={<IconChangeRequest className={iconClass} />} label="Change requests" hasSubmenu />
            <NavItem icon={<IconSettings className={iconClass} />} label="Configuration" hasSubmenu />
            <NavItem icon={<IconAdmin className={iconClass} />} label="Administration" hasSubmenu />
          </nav>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
