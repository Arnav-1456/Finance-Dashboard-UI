import { useMemo } from 'react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function BalanceTrendChart({ transactions }) {
  const data = useMemo(() => {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      const label = format(monthDate, 'MMM');

      const monthTxns = transactions.filter((t) =>
        isWithinInterval(new Date(t.date), { start, end })
      );

      const income = monthTxns
        .filter((t) => t.type === 'Income')
        .reduce((s, t) => s + t.amount, 0);
      const expenses = monthTxns
        .filter((t) => t.type === 'Expense')
        .reduce((s, t) => s + t.amount, 0);

      months.push({ month: label, income, expenses, net: income - expenses });
    }

    return months;
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradientIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradientExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3E" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#8B8FA3', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#8B8FA3', fontSize: 12 }}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#464554', strokeDasharray: '4 4' }} />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#00D4AA"
          strokeWidth={2}
          fill="url(#gradientIncome)"
          dot={false}
          activeDot={{ r: 5, fill: '#00D4AA', strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#F43F5E"
          strokeWidth={2}
          fill="url(#gradientExpenses)"
          dot={false}
          activeDot={{ r: 5, fill: '#F43F5E', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-bright/95 backdrop-blur-md rounded-xl px-4 py-3 border border-border-default shadow-ambient">
      <p className="text-xs font-semibold text-text-primary mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-text-secondary capitalize">{entry.dataKey}:</span>
          <span className="font-semibold text-text-primary">
            ${entry.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  );
}
