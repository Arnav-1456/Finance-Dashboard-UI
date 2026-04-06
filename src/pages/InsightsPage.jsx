import { useMemo } from 'react';
import { Trophy, AlertTriangle, ArrowRight, Wallet, Percent, Flame } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import ComparisonBarChart from '../components/charts/ComparisonBarChart';

export default function InsightsPage() {
  const { transactions } = useAppContext();

  const insights = useMemo(() => {
    const now = new Date();
    const thisStart = startOfMonth(now);
    const thisEnd = endOfMonth(now);

    // Filter to just this month
    const thisMonthTxns = transactions.filter(t => 
      isWithinInterval(new Date(t.date), { start: thisStart, end: thisEnd })
    );

    // 1. Savings Rate
    const income = thisMonthTxns.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
    const expenses = thisMonthTxns.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    // 2. Highest Spending Category
    const categoryTotals = {};
    const expensesOnly = thisMonthTxns.filter(t => t.type === 'Expense');
    expensesOnly.forEach(t => {
      const label = t.categoryLabel || 'Other';
      categoryTotals[label] = (categoryTotals[label] || 0) + t.amount;
    });

    let topCategory = { name: 'None', amount: 0, pct: 0 };
    Object.entries(categoryTotals).forEach(([name, amount]) => {
      if (amount > topCategory.amount) {
        topCategory = { 
          name, 
          amount, 
          pct: expenses > 0 ? (amount / expenses) * 100 : 0 
        };
      }
    });

    // 3. Top 3 Expense Transactions
    const top3Expenses = [...expensesOnly]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    return { savingsRate, topCategory, top3Expenses, expenses };
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary">AI Insights</h2>
        <p className="text-sm text-text-secondary mt-1">Automated analysis of your spending habits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Key Metric Cards */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Highest Category Card */}
          <div className="bg-bg-surface rounded-2xl p-6 border-t-4 border-t-accent-rose shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-accent-rose/10 text-accent-rose">
                <Flame size={20} />
              </div>
              <h3 className="font-semibold text-text-primary">Highest Spending</h3>
            </div>
            <p className="text-3xl font-bold text-text-primary tracking-tight mb-1">
              {insights.topCategory.name}
            </p>
            <div className="flex items-end gap-2 text-sm">
              <span className="font-medium text-accent-rose">
                ${insights.topCategory.amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </span>
              <span className="text-text-muted">
                ({insights.topCategory.pct.toFixed(1)}% of total)
              </span>
            </div>
            
            {/* Warning Message if > 40% */}
            {insights.topCategory.pct > 40 && (
              <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-[#3D2520] border border-[#5C322B]">
                <AlertTriangle size={16} className="text-[#FF8B7A] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#FF8B7A] leading-relaxed">
                  This single category consumes over 40% of your expenses. Consider re-evaluating this budget.
                </p>
              </div>
            )}
          </div>

          {/* Savings Rate Card */}
          <div className="bg-bg-surface rounded-2xl p-6 border-t-4 border-t-accent-teal shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-accent-teal/10 text-accent-teal">
                <Percent size={20} />
              </div>
              <h3 className="font-semibold text-text-primary">Savings Rate</h3>
            </div>
            <p className="text-3xl font-bold text-text-primary tracking-tight mb-2">
              {insights.savingsRate.toFixed(1)}%
            </p>
            
            {/* Progress/Goal bar */}
            <div className="space-y-1.5 mt-4">
              <div className="flex justify-between text-xs text-text-secondary">
                <span>0%</span>
                <span className="text-accent-teal font-medium">Goal: 20%</span>
              </div>
              <div className="w-full h-2 bg-bg-input rounded-full overflow-hidden relative">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    insights.savingsRate >= 20 ? 'bg-status-success' : 'bg-status-warning'
                  }`}
                  style={{ width: `${Math.min(Math.max(insights.savingsRate, 0), 100)}%` }}
                />
                {/* 20% Marker */}
                <div className="absolute top-0 bottom-0 left-[20%] w-[2px] bg-bg-surface" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Comparison Bar Chart */}
          <div className="bg-bg-surface rounded-2xl p-6 w-full">
            <h3 className="text-base font-semibold text-text-primary mb-6">Current vs Previous Month</h3>
            <ComparisonBarChart transactions={transactions} />
          </div>

          {/* Top 3 Transactions list */}
          <div className="bg-bg-surface rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Trophy size={18} className="text-accent-amber" />
              <h3 className="text-base font-semibold text-text-primary">Largest Expenses (This Month)</h3>
            </div>
            
            {insights.top3Expenses.length === 0 ? (
              <p className="text-sm text-text-muted">No expenses recorded this month.</p>
            ) : (
              <div className="space-y-3">
                {insights.top3Expenses.map((tx, idx) => (
                  <div key={tx.id} className="flex items-center gap-4 p-3 rounded-xl bg-bg-row-alt border border-transparent hover:border-border-default transition-colors">
                    <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-xs font-bold text-text-secondary flex-shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{tx.description}</p>
                      <p className="text-xs text-text-muted mt-0.5">{tx.categoryLabel}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text-primary">
                        ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
