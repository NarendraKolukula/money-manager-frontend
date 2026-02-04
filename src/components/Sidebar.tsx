import { LayoutDashboard, History, Wallet, Plus, ArrowRightLeft } from 'lucide-react';

type View = 'dashboard' | 'history' | 'accounts';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onAddClick: () => void;
  onTransferClick: () => void;
}

export function Sidebar({ currentView, onViewChange, onAddClick, onTransferClick }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history' as View, label: 'History', icon: History },
    { id: 'accounts' as View, label: 'Accounts', icon: Wallet },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
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

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={onAddClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
        <button
          onClick={onTransferClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowRightLeft className="w-5 h-5" />
          Transfer
        </button>
      </div>
    </aside>
  );
}
