
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
  | 'Bill Payment'
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
  expiryTime?: string;
  location: string;
  grossAmount: MoneyValue;
  amount: MoneyValue; // Net Amount often referred to just as Amount in display
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
  type: TransactionType; // Added type here for detail view context
}

export interface TransactionListItem {
  id: string;
  reference: string;
  date: string;
  grossAmount: MoneyValue;
  amount: MoneyValue;
  type: TransactionType;
  payerWalletId: string;
  payeeWalletId: string;
  status: TransactionStatus;
  message: string;
  school: string;
  paymentMethod: string;
  serialNumber: string;
}
