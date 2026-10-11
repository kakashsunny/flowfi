import React from 'react';
import { useBudget } from '../hooks/useBudget';
import { BalanceCard } from '../components/budget/BalanceCard';
import { BudgetRing } from '../components/budget/BudgetRing';
import { DailyAllowance } from '../components/budget/DailyAllowance';
import { SpendingBreakdown } from '../components/budget/SpendingBreakdown';
import { HealthScore } from '../components/health/HealthScore';
import { RiskMeter } from '../components/health/RiskMeter';
import { SpendingHeatmap } from '../components/charts/SpendingHeatmap';
import { Trash2, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

interface DashboardPageProps {
  onNavigateToSimulate: () => void;
  onOpenAddExpense: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToSimulate,
  onOpenAddExpense,
}) => {
  const budget = useBudget();

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      {/* Hero Section: Balance Card & Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <BalanceCard
            state={{
              totalBudget: budget.totalBudget,
              spent: budget.spent,
              committed: budget.committed,
              savedToGoals: budget.savedToGoals,
              daysPassed: budget.daysPassed,
              daysRemaining: budget.daysRemaining,
              availableBalance: budget.availableBalance,
              dailyAllowance: budget.dailyAllowance,
              healthScore: budget.healthScore,
              riskLevel: budget.riskLevel,
            }}
            onOpenSimulate={onNavigateToSimulate}
            onOpenAddExpense={onOpenAddExpense}
          />
        </div>

        <div className="rounded-2xl bg-[#111320] border border-[#1E2238] p-6 flex flex-col items-center justify-center">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 self-start">
            Pool Distribution
          </h3>
          <BudgetRing
            totalBudget={budget.totalBudget}
            availableBalance={budget.availableBalance}
            spent={budget.spent}
            committed={budget.committed}
            savedToGoals={budget.savedToGoals}
            size={180}
          />
        </div>
      </div>

      {/* Health, Risk, and Daily Allowance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DailyAllowance
          dailyAllowance={budget.dailyAllowance}
          daysRemaining={budget.daysRemaining}
          riskLevel={budget.riskLevel}
        />
        <HealthScore score={budget.healthScore} />
        <RiskMeter
          riskLevel={budget.riskLevel}
          dailyAllowance={budget.dailyAllowance}
        />
      </div>

      {/* Spending Breakdown and Heatmap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingBreakdown
          categories={budget.categoryBreakdown}
          totalSpent={budget.spent}
        />
        <SpendingHeatmap
          expenses={budget.expenses}
          daysPassed={budget.daysPassed}
        />
      </div>

      {/* Recent Ledger Transactions */}
      <div className="rounded-xl bg-[#111320] border border-[#1E2238] p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Active Cycle Expenses
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every logged expense impacts tomorrow's daily allowance.
            </p>
          </div>
          <button
            onClick={onOpenAddExpense}
            className="min-h-[44px] px-3 py-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
          >
            + Add New
          </button>
        </div>

        {budget.expenses.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No expenses logged in this cycle yet. Click "+ Add New" or test a decision in the Simulator.
          </div>
        ) : (
          <div className="divide-y divide-[#181B2C]">
            {budget.expenses.map((exp) => {
              const catMeta = CATEGORIES[exp.category];
              return (
                <div
                  key={exp.id}
                  className="py-3.5 flex items-center justify-between gap-3 text-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        catMeta?.bgColor || 'bg-slate-800'
                      }`}
                    >
                      <ShoppingBag className={`w-4 h-4 ${catMeta?.color || 'text-slate-300'}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-100 text-sm truncate">
                        {exp.description}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{catMeta?.name || exp.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(exp.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-white text-base">
                      -₹{exp.amount.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => budget.deleteExpense(exp.id)}
                      title="Delete expense"
                      aria-label={`Delete ${exp.description}`}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-rose-400 p-2.5 rounded-lg transition-colors opacity-90 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
