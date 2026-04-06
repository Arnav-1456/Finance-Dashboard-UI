import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { categories, getCategoryByLabel } from '../../data/categories';

const COLORS = {
  'Food & Dining': '#F59E0B',
  'Salary': '#10B981',
  'Transport': '#3B82F6',
  'Shopping': '#A855F7',
  'Rent & Bills': '#F43F5E',
  'Freelance': '#00D4AA',
  'Entertainment': '#6366F1',
  'Other': '#8B8FA3',
};

export default function CategoryDonutChart({ transactions }) {
  const data = useMemo(() => {
    const expensesByCategory = {};

    transactions
      .filter((t) => t.type === 'Expense')
      .forEach((t) => {
        const label = t.categoryLabel || 'Other';
        expensesByCategory[label] = (expensesByCategory[label] || 0) + t.amount;
      });

    return Object.entries(expensesByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || '#8B8FA3'} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip total={total} />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label */}
      <div className="-mt-[140px] mb-[80px] text-center pointer-events-none">
        <p className="text-2xl font-bold text-text-primary">
          ${total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </p>
        <p className="text-xs text-text-muted">Total Spent</p>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 w-full">
        {data.map((entry) => {
          const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
          return (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[entry.name] || '#8B8FA3' }}
              />
              <span className="text-text-secondary truncate">{entry.name}</span>
              <span className="text-text-primary font-semibold ml-auto">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DonutTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  return (
    <div className="bg-surface-bright/95 backdrop-blur-md rounded-xl px-4 py-3 border border-border-default shadow-ambient">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: COLORS[name] || '#8B8FA3' }}
        />
        <span className="text-xs font-semibold text-text-primary">{name}</span>
      </div>
      <p className="text-xs text-text-secondary">
        ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({pct}%)
      </p>
    </div>
  );
}
