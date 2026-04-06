import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TopBar from './TopBar';
import { AppProvider } from '../../store/AppContext';
import { BrowserRouter } from 'react-router-dom';

// Wrapper for components using hooks (react-router, AppContext)
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AppProvider>
      {children}
    </AppProvider>
  </BrowserRouter>
);

describe('TopBar Component Tests', () => {
  it('renders successfully without crashing', () => {
    render(
      <TestWrapper>
        <TopBar />
      </TestWrapper>
    );
    // Role switcher should default to showing the 'Admin' badge
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('swaps the Theme (Light/Dark mode) correctly when toggled', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TopBar />
      </TestWrapper>
    );

    const toggleButton = screen.getByLabelText('Toggle theme');
    expect(toggleButton).toBeInTheDocument();

    // Verify it assigns "light" property correctly.
    // By default documentElement has NO "light"
    expect(document.documentElement.classList.contains('light')).toBe(false);
    
    // Toggle theme to Light
    await user.click(toggleButton);
    expect(document.documentElement.classList.contains('light')).toBe(true);

    // Toggle theme back to Dark
    await user.click(toggleButton);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });
});
