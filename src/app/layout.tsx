import React from 'react';
import {
  Sparkles,
  Plus,
  RefreshCw,
  LayoutDashboard,
  Target,
  Tv,
  TrendingUp,
} from 'lucide-react';
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
  const navItems: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'simulate', label: 'Simulator', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'goals', label: 'Goals', icon: <Target className="w-5 h-5" /> },
    { id: 'subscriptions', label: 'Subs', icon: <Tv className="w-5 h-5" /> },
    { id: 'forecast', label: 'Forecast', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 1. Skip Navigation for Screen Readers & Keyboard Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:outline-none shadow-xl font-semibold text-sm min-h-[44px] flex items-center"
      >
        Skip to main content
      </a>

      {/* 2. Top Bar Contract: 3 zones, single-line, zero clutter */}
      <header className="sticky top-0 z-30 bg-[#090A0F]/95 backdrop-blur-md border-b border-[#1A1E30] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              aria-label="FlowFi Home"
              className="min-h-[44px] min-w-[44px] flex items-center gap-2 text-xl font-extrabold tracking-tight text-white hover:text-indigo-400 transition-colors whitespace-nowrap group"
            >
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform text-sm">
                ⚡
              </span>
              <span>FlowFi</span>
            </button>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-500 tracking-wider">
              ₹10,000 / 30D
            </span>
          </div>

          {/* Zone 2: Navigation Links for Desktop & Tablet (md and above) */}
          <nav
            aria-label="Desktop Navigation"
            className="hidden md:flex items-center gap-1 bg-[#121524] p-1 rounded-xl border border-[#1E233B]"
          >
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 min-h-[36px] flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#1A1F36]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onResetDemo}
              title="Reset cycle to Day 10 preset"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 text-slate-400 hover:text-slate-200 hover:bg-[#151829] rounded-lg transition-colors border border-transparent hover:border-[#222740] active:scale-95"
              aria-label="Reset simulation cycle to initial Day 10 state"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Button
              size="sm"
              variant="primary"
              onClick={onOpenAddExpense}
              className="text-sm font-semibold shadow-indigo-600/20 px-3.5 py-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Log Expense</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Viewport Content — pb-24 on mobile ensures no collision with bottom nav */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8 pb-28 md:pb-12 focus:outline-none"
      >
        {children}
      </main>

      {/* 3. Mobile Bottom Navigation Bar (Active on < 768px for iPhone SE, iPhone 14, Android) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0B0D18]/95 backdrop-blur-lg border-t border-[#1C2036] px-2 py-1.5 flex items-center justify-around safe-area-pb"
      >
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`min-h-[48px] min-w-[56px] flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 transition-all ${
                isActive
                  ? 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <span className={`p-1 rounded-md transition-colors ${isActive ? 'bg-indigo-600/20' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[11px] leading-none tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <footer className="border-t border-[#161928] py-6 text-xs text-slate-500 text-center mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>FlowFi · Gen Z Runway & Ripple-Effect Simulator</span>
          <span className="font-mono text-xs">Strict ₹10,000 / 30-Day Pure Client Architecture</span>
        </div>
      </footer>
    </div>
  );
};
