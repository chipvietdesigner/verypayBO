
import { TransactionListItem, TransactionStatus, TransactionType, TransactionData, Wallet, WalletLedgerItem, WalletStatementMetrics, InvoiceListItem, EodWorkflow, LedgerEntry, PartyDetails, MoneyValue } from './types';

// --- HELPER INTERFACES FOR STATIC DATA ---
interface StaticTransaction {
  id: string;
  reference: string;
  providerReference?: string;
  date: string;
  completedDate?: string;
  expiryTime?: string;
  type: TransactionType;
  status: TransactionStatus;
  currency: string;
  amount: number;      // Base/Nominal Amount (Request Amount)
  payerFee: number;    
  payeeFee: number;
  paymentMethod: string;
  payerWalletId: string;
  payeeWalletId: string;
  school: string;
  message: string;
  remark: string;
  serialNumber: string;
  location: string;
  posId: string;
  tokenId: string;
}

// --- STATIC DATA STORE ---
// Logic applied in getMockDetailData: 
// Gross = Amount + Payer Fee (Total Debited)
// Net = Amount - Payee Fee (Total Credited)

const STATIC_TRANSACTIONS: StaticTransaction[] = [
  // 1. Withdrawal (Case 5000 + 50 = 5050)
  {
    id: '1',
    reference: 'REF-135VH64',
    date: '24/11/25 16:21',
    type: 'Withdrawal',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 5000,
    payerFee: 10,
    payeeFee: 50,
    paymentMethod: 'External transfer',
    payerWalletId: '25621115927217',
    payeeWalletId: '25100000000001',
    school: '--',
    message: '[000] Success',
    remark: 'Cash withdrawal for petty cash',
    serialNumber: 'SN-0001',
    location: 'Kampala, Uganda',
    posId: '1FE12FC7410D2233',
    tokenId: '--'
  },
  // 2. Payment (Case 20 + 1 = 21, Payee fee 11 -> Net 9)
  {
    id: '2',
    reference: 'REF-PAY-002',
    date: '02/12/25 11:34',
    type: 'Payment',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 20,
    payerFee: 0,
    payeeFee: 1,
    paymentMethod: 'Transfer',
    payerWalletId: '25616521371430',
    payeeWalletId: '25156567467017',
    school: 'Greenwood High',
    message: '[000] Success',
    remark: 'Payment test small',
    serialNumber: 'SN-0002',
    location: 'Kampala, Uganda',
    posId: '--',
    tokenId: '--'
  },
  // 3. Funds In (Case 1000 + 10 = 1010)
  {
    id: '3',
    reference: 'REF-053757',
    date: '02/12/25 11:13',
    type: 'Funds in',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 1000,
    payerFee: 12,
    payeeFee: 10,
    paymentMethod: 'Mobile Money',
    payerWalletId: '256771811251',
    payeeWalletId: '25116000000001',
    school: '--',
    message: '[0] Success',
    remark: 'Wallet top up via Yo!',
    serialNumber: 'SN-0003',
    location: 'Kampala, Uganda',
    posId: '--',
    tokenId: '--'
  },
  // 4. Funds In (Case 100,000 + 2,000 = 102,000)
  {
    id: '4',
    reference: 'REF-053751',
    date: '01/12/25 19:41',
    type: 'Funds in',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 100000,
    payerFee: 2000,
    payeeFee: 1000,
    paymentMethod: 'Mobile Money',
    payerWalletId: '256741429789',
    payeeWalletId: '25116000000001',
    school: '--',
    message: '[N/A] Success',
    remark: 'Funds in from Airtel',
    serialNumber: 'SN-0004',
    location: 'Kampala, Uganda',
    posId: '--',
    tokenId: '--'
  },
  // 5. Funds Out (Case 744, Payer Fee 250 -> 994)
  {
    id: '5',
    reference: 'REF-000001',
    date: '25/11/25 09:15',
    type: 'Funds out',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 744,
    payerFee: 1,
    payeeFee: 8,
    paymentMethod: 'External transfer',
    payerWalletId: '25116000000001',
    payeeWalletId: '25190000000001',
    school: '--',
    message: '[000] Success',
    remark: 'Settlement to bank',
    serialNumber: 'SN-0005',
    location: 'Kampala, Uganda',
    posId: '--',
    tokenId: '--'
  },
  // 6. Pre-funded (Case 150k, 0 fee)
  {
    id: '6',
    reference: 'REF-PRE-007',
    date: '19/11/25 08:30',
    type: 'Pre-funded',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 150000,
    payerFee: 1200,
    payeeFee: 11500,
    paymentMethod: 'Internal',
    payerWalletId: '256700000010',
    payeeWalletId: '256700000009',
    school: '--',
    message: 'Success',
    remark: 'Scholarship disbursement',
    serialNumber: 'SN-0006',
    location: '--',
    posId: '--',
    tokenId: '--'
  },
  // 7. Deactivation Transfer (Case 5,500, 0 fee)
  {
    id: '7',
    reference: 'REF-DEA-008',
    date: '18/11/25 12:00',
    type: 'Deactivation Transfer',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 5500,
    payerFee: 100,
    payeeFee: 455,
    paymentMethod: 'System',
    payerWalletId: '256700000010',
    payeeWalletId: '256700000034',
    school: '--',
    message: 'Wallet closed',
    remark: 'User deactivation sweep',
    serialNumber: 'SN-0007',
    location: '--',
    posId: '--',
    tokenId: '--'
  },
  // 8. Merchant Payment (30k, Payer Fee 1500 -> 31.5k)
  {
    id: '8',
    reference: 'REF-MER-008',
    date: '21/11/25 16:45',
    type: 'Merchant Payment',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 30000,
    payerFee: 200,
    payeeFee: 300,
    paymentMethod: 'QR code',
    payerWalletId: '256700000003',
    payeeWalletId: '256700000010',
    school: '--',
    message: 'Success',
    remark: 'Canteen purchase',
    serialNumber: 'SN-0008',
    location: 'Kampala',
    posId: 'POS-MER-02',
    tokenId: '--'
  },
  // 9. Wallet Top Up (300k, Payer Fee 3k -> 303k)
  {
    id: '9',
    reference: 'REF-TOP-0015',
    date: '28/11/25 11:00',
    type: 'Wallet Top Up',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 300000,
    payerFee: 320,
    payeeFee: 3000,
    paymentMethod: 'External transfer',
    payerWalletId: '25611111111115',
    payeeWalletId: '25116000000001',
    school: '--',
    message: '[000] Success',
    remark: 'Top up from bank account',
    serialNumber: 'SN-0009',
    location: '--',
    posId: '--',
    tokenId: '--'
  },
  // 10. Funds Out (Receiving side fee: 450k, Payee Fee 4.5k -> Net 445.5k)
  {
    id: '10',
    reference: 'REF-OUT-0018',
    date: '28/11/25 14:20',
    type: 'Funds out',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 450000,
    payerFee: 1200,
    payeeFee: 4500,
    paymentMethod: 'External transfer',
    payerWalletId: '25116000000001',
    payeeWalletId: '25190000000003',
    school: '--',
    message: '[000] Success',
    remark: 'Settlement with receiving charges',
    serialNumber: 'SN-0010',
    location: 'Kampala',
    posId: '--',
    tokenId: '--'
  },
  // 11. Payment (Failed)
  {
    id: '11',
    reference: 'REF-PAY-FAIL',
    date: '30/11/25 14:05',
    type: 'Payment',
    status: TransactionStatus.FAILED,
    currency: 'UGX',
    amount: 7000,
    payerFee: 80,
    payeeFee: 70,
    paymentMethod: 'QR code',
    payerWalletId: '25670000000030',
    payeeWalletId: '25170000000030',
    school: '--',
    message: 'Insufficient funds',
    remark: 'In-flight payment',
    serialNumber: 'SN-0011',
    location: '--',
    posId: '--',
    tokenId: '--'
  },
  // 12. Payment (Large) 500k, Payer Fee 2k, Payee Fee 5k -> Gross 502k, Net 495k
  {
    id: '12',
    reference: 'F6N9L26B34A',
    date: '26/11/25 14:59',
    type: 'Payment',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 500000,
    payerFee: 0,
    payeeFee: 5000,
    paymentMethod: 'External transfer',
    payerWalletId: '256773774324',
    payeeWalletId: '25116584341015',
    school: '--',
    message: '[000] Success',
    remark: '--',
    serialNumber: 'SN-0012',
    location: 'Kampala',
    posId: '--',
    tokenId: '--'
  },
  // 13. Withdrawal (ATM) 200k, Payer Fee 2k -> Gross 202k
  {
    id: '13',
    reference: 'REF-WDL-0013',
    date: '28/11/25 09:30',
    type: 'Withdrawal',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 200000,
    payerFee: 0,
    payeeFee: 2000,
    paymentMethod: 'External transfer',
    payerWalletId: '25670000000013',
    payeeWalletId: '25100000000002',
    school: '--',
    message: '[000] Success',
    remark: 'ATM withdrawal',
    serialNumber: 'SN-0013',
    location: 'Kampala',
    posId: '--',
    tokenId: '--'
  },
  // 14. Wallet Top Up (No Fee)
  {
    id: '14',
    reference: 'REF-TOP-0028',
    date: '30/11/25 11:45',
    type: 'Wallet Top Up',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 150000,
    payerFee: 0,
    payeeFee: 1500,
    paymentMethod: 'External transfer',
    payerWalletId: '25611111111128',
    payeeWalletId: '25111111111128',
    school: '--',
    message: '[000] Success',
    remark: 'Top up from salary',
    serialNumber: 'SN-0014',
    location: '--',
    posId: '--',
    tokenId: '--'
  },
  // 15. Funds In (10k, Fee 300 -> Gross 10,300)
  {
    id: '15',
    reference: 'REF-053754',
    date: '01/12/25 19:47',
    type: 'Funds in',
    status: TransactionStatus.APPROVED,
    currency: 'UGX',
    amount: 10000,
    payerFee: 0,
    payeeFee: 100,
    paymentMethod: 'Mobile Money',
    payerWalletId: '25616596417589',
    payeeWalletId: '25116000000001',
    school: '--',
    message: '[000] Success',
    remark: 'Funds in from Airtel with fixed fee',
    serialNumber: 'SN-0015',
    location: 'Kampala',
    posId: '--',
    tokenId: '--'
  }
];

