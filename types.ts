
export enum TransactionStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED'
}

export type TransactionType = 
  | 'Wallet Top Up'
  | 'Funds in'
  | 'Funds out'
  | 'Pre-funded'
  | 'Deactivation Transfer'
  | 'Withdrawal'
  | 'Payment'
  | 'Merchant Payment'
  | 'External Transfer';

export interface MoneyValue {
  currency: string;
  amount: number;
}

export interface PartyDetails {
  walletId: string;
  amount: MoneyValue;
  fee: MoneyValue;
  fixedFee: MoneyValue;
  percentageFee: string; // e.g. "3%"
  total: MoneyValue;
}

export interface CommissionDistribution {
  clientEarned: MoneyValue;
  veryPayEarned: MoneyValue;
  partnerEarned: MoneyValue;
  clientCommission?: string;
  veryPayCommission?: string;
  partnerCommission?: string;
}

export interface LedgerEntry {
  id: string;
  account: string;
  accountType: string;
  transactionType: string;
  indicator: 'Debit' | 'Credit';
  amount: MoneyValue;
  openingBalance: MoneyValue | null;
  closingBalance: MoneyValue | null;
  status: string;
  dateTime: string;
}

export interface TransactionData {
  reference: string;
  creationDate: string;
  completedDate?: string; // New: For approved txs
  expiryTime?: string;    // Existing: For pending txs
  location: string;
  requestAmount: MoneyValue; // New: Original user input
  grossAmount: MoneyValue;
  amount: MoneyValue; // Net Amount
  posId: string;
  tokenId?: string;
  paymentMethod: string;
  serviceType?: string;
  status: TransactionStatus;
  remark: string;
  message: string;
  payer: PartyDetails;
  payee: PartyDetails;
  commissions: CommissionDistribution;
  ledger: LedgerEntry[];
  type: TransactionType;
}

export interface TransactionListItem {
  id: string;
  reference: string;
  date: string;
  requestAmount: MoneyValue;
  type: TransactionType;
  payerWalletId: string;
  payeeWalletId: string;
  status: TransactionStatus;
  message: string;
  school: string;
  paymentMethod: string;
  serialNumber: string;
}

export interface Wallet {
  id: string;
  name: string;
  accountNumber: string;
  provider: string; // e.g. 'VeryPay', 'Airtel', 'MTN', 'Yo!'
  balance: MoneyValue;
  lastReconciliation: string;
  type: 'Internal' | 'External' | 'Fee';
}

export interface WalletStatementMetrics {
  periodStart: string;
  periodEnd: string;
  openingBalance: MoneyValue;
  closingBalance: MoneyValue;
  totalDebits: MoneyValue;
  totalCredits: MoneyValue;
}

export interface WalletLedgerItem {
  id: string;
  transactionId: string;
  reference: string;
  date: string;
  description: string;
  counterparty: string;
  type: string;
  debit?: MoneyValue;
  credit?: MoneyValue;
  balance: MoneyValue;
  status: 'Reconciled' | 'Pending' | 'Uncleared';
}
