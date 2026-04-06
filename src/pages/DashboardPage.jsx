import { useMemo, useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import BalanceTrendChart from '../components/charts/BalanceTrendChart';
import CategoryDonutChart from '../components/charts/CategoryDonutChart';

export default function DashboardPage() {
  const { transactions } = useAppContext();

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return { totalIncome, totalExpenses, balance, savingsRate };
  }, [transactions]);

  const cards = [
    {
      label: 'Total Balance',
      value: stats.balance,
      change: +2.4,
      icon: DollarSign,
      accent: 'accent-teal',
      border: 'border-l-accent-teal',
    },
    {
      label: 'Total Income',
      value: stats.totalIncome,
      change: +8.1,
      icon: TrendingUp,
      accent: 'accent-indigo',
      border: 'border-l-accent-indigo',
    },
    {
      label: 'Total Expenses',
      value: stats.totalExpenses,
      change: -3.2,
      icon: TrendingDown,
      accent: 'accent-rose',
      border: 'border-l-accent-rose',
    },
    {
      label: 'Savings Rate',
      value: stats.savingsRate,
      isSavings: true,
      icon: PiggyBank,
      accent: 'accent-amber',
      border: 'border-l-accent-amber',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
          Welcome back, Alex
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Here&apos;s your financial overview for{' '}
          {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-bg-surface rounded-2xl p-5 md:p-6">
          <h3 className="text-base font-semibold text-text-primary mb-4">Revenue Overview</h3>
          <BalanceTrendChart transactions={transactions} />
        </div>
        <div className="lg:col-span-2 bg-bg-surface rounded-2xl p-5 md:p-6">
          <h3 className="text-base font-semibold text-text-primary mb-4">Expense Breakdown</h3>
          <CategoryDonutChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

/* ── Stat Card ── */

function StatCard({ label, value, change, isSavings, icon: Icon, accent, border }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 1000; // 1 second animation

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuart
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(value * easeOut);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  const formatted = isSavings
    ? `${displayValue.toFixed(1)}%`
    : `$${Math.abs(displayValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div
      className={`
        group relative bg-bg-surface rounded-2xl p-5
        border-l-[3px] ${border}
        hover:-translate-y-0.5 hover:shadow-card
        transition-all duration-200 ease-out
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className="text-2xl font-bold text-text-primary tracking-tight">{formatted}</p>
        </div>
        <div className={`p-2 rounded-xl bg-${accent}/10`}>
          <Icon size={20} className={`text-${accent}`} />
        </div>
      </div>

      {!isSavings && change !== undefined && (
        <div className="flex items-center gap-1.5 mt-3">
          {change >= 0 ? (
            <TrendingUp size={14} className="text-status-success" />
          ) : (
            <TrendingDown size={14} className="text-status-error" />
          )}
          <span
            className={`text-xs font-semibold ${change >= 0 ? 'text-status-success' : 'text-status-error'}`}
          >
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-text-muted">vs last month</span>
        </div>
      )}

      {isSavings && (
        <div className="mt-3">
          <div className="w-full h-1.5 bg-bg-input rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-amber rounded-full transition-all duration-500"
              style={{ width: `${Math.min(displayValue, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
