import { useMemo } from 'react';
import { useBudgetStore } from '../store/budgetStore';
import { getHealthLabel, getHealthAdvice } from '../lib/health-calculator';

export function useHealthScore() {
  const healthScore = useBudgetStore((state) => state.healthScore);
  const dailyAllowance = useBudgetStore((state) => state.dailyAllowance);
  const riskLevel = useBudgetStore((state) => state.riskLevel);
  const availableBalance = useBudgetStore((state) => state.availableBalance);
  const spent = useBudgetStore((state) => state.spent);
  const totalBudget = useBudgetStore((state) => state.totalBudget);

  const label = useMemo(() => getHealthLabel(healthScore), [healthScore]);
  const tips = useMemo(() => getHealthAdvice(healthScore, dailyAllowance), [healthScore, dailyAllowance]);

  return {
    healthScore,
    dailyAllowance,
    riskLevel,
    availableBalance,
    spent,
    totalBudget,
    label,
    tips,
  };
}
