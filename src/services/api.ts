// API Service for connecting to Spring Boot backend
import { API_URL } from '../config';


// API Service for connecting to Spring Boot backend
const API_BASE_URL = API_URL;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const result: ApiResponse<T> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'API request failed');
  }

  return result.data;
}

// Transaction Types for API
export interface TransactionApiDTO {
  id?: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  category: string;
  division: 'OFFICE' | 'PERSONAL';
  accountId: string;
  dateTime: string;
  createdAt?: string;
  updatedAt?: string;
  editable?: boolean;
}

export interface TransferApiDTO {
  id?: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  dateTime: string;
  createdAt?: string;
}

export interface AccountApiDTO {
  id: string;
  name: string;
  balance: number;
  color: string;
}

export interface CategoryApiDTO {
  id: string;
  name: string;
  icon: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface DashboardSummaryDTO {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: CategorySummaryDTO[];
  periodComparison: PeriodDataDTO[];
}

export interface CategorySummaryDTO {
  categoryId: string;
  categoryName: string;
  icon: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  count: number;
}

export interface PeriodDataDTO {
  period: string;
  income: number;
  expense: number;
}

// Transaction API
export const transactionApi = {
  getAll: (params?: {
    division?: 'OFFICE' | 'PERSONAL';
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<TransactionApiDTO[]> => {
    const searchParams = new URLSearchParams();
    if (params?.division) searchParams.append('division', params.division);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    
    const query = searchParams.toString();
    return apiCall(`/transactions${query ? `?${query}` : ''}`);
  },

  getById: (id: string): Promise<TransactionApiDTO> => {
    return apiCall(`/transactions/${id}`);
  },

  create: (transaction: Omit<TransactionApiDTO, 'id' | 'createdAt' | 'updatedAt' | 'editable'>): Promise<TransactionApiDTO> => {
    return apiCall('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  },

  update: (id: string, transaction: Partial<TransactionApiDTO>): Promise<TransactionApiDTO> => {
    return apiCall(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  },

  delete: (id: string): Promise<void> => {
    return apiCall(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Account API
export const accountApi = {
  getAll: (): Promise<AccountApiDTO[]> => {
    return apiCall('/accounts');
  },

  getById: (id: string): Promise<AccountApiDTO> => {
    return apiCall(`/accounts/${id}`);
  },

  getTotalBalance: (): Promise<number> => {
    return apiCall('/accounts/total-balance');
  },

  create: (account: Omit<AccountApiDTO, 'id'>): Promise<AccountApiDTO> => {
    return apiCall('/accounts', {
      method: 'POST',
      body: JSON.stringify(account),
    });
  },

  update: (id: string, account: Partial<AccountApiDTO>): Promise<AccountApiDTO> => {
    return apiCall(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(account),
    });
  },

  delete: (id: string): Promise<void> => {
    return apiCall(`/accounts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Transfer API
export const transferApi = {
  getAll: (): Promise<TransferApiDTO[]> => {
    return apiCall('/transfers');
  },

  getById: (id: string): Promise<TransferApiDTO> => {
    return apiCall(`/transfers/${id}`);
  },

  getByDateRange: (startDate: string, endDate: string): Promise<TransferApiDTO[]> => {
    return apiCall(`/transfers/date-range?startDate=${startDate}&endDate=${endDate}`);
  },

  create: (transfer: Omit<TransferApiDTO, 'id' | 'createdAt'>): Promise<TransferApiDTO> => {
    return apiCall('/transfers', {
      method: 'POST',
      body: JSON.stringify(transfer),
    });
  },

  delete: (id: string): Promise<void> => {
    return apiCall(`/transfers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Category API
export const categoryApi = {
  getAll: (): Promise<CategoryApiDTO[]> => {
    return apiCall('/categories');
  },

  getByType: (type: 'INCOME' | 'EXPENSE'): Promise<CategoryApiDTO[]> => {
    return apiCall(`/categories/type/${type}`);
  },

  getById: (id: string): Promise<CategoryApiDTO> => {
    return apiCall(`/categories/${id}`);
  },

  create: (category: CategoryApiDTO): Promise<CategoryApiDTO> => {
    return apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  update: (id: string, category: Partial<CategoryApiDTO>): Promise<CategoryApiDTO> => {
    return apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  delete: (id: string): Promise<void> => {
    return apiCall(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Dashboard API
export const dashboardApi = {
  getWeeklySummary: (): Promise<DashboardSummaryDTO> => {
    return apiCall('/dashboard/summary/weekly');
  },

  getMonthlySummary: (): Promise<DashboardSummaryDTO> => {
    return apiCall('/dashboard/summary/monthly');
  },

  getYearlySummary: (): Promise<DashboardSummaryDTO> => {
    return apiCall('/dashboard/summary/yearly');
  },

  getCustomSummary: (startDate: string, endDate: string): Promise<DashboardSummaryDTO> => {
    return apiCall(`/dashboard/summary/custom?startDate=${startDate}&endDate=${endDate}`);
  },

  getCategorySummary: (startDate?: string, endDate?: string): Promise<CategorySummaryDTO[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString();
    return apiCall(`/dashboard/category-summary${query ? `?${query}` : ''}`);
  },

  getTotals: (startDate?: string, endDate?: string): Promise<{ totalIncome: number; totalExpense: number; balance: number }> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString();
    return apiCall(`/dashboard/totals${query ? `?${query}` : ''}`);
  },
};

// Export all APIs
export const api = {
  transactions: transactionApi,
  accounts: accountApi,
  transfers: transferApi,
  categories: categoryApi,
  dashboard: dashboardApi,
};

export default api;
