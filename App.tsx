
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import TransactionListView from './components/TransactionListView';
import TransactionDetailView from './components/TransactionDetailView';
import GlobalOverview from './components/GlobalOverview';
import WalletsListView from './components/WalletsListView';
import WalletDetailView from './components/WalletDetailView';
import DiscrepanciesView from './components/DiscrepanciesView';
import { TransactionStatus, TransactionData, TransactionType, TransactionListItem } from './types';

// Helper to generate detail data based on selected row info
const getMockDetailData = (item: TransactionListItem): TransactionData => {
  
  // Simulate time progression based on item date
  const createDateObj = new Date(); // In real app, parse item.date
  const completeDateObj = new Date(createDateObj.getTime() + 15000); // 15 seconds later
  const expiryDateObj = new Date(createDateObj.getTime() + (24 * 60 * 60 * 1000)); // 24 hours later

  const formatDate = (d: Date) => `${d.toLocaleDateString('en-GB')} ${d.toLocaleTimeString('en-GB')}`;
  
  // Logic: Completed date exists for APPROVED, FAILED, DECLINED
  const isTerminalState = [TransactionStatus.APPROVED, TransactionStatus.FAILED, TransactionStatus.DECLINED].includes(item.status);

  const baseData = {
    reference: item.reference,
    creationDate: item.date,
    
    // Updated Logic: Show completedDate for all terminal statuses
    completedDate: isTerminalState ? formatDate(completeDateObj) : undefined,
    expiryTime: item.status === TransactionStatus.PENDING ? formatDate(expiryDateObj) : undefined,
    
    location: 'Kampala, Uganda',
    posId: '1FE12FC7410D2233',
    tokenId: '--',
    paymentMethod: item.paymentMethod,
    serviceType: '--',
    status: item.status, // STRICTLY USE PASSED STATUS
    
    // Separate Remark (User) from Message (System)
    remark: item.type === 'Payment' ? 'Payment for Term 2 School Fees' 
          : item.type === 'Withdrawal' ? 'Cash withdrawal for petty cash' 
          : 'User initiated transaction',

    message: item.status === TransactionStatus.APPROVED 
        ? '[000] Transaction processed successfully' 
        : item.status === TransactionStatus.FAILED
            ? '[102] Failed to process transaction.\nError: Insufficient funds in payer wallet.\nStack trace: \n  at WalletService.debit(WalletId: 250...)\n  at TransactionManager.process()\n  Error Code: EF-001-LOW_BALANCE\n\nAdditional Info:\nProvider returned status 402 Payment Required.'
            : item.message,
            
    type: item.type,
    requestAmount: item.requestAmount,
    grossAmount: item.requestAmount, // Assuming 1:1 for simplicity in this view
    amount: { currency: item.requestAmount.currency, amount: Math.floor(item.requestAmount.amount * 0.99) }, // Net is slightly less
    payer: {
       walletId: item.payerWalletId,
       amount: item.requestAmount,
       fee: { currency: item.requestAmount.currency, amount: 10 },
       fixedFee: { currency: item.requestAmount.currency, amount: 0 },
       percentageFee: '0%',
       total: item.requestAmount,
    },
    payee: {
       walletId: item.payeeWalletId,
       amount: { currency: item.requestAmount.currency, amount: Math.floor(item.requestAmount.amount * 0.99) },
       fee: { currency: item.requestAmount.currency, amount: 10 },
       fixedFee: { currency: 'UGX', amount: 0 },
       percentageFee: '0%',
       total: { currency: item.requestAmount.currency, amount: Math.floor(item.requestAmount.amount * 0.99) },
    },
    commissions: {
      clientEarned: { currency: 'UGX', amount: 0 },
      veryPayEarned: { currency: 'UGX', amount: 0 },
      partnerEarned: { currency: 'UGX', amount: 0 },
    },
    ledger: []
  };

  // Generate Ledger entries that match the status
  const ledgerStatus = isTerminalState ? item.status.toUpperCase() : 'PENDING'; // "COMPLETED" in screenshot usually maps to APPROVED here, but using dynamic
  const finalStatus = ledgerStatus === 'APPROVED' ? 'COMPLETED' : ledgerStatus;

  let ledgerEntries = [];

  if (item.type === 'Funds in') {
      // Special 5-row structure for Funds In
      const currency = item.requestAmount.currency;
      const grossVal = item.requestAmount.amount;
      // Calculate Fee (e.g., 10%)
      const feeVal = Math.round(grossVal * 0.1); 
      const netVal = grossVal - feeVal;
      
      // Mock Balances for visual accuracy
      const ovaOpening = 1000000;
      const walletOpening = 0;

      ledgerEntries = [
        {
            id: 'L1',
            account: item.payerWalletId, // Payer MSISDN
            accountType: 'MSISDN',
            transactionType: 'Collection',
            indicator: 'Debit',
            amount: { currency, amount: grossVal },
            openingBalance: null,
            closingBalance: null,
            status: finalStatus,
            dateTime: item.date
        },
        {
            id: 'L2',
            account: '2560000000001', // Intermediate Account
            accountType: 'VeryPay OVA',
            transactionType: 'Collection',
            indicator: 'Credit',
            amount: { currency, amount: netVal },
            openingBalance: null,
            closingBalance: null,
            status: finalStatus,
            dateTime: item.date
        },
        {
            id: 'L3',
            account: '2600000000002', // Fee Account
            accountType: 'Provider Fee',
            transactionType: 'Collection',
            indicator: 'Credit',
            amount: { currency, amount: feeVal },
            openingBalance: null,
            closingBalance: null,
            status: finalStatus,
            dateTime: item.date
        },
        {
            id: 'L4',
            account: '2560000000003', // Disbursement Source
            accountType: 'VeryPay OVA',
            transactionType: 'Disbursement',
            indicator: 'Debit',
            amount: { currency, amount: netVal },
            openingBalance: { currency, amount: ovaOpening },
            closingBalance: { currency, amount: ovaOpening - netVal },
            status: finalStatus,
            dateTime: item.date
        },
        {
            id: 'L5',
            account: item.payeeWalletId, // Payee Wallet
            accountType: 'Wallet',
            transactionType: 'Disbursement',
            indicator: 'Credit',
            amount: { currency, amount: netVal },
            openingBalance: { currency, amount: walletOpening },
            closingBalance: { currency, amount: walletOpening + netVal },
            status: finalStatus,
            dateTime: item.date
        }
      ];
  } else {
      // Default Logic for other types (e.g. Payment, Withdrawal)
      const rawLedgerEntries = [
        { id: '1', account: 'Wallet_Payer', accountType: 'Wallet', transactionType: item.type, indicator: 'Debit', amount: item.requestAmount },
        { id: '2', account: 'Wallet_Payee', accountType: 'Wallet', transactionType: item.type, indicator: 'Credit', amount: { currency: item.requestAmount.currency, amount: Math.floor(item.requestAmount.amount * 0.99) } },
      ];

      ledgerEntries = rawLedgerEntries.map(entry => {
         let openingBalance = null;
         let closingBalance = null;
         
         // Populate balances for Payment and Withdrawal types
         // Removed Bill Payment, Added Withdrawal
         const shouldHaveBalance = ['Payment', 'Merchant Payment', 'Withdrawal'].includes(item.type);

         if (shouldHaveBalance) {
             const randomOpening = 5000000 + Math.floor(Math.random() * 5000000);
             const change = entry.amount.amount;
             openingBalance = { currency: item.requestAmount.currency, amount: randomOpening };
             
             // Calculate closing based on indicator
             const closingAmt = entry.indicator === 'Debit' 
                ? randomOpening - change 
                : randomOpening + change;
                
             closingBalance = { currency: item.requestAmount.currency, amount: closingAmt };
         }

         return {
             ...entry,
             openingBalance,
             closingBalance,
             status: finalStatus,
             dateTime: item.date
         }
      });
  }
  
  return {
      ...baseData,
      ledger: ledgerEntries as any
  };
};

