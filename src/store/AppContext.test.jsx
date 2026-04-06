import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { AppProvider, useAppContext } from './AppContext';
import { mockTransactions } from '../data/transactions';

// A strict testing component to read output from Context
const ContextConsumer = () => {
  const { role, setRole, transactions } = useAppContext();
  
  return (
    <div>
      <div data-testid="role-value">{role}</div>
      <button onClick={() => setRole('Viewer')} data-testid="role-switch-btn">Switch Role</button>
      <div data-testid="tx-count">{transactions.length}</div>
    </div>
  );
};

describe('AppContext Global State', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with Admin role and mock transactions fallback if localStorage is empty', () => {
    render(
      <AppProvider>
        <ContextConsumer />
      </AppProvider>
    );
    
    // Check initial user role
    expect(screen.getByTestId('role-value')).toHaveTextContent('Admin');
    
    // Check exact transaction length fallback to mock default
    expect(screen.getByTestId('tx-count')).toHaveTextContent(mockTransactions.length.toString());
  });

  it('updates the role correctly utilizing setRole action', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <ContextConsumer />
      </AppProvider>
    );
    
    expect(screen.getByTestId('role-value')).toHaveTextContent('Admin');
    
    // Click switch
    await user.click(screen.getByTestId('role-switch-btn'));
    
    // Role updates actively
    expect(screen.getByTestId('role-value')).toHaveTextContent('Viewer');
  });

  it('hydrates transactions correctly from localStorage', () => {
    const mockStorage = [{ id: 'testing_1', amount: 50.0 }];
    localStorage.setItem('finance_hero_txns', JSON.stringify(mockStorage));

    render(
      <AppProvider>
        <ContextConsumer />
      </AppProvider>
    );

    expect(screen.getByTestId('tx-count')).toHaveTextContent('1');
  });
});
