import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Simulator } from '../simulator/Simulator';
import { useBudgetStore } from '../../store/budgetStore';

describe('Decision Simulator', () => {
  beforeEach(() => {
    useBudgetStore.getState().resetToInitialDemo();
  });

  it('updates impact preview on amount change', async () => {
    render(<Simulator />);
    const input = screen.getByLabelText(/amount/i);
    await userEvent.clear(input);
    await userEvent.type(input, '500');
    expect(screen.getByTestId('impact-balance')).toHaveTextContent('₹6,000');
  });

  it('shows warning for large amounts', async () => {
    render(<Simulator />);
    const input = screen.getByLabelText(/amount/i);
    await userEvent.clear(input);
    await userEvent.type(input, '9000');
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
