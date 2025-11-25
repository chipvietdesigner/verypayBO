
import React, { useState, useRef, useEffect } from 'react';
import {
  IconDashboard, IconSettings, IconTenants, IconUsers, IconProcedure, IconAudit, IconChangeRequest,
  IconHome, IconSchool, IconAttendance, IconStudent, IconMerchant, IconTransaction, IconDocument,
  IconToken, IconPosDevice, IconDevice, IconInvoice, IconAccounting, IconLimits, IconRevenue,
  IconReport, IconNotification, IconAdmin, IconChevronDown, IconChevronRight, IconCheckCircle
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
      flex items-center justify-between px-4 py-2 cursor-pointer text-sm font-regular text-slate-800 border-l-4
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedTenant, setSelectedTenant] = useState({ name: 'Cashless School Uganda', id: '882910' });

  const tenants = [
    { name: 'Cashless School Uganda', id: '882910' },
    { name: 'VeryPay Kenya Ltd', id: '110293' },
    { name: 'Tanzania Payments', id: '449102' }
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
    <div className="px-4 mb-2 pt-2 border-t border-slate-200 relative" ref={dropdownRef}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-2 py-2 rounded-lg border cursor-pointer transition-all ${isOpen ? 'bg-slate-100 border-slate-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
            {selectedTenant.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-slate-900 truncate">{selectedTenant.name}</div>
              <div className="text-[10px] text-slate-500 font-mono">ID: {selectedTenant.id}</div>
          </div>
          <IconChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
             <div className="py-1">
                {tenants.map(tenant => (
                  <div 
                    key={tenant.id}
                    onClick={() => {
                      setSelectedTenant(tenant);
                      setIsOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className={`text-sm font-medium ${selectedTenant.id === tenant.id ? 'text-blue-700' : 'text-slate-700'}`}>{tenant.name}</div>
                      <div className="text-[10px] text-slate-400">ID: {tenant.id}</div>
                    </div>
                    {selectedTenant.id === tenant.id && <IconCheckCircle className="w-4 h-4 text-blue-600" />}
                  </div>
                ))}
             </div>
             <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 text-[10px] text-blue-600 font-bold uppercase tracking-wider text-center cursor-pointer hover:bg-slate-100">
                Manage Tenants
             </div>
          </div>
        )}
    </div>
  );
};

interface SidebarProps {
  onNavigate?: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const [studentsExpanded, setStudentsExpanded] = useState(false);
  
  // State for group expansion
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    global: true,
    general: true,
    financials: true,
    operations: true,
    payments: true,
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

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-3.5rem)] overflow-y-auto fixed top-14 left-0 hidden lg:block custom-scrollbar font-sans z-40">
      <div className="py-4 pb-20">
        
        {/* Global Context */}
        <div 
            onClick={() => toggleGroup('global')}
            className="px-4 mb-2 flex items-center justify-between cursor-pointer group select-none"
        >
            <div className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider group-hover:text-black transition-colors">Global Scope</div>
            <IconChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${expandedGroups.global ? '' : '-rotate-90'}`} />
        </div>
        
        {expandedGroups.global && (
          <nav className="space-y-0.5 mb-4 transition-all duration-300">
            <NavItem icon={<IconDashboard className={iconClass} />} label="Overview" />
            <NavItem icon={<IconSettings className={iconClass} />} label="Configuration" />
            <NavItem icon={<IconTenants className={iconClass} />} label="Tenants" />
            <NavItem icon={<IconUsers className={iconClass} />} label="Master admins" />
          </nav>
        )}

        {/* Interactive Tenant Selector */}
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
            <NavItem icon={<IconSchool className={iconClass} />} label="Schools" />
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
              isActive 
              onClick={() => onNavigate && onNavigate('transactions')}
            />
            <NavItem icon={<IconInvoice className={iconClass} />} label="Invoices" hasSubmenu />
            <NavItem icon={<IconReport className={iconClass} />} label="Reports" hasSubmenu />
            <NavItem icon={<IconAccounting className={iconClass} />} label="Accounting" hasSubmenu />
            <NavItem icon={<IconRevenue className={iconClass} />} label="Revenue sharing" hasSubmenu />
            <NavItem icon={<IconLimits className={iconClass} />} label="Limits" hasSubmenu />
            <NavItem icon={<IconDocument className={iconClass} />} label="Documents submission" />
          </nav>
        )}

        {/* GROUP: Operations */}
        <GroupHeader 
          title="Academic Operations" 
          isExpanded={expandedGroups.operations} 
          onToggle={() => toggleGroup('operations')} 
        />
        {expandedGroups.operations && (
          <nav className="space-y-0.5 transition-all duration-300">
            <NavItem 
              icon={<IconStudent className={iconClass} />} 
              label="Students" 
              hasSubmenu 
              isExpanded={studentsExpanded} 
              onClick={() => setStudentsExpanded(!studentsExpanded)}
            />
            {studentsExpanded && (
               <div className="bg-slate-50 border-l-2 border-slate-200 ml-5 my-1 rounded-r">
                  <div className="pl-8 pr-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer hover:bg-slate-100 rounded-r">List of students</div>
                  <div className="pl-8 pr-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer hover:bg-slate-100 rounded-r">Mass onboarding</div>
               </div>
            )}
            <NavItem icon={<IconUsers className={iconClass} />} label="Guardians" />
            <NavItem icon={<IconAttendance className={iconClass} />} label="Attendance" hasSubmenu />
          </nav>
        )}

        {/* GROUP: Payments */}
        <GroupHeader 
          title="Payment Infrastructure" 
          isExpanded={expandedGroups.payments} 
          onToggle={() => toggleGroup('payments')} 
        />
        {expandedGroups.payments && (
          <nav className="space-y-0.5 transition-all duration-300">
            <NavItem icon={<IconMerchant className={iconClass} />} label="Merchants & Agents" />
            <NavItem icon={<IconToken className={iconClass} />} label="Payment tokens" />
            <NavItem icon={<IconPosDevice className={iconClass} />} label="POS devices" />
            <NavItem icon={<IconDevice className={iconClass} />} label="Devices" />
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
