import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/insights', icon: BarChart3, label: 'Insights' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`
          hidden md:flex flex-col fixed left-0 top-0 h-screen z-40
          bg-bg-sidebar transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[64px]' : 'w-[240px]'}
        `}
      >
        {/* Logo / Brand */}
        <div className="h-16 flex items-center px-4 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-teal to-accent-teal-dark flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">F</span>
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-text-primary whitespace-nowrap overflow-hidden">
              FinanceHub
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-1 px-2 mt-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? 'bg-accent-teal/8 text-accent-teal'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-high/50'
                }
                ${collapsed ? 'justify-center' : ''}
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent-teal rounded-r-full" />
                  )}
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                  )}
                  {/* Tooltip on collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2 py-1 bg-surface-bright text-text-primary text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="mx-2 mb-4 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-high/50 transition-colors text-center"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          >
            <path d="m11 17-5-5 5-5" />
            <path d="m18 17-5-5 5-5" />
          </svg>
        </button>

        {/* User Avatar */}
        <div className={`px-3 pb-4 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">AK</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-text-primary truncate">Alex Kim</p>
              <p className="text-xs text-text-muted truncate">alex@fintech.io</p>
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-sidebar/95 backdrop-blur-xl border-t border-border-default px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 4).map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors
                ${isActive ? 'text-accent-teal' : 'text-text-secondary'}`
              }
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