type ViewState = 'transactions' | 'transaction-detail' | 'overview' | 'accounting-wallets' | 'accounting-wallet-detail' | 'accounting-discrepancies';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('transactions');
  const [selectedTx, setSelectedTx] = useState<TransactionData | null>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view as ViewState);
    if (view !== 'transaction-detail') {
      setSelectedTx(null);
    }
    if (view !== 'accounting-wallet-detail') {
      setSelectedWalletId(null);
    }
  };

  // Accepts full item now
  const handleRowClick = (item: TransactionListItem) => {
    const detailData = getMockDetailData(item);
    setSelectedTx(detailData);
    setCurrentView('transaction-detail');
  };

  const handleWalletClick = (id: string) => {
    setSelectedWalletId(id);
    setCurrentView('accounting-wallet-detail');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <GlobalOverview />;
      case 'transactions':
        return <TransactionListView onRowClick={handleRowClick} />;
      case 'transaction-detail':
        return selectedTx ? <TransactionDetailView data={selectedTx} onBack={() => setCurrentView('transactions')} /> : null;
      case 'accounting-wallets':
        return <WalletsListView onWalletClick={handleWalletClick} />;
      case 'accounting-wallet-detail':
        return <WalletDetailView walletId={selectedWalletId || '1'} onBack={() => setCurrentView('accounting-wallets')} />;
      case 'accounting-discrepancies':
        return <DiscrepanciesView />;
      default:
        return <TransactionListView onRowClick={handleRowClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900">
      <TopBar />
      <Sidebar onNavigate={handleNavigate} currentView={currentView} />
      
      {/* Main Content Wrapper */}
      <div className="pt-14 lg:pl-64 transition-all duration-300 h-screen overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
