import React from 'react';
import { Simulator } from '../../components/simulator/Simulator';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface SimulatePageProps {
  onBackToDashboard?: () => void;
}

export const SimulatePage: React.FC<SimulatePageProps> = ({ onBackToDashboard }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#151829] transition-colors md:hidden"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>What-If Decision Simulator</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Drag the slider or tap a Gen Z preset to view the cascading ripple effects across your
            balance, risk score, and savings goals.
          </p>
        </div>
      </div>

      <Simulator />
    </div>
  );
};

export default SimulatePage;
