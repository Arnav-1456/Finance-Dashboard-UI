import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export default function ComparisonBarChart({ transactions }) {
  const data = useMemo(() => {
    const now = new Date();
    
    // This month
    const thisStart = startOfMonth(now);
    const thisEnd = endOfMonth(now);
    
    // Last month
    const lastStart = startOfMonth(subMonths(now, 1));
    const lastEnd = endOfMonth(subMonths(now, 1));

    const computeTotals = (start, end) => {
      const txns = transactions.filter(t => isWithinInterval(new Date(t.date), { start, end }));
      const income = txns.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
      const expense = txns.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
      return { income, expense };
    };

    const thisMonth = computeTotals(thisStart, thisEnd);
    const lastMonth = computeTotals(lastStart, lastEnd);

    return [
      {
        name: 'Last Month',
        Income: lastMonth.income,
        Expense: lastMonth.expense,
      },
      {
        name: 'This Month',
        Income: thisMonth.income,
        Expense: thisMonth.expense,
      }
    ];
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barGap={8}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" vertical={false} />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#8B8FA3', fontSize: 13, fontWeight: 500 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#5A5F7A', fontSize: 12 }}
          tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#252840', opacity: 0.4 }} />
        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
        <Bar dataKey="Income" fill="#00D4AA" radius={[4, 4, 0, 0]} maxBarSize={60} />
        <Bar dataKey="Expense" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={60} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-bright/95 backdrop-blur-md rounded-xl px-4 py-3 border border-border-default shadow-ambient">
      <p className="text-xs font-semibold text-text-primary mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-xs mt-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-text-secondary">{entry.dataKey}:</span>
          </div>
          <span className="font-semibold text-text-primary">
            ${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  );
}
