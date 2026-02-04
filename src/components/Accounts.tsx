import { useMoneyContext } from '../context/MoneyContext';
import { CreditCard, Banknote, Building2, ArrowRightLeft } from 'lucide-react';
import { format } from 'date-fns';

interface AccountsProps {
  onTransferClick: () => void;
}

export function Accounts({ onTransferClick }: AccountsProps) {
  const { accounts, transfers } = useMoneyContext();

  const getAccountIcon = (accountId: string) => {
    switch (accountId) {
      case 'cash':
        return Banknote;
      case 'bank':
        return Building2;
      case 'credit':
        return CreditCard;
      default:
        return CreditCard;
    }
  };

  const getAccountName = (accountId: string) => {
    return accounts.find(a => a.id === accountId)?.name || accountId;
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const sortedTransfers = [...transfers].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Accounts</h2>
        <button
          onClick={onTransferClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Transfer
        </button>
      </div>

      {/* Total Balance */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
        <p className="text-white/80 text-sm">Total Balance</p>
        <p className="text-3xl font-bold mt-1">₹{totalBalance.toLocaleString()}</p>
        <p className="text-white/60 text-sm mt-2">{accounts.length} accounts</p>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((account) => {
          const Icon = getAccountIcon(account.id);
          return (
            <div
              key={account.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${account.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: account.color }} />
                </div>
                <h3 className="font-medium text-gray-800">{account.name}</h3>
              </div>
              <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-gray-800' : 'text-red-500'}`}>
                ₹{account.balance.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Transfer History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Transfer History</h3>
        </div>
        {sortedTransfers.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No transfers yet
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {sortedTransfers.map((transfer) => (
              <div key={transfer.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {getAccountName(transfer.fromAccountId)}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium text-gray-800">
                        {getAccountName(transfer.toAccountId)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {transfer.description || 'No description'} • {format(new Date(transfer.dateTime), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    ₹{transfer.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
