import { useState, useEffect } from 'react';
import { useMoneyContext } from '../context/MoneyContext';
import { Modal } from './Modal';
import { CategoryIcon } from './CategoryIcon';
import { Transaction, Division } from '../types';
import { format } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
  const { categories, accounts, updateTransaction, deleteTransaction, canEdit } = useMoneyContext();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [division, setDivision] = useState<Division>('personal');
  const [accountId, setAccountId] = useState('');
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setCategory(transaction.category);
      setDivision(transaction.division);
      setAccountId(transaction.accountId);
      setDateTime(format(new Date(transaction.dateTime), "yyyy-MM-dd'T'HH:mm"));
    }
  }, [transaction]);

  if (!transaction) return null;

  const isEditable = canEdit(transaction.createdAt);
  const filteredCategories = categories.filter(c => c.type === transaction.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditable) return;

    updateTransaction(transaction.id, {
      amount: parseFloat(amount),
      description,
      category,
      division,
      accountId,
      dateTime: new Date(dateTime).toISOString(),
    });

    onClose();
  };

  const handleDelete = () => {
    if (!isEditable) return;
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transaction.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Transaction">
      {!isEditable && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <p className="text-sm text-amber-700">
            This transaction cannot be edited. Editing is only allowed within 12 hours of creation.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            transaction.type === 'income' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {transaction.type === 'income' ? 'Income' : 'Expense'}
          </span>
        </div>

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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            required
            min="0"
            step="0.01"
            disabled={!isEditable}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            required
            disabled={!isEditable}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            required
            disabled={!isEditable}
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
                onClick={() => isEditable && setCategory(cat.id)}
                disabled={!isEditable}
                className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                  category === cat.id
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!isEditable ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            <label className={`flex items-center ${!isEditable ? 'opacity-50' : ''}`}>
              <input
                type="radio"
                value="personal"
                checked={division === 'personal'}
                onChange={(e) => setDivision(e.target.value as Division)}
                className="mr-2"
                disabled={!isEditable}
              />
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                Personal
              </span>
            </label>
            <label className={`flex items-center ${!isEditable ? 'opacity-50' : ''}`}>
              <input
                type="radio"
                value="office"
                checked={division === 'office'}
                onChange={(e) => setDivision(e.target.value as Division)}
                className="mr-2"
                disabled={!isEditable}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            required
            disabled={!isEditable}
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {isEditable && (
            <>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-3 rounded-lg font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </>
          )}
          {!isEditable && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-lg font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
