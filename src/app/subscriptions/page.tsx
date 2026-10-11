import React, { useState } from 'react';
import { useSubscriptions } from '../../hooks/useSubscriptions';
import { AddSubscriptionModal } from '../../components/subscriptions/AddSubscriptionModal';
import { Button } from '../../components/ui/Button';
import { Tv, Plus, Calendar, Trash2, CheckCircle2, PauseCircle, ShieldAlert } from 'lucide-react';

export const SubscriptionsPage: React.FC = () => {
  const { subscriptions, committed, toggleSubscription, deleteSubscription } = useSubscriptions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeCount = subscriptions.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Tv className="w-5 h-5 text-indigo-400" />
            <span>Recurring Subscriptions Radar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Subscriptions lock down portions of your ₹10,000 budget as non-negotiable commitments.
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Subscription</span>
        </Button>
      </div>

      {/* Committed Total Hero Strip */}
      <div className="rounded-xl bg-gradient-to-r from-[#14172B] to-[#101322] border border-[#202642] p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Committed Budget This Cycle
          </span>
          <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-1">
            ₹{committed.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-slate-400 font-sans"> / month</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{activeCount} Active</span>
          </div>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{subscriptions.length - activeCount} Paused</span>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="rounded-xl bg-[#111320] border border-[#1E2238] p-5 md:p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Scheduled Commitments ({subscriptions.length})
        </h2>

        {subscriptions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No recurring subscriptions tracked. Click "Add Subscription" to log Netflix, Spotify, gym passes, or EMIs.
          </div>
        ) : (
          <div className="divide-y divide-[#1A1D2E]">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSubscription(sub.id)}
                    title={sub.isActive ? 'Pause subscription' : 'Activate subscription'}
                    className={`p-2 rounded-lg transition-colors ${
                      sub.isActive
                        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                        : 'bg-slate-800/40 text-slate-500 border border-slate-700/40'
                    }`}
                  >
                    {sub.isActive ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <PauseCircle className="w-4 h-4" />
                    )}
                  </button>

                  <div>
                    <div className="font-semibold text-slate-100 flex items-center gap-2">
                      <span>{sub.name}</span>
                      {!sub.isActive && (
                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-800 px-1.5 py-0.2 rounded">
                          Paused
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Billed on Day {sub.billingDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{sub.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="font-mono font-bold text-base text-white">
                      ₹{sub.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/ cycle</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSubscription(sub.id)}
                      className="px-2.5 py-1 text-xs font-medium rounded border border-[#252B44] text-slate-300 hover:text-white hover:bg-[#1A1E32] transition-colors"
                    >
                      {sub.isActive ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={() => deleteSubscription(sub.id)}
                      aria-label={`Delete subscription ${sub.name}`}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddSubscriptionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
