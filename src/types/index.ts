export type TransactionType = 'income' | 'expense';
export type Division = 'office' | 'personal';

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  division: Division;
  accountId: string;
  dateTime: string;
  createdAt: string;
}

export interface Transfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  dateTime: string;
  createdAt: string;
}

export type ViewPeriod = 'weekly' | 'monthly' | 'yearly';

export interface FilterOptions {
  division: Division | 'all';
  category: string | 'all';
  startDate: string;
  endDate: string;
}
