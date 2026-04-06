import { useState, useEffect } from 'react';
import { X, Search, Filter, Plus, FileEdit, Trash2, ArrowUpDown } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { categories } from '../data/categories';
import TransactionModal from './TransactionModal';
import { subDays, isAfter } from 'date-fns';

export default function TransactionsPage() {
  const { role, transactions, setTransactions, filters, setFilters } = useAppContext();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // ── Handlers ──
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleEdit = (tx) => {
    if (role !== 'Admin') return;
    setEditingTx(tx);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    if (role !== 'Admin') return;
    setEditingTx(null);
    setModalOpen(true);
  };

  const handleSaveModal = (txData) => {
    if (editingTx) {
      // Edit
      setTransactions((prev) => prev.map((t) => (t.id === editingTx.id ? { ...t, ...txData } : t)));
    } else {
      // Add new
      setTransactions((prev) => [
        {
          ...txData,
          id: `tx_${Date.now()}`,
          status: 'Completed',
        },
        ...prev,
      ]);
    }
    setModalOpen(false);
  };

  // ── Filtering & Sorting Logic ──
  const filteredTransactions = transactions
    .filter((t) => {
      // Search
      if (
        filters.searchQuery &&
        !t.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Type
      if (filters.type !== 'All' && t.type !== filters.type) return false;
      // Category
      if (filters.categoryId !== 'All' && t.categoryId !== filters.categoryId) return false;
      
      // Date Range
      if (filters.dateRange !== 'All Time') {
        const txDate = new Date(t.date);
        const now = new Date();
        let cutoffDate = null;
        
        switch (filters.dateRange) {
          case 'Last 7 Days': cutoffDate = subDays(now, 7); break;
          case 'Last 30 Days': cutoffDate = subDays(now, 30); break;
          case 'Last 90 Days': cutoffDate = subDays(now, 90); break;
          default: break;
        }
        
        if (cutoffDate && !isAfter(txDate, cutoffDate)) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      // default: date
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Transactions</h2>
          <p className="text-sm text-text-secondary mt-1">Manage and filter your ledgers</p>
        </div>
        {role === 'Admin' && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-accent-teal text-[#002118] rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-bg-surface p-4 rounded-2xl flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by description..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-4 py-2 bg-bg-input border border-border-default rounded-xl text-sm focus:outline-none focus:border-accent-teal transition-colors text-text-primary"
          />
        </div>
        
        {/* Date Range Filter */}
        <select
          value={filters.dateRange}
          onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          className="bg-bg-input border border-border-default rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
        >
          <option value="All Time">All Time</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="Last 90 Days">Last 90 Days</option>
        </select>

        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="bg-bg-input border border-border-default rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
        >
          <option value="All">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        {/* Category Filter */}
        <select
          value={filters.categoryId}
          onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
          className="bg-bg-input border border-border-default rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        
        {/* Clear Filters */}
        {(filters.type !== 'All' || filters.categoryId !== 'All' || filters.dateRange !== 'All Time' || filters.searchQuery !== '') && (
          <button
            onClick={() => setFilters({ type: 'All', categoryId: 'All', dateRange: 'All Time', status: 'All', searchQuery: '' })}
            className="text-text-muted hover:text-accent-rose text-sm font-medium transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-bg-surface rounded-2xl overflow-hidden border border-border-default">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-input border-b border-border-default">
                <th
                  onClick={() => handleSort('date')}
                  className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    Date
                    <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Category
                </th>
                <th
                  onClick={() => handleSort('amount')}
                  className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right cursor-pointer hover:text-text-primary transition-colors group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    Amount
                  </div>
                </th>
                {role === 'Admin' && (
                  <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={role === 'Admin' ? 5 : 4} className="px-6 py-12 text-center text-text-muted">
                    <div className="flex flex-col items-center gap-2">
                      <Filter size={32} className="opacity-20" />
                      <p>No transactions found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-bg-hover transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-text-primary">{tx.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-surface-bright text-text-secondary border border-border-default">
                        {tx.categoryLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`text-sm font-bold ${
                          tx.type === 'Income' ? 'text-status-success' : 'text-text-primary'
                        }`}
                      >
                        {tx.type === 'Income' ? '+' : '-'}$
                        {Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    {role === 'Admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(tx)}
                            className="p-1.5 text-text-muted hover:text-accent-teal hover:bg-accent-teal/10 rounded-lg transition-colors"
                          >
                            <FileEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="p-1.5 text-text-muted hover:text-accent-rose hover:bg-accent-rose/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <TransactionModal
          transaction={editingTx}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
}