// --- EXPORTS ---

// Map static data to List Item format
export const initialTransactions: TransactionListItem[] = STATIC_TRANSACTIONS.map(tx => ({
  id: tx.id,
  reference: tx.reference,
  date: tx.date,
  requestAmount: { currency: tx.currency, amount: tx.amount },
  type: tx.type,
  payerWalletId: tx.payerWalletId,
  payeeWalletId: tx.payeeWalletId,
  payerFee: tx.payerFee,   
  payeeFee: tx.payeeFee ,
  status: tx.status,
  message: tx.message,
  school: tx.school,
  paymentMethod: tx.paymentMethod,
  serialNumber: tx.serialNumber
}));

// Get full details from static data
export const getMockDetailData = (item: Partial<TransactionListItem>): TransactionData => {
  const found = STATIC_TRANSACTIONS.find(t => t.reference === item.reference);
  
  if (found) {
    const currency = found.currency;
    const baseAmount = found.amount; // Nominal / Request Amount
    const payerFee = found.payerFee;
    const payeeFee = found.payeeFee;

    // Strict Accounting Logic:
    // Gross Amount (Total Debited) = Base + Payer Fee
    // Net Amount (Total Credited)  = Base - Payee Fee
    
    const grossAmount = baseAmount + payerFee;
    const netAmount = baseAmount - payeeFee;

    // Payer Details
    const payerDetails: PartyDetails = {
        walletId: found.payerWalletId,
        amount: { currency, amount: baseAmount }, // Nominal
        fee: { currency, amount: payerFee },
        fixedFee: { currency, amount: payerFee }, 
        percentageFee: '0%',
        total: { currency, amount: grossAmount } // Total Debited = Gross
    };

    // Payee Details
    const payeeDetails: PartyDetails = {
        walletId: found.payeeWalletId,
        amount: { currency, amount: baseAmount }, // Nominal
        fee: { currency, amount: payeeFee },
        fixedFee: { currency, amount: payeeFee },
        percentageFee: '0%',
        total: { currency, amount: netAmount } // Total Credited = Net
    };

    const ledgerStatus = found.status === TransactionStatus.APPROVED ? 'COMPLETED' : 'FAILED';
    const ledger: LedgerEntry[] = [
        {
            id: 'L1', account: found.payerWalletId, accountType: 'Wallet', transactionType: found.type, indicator: 'Debit',
            amount: { currency, amount: grossAmount }, // Debit Gross
            openingBalance: null, closingBalance: null, status: ledgerStatus, dateTime: found.date
        },
        {
            id: 'L2', account: 'FEE-WALLET', accountType: 'Internal', transactionType: 'Fee', indicator: 'Credit',
            amount: { currency, amount: payerFee + payeeFee }, // Credit Total Fee
            openingBalance: null, closingBalance: null, status: ledgerStatus, dateTime: found.date
        },
        {
            id: 'L3', account: found.payeeWalletId, accountType: 'Wallet', transactionType: found.type, indicator: 'Credit',
            amount: { currency, amount: netAmount }, // Credit Net
            openingBalance: null, closingBalance: null, status: ledgerStatus, dateTime: found.date
        }
    ];

    return {
      reference: found.reference,
      providerReference: found.providerReference,
      creationDate: found.date,
      completedDate: found.status === 'APPROVED' ? found.date : undefined,
      expiryTime: found.status === 'PENDING' ? '01/01/2030' : undefined,
      location: found.location,
      requestAmount: { currency, amount: baseAmount },
      grossAmount: { currency, amount: grossAmount },
      amount: { currency, amount: netAmount }, // Net
      posId: found.posId,
      tokenId: found.tokenId,
      paymentMethod: found.paymentMethod,
      serviceType: '--',
      status: found.status,
      remark: found.remark,
      message: found.message,
      type: found.type,
      payer: payerDetails,
      payee: payeeDetails,
      commissions: {
        clientEarned: { currency: 'UGX', amount: 0 },
        veryPayEarned: { currency: 'UGX', amount: payerFee + payeeFee },
        partnerEarned: { currency: 'UGX', amount: 0 },
      },
      ledger: ledger
    };
  }

  // Fallback
  return {
    reference: 'NOT_FOUND',
    creationDate: '',
    location: '',
    requestAmount: { currency: 'UGX', amount: 0 },
    grossAmount: { currency: 'UGX', amount: 0 },
    amount: { currency: 'UGX', amount: 0 },
    posId: '',
    paymentMethod: '',
    status: TransactionStatus.FAILED,
    remark: '',
    message: 'Transaction not found',
    payer: { walletId: '', amount: { currency: 'UGX', amount: 0 }, fee: { currency: 'UGX', amount: 0 }, fixedFee: { currency: 'UGX', amount: 0 }, percentageFee: '0%', total: { currency: 'UGX', amount: 0 } },
    payee: { walletId: '', amount: { currency: 'UGX', amount: 0 }, fee: { currency: 'UGX', amount: 0 }, fixedFee: { currency: 'UGX', amount: 0 }, percentageFee: '0%', total: { currency: 'UGX', amount: 0 } },
    commissions: { clientEarned: { currency: 'UGX', amount: 0 }, veryPayEarned: { currency: 'UGX', amount: 0 }, partnerEarned: { currency: 'UGX', amount: 0 } },
    ledger: [],
    type: 'Payment'
  };
};

