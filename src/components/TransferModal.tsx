import { useState } from 'react';
import { useMoneyContext } from '../context/MoneyContext';
import { Modal } from './Modal';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const { accounts, addTransfer } = useMoneyContext();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || '');
  const [dateTime, setDateTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !fromAccountId || !toAccountId || fromAccountId === toAccountId) return;

    addTransfer({
      fromAccountId,
      toAccountId,
      amount: parseFloat(amount),
      description,
      dateTime: new Date(dateTime).toISOString(),
    });

    // Reset form
    setAmount('');
    setDescription('');
    setDateTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transfer Money">
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

        {/* Account Selection */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Account
            </label>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 mt-6" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Account
            </label>
            <select
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {fromAccountId === toAccountId && (
          <p className="text-sm text-red-500">Please select different accounts</p>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={fromAccountId === toAccountId}
          className="w-full py-3 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Transfer
        </button>
      </form>
    </Modal>
  );
}
