import { create } from 'zustand';
import { BudgetState, Expense, SavingsGoal, Subscription, ExpenseCategory } from '../types';
import { safeAdd, safeSub, recalculateBudgetState } from '../lib/budget-engine';
import { loadFullAppState, saveFullAppState, clearStorage } from '../lib/storage';

interface BudgetStoreState {
  // Core Budget State
  totalBudget: number;
  startDate: Date;
  daysPassed: number;
  daysRemaining: number;
  spent: number;
  committed: number;
  savedToGoals: number;
  availableBalance: number;
  dailyAllowance: number;
  healthScore: number;
  riskLevel: 'safe' | 'caution' | 'danger';

  // Collections
  expenses: Expense[];
  goals: SavingsGoal[];
  subscriptions: Subscription[];

  // Actions
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<Expense>;
  deleteExpense: (id: string) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'dailyRequired' | 'percentComplete' | 'onTrack'>) => void;
  contributeToGoal: (goalId: string, amount: number) => boolean;
  deleteGoal: (goalId: string) => void;
  addSubscription: (sub: Omit<Subscription, 'id' | 'nextDue'>) => void;
  toggleSubscription: (id: string) => void;
  deleteSubscription: (id: string) => void;
  setDaysPassed: (days: number) => void;
  resetToInitialDemo: () => void;
  resetCleanSlate: () => void;
  getBudgetSnapshot: () => BudgetState;
}

const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    amount: 450,
    category: 'Food',
    description: 'Boba tea & gourmet burger',
    date: new Date(Date.now() - 7 * 86400000),
    isRecurring: false,
    tags: ['dining', 'weekend'],
  },
  {
    id: 'exp-2',
    amount: 280,
    category: 'Transport',
    description: 'Uber ride across town',
    date: new Date(Date.now() - 5 * 86400000),
    isRecurring: false,
    tags: ['commute'],
  },
  {
    id: 'exp-3',
    amount: 620,
    category: 'Entertainment',
    description: 'IMAX 3D cinema tickets',
    date: new Date(Date.now() - 3 * 86400000),
    isRecurring: false,
    tags: ['hangout'],
  },
  {
    id: 'exp-4',
    amount: 350,
    category: 'Food',
    description: 'Artisan roast coffee & bakery',
    date: new Date(Date.now() - 2 * 86400000),
    isRecurring: false,
    tags: ['cafe'],
  },
  {
    id: 'exp-5',
    amount: 300,
    category: 'Shopping',
    description: 'Type-C braided cable & notebook',
    date: new Date(Date.now() - 1 * 86400000),
    isRecurring: false,
    tags: ['workspace'],
  },
];

const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'Goa Monsoon Trip',
    targetAmount: 4000,
    savedAmount: 500,
    deadline: new Date(Date.now() + 20 * 86400000),
    dailyRequired: 175,
    percentComplete: 12.5,
    onTrack: true,
  },
  {
    id: 'goal-2',
    name: 'Mechanical Keyboard (Hot-swap)',
    targetAmount: 2500,
    savedAmount: 0,
    deadline: new Date(Date.now() + 25 * 86400000),
    dailyRequired: 100,
    percentComplete: 0,
    onTrack: true,
  },
];

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Spotify Premium Student',
    amount: 119,
    billingDate: 15,
    category: 'Entertainment',
    isActive: true,
    nextDue: new Date(Date.now() + 5 * 86400000),
  },
  {
    id: 'sub-2',
    name: 'Netflix 4K Ultra Stream',
    amount: 499,
    billingDate: 22,
    category: 'Subscriptions',
    isActive: true,
    nextDue: new Date(Date.now() + 12 * 86400000),
  },
  {
    id: 'sub-3',
    name: 'GitHub Copilot + Cursor Pro',
    amount: 382,
    billingDate: 28,
    category: 'Education',
    isActive: true,
    nextDue: new Date(Date.now() + 18 * 86400000),
  },
];

function calculateCommittedTotal(subs: Subscription[]): number {
  return subs.filter((s) => s.isActive).reduce((sum, s) => safeAdd(sum, s.amount), 0);
}

