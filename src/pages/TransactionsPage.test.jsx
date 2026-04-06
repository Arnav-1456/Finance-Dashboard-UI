import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import TransactionsPage from './TransactionsPage';
import { AppProvider } from '../store/AppContext';
import { BrowserRouter } from 'react-router-dom';

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AppProvider>
      {children}
    </AppProvider>
  </BrowserRouter>
);

describe('Transactions Page Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the Add Transaction button initially for Admin', async () => {
    render(
      <TestWrapper>
        <TransactionsPage />
      </TestWrapper>
    );

    // Context defaults to Admin, so the CTA button should be visible.
    expect(screen.getByText('Add Transaction')).toBeInTheDocument();
  });

  it('renders rows for the transactions automatically', () => {
    render(
      <TestWrapper>
        <TransactionsPage />
      </TestWrapper>
    );
    // Since mock transactions contain 'Salary' and 'Grocery', let's just make sure the table populated.
    expect(screen.getAllByRole('row').length).toBeGreaterThan(5); // At least header + a few mock records
  });
});
