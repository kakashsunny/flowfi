import React, { useMemo } from 'react';
import { useBudgetStore } from '../../store/budgetStore';
import { generateForecast } from '../../lib/forecast-engine';
import { ForecastLine } from '../../components/charts/ForecastLine';
import { TrendingUp, AlertCircle, ShieldCheck, Calendar } from 'lucide-react';

export const ForecastPage: React.FC = () => {
  const store = useBudgetStore();

  const forecastData = useMemo(() => {
    return generateForecast(
      {
        totalBudget: store.totalBudget,
        startDate: store.startDate,
        daysPassed: store.daysPassed,
        daysRemaining: store.daysRemaining,
        spent: store.spent,
        committed: store.committed,
        savedToGoals: store.savedToGoals,
        availableBalance: store.availableBalance,
        dailyAllowance: store.dailyAllowance,
        healthScore: store.healthScore,
        riskLevel: store.riskLevel,
      },
      store.subscriptions
    );
  }, [
    store.totalBudget,
    store.startDate,
    store.daysPassed,
    store.daysRemaining,
    store.spent,
    store.committed,
    store.savedToGoals,
    store.availableBalance,
    store.dailyAllowance,
    store.healthScore,
    store.riskLevel,
    store.subscriptions,
  ]);

  const endDayPoint = forecastData[forecastData.length - 1];
  const projectedSurplus = endDayPoint ? endDayPoint.projectedBalance : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>30-Day Runway Projection</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate your entire cycle runway assuming current velocity & scheduled subscription bills.
          </p>
        </div>

        {/* Day scrubber indicator */}
        <div className="flex items-center gap-2 text-xs font-mono bg-[#111320] border border-[#1E2238] px-3.5 py-1.5 rounded-lg text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>Currently Day {store.daysPassed}</span>
        </div>
      </div>

      {/* Projection Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-[#111320] border border-[#1E2238] p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
            End of Cycle Runway (Day 30)
          </span>
          <div className="text-2xl font-extrabold font-mono text-white mt-1">
            ₹{projectedSurplus.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            {projectedSurplus > 0 ? 'Comfortable buffer' : 'Zero buffer — danger of overdraft'}
          </span>
        </div>

        <div className="rounded-xl bg-[#111320] border border-[#1E2238] p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
            Current Daily Pacing
          </span>
          <div className="text-2xl font-extrabold font-mono text-indigo-400 mt-1">
            ₹{store.dailyAllowance.toLocaleString('en-IN')}
            <span className="text-xs font-sans text-slate-400 font-normal"> / day</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Sustainable for remaining {store.daysRemaining} days
          </span>
        </div>

        <div className="rounded-xl bg-[#111320] border border-[#1E2238] p-4">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
            Upcoming Bills Committed
          </span>
          <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">
            ₹{store.committed.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Safeguarded from available funds
          </span>
        </div>
      </div>

      {/* Chart */}
      <ForecastLine
        data={forecastData}
        totalBudget={store.totalBudget}
      />

      {/* Milestone Breakdown Table */}
      <div className="rounded-xl bg-[#111320] border border-[#1E2238] p-5 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Weekly Cycle Milestones
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#1E2238] text-slate-400 font-mono">
                <th className="py-2.5 px-3">Milestone</th>
                <th className="py-2.5 px-3">Projected Balance</th>
                <th className="py-2.5 px-3">Expected Burn Pace</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161928] font-mono">
              {[
                { day: 7, label: 'Week 1 (Day 7)' },
                { day: 14, label: 'Mid-Cycle (Day 14)' },
                { day: 21, label: 'Week 3 (Day 21)' },
                { day: 30, label: 'Month Close (Day 30)' },
              ].map(({ day, label }) => {
                const pt = forecastData[day - 1];
                const isPassed = day <= store.daysPassed;
                return (
                  <tr key={day} className="hover:bg-[#151829] transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-200">{label}</td>
                    <td className="py-3 px-3 text-white font-bold">
                      ₹{pt ? pt.projectedBalance.toLocaleString('en-IN') : '-'}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      ₹{pt ? pt.projectedBurn.toLocaleString('en-IN') : '-'}/day
                    </td>
                    <td className="py-3 px-3">
                      {isPassed ? (
                        <span className="text-emerald-400 font-sans font-medium text-[11px]">
                          ✓ Completed
                        </span>
                      ) : (
                        <span className="text-indigo-400 font-sans font-medium text-[11px]">
                          Projected
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