function calculateSavedToGoalsTotal(goals: SavingsGoal[]): number {
  return goals.reduce((sum, g) => safeAdd(sum, g.savedAmount), 0);
}

function computeGoalMetrics(goal: SavingsGoal, daysRemaining: number): SavingsGoal {
  const remainingTarget = Math.max(0, goal.targetAmount - goal.savedAmount);
  const remainingDays = Math.max(1, Math.min(daysRemaining, 30));
  const dailyRequired = Math.round((remainingTarget / remainingDays) * 100) / 100;
  const percentComplete = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 1000) / 10);
  const onTrack = dailyRequired <= 200;

  return {
    ...goal,
    dailyRequired,
    percentComplete,
    onTrack,
  };
}

// Compute initial state
const defaultRecalc = recalculateBudgetState({
  totalBudget: 10000,
  spent: 2000,
  committed: 1000,
  savedToGoals: 500,
  daysPassed: 10,
});

export const useBudgetStore = create<BudgetStoreState>((set, get) => {
  // Attempt to restore saved state
  const persisted = typeof window !== 'undefined' ? loadFullAppState() : null;

  const initialValues = persisted
    ? {
        ...persisted.budgetState,
        expenses: persisted.expenses,
        goals: persisted.goals,
        subscriptions: persisted.subscriptions,
      }
    : {
        ...defaultRecalc,
        expenses: INITIAL_EXPENSES,
        goals: INITIAL_GOALS.map((g) => computeGoalMetrics(g, defaultRecalc.daysRemaining)),
        subscriptions: INITIAL_SUBSCRIPTIONS,
      };

  return {
    ...initialValues,

    getBudgetSnapshot: () => {
      const state = get();
      return {
        totalBudget: state.totalBudget,
        startDate: state.startDate,
        daysPassed: state.daysPassed,
        daysRemaining: state.daysRemaining,
        spent: state.spent,
        committed: state.committed,
        savedToGoals: state.savedToGoals,
        availableBalance: state.availableBalance,
        dailyAllowance: state.dailyAllowance,
        healthScore: state.healthScore,
        riskLevel: state.riskLevel,
      };
    },

    addExpense: async (expenseData) => {
      const newExpense: Expense = {
        ...expenseData,
        id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };

      set((state) => {
        const nextSpent = safeAdd(state.spent, newExpense.amount);
        const recalc = recalculateBudgetState({
          totalBudget: state.totalBudget,
          spent: nextSpent,
          committed: state.committed,
          savedToGoals: state.savedToGoals,
          daysPassed: state.daysPassed,
          startDate: state.startDate,
        });

        const nextExpenses = [newExpense, ...state.expenses];

        // Sync with storage
        saveFullAppState({
          budgetState: recalc,
          expenses: nextExpenses,
          goals: state.goals,
          subscriptions: state.subscriptions,
        });

        return {
          expenses: nextExpenses,
          spent: nextSpent,
          availableBalance: recalc.availableBalance,
          dailyAllowance: recalc.dailyAllowance,
          healthScore: recalc.healthScore,
          riskLevel: recalc.riskLevel,
        };
      });

      return newExpense;
    },

    deleteExpense: (id) => {
      set((state) => {
        const target = state.expenses.find((e) => e.id === id);
        if (!target) return {};
        const nextSpent = safeSub(state.spent, target.amount);
        const nextExpenses = state.expenses.filter((e) => e.id !== id);

        const recalc = recalculateBudgetState({
          totalBudget: state.totalBudget,
          spent: nextSpent,
          committed: state.committed,
          savedToGoals: state.savedToGoals,
          daysPassed: state.daysPassed,
          startDate: state.startDate,
        });

        saveFullAppState({
          budgetState: recalc,
          expenses: nextExpenses,
          goals: state.goals,
          subscriptions: state.subscriptions,
        });

        return {
          expenses: nextExpenses,
          spent: nextSpent,
          availableBalance: recalc.availableBalance,
          dailyAllowance: recalc.dailyAllowance,
          healthScore: recalc.healthScore,
          riskLevel: recalc.riskLevel,
        };
      });
    },

    addGoal: (goalData) => {
      set((state) => {
        const tempGoal: SavingsGoal = {
          ...goalData,
          id: `goal-${Date.now()}`,
          dailyRequired: 0,
          percentComplete: 0,
          onTrack: true,
        };
        const computed = computeGoalMetrics(tempGoal, state.daysRemaining);
        const nextGoals = [...state.goals, computed];
        const nextSavedToGoals = calculateSavedToGoalsTotal(nextGoals);

        const recalc = recalculateBudgetState({
          totalBudget: state.totalBudget,
          spent: state.spent,
          committed: state.committed,
          savedToGoals: nextSavedToGoals,
          daysPassed: state.daysPassed,
          startDate: state.startDate,
        });

        saveFullAppState({
          budgetState: recalc,
          expenses: state.expenses,
          goals: nextGoals,
          subscriptions: state.subscriptions,
        });

        return {
          goals: nextGoals,
          savedToGoals: nextSavedToGoals,
          availableBalance: recalc.availableBalance,
          dailyAllowance: recalc.dailyAllowance,
          healthScore: recalc.healthScore,
          riskLevel: recalc.riskLevel,
        };
      });
    },

    contributeToGoal: (goalId, amount) => {
      const state = get();
      if (amount <= 0 || amount > state.availableBalance) return false;

      set((curr) => {
        const nextGoals = curr.goals.map((g) => {
          if (g.id !== goalId) return g;
          const newSaved = safeAdd(g.savedAmount, amount);
          return computeGoalMetrics({ ...g, savedAmount: newSaved }, curr.daysRemaining);
        });

        const nextSavedToGoals = calculateSavedToGoalsTotal(nextGoals);
        const recalc = recalculateBudgetState({
          totalBudget: curr.totalBudget,
          spent: curr.spent,
          committed: curr.committed,
          savedToGoals: nextSavedToGoals,
          daysPassed: curr.daysPassed,
          startDate: curr.startDate,
        });

        saveFullAppState({
          budgetState: recalc,
          expenses: curr.expenses,
          goals: nextGoals,
          subscriptions: curr.subscriptions,
        });

        return {
          goals: nextGoals,
          savedToGoals: nextSavedToGoals,
          availableBalance: recalc.availableBalance,
          dailyAllowance: recalc.dailyAllowance,
          healthScore: recalc.healthScore,
          riskLevel: recalc.riskLevel,
        };
      });

      return true;
    },

    deleteGoal: (goalId) => {
      set((state) => {
        const nextGoals = state.goals.filter((g) => g.id !== goalId);
        const nextSavedToGoals = calculateSavedToGoalsTotal(nextGoals);

        const recalc = recalculateBudgetState({
          totalBudget: state.totalBudget,
          spent: state.spent,
          committed: state.committed,
          savedToGoals: nextSavedToGoals,
          daysPassed: state.daysPassed,
          startDate: state.startDate,
        });

        saveFullAppState({
          budgetState: recalc,
          expenses: state.expenses,
          goals: nextGoals,
          subscriptions: state.subscriptions,
        });

        return {
          goals: nextGoals,
          savedToGoals: nextSavedToGoals,
          availableBalance: recalc.availableBalance,
          dailyAllowance: recalc.dailyAllowance,
          healthScore: recalc.healthScore,
          riskLevel: recalc.riskLevel,
        };
      });
    },

    addSubscription: (subData) => {
      set((state) => {
        const newSub: Subscription = {
          ...subData,
          id: `sub-${Date.now()}`,
          nextDue: new Date(Date.now() + 10 * 86400000),
        };
        const nextSubs = [...state.subscriptions, newSub];
        const nextCommitted = calculateCommittedTotal(nextSubs);

        const recalc = recalculateBudgetState({
          totalBudget: state.totalBudget,
          spent: state.spent,
          committed: nextCommitted,
          savedToGoals: state.savedToGoals,
          daysPassed: state.daysPassed,
          startDate: state.startDate,
        });

        saveFullAppState({
          budgetState: recalc,
          expenses: state.expenses,
          goals: state.goals,
          subscriptions: nextSubs,
        });

        return {
          subscriptions: nextSubs,
          committed: nextCommitted,
          availableBalance: recalc.availableBalance,
          dailyAllowance: recalc.dailyAllowance,
          healthScore: recalc.healthScore,
          riskLevel: recalc.riskLevel,
        };
      });
    },

    toggleSubscription: (id) => {
      set((state) => {
        const nextSubs = state.subscriptions.map((s) =>
          s.id === id ? { ...s, isActive: !s.isActive } : s
        );
        const nextCommitted = calculateCommittedTotal(nextSubs);

        const recalc = recalculateBudgetState({
          totalBudget: state.totalBudget,
          spent: state.spent,
          committed: nextCommitted,
          savedToGoals: state.savedToGoals,
          daysPassed: state.daysPassed,
          startDate: state.startDate,
        });

        saveFullAppState({
          budgetState: recalc,
          expenses: state.expenses,
          goals: state.goals,
          subscriptions: nextSubs,
        });

        return {
          subscriptions: nextSubs,
          committed: nextCommitted,
          availableBalance: recalc.availableBalance,
          dailyAllowance: recalc.dailyAllowance,
          healthScore: recalc.healthScore,
          riskLevel: recalc.riskLevel,
        };
      });
    },

    deleteSubscription: (id) => {
      set((state) => {
        const nextSubs = state.subscriptions.filter((s) => s.id !== id);
        const nextCommitted = calculateCommittedTotal(nextSubs);

        const recalc = recalculateBudgetState({
          totalBudget: state.totalBudget,
          spent: state.spent,
          committed: nextCommitted,
          savedToGoals: state.savedToGoals,
          daysPassed: state.daysPassed,
          startDate: state.startDate,
        });

        saveFullAppState({
          budgetState: recalc,
          expenses: state.expenses,
          goals: state.goals,
          subscriptions: nextSubs,
        });

        return {
          subscriptions: nextSubs,
          committed: nextCommitted,
          availableBalance: recalc.availableBalance,
          dailyAllowance: recalc.dailyAllowance,
          healthScore: recalc.healthScore,
          riskLevel: recalc.riskLevel,
        };
      });
    },

    setDaysPassed: (days) => {
      set((state) => {
        const clampedDays = Math.max(0, Math.min(30, days));
        const recalc = recalculateBudgetState({
          totalBudget: state.totalBudget,
          spent: state.spent,
          committed: state.committed,
          savedToGoals: state.savedToGoals,
          daysPassed: clampedDays,
          startDate: state.startDate,
        });

        const nextGoals = state.goals.map((g) => computeGoalMetrics(g, recalc.daysRemaining));

        return {
          daysPassed: clampedDays,
          daysRemaining: recalc.daysRemaining,
          availableBalance: recalc.availableBalance,
          dailyAllowance: recalc.dailyAllowance,
          healthScore: recalc.healthScore,
          riskLevel: recalc.riskLevel,
          goals: nextGoals,
        };
      });
    },

    resetToInitialDemo: () => {
      clearStorage();
      const recalc = recalculateBudgetState({
        totalBudget: 10000,
        spent: 2000,
        committed: 1000,
        savedToGoals: 500,
        daysPassed: 10,
      });

      const goals = INITIAL_GOALS.map((g) => computeGoalMetrics(g, recalc.daysRemaining));

      saveFullAppState({
        budgetState: recalc,
        expenses: INITIAL_EXPENSES,
        goals,
        subscriptions: INITIAL_SUBSCRIPTIONS,
      });

      set({
        ...recalc,
        expenses: INITIAL_EXPENSES,
        goals,
        subscriptions: INITIAL_SUBSCRIPTIONS,
      });
    },

    resetCleanSlate: () => {
      clearStorage();
      const recalc = recalculateBudgetState({
        totalBudget: 10000,
        spent: 0,
        committed: 0,
        savedToGoals: 0,
        daysPassed: 0,
      });

      saveFullAppState({
        budgetState: recalc,
        expenses: [],
        goals: [],
        subscriptions: [],
      });

      set({
        ...recalc,
        expenses: [],
        goals: [],
        subscriptions: [],
      });
    },
  };
});
