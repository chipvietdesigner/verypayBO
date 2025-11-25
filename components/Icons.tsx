import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  CreditCard, 
  Smartphone, 
  Wallet,
  ArrowRightLeft,
  Copy,
  Download,
  LayoutDashboard,
  Settings,
  Building,
  Users,
  FileText,
  History,
  GitPullRequest,
  Home,
  School,
  Calendar,
  User,
  ShoppingBag,
  FileCheck,
  HardDrive,
  Monitor,
  Receipt,
  Calculator,
  Sliders,
  PieChart,
  Bell,
  LogOut,
  Globe,
  ChevronDown,
  Menu,
  ChevronRight,
  MoreHorizontal,
  ArrowRight,
  PlusCircle,
  MinusCircle,
  Filter,
  Search,
  ChevronLeft,
  TrendingUp,
  RotateCw,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';

interface IconProps {
  className?: string;
}

export const IconBack = ({ className }: IconProps) => <ArrowLeft className={className || "w-5 h-5"} />;
export const IconLocation = ({ className }: IconProps) => <MapPin className={className || "w-3.5 h-3.5"} />;
export const IconSuccess = ({ className }: IconProps) => <CheckCircle className={className || "w-5 h-5"} />;
export const IconPending = ({ className }: IconProps) => <Clock className={className || "w-5 h-5"} />;
export const IconFailed = ({ className }: IconProps) => <AlertCircle className={className || "w-5 h-5"} />;
export const IconPOS = ({ className }: IconProps) => <CreditCard className={className || "w-4 h-4"} />;
export const IconMethod = ({ className }: IconProps) => <Smartphone className={className || "w-4 h-4"} />;
export const IconWallet = ({ className }: IconProps) => <Wallet className={className || "w-4 h-4"} />;
export const IconFlow = ({ className }: IconProps) => <ArrowRightLeft className={className || "w-4 h-4"} />;
export const IconCopy = ({ className }: IconProps) => <Copy className={className || "w-3.5 h-3.5"} />;
export const IconDownload = ({ className }: IconProps) => <Download className={className || "w-4 h-4"} />;

export const IconAlertCircle = ({ className }: IconProps) => <AlertCircle className={className || "w-5 h-5"} />;
export const IconClock = ({ className }: IconProps) => <Clock className={className || "w-5 h-5"} />;
export const IconTrendingUp = ({ className }: IconProps) => <TrendingUp className={className || "w-5 h-5"} />;
export const IconRefresh = ({ className }: IconProps) => <RotateCw className={className || "w-4 h-4"} />;
export const IconBarChart = ({ className }: IconProps) => <BarChart3 className={className || "w-4 h-4"} />;
export const IconActivity = ({ className }: IconProps) => <Activity className={className || "w-4 h-4"} />;
export const IconZap = ({ className }: IconProps) => <Zap className={className || "w-4 h-4"} />;

// Sidebar & Nav Icons
export const IconDashboard = ({ className }: IconProps) => <LayoutDashboard className={className || "w-5 h-5"} />;
export const IconSettings = ({ className }: IconProps) => <Settings className={className || "w-5 h-5"} />;
export const IconTenants = ({ className }: IconProps) => <Building className={className || "w-5 h-5"} />;
export const IconUsers = ({ className }: IconProps) => <Users className={className || "w-5 h-5"} />;
export const IconAudit = ({ className }: IconProps) => <FileText className={className || "w-5 h-5"} />;
export const IconProcedure = ({ className }: IconProps) => <History className={className || "w-5 h-5"} />;
export const IconChangeRequest = ({ className }: IconProps) => <GitPullRequest className={className || "w-5 h-5"} />;

export const IconHome = ({ className }: IconProps) => <Home className={className || "w-5 h-5"} />;
export const IconSchool = ({ className }: IconProps) => <School className={className || "w-5 h-5"} />;
export const IconAttendance = ({ className }: IconProps) => <Calendar className={className || "w-5 h-5"} />;
export const IconStudent = ({ className }: IconProps) => <User className={className || "w-5 h-5"} />;
export const IconMerchant = ({ className }: IconProps) => <ShoppingBag className={className || "w-5 h-5"} />;
export const IconTransaction = ({ className }: IconProps) => <ArrowRightLeft className={className || "w-5 h-5"} />;
export const IconDocument = ({ className }: IconProps) => <FileCheck className={className || "w-5 h-5"} />;
export const IconToken = ({ className }: IconProps) => <CreditCard className={className || "w-5 h-5"} />;
export const IconPosDevice = ({ className }: IconProps) => <HardDrive className={className || "w-5 h-5"} />;
export const IconDevice = ({ className }: IconProps) => <Monitor className={className || "w-5 h-5"} />;
export const IconInvoice = ({ className }: IconProps) => <Receipt className={className || "w-5 h-5"} />;
export const IconAccounting = ({ className }: IconProps) => <Calculator className={className || "w-5 h-5"} />;
export const IconLimits = ({ className }: IconProps) => <Sliders className={className || "w-5 h-5"} />;
export const IconRevenue = ({ className }: IconProps) => <PieChart className={className || "w-5 h-5"} />;
export const IconReport = ({ className }: IconProps) => <FileText className={className || "w-5 h-5"} />;
export const IconNotification = ({ className }: IconProps) => <Bell className={className || "w-5 h-5"} />;
export const IconAdmin = ({ className }: IconProps) => <User className={className || "w-5 h-5"} />;

export const IconLogout = ({ className }: IconProps) => <LogOut className={className || "w-4 h-4"} />;
export const IconGlobe = ({ className }: IconProps) => <Globe className={className || "w-4 h-4"} />;
export const IconChevronDown = ({ className }: IconProps) => <ChevronDown className={className || "w-4 h-4"} />;
export const IconMenu = ({ className }: IconProps) => <Menu className={className || "w-5 h-5"} />;
export const IconChevronRight = ({ className }: IconProps) => <ChevronRight className={className || "w-4 h-4"} />;
export const IconChevronLeft = ({ className }: IconProps) => <ChevronLeft className={className || "w-4 h-4"} />;
export const IconMore = ({ className }: IconProps) => <MoreHorizontal className={className || "w-4 h-4"} />;
export const IconBuilding = ({ className }: IconProps) => <Building className={className || "w-4 h-4"} />;

export const IconArrowRight = ({ className }: IconProps) => <ArrowRight className={className || "w-5 h-5"} />;
export const IconPlusCircle = ({ className }: IconProps) => <PlusCircle className={className || "w-5 h-5"} />;
export const IconMinusCircle = ({ className }: IconProps) => <MinusCircle className={className || "w-5 h-5"} />;
export const IconCheckCircle = ({ className }: IconProps) => <CheckCircle className={className || "w-5 h-5"} />;
export const IconFilter = ({ className }: IconProps) => <Filter className={className || "w-4 h-4"} />;
export const IconSearch = ({ className }: IconProps) => <Search className={className || "w-4 h-4"} />;
export const IconCalendar = ({ className }: IconProps) => <Calendar className={className || "w-4 h-4"} />;
