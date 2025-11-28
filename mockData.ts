import { TransactionListItem, TransactionStatus, TransactionType, TransactionData, Wallet, WalletLedgerItem, WalletStatementMetrics } from './types';

// --- TRANSACTIONS ---

const generateMockTransactions = (count: number): TransactionListItem[] => {
  const types: TransactionType[] = ['Funds in', 'Wallet Top Up', 'Withdrawal', 'Payment', 'Deactivation Transfer'];
  
  // Weighted statuses: More Approved than others. REMOVED PENDING.
  const statuses = [
      TransactionStatus.APPROVED, TransactionStatus.APPROVED, TransactionStatus.APPROVED, TransactionStatus.APPROVED, 
      TransactionStatus.APPROVED, TransactionStatus.APPROVED, TransactionStatus.APPROVED, 
      // TransactionStatus.PENDING, // Removed
      TransactionStatus.FAILED, 
      TransactionStatus.DECLINED
  ];
  
  const methods = ['External transfer', 'Physical card', 'QR code', 'Transfer', 'Mobile Money'];
  const amounts = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 150000, 200000, 500000, 1000000];

  return Array.from({ length: count }).map((_, index) => {
    const id = (index + 1).toString();
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const baseAmount = amounts[Math.floor(Math.random() * amounts.length)];
    
    let message = 'Success';
    if (status === TransactionStatus.FAILED) message = 'Insufficient funds';
    else if (status === TransactionStatus.DECLINED) message = 'Risk threshold exceeded';

    return {
      id,
      reference: `REF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      date: `24/11/25 ${String(Math.floor(Math.random() * 23)).padStart(2, '0')}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`,
      requestAmount: { currency: 'UGX', amount: baseAmount },
      type,
      payerWalletId: `221${Math.floor(Math.random() * 1000000000)}`,
      payeeWalletId: `251${Math.floor(Math.random() * 1000000000)}`,
      status,
      message,
      school: '--',
      paymentMethod: method,
      serialNumber: Math.random() > 0.7 ? `SN-${Math.floor(Math.random() * 10000)}` : '--'
    };
  });
};

export const initialTransactions = generateMockTransactions(150);

export const getMockDetailData = (item: Partial<TransactionListItem>): TransactionData => {
  const createDateObj = new Date();
  const completeDateObj = new Date(createDateObj.getTime() + 15000);
  const expiryDateObj = new Date(createDateObj.getTime() + (24 * 60 * 60 * 1000));
  const formatDate = (d: Date) => `${d.toLocaleDateString('en-GB')} ${d.toLocaleTimeString('en-GB')}`;
  
  const isTerminalState = [TransactionStatus.APPROVED, TransactionStatus.FAILED, TransactionStatus.DECLINED].includes(item.status || TransactionStatus.APPROVED);

  const baseData = {
    reference: item.reference || 'REF-UNK',
    creationDate: item.date || formatDate(createDateObj),
    completedDate: isTerminalState ? formatDate(completeDateObj) : undefined,
    expiryTime: item.status === TransactionStatus.PENDING ? formatDate(expiryDateObj) : undefined,
    location: 'Kampala, Uganda',
    posId: '1FE12FC7410D2233',
    tokenId: '--',
    paymentMethod: item.paymentMethod || 'Mobile Money',
    serviceType: '--',
    status: item.status || TransactionStatus.APPROVED,
    remark: item.type === 'Payment' ? 'Payment for Term 2 School Fees' 
          : item.type === 'Withdrawal' ? 'Cash withdrawal for petty cash' 
          : 'User initiated transaction',
    message: item.status === TransactionStatus.APPROVED 
        ? '[000] Transaction processed successfully' 
        : item.status === TransactionStatus.FAILED
            ? '[102] Failed to process transaction.\nError: Insufficient funds in payer wallet.\nStack trace: \n  at WalletService.debit(WalletId: 250...)\n  at TransactionManager.process()\n  Error Code: EF-001-LOW_BALANCE\n\nAdditional Info:\nProvider returned status 402 Payment Required.'
            : (item.message || 'Success'),
    type: item.type || 'Payment',
    requestAmount: item.requestAmount || { currency: 'UGX', amount: 0 },
    grossAmount: item.requestAmount || { currency: 'UGX', amount: 0 },
    amount: item.requestAmount ? { currency: item.requestAmount.currency, amount: Math.floor(item.requestAmount.amount * 0.99) } : { currency: 'UGX', amount: 0 },
    payer: {
       walletId: item.payerWalletId || 'Unknown',
       amount: item.requestAmount || { currency: 'UGX', amount: 0 },
       fee: { currency: 'UGX', amount: 10 },
       fixedFee: { currency: 'UGX', amount: 0 },
       percentageFee: '0%',
       total: item.requestAmount || { currency: 'UGX', amount: 0 },
    },
    payee: {
       walletId: item.payeeWalletId || 'Unknown',
       amount: item.requestAmount ? { currency: item.requestAmount.currency, amount: Math.floor(item.requestAmount.amount * 0.99) } : { currency: 'UGX', amount: 0 },
       fee: { currency: 'UGX', amount: 10 },
       fixedFee: { currency: 'UGX', amount: 0 },
       percentageFee: '0%',
       total: item.requestAmount ? { currency: item.requestAmount.currency, amount: Math.floor(item.requestAmount.amount * 0.99) } : { currency: 'UGX', amount: 0 },
    },
    commissions: {
      clientEarned: { currency: 'UGX', amount: 0 },
      veryPayEarned: { currency: 'UGX', amount: 0 },
      partnerEarned: { currency: 'UGX', amount: 0 },
    },
    ledger: []
  };

  const ledgerStatus = (item.status === TransactionStatus.APPROVED) ? 'COMPLETED' : (item.status || 'COMPLETED').toUpperCase();
  const finalStatus = ledgerStatus === 'APPROVED' ? 'COMPLETED' : ledgerStatus;

  let ledgerEntries = [];

  if (item.type === 'Funds in') {
      const currency = baseData.requestAmount.currency;
      const grossVal = baseData.requestAmount.amount;
      const feeVal = Math.round(grossVal * 0.1); 
      const netVal = grossVal - feeVal;
      const ovaOpening = 1000000;
      const walletOpening = 0;
      const isFailed = item.status === TransactionStatus.FAILED;
      const ovaClosing = isFailed ? ovaOpening : ovaOpening - netVal;
      const walletClosing = isFailed ? walletOpening : walletOpening + netVal;

      ledgerEntries = [
        {
            id: 'L1', account: item.payerWalletId || 'Wallet', accountType: 'MSISDN', transactionType: 'Collection', indicator: 'Debit',
            amount: { currency, amount: grossVal }, openingBalance: null, closingBalance: null, status: finalStatus, dateTime: baseData.creationDate
        },
        {
            id: 'L2', account: '2560000000001', accountType: 'VeryPay OVA', transactionType: 'Collection', indicator: 'Credit',
            amount: { currency, amount: netVal }, openingBalance: null, closingBalance: null, status: finalStatus, dateTime: baseData.creationDate
        },
        {
            id: 'L3', account: '2600000000002', accountType: 'Provider Fee', transactionType: 'Collection', indicator: 'Credit',
            amount: { currency, amount: feeVal }, openingBalance: null, closingBalance: null, status: finalStatus, dateTime: baseData.creationDate
        },
        {
            id: 'L4', account: '2560000000003', accountType: 'VeryPay OVA', transactionType: 'Disbursement', indicator: 'Debit',
            amount: { currency, amount: netVal }, openingBalance: { currency, amount: ovaOpening }, closingBalance: { currency, amount: ovaClosing }, status: finalStatus, dateTime: baseData.creationDate
        },
        {
            id: 'L5', account: item.payeeWalletId || 'Wallet', accountType: 'Wallet', transactionType: 'Disbursement', indicator: 'Credit',
            amount: { currency, amount: netVal }, openingBalance: { currency, amount: walletOpening }, closingBalance: { currency, amount: walletClosing }, status: finalStatus, dateTime: baseData.creationDate
        }
      ];
  } else {
      const rawLedgerEntries = [
        { id: '1', account: 'Wallet_Payer', accountType: 'Wallet', transactionType: item.type || 'Payment', indicator: 'Debit', amount: baseData.requestAmount },
        { id: '2', account: 'Wallet_Payee', accountType: 'Wallet', transactionType: item.type || 'Payment', indicator: 'Credit', amount: { currency: baseData.requestAmount.currency, amount: Math.floor(baseData.requestAmount.amount * 0.99) } },
      ];

      ledgerEntries = rawLedgerEntries.map(entry => {
         let openingBalance = null;
         let closingBalance = null;
         const shouldHaveBalance = ['Payment', 'Merchant Payment', 'Withdrawal'].includes(item.type || '');

         if (shouldHaveBalance) {
             const randomOpening = 5000000 + Math.floor(Math.random() * 5000000);
             const change = entry.amount.amount;
             openingBalance = { currency: baseData.requestAmount.currency, amount: randomOpening };
             
             if (item.status === TransactionStatus.FAILED) {
                 closingBalance = { currency: baseData.requestAmount.currency, amount: randomOpening };
             } else {
                 const closingAmt = entry.indicator === 'Debit' ? randomOpening - change : randomOpening + change;
                 closingBalance = { currency: baseData.requestAmount.currency, amount: closingAmt };
             }
         }
         return { ...entry, openingBalance, closingBalance, status: finalStatus, dateTime: baseData.creationDate }
      });
  }
  
  return { ...baseData, ledger: ledgerEntries as any };
};

// --- WALLETS ---

export const wallets: Wallet[] = [
    { id: '1', name: 'General OVA', accountNumber: 'GEN-OVA-001', provider: 'VeryPay', balance: { currency: 'UGX', amount: -347635687 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' },
    { id: '2', name: 'Pre-funded OVA', accountNumber: 'PRE-OVA-002', provider: 'VeryPay', balance: { currency: 'UGX', amount: -3999161 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' },
    { id: '3', name: 'Invoice OVA (MTN)', accountNumber: 'INV-MTN-001', provider: 'MTN', balance: { currency: 'UGX', amount: -11300 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '4', name: 'Invoice OVA (Airtel)', accountNumber: 'INV-AIR-002', provider: 'Airtel', balance: { currency: 'UGX', amount: -27639 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '5', name: 'Airtel OVA', accountNumber: 'AIR-OVA-001', provider: 'Airtel', balance: { currency: 'UGX', amount: 5458895 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '6', name: 'YO OVA (Airtel)', accountNumber: 'YO-AIR-001', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 13500 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '7', name: 'YO OVA (MTN)', accountNumber: 'YO-MTN-002', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 15763 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '8', name: 'YO OVA (Warid)', accountNumber: 'YO-WAR-003', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 116607794 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '9', name: 'Fee Distribution', accountNumber: 'FEE-DIST-01', provider: 'VeryPay', balance: { currency: 'UGX', amount: 286939 }, lastReconciliation: '18/09/25 14:52:10', type: 'Fee' },
    { id: '10', name: 'Fee Earning', accountNumber: 'FEE-EARN-01', provider: 'VeryPay', balance: { currency: 'UGX', amount: 594628 }, lastReconciliation: '18/09/25 14:52:10', type: 'Fee' },
    { id: '11', name: 'Airtel Fee Earning', accountNumber: 'FEE-AIR-01', provider: 'Airtel', balance: { currency: 'UGX', amount: 132798 }, lastReconciliation: '18/09/25 14:52:10', type: 'Fee' },
    { id: '12', name: 'YO Fee Earning', accountNumber: 'FEE-YO-01', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 112340 }, lastReconciliation: '18/09/25 14:52:10', type: 'Fee' },
];

export const getWalletDataByRange = (walletId: string, range: string) => {
  const walletInfo = wallets.find(w => w.id === walletId) || wallets[0];

  const today = new Date();
  const dateStr = (d: Date, time: string) => `${d.toLocaleDateString('en-GB')} ${time}`;
  const getPastDate = (daysAgo: number) => { const d = new Date(today); d.setDate(d.getDate() - daysAgo); return d; };

  const rawTransactions = [
      { id: 't1', daysAgo: 0, time: '14:30', reference: 'REF-NOW-1', description: 'Merchant Settlement', counterparty: 'Kampala Store', type: 'Settlement', debit: 50000, status: 'Pending' },
      { id: 't2', daysAgo: 0, time: '11:15', reference: 'REF-NOW-2', description: 'Top Up', counterparty: 'Equity Bank', type: 'Funding', credit: 300000, status: 'Reconciled' },
      { id: 'w1', daysAgo: 2, time: '14:20', reference: 'REF-WK-1', description: 'Fee Payout', counterparty: 'Partner A', type: 'Fee', debit: 45000, status: 'Reconciled' },
      { id: 'm1', daysAgo: 10, time: '15:30', reference: 'REF-M-1', description: 'Monthly Server Fee', counterparty: 'AWS', type: 'OpEx', debit: 2500000, status: 'Reconciled' },
      { id: 'old1', daysAgo: 45, time: '12:00', reference: 'REF-OLD-1', description: 'Q3 Disbursement', counterparty: 'Multiple', type: 'Disbursement', debit: 45000000, status: 'Reconciled' },
  ];

  let filteredRaw = rawTransactions; 
  if(range === 'Today') filteredRaw = rawTransactions.filter(t => t.daysAgo === 0);
  if(range === 'This Week') filteredRaw = rawTransactions.filter(t => t.daysAgo <= 7);
  if(range === 'This Month') filteredRaw = rawTransactions.filter(t => t.daysAgo <= 30);

  let totalCredits = 0;
  let totalDebits = 0;

  const ledgerItems: WalletLedgerItem[] = filteredRaw.map(t => {
      const d = getPastDate(t.daysAgo);
      if (t.credit) totalCredits += t.credit;
      if (t.debit) totalDebits += t.debit;
      
      return {
          id: t.id,
          transactionId: `TX-${t.id}`,
          reference: t.reference,
          date: dateStr(d, t.time),
          description: t.description,
          counterparty: t.counterparty,
          type: t.type,
          debit: t.debit ? { currency: walletInfo.balance.currency, amount: t.debit } : undefined,
          credit: t.credit ? { currency: walletInfo.balance.currency, amount: t.credit } : undefined,
          balance: { currency: walletInfo.balance.currency, amount: 0 },
          status: t.status as any
      };
  });

  let closingBalanceAmt = walletInfo.balance.amount;
  const openingBalanceAmt = closingBalanceAmt - totalCredits + totalDebits;
  let runningBal = closingBalanceAmt;
  
  const processedLedger = ledgerItems.map(item => {
      const rowBalance = runningBal;
      if (item.credit) runningBal -= item.credit.amount;
      if (item.debit) runningBal += item.debit.amount;
      return { ...item, balance: { currency: walletInfo.balance.currency, amount: rowBalance } };
  });

  return { 
      walletInfo, 
      metrics: {
          periodStart: '01/01/2025', periodEnd: dateStr(today, ''),
          openingBalance: { currency: walletInfo.balance.currency, amount: openingBalanceAmt },
          totalDebits: { currency: walletInfo.balance.currency, amount: totalDebits },
          totalCredits: { currency: walletInfo.balance.currency, amount: totalCredits },
          closingBalance: { currency: walletInfo.balance.currency, amount: closingBalanceAmt }
      }, 
      ledger: processedLedger 
  };
};