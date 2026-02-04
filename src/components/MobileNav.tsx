import { LayoutDashboard, History, Wallet, Plus } from 'lucide-react';

type View = 'dashboard' | 'history' | 'accounts';

interface MobileNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onAddClick: () => void;
}

export function MobileNav({ currentView, onViewChange, onAddClick }: MobileNavProps) {
  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history' as View, label: 'History', icon: History },
    { id: 'accounts' as View, label: 'Accounts', icon: Wallet },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 lg:hidden z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          // Add FAB in the middle
          if (index === 1) {
            return (
              <div key={item.id} className="flex items-center gap-2">
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`flex flex-col items-center px-4 py-2 ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
                <button
                  onClick={onAddClick}
                  className="w-14 h-14 -mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200"
                >
                  <Plus className="w-6 h-6 text-white" />
                </button>
              </div>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center px-4 py-2 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
