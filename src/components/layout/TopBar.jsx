import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, Shield, Eye, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../../store/AppContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/insights': 'Insights & Analytics',
  '/settings': 'Settings',
};

export default function TopBar() {
  const { role, setRole } = useAppContext();
  const location = useLocation();
  const [roleOpen, setRoleOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Theme toggle
  const [isDark, setIsDark] = useState(() => {
    return !document.documentElement.classList.contains('light');
  });

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    setIsDark(!isDark);
  };

  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-bg-sidebar/60 backdrop-blur-xl border-b border-border-default/50 sticky top-0 z-30">
      {/* Left: Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-text-primary">{pageTitle}</h1>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div
          className={`
            flex items-center w-full gap-2 px-4 py-2 rounded-xl
            bg-bg-input border transition-all duration-200
            ${searchFocused ? 'border-accent-teal shadow-glow-teal' : 'border-border-default'}
          `}
        >
          <Search size={16} className="text-text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search transactions, insights..."
            className="bg-transparent border-none outline-none text-sm text-text-primary placeholder-text-muted w-full"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-high/50 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-high/50 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-rose rounded-full" />
        </button>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleOpen(!roleOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-input border border-border-default hover:border-outline transition-colors"
          >
            {role === 'Admin' ? (
              <Shield size={14} className="text-accent-teal" />
            ) : (
              <Eye size={14} className="text-accent-indigo" />
            )}
            <span className="text-xs font-semibold text-text-primary">{role}</span>
            <ChevronDown
              size={12}
              className={`text-text-muted transition-transform duration-200 ${roleOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {roleOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setRoleOpen(false)} />
              <div className="absolute right-0 mt-2 w-40 rounded-xl bg-bg-surface border border-border-default shadow-ambient overflow-hidden z-50">
                <button
                  onClick={() => { setRole('Admin'); setRoleOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors
                    ${role === 'Admin' ? 'text-accent-teal bg-accent-teal/8' : 'text-text-secondary hover:text-text-primary hover:bg-surface-high/50'}`}
                >
                  <Shield size={14} />
                  <span className="font-medium">Admin</span>
                </button>
                <button
                  onClick={() => { setRole('Viewer'); setRoleOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors
                    ${role === 'Viewer' ? 'text-accent-indigo bg-accent-indigo/8' : 'text-text-secondary hover:text-text-primary hover:bg-surface-high/50'}`}
                >
                  <Eye size={14} />
                  <span className="font-medium">Viewer</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
