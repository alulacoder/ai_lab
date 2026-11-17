import React from 'react';
import { DepartmentId } from '../../types/laboratory';

interface FooterProps {
  onSelectDepartment: (deptId: DepartmentId) => void;
  onOpenEquipment: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectDepartment, onOpenEquipment }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-200">Aetheria Virtual Science Laboratory</span>
          <span className="mx-2 text-slate-600">·</span>
          <span>Interactive STEM Research & Simulation Facility</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <button onClick={() => onSelectDepartment('chemistry')} className="hover:text-white transition-colors">
            Chemistry
          </button>
          <button onClick={() => onSelectDepartment('physics')} className="hover:text-white transition-colors">
            Physics
          </button>
          <button onClick={() => onSelectDepartment('biology')} className="hover:text-white transition-colors">
            Biology
          </button>
          <button onClick={() => onSelectDepartment('astronomy')} className="hover:text-white transition-colors">
            Astronomy
          </button>
          <button onClick={onOpenEquipment} className="hover:text-white transition-colors">
            Equipment
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          Empirical simulations modeled for educational accuracy.
        </div>
      </div>
    </footer>
  );
};
