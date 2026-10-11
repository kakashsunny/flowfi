/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense, lazy } from 'react';
import { Layout, AppTab } from './app/layout';
import { DashboardPage } from './app/page';
import { AddExpenseModal } from './components/budget/AddExpenseModal';
import { useBudgetStore } from './store/budgetStore';

// Lazy-loaded routes for code splitting and instant sub-100ms LCP on initial load
const SimulatePage = lazy(() =>
  import('./app/simulate/page').then((m) => ({ default: m.SimulatePage }))
);
const GoalsPage = lazy(() =>
  import('./app/goals/page').then((m) => ({ default: m.GoalsPage }))
);
const SubscriptionsPage = lazy(() =>
  import('./app/subscriptions/page').then((m) => ({ default: m.SubscriptionsPage }))
);
const ForecastPage = lazy(() =>
  import('./app/forecast/page').then((m) => ({ default: m.ForecastPage }))
);

const ViewSkeleton = () => (
  <div className="w-full space-y-6 animate-pulse" aria-busy="true" aria-label="Loading view">
    <div className="h-10 bg-[#141728] rounded-xl w-1/3" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-44 bg-[#141728] rounded-xl border border-[#1E2338]" />
      <div className="h-44 bg-[#141728] rounded-xl border border-[#1E2338]" />
      <div className="h-44 bg-[#141728] rounded-xl border border-[#1E2338]" />
    </div>
    <div className="h-64 bg-[#141728] rounded-xl border border-[#1E2338]" />
  </div>
);

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('dashboard');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const resetToInitialDemo = useBudgetStore((state) => state.resetToInitialDemo);

  return (
    <Layout
      currentTab={currentTab}
      onNavigate={setCurrentTab}
      onOpenAddExpense={() => setIsAddExpenseOpen(true)}
      onResetDemo={resetToInitialDemo}
    >
      {currentTab === 'dashboard' && (
        <DashboardPage
          onNavigateToSimulate={() => setCurrentTab('simulate')}
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
        />
      )}

      {currentTab === 'simulate' && (
        <Suspense fallback={<ViewSkeleton />}>
          <SimulatePage onBackToDashboard={() => setCurrentTab('dashboard')} />
        </Suspense>
      )}

      {currentTab === 'goals' && (
        <Suspense fallback={<ViewSkeleton />}>
          <GoalsPage />
        </Suspense>
      )}

      {currentTab === 'subscriptions' && (
        <Suspense fallback={<ViewSkeleton />}>
          <SubscriptionsPage />
        </Suspense>
      )}

      {currentTab === 'forecast' && (
        <Suspense fallback={<ViewSkeleton />}>
          <ForecastPage />
        </Suspense>
      )}

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />
    </Layout>
  );
}
