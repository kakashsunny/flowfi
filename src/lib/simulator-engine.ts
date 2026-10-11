import { BudgetState, ProposedDecision, SimulationResult, SavingsGoal, GoalImpact, RiskLevel } from '../types';
import { safeSub, safeAdd, getRiskLevel } from './budget-engine';
import { calculateHealthScore } from './health-calculator';

export function simulateDecision(
  currentState: BudgetState,
  proposed: ProposedDecision,
  goals: SavingsGoal[] = []
): SimulationResult {
  const amount = proposed.amount ?? 0;
  const isAffordable = amount <= currentState.availableBalance;
  const safeToCommit = isAffordable && amount >= 0;

  // New simulated figures
  const newBalance = safeSub(currentState.availableBalance, amount);
  const newSpent = safeAdd(currentState.spent, amount);
  const daysRemaining = Math.max(currentState.daysRemaining, 1);
  const newDailyAllowance = Math.round((newBalance / daysRemaining) * 100) / 100;

  const newRisk: RiskLevel = getRiskLevel(newDailyAllowance);

  // Health score recalculation
  const simulatedState: Partial<BudgetState> = {
    ...currentState,
    spent: newSpent,
    availableBalance: newBalance,
    dailyAllowance: newDailyAllowance,
    riskLevel: newRisk,
  };
  const newHealthScore = calculateHealthScore(simulatedState);

  // Deltas
  const balanceDelta = -Math.round(amount * 100) / 100;
  const dailyAllowanceDelta = Math.round((newDailyAllowance - currentState.dailyAllowance) * 100) / 100;
  const healthScoreDelta = newHealthScore - currentState.healthScore;

  // Warnings generation
  const warnings: string[] = [];

  if (amount > currentState.availableBalance) {
    const deficit = Math.round((amount - currentState.availableBalance) * 100) / 100;
    warnings.push(`Warning: Expense exceeds your available balance by ₹${deficit.toLocaleString('en-IN')}. You will run out of funds.`);
  }

  if (newDailyAllowance < 100) {
    warnings.push('High risk danger: Daily allowance drops below critical ₹100/day threshold.');
  } else if (newDailyAllowance < 200 && currentState.dailyAllowance >= 200) {
    warnings.push('Caution: Your daily allowance slips into the cautious ₹100–₹200/day band.');
  }

  // Calculate run-out day if current burn continues
  if (newDailyAllowance <= 0) {
    warnings.push('Danger: You will completely run out of money today.');
  } else {
    const daysUntilEmpty = Math.floor(newBalance / Math.max(1, currentState.spent / Math.max(1, currentState.daysPassed)));
    if (daysUntilEmpty < currentState.daysRemaining && daysUntilEmpty > 0) {
      const estimatedRunoutDay = currentState.daysPassed + daysUntilEmpty;
      warnings.push(`Projected: At this burn rate, you run out on Day ${estimatedRunoutDay} of 30.`);
    }
  }

  // Savings goals impact
  const goalImpact: GoalImpact[] = goals.map((goal) => {
    const remainingToSave = Math.max(0, goal.targetAmount - goal.savedAmount);
    const prevDailyReq = goal.dailyRequired;
    // If available balance shrinks, fewer discretionary funds remain to feed goals
    const isImpacted = newDailyAllowance < 150 && remainingToSave > 0;
    const addedDays = isImpacted ? Math.min(10, Math.ceil((amount / Math.max(1, newDailyAllowance)) * 0.5)) : 0;

    return {
      goalId: goal.id,
      goalName: goal.name,
      previousDailyRequired: prevDailyReq,
      newDailyRequired: isImpacted ? Math.round((prevDailyReq * 1.25) * 100) / 100 : prevDailyReq,
      stillOnTrack: !isImpacted && newDailyAllowance >= 120,
      delayDays: addedDays,
    };
  });

  // 30-day forecast generation for simulated state
  const forecastChange: number[] = [];
  const currentDailyBurn = newDailyAllowance;
  for (let day = 1; day <= 30; day++) {
    if (day <= currentState.daysPassed) {
      forecastChange.push(
        Math.max(0, currentState.totalBudget - (currentState.spent / currentState.daysPassed) * day)
      );
    } else {
      const remainingDaysAhead = day - currentState.daysPassed;
      const projected = safeSub(newBalance, currentDailyBurn * remainingDaysAhead);
      forecastChange.push(projected);
    }
  }

  // Contextual recommendation
  let recommendation = '';
  if (!safeToCommit) {
    recommendation = `🛑 Hold off! Spending ₹${amount.toLocaleString('en-IN')} breaks your monthly cycle. Split this into future cycles or postpone until Day 30.`;
  } else if (newDailyAllowance >= 250) {
    recommendation = `✅ Clear to spend! You will still maintain a strong ₹${newDailyAllowance}/day runway with zero goal derailments.`;
  } else if (newDailyAllowance >= 150) {
    recommendation = `⚠️ Manageable: You can afford this, but tighten dining and transport for the next 3 days to offset the ripple.`;
  } else {
    recommendation = `⚡ High friction: This purchase heavily strains your remaining ${currentState.daysRemaining} days. Consider finding a cheaper alternative or waiting for next month's refresh.`;
  }

  return {
    decision: proposed,
    impact: {
      balanceDelta,
      dailyAllowanceDelta,
      healthScoreDelta,
      riskDelta: newRisk,
      goalImpact,
      forecastChange,
      warnings,
      recommendation,
      newBalance,
      newDailyAllowance,
      newHealthScore,
    },
    safeToCommit,
  };
}
