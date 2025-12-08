
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import TransactionListView from './components/TransactionListView';
import TransactionDetailView from './components/TransactionDetailView';
import GlobalOverview from './components/GlobalOverview';
import WalletsListView from './components/WalletsListView';
import WalletDetailView from './components/WalletDetailView';
import DiscrepanciesView from './components/DiscrepanciesView';
import IssueInvoiceFlow from './components/IssueInvoiceFlow';
import { TransactionStatus, TransactionData, TransactionType, TransactionListItem } from './types';

// Helper to generate detail data based on selected row info
const getMockDetailData = (item: TransactionListItem): TransactionData => {
  
  const createDateObj = new Date(); 
  const completeDateObj = new Date(createDateObj.getTime() + 15000); 
  const expiryDateObj = new Date(createDateObj.getTime() + (24 * 60 * 60 * 1000)); 

  const formatDate = (d: Date) => `${d.toLocaleDateString('en-GB')} ${d.toLocaleTimeString('en-GB')}`;
  
  const isTerminalState = [TransactionStatus.APPROVED, TransactionStatus.FAILED, TransactionStatus.DECLINED].includes(item.status);

  const baseData = {
    reference: item.reference,
    creationDate: item.date,
    completedDate: isTerminalState ? formatDate(completeDateObj) : undefined,
    expiryTime: item.status === TransactionStatus.PENDING ? formatDate(expiryDateObj) : undefined,
    location: 'Kampala, Uganda',
    posId: '1FE12FC7410D2233',
    tokenId: '--',
    paymentMethod: item.paymentMethod,
    serviceType: '--',
    status: item.status, 
    
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
    grossAmount: item.requestAmount,
    amount: { currency: item.requestAmount.currency, amount: Math.floor(item.requestAmount.amount * 0.99) },
    payer: {
       walletId: item.payerWalletId,
       amount: item.requestAmount,
       fee: { currency: item.requestAmount.currency, amount: Number(item.payerFee) },
       fixedFee: { currency: item.requestAmount.currency, amount: Number(item.payeeFee) },
       percentageFee: '0%',
       total: item.requestAmount,
    },
    payee: {
       walletId: item.payeeWalletId,
       amount: { currency: item.requestAmount.currency, amount: Math.floor(item.requestAmount.amount * 0.99) },
       fee: { currency: item.requestAmount.currency, amount: Number(item.payeeFee) },
       fixedFee: { currency: 'UGX', amount: Number(item.payeeFee) },
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

  const ledgerStatus = isTerminalState ? item.status.toUpperCase() : 'PENDING';
  const finalStatus = ledgerStatus === 'APPROVED' ? 'COMPLETED' : ledgerStatus;

  let ledgerEntries = [];

  if (item.type === 'Funds in') {
      const currency = item.requestAmount.currency;
      const grossVal = item.requestAmount.amount;
      const feeVal = Math.round(grossVal * 0.1); 
      const netVal = grossVal - feeVal;
      const ovaOpening = 1000000;
      const walletOpening = 0;
      const isFailed = item.status === TransactionStatus.FAILED;
      const ovaClosing = isFailed ? ovaOpening : ovaOpening - netVal;
      const walletClosing = isFailed ? walletOpening : walletOpening + netVal;

      ledgerEntries = [
        {
            id: 'L1', account: item.payerWalletId, accountType: 'MSISDN', transactionType: 'Collection', indicator: 'Debit',
            amount: { currency, amount: grossVal }, openingBalance: null, closingBalance: null, status: finalStatus, dateTime: item.date
        },
        {
            id: 'L2', account: '2560000000001', accountType: 'VeryPay OVA', transactionType: 'Collection', indicator: 'Credit',
            amount: { currency, amount: netVal }, openingBalance: null, closingBalance: null, status: finalStatus, dateTime: item.date
        },
        {
            id: 'L3', account: '2600000000002', accountType: 'Provider Fee', transactionType: 'Collection', indicator: 'Credit',
            amount: { currency, amount: feeVal }, openingBalance: null, closingBalance: null, status: finalStatus, dateTime: item.date
        },
        {
            id: 'L4', account: '2560000000003', accountType: 'VeryPay OVA', transactionType: 'Disbursement', indicator: 'Debit',
            amount: { currency, amount: netVal }, openingBalance: { currency, amount: ovaOpening }, closingBalance: { currency, amount: ovaClosing }, status: finalStatus, dateTime: item.date
        },
        {
            id: 'L5', account: item.payeeWalletId, accountType: 'Wallet', transactionType: 'Disbursement', indicator: 'Credit',
            amount: { currency, amount: netVal }, openingBalance: { currency, amount: walletOpening }, closingBalance: { currency, amount: walletClosing }, status: finalStatus, dateTime: item.date
        }
      ];
  } else {
      const rawLedgerEntries = [
        { id: '1', account: 'Wallet_Payer', accountType: 'Wallet', transactionType: item.type, indicator: 'Debit', amount: item.requestAmount },
        { id: '2', account: 'Wallet_Payee', accountType: 'Wallet', transactionType: item.type, indicator: 'Credit', amount: { currency: item.requestAmount.currency, amount: Math.floor(item.requestAmount.amount * 0.99) } },
      ];

      ledgerEntries = rawLedgerEntries.map(entry => {
         let openingBalance = null;
         let closingBalance = null;
         const shouldHaveBalance = ['Payment', 'Merchant Payment', 'Withdrawal'].includes(item.type);

         if (shouldHaveBalance) {
             const randomOpening = 5000000 + Math.floor(Math.random() * 5000000);
             const change = entry.amount.amount;
             openingBalance = { currency: item.requestAmount.currency, amount: randomOpening };
             
             if (item.status === TransactionStatus.FAILED) {
                 closingBalance = { currency: item.requestAmount.currency, amount: randomOpening };
             } else {
                 const closingAmt = entry.indicator === 'Debit' ? randomOpening - change : randomOpening + change;
                 closingBalance = { currency: item.requestAmount.currency, amount: closingAmt };
             }
         }
         return { ...entry, openingBalance, closingBalance, status: finalStatus, dateTime: item.date }
      });
  }
  
  return { ...baseData, ledger: ledgerEntries as any };
};

type ViewState = 'transactions' | 'transaction-detail' | 'overview' | 'accounting-wallets' | 'accounting-wallet-detail' | 'accounting-discrepancies' | 'issue-invoice';

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
      case 'issue-invoice':
        return <IssueInvoiceFlow onCancel={() => setCurrentView('transactions')} />;
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
