import { useState } from 'react';
import { useMoneyContext } from '../context/MoneyContext';
import { Modal } from './Modal';
import { CategoryIcon } from './CategoryIcon';
import { TransactionType, Division } from '../types';
import { format } from 'date-fns';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { categories, accounts, addTransaction } = useMoneyContext();
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [division, setDivision] = useState<Division>('personal');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [dateTime, setDateTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

  const filteredCategories = categories.filter(c => c.type === activeTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category || !accountId) return;

    addTransaction({
      type: activeTab,
      amount: parseFloat(amount),
      description,
      category,
      division,
      accountId,
      dateTime: new Date(dateTime).toISOString(),
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setDivision('personal');
    setDateTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    onClose();
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    setDivision('personal');
    setActiveTab('expense');
    setDateTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Transaction">
      {/* Tabs */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => {
            setActiveTab('income');
            setCategory('');
          }}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            activeTab === 'income'
              ? 'bg-green-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Income
        </button>
        <button
          onClick={() => {
            setActiveTab('expense');
            setCategory('');
          }}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            activeTab === 'expense'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Expense
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Date & Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date & Time
          </label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                  category === cat.id
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CategoryIcon iconName={cat.icon} className="w-5 h-5 mb-1" />
                <span className="text-xs text-center truncate w-full">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Division */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Division
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="personal"
                checked={division === 'personal'}
                onChange={(e) => setDivision(e.target.value as Division)}
                className="mr-2"
              />
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                Personal
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="office"
                checked={division === 'office'}
                onChange={(e) => setDivision(e.target.value as Division)}
                className="mr-2"
              />
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Office
              </span>
            </label>
          </div>
        </div>

        {/* Account */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} (₹{acc.balance.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
            activeTab === 'income'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          Add {activeTab === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </Modal>
  );
}
