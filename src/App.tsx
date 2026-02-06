// For production (Render backend)
// Uncomment below for local development
// export const API_URL = "http://localhost:8080";
import { useState } from 'react';
import { MoneyProvider } from './context/MoneyContext';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Dashboard } from './components/Dashboard';
import { TransactionHistory } from './components/TransactionHistory';
import { Accounts } from './components/Accounts';
import { AddTransactionModal } from './components/AddTransactionModal';
import { TransferModal } from './components/TransferModal';
import { EditTransactionModal } from './components/EditTransactionModal';
import { Transaction } from './types';
import { Wallet } from 'lucide-react';

type View = 'dashboard' | 'history' | 'accounts';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'history':
        return <TransactionHistory onEditTransaction={handleEditTransaction} />;
      case 'accounts':
        return <Accounts onTransferClick={() => setIsTransferModalOpen(true)} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          onAddClick={() => setIsAddModalOpen(true)}
          onTransferClick={() => setIsTransferModalOpen(true)}
        />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Money Manager</h1>
              <p className="text-xs text-gray-500">Personal Finance</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddClick={() => setIsAddModalOpen(true)}
      />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0 pb-24 lg:pb-0 min-h-screen">
        <div className="p-4 lg:p-8">
          {renderView()}
        </div>
      </main>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />
      
      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
      />
    </div>
  );
}



export default function App() {
  return (
    <MoneyProvider>
      <AppContent />
    </MoneyProvider>
  );
}