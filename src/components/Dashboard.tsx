import { API_URL } from './config';
import { useState, useMemo } from 'react';
import { useMoneyContext } from '../context/MoneyContext';
import { ViewPeriod } from '../types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, subWeeks, subMonths, subYears } from 'date-fns';
import { TrendingUp, TrendingDown, Wallet, PieChart as PieChartIcon, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CategoryIcon } from './CategoryIcon';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function Dashboard() {
  const { transactions, categories, accounts, getTotalIncome, getTotalExpense, getCategoryTotals } = useMoneyContext();
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('monthly');

  const getPeriodDates = (period: ViewPeriod, offset: number = 0) => {
    const now = new Date();
    let start: Date, end: Date;

    switch (period) {
      case 'weekly':
        const weekDate = subWeeks(now, offset);
        start = startOfWeek(weekDate, { weekStartsOn: 1 });
        end = endOfWeek(weekDate, { weekStartsOn: 1 });
        break;
      case 'monthly':
        const monthDate = subMonths(now, offset);
        start = startOfMonth(monthDate);
        end = endOfMonth(monthDate);
        break;
      case 'yearly':
        const yearDate = subYears(now, offset);
        start = startOfYear(yearDate);
        end = endOfYear(yearDate);
        break;
    }

    return { start, end };
  };

  const getFilteredByPeriod = (period: ViewPeriod, offset: number = 0) => {
    const { start, end } = getPeriodDates(period, offset);
    return transactions.filter(t => {
      const date = new Date(t.dateTime);
      return isWithinInterval(date, { start, end });
    });
  };

  const currentPeriodTransactions = useMemo(() => getFilteredByPeriod(viewPeriod, 0), [transactions, viewPeriod]);
  const totalIncome = getTotalIncome(currentPeriodTransactions);
  const totalExpense = getTotalExpense(currentPeriodTransactions);
  const balance = totalIncome - totalExpense;

  // Calculate total account balance
  const totalAccountBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const categoryTotals = useMemo(() => {
    return getCategoryTotals(currentPeriodTransactions.filter(t => t.type === 'expense'));
  }, [currentPeriodTransactions]);

  // Income category totals for summary
  const incomeCategoryTotals = useMemo(() => {
    return getCategoryTotals(currentPeriodTransactions.filter(t => t.type === 'income'));
  }, [currentPeriodTransactions]);

  const pieChartData = categoryTotals.map(ct => {
    const cat = categories.find(c => c.id === ct.category);
    return {
      name: cat?.name || ct.category,
      value: ct.amount,
    };
  });

  // Bar chart data for comparison
  const barChartData = useMemo(() => {
    const periods = viewPeriod === 'weekly' ? 4 : viewPeriod === 'monthly' ? 6 : 3;
    const data = [];

    for (let i = periods - 1; i >= 0; i--) {
      const periodTxns = getFilteredByPeriod(viewPeriod, i);
      const { start } = getPeriodDates(viewPeriod, i);
      let label: string;

      switch (viewPeriod) {
        case 'weekly':
          label = format(start, 'MMM d');
          break;
        case 'monthly':
          label = format(start, 'MMM yyyy');
          break;
        case 'yearly':
          label = format(start, 'yyyy');
          break;
      }

      data.push({
        name: label,
        Income: getTotalIncome(periodTxns),
        Expense: getTotalExpense(periodTxns),
      });
    }

    return data;
  }, [transactions, viewPeriod]);

  const getPeriodLabel = () => {
    const { start, end } = getPeriodDates(viewPeriod, 0);
    switch (viewPeriod) {
      case 'weekly':
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
      case 'monthly':
        return format(start, 'MMMM yyyy');
      case 'yearly':
        return format(start, 'yyyy');
    }
  };

  // Recent transactions for history section
  const recentTransactions = useMemo(() => {
    return [...currentPeriodTransactions]
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
      .slice(0, 5);
  }, [currentPeriodTransactions]);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const getCategoryIconName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.icon || 'Receipt';
  };

  return (
    <div className="space-y-6">
      {/* Header with Period Selector Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {getPeriodLabel()}
          </p>
        </div>
        
        {/* Dropdown Period Selector */}
        <div className="relative">
          <select
            value={viewPeriod}
            onChange={(e) => setViewPeriod(e.target.value as ViewPeriod)}
            className="appearance-none px-6 py-3 pr-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
          >
            <option value="weekly" className="bg-white text-gray-800">Weekly View</option>
            <option value="monthly" className="bg-white text-gray-800">Monthly View</option>
            <option value="yearly" className="bg-white text-gray-800">Yearly View</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold mt-1">₹{totalIncome.toLocaleString()}</p>
              <p className="text-green-200 text-xs mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {viewPeriod === 'weekly' ? 'This Week' : viewPeriod === 'monthly' ? 'This Month' : 'This Year'}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Expense</p>
              <p className="text-2xl font-bold mt-1">₹{totalExpense.toLocaleString()}</p>
              <p className="text-red-200 text-xs mt-2 flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3" />
                {viewPeriod === 'weekly' ? 'This Week' : viewPeriod === 'monthly' ? 'This Month' : 'This Year'}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Period Balance Card */}
        <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Period Balance</p>
              <p className="text-2xl font-bold mt-1">₹{balance.toLocaleString()}</p>
              <p className="text-white/60 text-xs mt-2">
                {balance >= 0 ? 'Savings' : 'Overspent'}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Account Balance Card */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Balance</p>
              <p className="text-2xl font-bold mt-1">₹{totalAccountBalance.toLocaleString()}</p>
              <p className="text-purple-200 text-xs mt-2">
                {accounts.length} accounts
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Income vs Expense Comparison */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {viewPeriod === 'weekly' ? 'Weekly' : viewPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Income vs Expense
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => `₹${Number(value).toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Expense by Category */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-gray-500" />
            Expense Distribution by Category
          </h3>
          {pieChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No expense data for this period
            </div>
          )}
        </div>
      </div>

      {/* Category Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories Summary */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            Expense Categories Summary
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
            {categoryTotals.length > 0 ? (
              categoryTotals.map((ct, index) => {
                const cat = categories.find(c => c.id === ct.category);
                const percentage = totalExpense > 0 ? (ct.amount / totalExpense) * 100 : 0;
                return (
                  <div key={ct.category} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${COLORS[index % COLORS.length]}20`, color: COLORS[index % COLORS.length] }}
                    >
                      <CategoryIcon
                        iconName={cat?.icon || 'Receipt'}
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800 truncate">{cat?.name || ct.category}</p>
                        <p className="text-sm font-semibold text-gray-700">₹{ct.amount.toLocaleString()}</p>
                      </div>
                      <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center py-4">No expenses for this period</p>
            )}
          </div>
        </div>

        {/* Income Categories Summary */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Income Categories Summary
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
            {incomeCategoryTotals.length > 0 ? (
              incomeCategoryTotals.map((ct, index) => {
                const cat = categories.find(c => c.id === ct.category);
                const percentage = totalIncome > 0 ? (ct.amount / totalIncome) * 100 : 0;
                return (
                  <div key={ct.category} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${COLORS[(index + 4) % COLORS.length]}20`, color: COLORS[(index + 4) % COLORS.length] }}
                    >
                      <CategoryIcon
                        iconName={cat?.icon || 'Receipt'}
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800 truncate">{cat?.name || ct.category}</p>
                        <p className="text-sm font-semibold text-green-600">₹{ct.amount.toLocaleString()}</p>
                      </div>
                      <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: COLORS[(index + 4) % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center py-4">No income for this period</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transaction History */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Transaction History</h3>
          <span className="text-sm text-gray-500">{currentPeriodTransactions.length} transactions</span>
        </div>
        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="py-3 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  <CategoryIcon iconName={getCategoryIconName(transaction.category)} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800 truncate">{transaction.description}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      transaction.division === 'office' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {transaction.division === 'office' ? 'Office' : 'Personal'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {getCategoryName(transaction.category)} • {format(new Date(transaction.dateTime), 'MMM d, h:mm a')}
                  </p>
                </div>
                <p className={`text-lg font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No transactions for this period</p>
          </div>
        )}
      </div>
    </div>
  );
}
