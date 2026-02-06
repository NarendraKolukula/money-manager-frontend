import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, Transfer, Account, Category, FilterOptions, TransactionType } from '../types';
import { defaultCategories, defaultAccounts, sampleTransactions, sampleTransfers } from '../data/initialData';
import { API_URL } from '../config';

interface MoneyContextType {
  transactions: Transaction[];
  transfers: Transfer[];
  accounts: Account[];
  categories: Category[];
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => boolean;
  deleteTransaction: (id: string) => boolean;
  addTransfer: (transfer: Omit<Transfer, 'id' | 'createdAt'>) => void;
  canEdit: (createdAt: string) => boolean;
  getFilteredTransactions: () => Transaction[];
  getTotalIncome: (transactions: Transaction[]) => number;
  getTotalExpense: (transactions: Transaction[]) => number;
  getCategoryTotals: (transactions: Transaction[]) => { category: string; amount: number; type: TransactionType }[];
}

const MoneyContext = createContext<MoneyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  transactions: 'money_manager_transactions',
  transfers: 'money_manager_transfers',
  accounts: 'money_manager_accounts',
};

export function MoneyProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.transactions);
    return stored ? JSON.parse(stored) : sampleTransactions;
  });

  const [transfers, setTransfers] = useState<Transfer[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.transfers);
    return stored ? JSON.parse(stored) : sampleTransfers;
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.accounts);
    return stored ? JSON.parse(stored) : defaultAccounts;
  });

  const [filters, setFilters] = useState<FilterOptions>({
    division: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
  });

  const categories = defaultCategories;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.transfers, JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
  }, [accounts]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: now,
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    
    // Update account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === transaction.accountId) {
        const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
        return { ...acc, balance: acc.balance + balanceChange };
      }
      return acc;
    }));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>): boolean => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction || !canEdit(transaction.createdAt)) {
      return false;
    }

    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, ...updates };
      }
      return t;
    }));
    return true;
  };

  const deleteTransaction = (id: string): boolean => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction || !canEdit(transaction.createdAt)) {
      return false;
    }

    // Revert account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === transaction.accountId) {
        const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
        return { ...acc, balance: acc.balance + balanceChange };
      }
      return acc;
    }));

    setTransactions(prev => prev.filter(t => t.id !== id));
    return true;
  };

  const addTransfer = (transfer: Omit<Transfer, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newTransfer: Transfer = {
      ...transfer,
      id: uuidv4(),
      createdAt: now,
    };
    
    setTransfers(prev => [...prev, newTransfer]);
    
    // Update account balances
    setAccounts(prev => prev.map(acc => {
      if (acc.id === transfer.fromAccountId) {
        return { ...acc, balance: acc.balance - transfer.amount };
      }
      if (acc.id === transfer.toAccountId) {
        return { ...acc, balance: acc.balance + transfer.amount };
      }
      return acc;
    }));
  };

  const canEdit = (createdAt: string): boolean => {
    const created = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 12;
  };

  const getFilteredTransactions = (): Transaction[] => {
    return transactions.filter(t => {
      if (filters.division !== 'all' && t.division !== filters.division) return false;
      if (filters.category !== 'all' && t.category !== filters.category) return false;
      
      const transactionDate = new Date(t.dateTime);
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        if (transactionDate < start) return false;
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        if (transactionDate > end) return false;
      }
      
      return true;
    });
  };

  const getTotalIncome = (txns: Transaction[]): number => {
    return txns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpense = (txns: Transaction[]): number => {
    return txns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  };

  const getCategoryTotals = (txns: Transaction[]): { category: string; amount: number; type: TransactionType }[] => {
    const totals: Record<string, { amount: number; type: TransactionType }> = {};
    
    txns.forEach(t => {
      if (!totals[t.category]) {
        totals[t.category] = { amount: 0, type: t.type };
      }
      totals[t.category].amount += t.amount;
    });
    
    return Object.entries(totals).map(([category, data]) => ({
      category,
      amount: data.amount,
      type: data.type,
    }));
  };

  return (
    <MoneyContext.Provider value={{
      transactions,
      transfers,
      accounts,
      categories,
      filters,
      setFilters,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addTransfer,
      canEdit,
      getFilteredTransactions,
      getTotalIncome,
      getTotalExpense,
      getCategoryTotals,
    }}>
      {children}
    </MoneyContext.Provider>
  );
}

export function useMoneyContext() {
  const context = useContext(MoneyContext);
  if (!context) {
    throw new Error('useMoneyContext must be used within a MoneyProvider');
  }
  return context;
}
