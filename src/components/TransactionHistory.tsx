import { useState } from 'react';
import { useMoneyContext } from '../context/MoneyContext';
import { Transaction } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { format } from 'date-fns';
import { Edit3, Clock, Briefcase, User, Filter, X } from 'lucide-react';

interface TransactionHistoryProps {
  onEditTransaction: (transaction: Transaction) => void;
}

export function TransactionHistory({ onEditTransaction }: TransactionHistoryProps) {
  const { 
    categories, 
    accounts, 
    filters, 
    setFilters, 
    getFilteredTransactions, 
    canEdit 
  } = useMoneyContext();
  
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = getFilteredTransactions()
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const getCategoryIcon = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.icon || 'Receipt';
  };

  const getAccountName = (accountId: string) => {
    return accounts.find(a => a.id === accountId)?.name || accountId;
  };

  const hasActiveFilters = filters.division !== 'all' || 
    filters.category !== 'all' || 
    filters.startDate || 
    filters.endDate;

  const clearFilters = () => {
    setFilters({
      division: 'all',
      category: 'all',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            hasActiveFilters 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-white rounded-full"></span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">Filter Transactions</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Division Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Division</label>
              <select
                value={filters.division}
                onChange={(e) => setFilters(prev => ({ ...prev, division: e.target.value as typeof filters.division }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Divisions</option>
                <option value="personal">Personal</option>
                <option value="office">Office</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>No transactions found</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-2 text-blue-500 hover:text-blue-600"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredTransactions.map((transaction) => {
              const isEditable = canEdit(transaction.createdAt);
              return (
                <div
                  key={transaction.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onEditTransaction(transaction)}
                >
                  <div className="flex items-center gap-4">
                    {/* Category Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      <CategoryIcon iconName={getCategoryIcon(transaction.category)} className="w-6 h-6" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-800 truncate">{transaction.description}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          transaction.division === 'office' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {transaction.division === 'office' ? (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              Office
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Personal
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <span>{getCategoryName(transaction.category)}</span>
                        <span>•</span>
                        <span>{getAccountName(transaction.accountId)}</span>
                        <span>•</span>
                        <span>{format(new Date(transaction.dateTime), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        {isEditable ? (
                          <span className="flex items-center gap-1 text-blue-500">
                            <Edit3 className="w-3 h-3" />
                            Editable
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Results count */}
      {filteredTransactions.length > 0 && (
        <p className="text-sm text-gray-500 text-center">
          Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
