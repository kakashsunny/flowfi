/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout, AppTab } from './app/layout';
import { DashboardPage } from './app/page';
import { SimulatePage } from './app/simulate/page';
import { GoalsPage } from './app/goals/page';
import { SubscriptionsPage } from './app/subscriptions/page';
import { ForecastPage } from './app/forecast/page';
import { AddExpenseModal } from './components/budget/AddExpenseModal';
import { useBudgetStore } from './store/budgetStore';

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
        <SimulatePage onBackToDashboard={() => setCurrentTab('dashboard')} />
      )}

      {currentTab === 'goals' && <GoalsPage />}

      {currentTab === 'subscriptions' && <SubscriptionsPage />}

      {currentTab === 'forecast' && <ForecastPage />}

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />
    </Layout>
  );
}
