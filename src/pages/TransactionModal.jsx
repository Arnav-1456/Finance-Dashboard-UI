import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { categories } from '../data/categories';

export default function TransactionModal({ transaction, onClose, onSave }) {
  const isEditing = !!transaction;

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'Expense',
    categoryId: categories[0].id,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: String(transaction.amount),
        type: transaction.type,
        categoryId: transaction.categoryId,
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    const cat = categories.find((c) => c.id === formData.categoryId);
    
    // Pass complete object
    onSave({
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      categoryId: formData.categoryId,
      categoryLabel: cat ? cat.label : 'Other',
      date: new Date(formData.date).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#000000] opacity-70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-bg-surface rounded-2xl shadow-ambient border border-border-default overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default bg-surface-high">
          <h3 className="text-lg font-semibold text-text-primary">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-bright transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          
          {/* Type Toggle */}
          <div className="flex p-1 bg-bg-input rounded-xl border border-border-default">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, type: 'Expense' }))}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                formData.type === 'Expense'
                  ? 'bg-surface-bright text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, type: 'Income' }))}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                formData.type === 'Income'
                  ? 'bg-surface-bright text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Income
            </button>
          </div>

          <div className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  className="w-full pl-8 pr-4 py-2.5 bg-bg-input border border-border-default rounded-xl text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Description
              </label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2.5 bg-bg-input border border-border-default rounded-xl text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                placeholder="e.g., Grocery Shopping"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-bg-input border border-border-default rounded-xl text-text-primary text-sm focus:outline-none focus:border-accent-teal transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-bg-input border border-border-default rounded-xl text-text-primary text-sm focus:outline-none focus:border-accent-teal transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 block text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-accent-teal to-accent-teal-dark text-[#002118] text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              {isEditing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