// --- INVOICES (Static) ---

export const initialInvoices: InvoiceListItem[] = [
  {
    id: 'INV-001',
    issuer: 'VeryPay UGANDA',
    name: 'Tuition Fees Term 2',
    invoiceType: 'Subscription',
    status: 'Generated',
    recipientType: 'Specific users',
    issueType: 'Immediate',
    creationDate: '20/11/25 09:00:00',
    paymentTerms: '30 days',
    amount: { currency: 'UGX', amount: 350000 }
  },
  {
    id: 'INV-002',
    issuer: 'VeryPay UGANDA',
    name: 'School Bus Service',
    invoiceType: 'Services or products',
    status: 'Scheduled',
    recipientType: 'Card Linked',
    issueType: 'Scheduled',
    creationDate: '21/11/25 14:00:00',
    paymentTerms: '10 days',
    amount: { currency: 'UGX', amount: 150000 }
  }
];

// --- EOD WORKFLOWS (Static) ---
export const initialEodWorkflows: EodWorkflow[] = [
    { id: '1', title: 'POS Discrepancy check', description: 'POS Discrepancy check', lastRun: '28/11/25 08:00:00', nextRun: '29/11/25 08:00:00', status: 'Active' },
    { id: '2', title: 'Workflow Report Transaction', description: 'Create a workflow to generate daily report transactions', lastRun: '--', nextRun: '--', status: 'Inactive' },
    { id: '3', title: 'Send Transaction Report Jobs', description: 'A workflow for send email about transaction report', lastRun: '--', nextRun: '--', status: 'Inactive' },
    { id: '4', title: 'Extract Transaction Report Jobs', description: 'A workflow created for Extract Transaction Report Jobs', lastRun: '--', nextRun: '--', status: 'Inactive' },
    { id: '5', title: 'Transaction Report', description: '', lastRun: '--', nextRun: '--', status: 'Inactive' },
];

