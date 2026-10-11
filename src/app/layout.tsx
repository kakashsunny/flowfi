import React from 'react';
import { Sparkles, Plus, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';

export type AppTab = 'dashboard' | 'simulate' | 'goals' | 'subscriptions' | 'forecast';

interface LayoutProps {
  currentTab: AppTab;
  onNavigate: (tab: AppTab) => void;
  onOpenAddExpense: () => void;
  onResetDemo: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentTab,
  onNavigate,
  onOpenAddExpense,
  onResetDemo,
  children,
}) => {
  const navItems: { id: AppTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'simulate', label: 'Simulator' },
    { id: 'goals', label: 'Goals' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'forecast', label: '30-Day Forecast' },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 1. Skip Navigation for Screen Readers & Keyboard Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:outline-none shadow-xl font-medium text-sm"
      >
        Skip to main content
      </a>

      {/* 2. Top Bar Contract: 3 zones, single-line, zero clutter */}
      <header className="sticky top-0 z-40 bg-[#090A0F]/90 backdrop-blur-md border-b border-[#1A1E30] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xl font-extrabold tracking-tight text-white hover:text-indigo-400 transition-colors whitespace-nowrap flex items-center gap-2 group"
            >
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                ⚡
              </span>
              <span>FlowFi</span>
            </button>
            <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500 tracking-wider">
              ₹10,000 / 30D
            </span>
          </div>

          {/* Zone 2: Navigation Links (Single-Line, 4-5 items) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 bg-[#121524] p-1 rounded-xl border border-[#1E233B]"
          >
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#1A1F36]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onResetDemo}
              title="Reset to Day 10 Demo state"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-[#151829] rounded-lg transition-colors border border-transparent hover:border-[#222740]"
              aria-label="Reset simulation cycle"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Button
              size="sm"
              variant="primary"
              onClick={onOpenAddExpense}
              className="text-xs font-semibold shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Log Expense</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-[#161928] bg-[#0C0E18] gap-1.5 no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white bg-[#131627]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Viewport Content */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 focus:outline-none">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#161928] py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>FlowFi · Gen Z Runway & Ripple-Effect Simulator</span>
          <span className="font-mono text-[11px]">Strict ₹10,000 / 30-Day Pure Client Architecture</span>
        </div>
      </footer>
    </div>
  );
};
