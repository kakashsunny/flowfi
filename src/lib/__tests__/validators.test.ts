import { describe, it, expect } from 'vitest';
import { ExpenseSchema } from '../validators';

describe('Input Validators', () => {
  const validBase = {
    amount: 500,
    description: 'Cafe coffee',
    category: 'Food' as const,
    date: new Date(),
    isRecurring: false,
  };

  it('rejects negative amounts', () => {
    expect(() => ExpenseSchema.parse({ ...validBase, amount: -100 })).toThrow();
  });

  it('rejects amounts over ₹10,000', () => {
    expect(() => ExpenseSchema.parse({ ...validBase, amount: 15000 })).toThrow();
  });

  it('rejects future dates', () => {
    const tomorrow = new Date(Date.now() + 86400000);
    expect(() => ExpenseSchema.parse({ ...validBase, date: tomorrow })).toThrow();
  });

  it('sanitizes description whitespace', () => {
    const result = ExpenseSchema.parse({ ...validBase, description: '  Lunch  ' });
    expect(result.description).toBe('Lunch');
  });
});