// --- WALLETS (Static) ---
export const wallets: Wallet[] = [
    { id: '1', name: 'General OVA', accountNumber: 'GEN-OVA-001', provider: 'VeryPay', balance: { currency: 'UGX', amount: -347635687 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' },
    { id: '2', name: 'Pre-funded OVA', accountNumber: 'PRE-OVA-002', provider: 'VeryPay', balance: { currency: 'UGX', amount: -3999161 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' },
    { id: '3', name: 'Invoice OVA (MTN)', accountNumber: 'INV-MTN-001', provider: 'MTN', balance: { currency: 'UGX', amount: -11300 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' },
    { id: '4', name: 'Invoice OVA (Airtel)', accountNumber: 'INV-AIR-002', provider: 'Airtel', balance: { currency: 'UGX', amount: -27639 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' },
    { id: '5', name: 'Airtel OVA', accountNumber: 'AIR-OVA-001', provider: 'Airtel', balance: { currency: 'UGX', amount: 5458895 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '6', name: 'YO OVA (Airtel)', accountNumber: 'YO-AIR-001', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 13500 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '7', name: 'YO OVA (MTN)', accountNumber: 'YO-MTN-002', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 15763 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '8', name: 'YO OVA (Warid)', accountNumber: 'YO-WAR-003', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 116607794 }, lastReconciliation: '18/09/25 14:52:10', type: 'External' },
    { id: '9', name: 'Fee Distribution', accountNumber: 'FEE-DIST-01', provider: 'VeryPay', balance: { currency: 'UGX', amount: 286939 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' },
    { id: '10', name: 'Fee Earning', accountNumber: 'FEE-EARN-01', provider: 'VeryPay', balance: { currency: 'UGX', amount: 594628 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' },
    { id: '11', name: 'Airtel Fee Earning', accountNumber: 'FEE-AIR-01', provider: 'Airtel', balance: { currency: 'UGX', amount: 132798 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' },
    { id: '12', name: 'YO Fee Earning', accountNumber: 'FEE-YO-01', provider: 'Yo! Payments', balance: { currency: 'UGX', amount: 112340 }, lastReconciliation: '18/09/25 14:52:10', type: 'Internal' },
];

// --- WALLET DETAIL GENERATOR (Simplified Static Logic) ---
export const getWalletDataByRange = (walletId: string, range: string) => {
  const walletInfo = wallets.find(w => w.id === walletId) || wallets[0];
  
  // Static dates for ledger
  const periodStart = '01/11/2025';
  const periodEnd = '30/11/2025';

  // Static Ledger Items for Wallet View
  const ledgerItems: WalletLedgerItem[] = [
      { id: 't1', transactionId: 'TX-1001', reference: 'REF-NOW-1', date: '28/11/25 14:30', description: 'Merchant Settlement', counterparty: 'Kampala Store', type: 'Settlement', debit: { currency: 'UGX', amount: 50000 }, balance: { currency: 'UGX', amount: 0 }, status: 'Pending' },
      { id: 't2', transactionId: 'TX-1002', reference: 'REF-NOW-2', date: '28/11/25 11:15', description: 'Top Up', counterparty: 'Equity Bank', type: 'Funding', credit: { currency: 'UGX', amount: 300000 }, balance: { currency: 'UGX', amount: 0 }, status: 'Reconciled' }
  ];

  // Recalculate simple running balance for display
  let runningBal = walletInfo.balance.amount;
  const processedLedger = ledgerItems.map(item => {
      const bal = runningBal;
      if (item.credit) runningBal -= item.credit.amount;
      if (item.debit) runningBal += item.debit.amount;
      return { ...item, balance: { currency: 'UGX', amount: bal } };
  });

  return { 
      walletInfo, 
      metrics: {
          periodStart,
          periodEnd,
          openingBalance: { currency: 'UGX', amount: runningBal }, // End result of backwards calc
          totalDebits: { currency: 'UGX', amount: 50000 },
          totalCredits: { currency: 'UGX', amount: 300000 },
          closingBalance: walletInfo.balance
      }, 
      ledger: processedLedger 
  };
};
