import React from 'react';
import { Sparkles, ClipboardList, Package, Home } from 'lucide-react';
import { DepartmentDropdown } from './DepartmentDropdown';
import { DepartmentId } from '../../types/laboratory';

interface HeaderProps {
  onNavigateHome: () => void;
  onOpenEquipment: () => void;
  onOpenNotebook: () => void;
  onToggleAssistant: () => void;
  onSelectExperiment: (expId: string) => void;
  onSelectDepartment: (deptId: DepartmentId) => void;
  notebookLogsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  onOpenEquipment,
  onOpenNotebook,
  onToggleAssistant,
  onSelectExperiment,
  onSelectDepartment,
  notebookLogsCount,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={onNavigateHome}
        className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
        <span>Aetheria Virtual Science Laboratory</span>
      </button>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={onNavigateHome}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span>Facility</span>
        </button>

        {/* Mega menu dropdown */}
        <DepartmentDropdown
          onSelectExperiment={onSelectExperiment}
          onSelectDepartment={onSelectDepartment}
        />

        <button
          onClick={onOpenEquipment}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Package className="w-3.5 h-3.5 text-slate-400" />
          <span>Equipment Catalog</span>
        </button>

        <button
          onClick={onOpenNotebook}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
          <span>Lab Journal ({notebookLogsCount})</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleAssistant}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>Ask Dr. Aetheria</span>
        </button>
      </div>
    </header>
  );
};
