import React, { useState } from 'react';
import { useGoals } from '../../hooks/useGoals';
import { useBudgetStore } from '../../store/budgetStore';
import { GoalCard } from '../../components/goals/GoalCard';
import { GoalProgress } from '../../components/goals/GoalProgress';
import { GoalSimulator } from '../../components/goals/GoalSimulator';
import { AddGoalModal } from '../../components/goals/AddGoalModal';
import { Button } from '../../components/ui/Button';
import { Target, Plus } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { goals, savedToGoals, availableBalance, contributeToGoal, deleteGoal } = useGoals();
  const daysRemaining = useBudgetStore((state) => state.daysRemaining);
  const dailyAllowance = useBudgetStore((state) => state.dailyAllowance);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span>Savings Goals & Lockbox</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Lock portions of your ₹10,000 budget for targeted goals. Funds locked here are shielded
            from impulse spending.
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>New Goal</span>
        </Button>
      </div>

      {/* Aggregate Lockbox Progress */}
      <GoalProgress goals={goals} totalSaved={savedToGoals} />

      {/* Goals Grid & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Active Savings Targets ({goals.length})
            </h2>
          </div>

          {goals.length === 0 ? (
            <div className="rounded-xl bg-[#111320] border border-[#1E2238] p-8 text-center text-xs text-slate-500">
              No active goals created yet. Click "New Goal" to lock funds for trips or tech upgrades!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  availableBalance={availableBalance}
                  onContribute={contributeToGoal}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <GoalSimulator
            availableBalance={availableBalance}
            daysRemaining={daysRemaining}
            dailyAllowance={dailyAllowance}
          />
        </div>
      </div>

      <AddGoalModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
