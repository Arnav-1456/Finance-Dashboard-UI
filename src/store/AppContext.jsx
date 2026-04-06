import { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions } from '../data/transactions';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState('Admin'); // 'Admin' or 'Viewer'
  
  // Try loading from localStorage first
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_hero_txns');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return mockTransactions;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('finance_hero_txns', JSON.stringify(transactions));
  }, [transactions]);
  
  const [filters, setFilters] = useState({
    dateRange: 'All Time',
    categoryId: 'All', 
    type: 'All', // 'All', 'Income', 'Expense'
    status: 'All', // 'All', 'Completed', 'Pending', 'Failed'
    searchQuery: '',
  });

  const value = {
    role,
    setRole,
    transactions,
    setTransactions,
    filters,
    setFilters
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
