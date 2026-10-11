export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Shopping'
  | 'Health'
  | 'Education'
  | 'Subscriptions'
  | 'Savings'
  | 'Other';

export type RiskLevel = 'safe' | 'caution' | 'danger';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  isRecurring: boolean;
  tags: string[];
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: Date;
  dailyRequired: number; // auto-calculated
  percentComplete: number;
  onTrack: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingDate: number; // day of month 1-31
  category: string;
  isActive: boolean;
  nextDue: Date;
}

export interface BudgetState {
  totalBudget: number; // ₹10,000
  startDate: Date;
  daysPassed: number; // 0-30
  daysRemaining: number; // 30 - daysPassed
  spent: number; // total spent so far
  committed: number; // upcoming subscriptions + EMIs
  savedToGoals: number; // locked in goals
  availableBalance: number; // totalBudget - spent - committed - savedToGoals
  dailyAllowance: number; // availableBalance / daysRemaining
  healthScore: number; // 0-100
  riskLevel: RiskLevel;
}

export interface ProposedDecision {
  amount: number;
  category: ExpenseCategory;
  description: string;
  isRecurring?: boolean;
}

export interface GoalImpact {
  goalId: string;
  goalName: string;
  previousDailyRequired: number;
  newDailyRequired: number;
  stillOnTrack: boolean;
  delayDays: number;
}

export interface SimulationResult {
  decision: ProposedDecision;
  impact: {
    balanceDelta: number; // change in available balance
    dailyAllowanceDelta: number; // change in ₹/day
    healthScoreDelta: number; // change in health score
    riskDelta: RiskLevel; // new risk level
    goalImpact: GoalImpact[]; // which goals are affected
    forecastChange: number[]; // new 30-day projection
    warnings: string[]; // e.g. "You'll run out on Day 24"
    recommendation: string; // AI-style advice
    newBalance: number;
    newDailyAllowance: number;
    newHealthScore: number;
  };
  safeToCommit: boolean;
}

export interface DaySpending {
  day: number;
  date: string;
  amount: number;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}
