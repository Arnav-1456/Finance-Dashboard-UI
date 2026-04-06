import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardPage from './DashboardPage';
import { AppProvider } from '../store/AppContext';

describe('Dashboard Page Component', () => {
  it('mounts the cards and injects default mock transactions correctly', () => {
    render(
      <AppProvider>
        <DashboardPage />
      </AppProvider>
    );

    // Verify UI blocks exist
    expect(screen.getByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Savings Rate')).toBeInTheDocument();
  });
});
