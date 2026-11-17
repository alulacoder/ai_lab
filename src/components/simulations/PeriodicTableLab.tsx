import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Search, Sparkles } from 'lucide-react';

interface ElementData {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: string;
  period: number;
  group: number;
  electronConfig: string;
  electronegativity?: number;
  shells: number[];
  color: string;
}

const ELEMENTS: ElementData[] = [
  { number: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, category: 'Nonmetal', period: 1, group: 1, electronConfig: '1s¹', electronegativity: 2.20, shells: [1], color: '#38bdf8' },
  { number: 2, symbol: 'He', name: 'Helium', mass: 4.0026, category: 'Noble Gas', period: 1, group: 18, electronConfig: '1s²', shells: [2], color: '#c084fc' },
  { number: 3, symbol: 'Li', name: 'Lithium', mass: 6.94, category: 'Alkali Metal', period: 2, group: 1, electronConfig: '[He] 2s¹', electronegativity: 0.98, shells: [2, 1], color: '#f87171' },
  { number: 4, symbol: 'Be', name: 'Beryllium', mass: 9.0122, category: 'Alkaline Earth', period: 2, group: 2, electronConfig: '[He] 2s²', electronegativity: 1.57, shells: [2, 2], color: '#fb923c' },
  { number: 5, symbol: 'B', name: 'Boron', mass: 10.81, category: 'Metalloid', period: 2, group: 13, electronConfig: '[He] 2s² 2p¹', electronegativity: 2.04, shells: [2, 3], color: '#facc15' },
  { number: 6, symbol: 'C', name: 'Carbon', mass: 12.011, category: 'Nonmetal', period: 2, group: 14, electronConfig: '[He] 2s² 2p²', electronegativity: 2.55, shells: [2, 4], color: '#38bdf8' },
  { number: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007, category: 'Nonmetal', period: 2, group: 15, electronConfig: '[He] 2s² 2p³', electronegativity: 3.04, shells: [2, 5], color: '#38bdf8' },
  { number: 8, symbol: 'O', name: 'Oxygen', mass: 15.999, category: 'Nonmetal', period: 2, group: 16, electronConfig: '[He] 2s² 2p⁴', electronegativity: 3.44, shells: [2, 6], color: '#38bdf8' },
  { number: 9, symbol: 'F', name: 'Fluorine', mass: 18.998, category: 'Halogen', period: 2, group: 17, electronConfig: '[He] 2s² 2p⁵', electronegativity: 3.98, shells: [2, 7], color: '#4ade80' },
  { number: 10, symbol: 'Ne', name: 'Neon', mass: 20.180, category: 'Noble Gas', period: 2, group: 18, electronConfig: '[He] 2s² 2p⁶', shells: [2, 8], color: '#c084fc' },
  { number: 11, symbol: 'Na', name: 'Sodium', mass: 22.990, category: 'Alkali Metal', period: 3, group: 1, electronConfig: '[Ne] 3s¹', electronegativity: 0.93, shells: [2, 8, 1], color: '#f87171' },
  { number: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.305, category: 'Alkaline Earth', period: 3, group: 2, electronConfig: '[Ne] 3s²', electronegativity: 1.31, shells: [2, 8, 2], color: '#fb923c' },
  { number: 13, symbol: 'Al', name: 'Aluminum', mass: 26.982, category: 'Post-Transition', period: 3, group: 13, electronConfig: '[Ne] 3s² 3p¹', electronegativity: 1.61, shells: [2, 8, 3], color: '#94a3b8' },
  { number: 14, symbol: 'Si', name: 'Silicon', mass: 28.085, category: 'Metalloid', period: 3, group: 14, electronConfig: '[Ne] 3s² 3p²', electronegativity: 1.90, shells: [2, 8, 4], color: '#facc15' },
  { number: 15, symbol: 'P', name: 'Phosphorus', mass: 30.974, category: 'Nonmetal', period: 3, group: 15, electronConfig: '[Ne] 3s² 3p³', electronegativity: 2.19, shells: [2, 8, 5], color: '#38bdf8' },
  { number: 16, symbol: 'S', name: 'Sulfur', mass: 32.06, category: 'Nonmetal', period: 3, group: 16, electronConfig: '[Ne] 3s² 3p⁴', electronegativity: 2.58, shells: [2, 8, 6], color: '#38bdf8' },
  { number: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, category: 'Halogen', period: 3, group: 17, electronConfig: '[Ne] 3s² 3p⁵', electronegativity: 3.16, shells: [2, 8, 7], color: '#4ade80' },
  { number: 18, symbol: 'Ar', name: 'Argon', mass: 39.948, category: 'Noble Gas', period: 3, group: 18, electronConfig: '[Ne] 3s² 3p⁶', shells: [2, 8, 8], color: '#c084fc' },
  { number: 19, symbol: 'K', name: 'Potassium', mass: 39.098, category: 'Alkali Metal', period: 4, group: 1, electronConfig: '[Ar] 4s¹', electronegativity: 0.82, shells: [2, 8, 8, 1], color: '#f87171' },
  { number: 20, symbol: 'Ca', name: 'Calcium', mass: 40.078, category: 'Alkaline Earth', period: 4, group: 2, electronConfig: '[Ar] 4s²', electronegativity: 1.00, shells: [2, 8, 8, 2], color: '#fb923c' },
  { number: 26, symbol: 'Fe', name: 'Iron', mass: 55.845, category: 'Transition Metal', period: 4, group: 8, electronConfig: '[Ar] 3d⁶ 4s²', electronegativity: 1.83, shells: [2, 8, 14, 2], color: '#e2e8f0' },
  { number: 29, symbol: 'Cu', name: 'Copper', mass: 63.546, category: 'Transition Metal', period: 4, group: 11, electronConfig: '[Ar] 3d¹⁰ 4s¹', electronegativity: 1.90, shells: [2, 8, 18, 1], color: '#e2e8f0' },
  { number: 47, symbol: 'Ag', name: 'Silver', mass: 107.87, category: 'Transition Metal', period: 5, group: 11, electronConfig: '[Kr] 4d¹⁰ 5s¹', electronegativity: 1.93, shells: [2, 8, 18, 18, 1], color: '#e2e8f0' },
  { number: 79, symbol: 'Au', name: 'Gold', mass: 196.97, category: 'Transition Metal', period: 6, group: 11, electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', electronegativity: 2.54, shells: [2, 8, 18, 32, 18, 1], color: '#e2e8f0' },
  { number: 92, symbol: 'U', name: 'Uranium', mass: 238.03, category: 'Actinide', period: 7, group: 3, electronConfig: '[Rn] 5f³ 6d¹ 7s²', electronegativity: 1.38, shells: [2, 8, 18, 32, 21, 9, 2], color: '#a3e635' },
];

interface PeriodicTableLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const PeriodicTableLab: React.FC<PeriodicTableLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['periodic-table'];
  const [selectedElement, setSelectedElement] = useState<ElementData>(ELEMENTS[5]); // Carbon
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredElements = ELEMENTS.filter((el) => {
    const matchesSearch =
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.number.toString() === searchQuery;
    const matchesCategory = categoryFilter === 'All' || el.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={() => {
        setSelectedElement(ELEMENTS[5]);
        setSearchQuery('');
        setCategoryFilter('All');
      }}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Selected Element': `${selectedElement.name} (${selectedElement.symbol})`,
        'Atomic Number': selectedElement.number,
        'Atomic Mass': `${selectedElement.mass} u`,
        'Electron Configuration': selectedElement.electronConfig,
        'Electronegativity': selectedElement.electronegativity || 'N/A',
        'Category': selectedElement.category,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Elements Grid & Filter */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            {/* Search and Category Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, symbol, or Z (e.g. Carbon, C, 6)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="All">All Categories</option>
                <option value="Nonmetal">Reactive Nonmetals</option>
                <option value="Noble Gas">Noble Gases</option>
                <option value="Alkali Metal">Alkali Metals</option>
                <option value="Alkaline Earth">Alkaline Earth Metals</option>
                <option value="Transition Metal">Transition Metals</option>
                <option value="Metalloid">Metalloids</option>
                <option value="Halogen">Halogens</option>
                <option value="Actinide">Actinides</option>
              </select>
            </div>

            {/* Elements Interactive Grid Cards */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {filteredElements.map((el) => {
                const isSelected = selectedElement.number === el.number;
                return (
                  <button
                    key={el.number}
                    onClick={() => setSelectedElement(el)}
                    className={`aspect-square p-1.5 rounded-lg border transition-all flex flex-col justify-between text-left relative overflow-hidden ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500/30'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex justify-between items-start text-[9px] font-mono text-slate-400 w-full">
                      <span>{el.number}</span>
                      <span className="text-[8px] truncate max-w-[36px]">{el.mass.toFixed(1)}</span>
                    </div>
                    <div className="text-base font-bold font-mono text-white text-center">
                      {el.symbol}
                    </div>
                    <div className="text-[8px] font-mono text-slate-400 truncate w-full text-center">
                      {el.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Bohr Model & Element Telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Animated Bohr Electron Shell Canvas */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-2">
              Bohr Quantized Orbital Shells
            </span>

            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Shell Orbit Rings */}
              {selectedElement.shells.map((electronsInShell, shellIdx) => {
                const radius = 24 + shellIdx * 16;
                return (
                  <div
                    key={shellIdx}
                    className="absolute rounded-full border border-slate-700/60 pointer-events-none"
                    style={{
                      width: `${radius * 2}px`,
                      height: `${radius * 2}px`,
                      animation: `spin ${10 + shellIdx * 5}s linear infinite`,
                    }}
                  >
                    {/* Render electrons in this shell */}
                    {Array.from({ length: electronsInShell }).map((_, eIdx) => {
                      const angle = (eIdx / electronsInShell) * 2 * Math.PI;
                      const x = radius * Math.cos(angle);
                      const y = radius * Math.sin(angle);
                      return (
                        <div
                          key={eIdx}
                          className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]"
                          style={{
                            left: `calc(50% + ${x}px - 4px)`,
                            top: `calc(50% + ${y}px - 4px)`,
                          }}
                        />
                      );
                    })}
                  </div>
                );
              })}

              {/* Nucleus */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-rose-500 shadow-[0_0_12px_#f97316] flex items-center justify-center text-xs font-mono font-bold text-white z-10">
                {selectedElement.symbol}
              </div>
            </div>

            <div className="mt-2 text-xs font-mono text-slate-400 text-center">
              Shells (n=1..k): {selectedElement.shells.join(' · ')} electrons
            </div>
          </div>

          {/* Element Specifications */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-xl font-bold text-white font-mono">{selectedElement.name}</span>
                <span className="text-xs text-slate-400 ml-2 font-mono">[{selectedElement.symbol}]</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
                {selectedElement.category}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Atomic Number (Z)</span>
                <span className="text-white font-bold">{selectedElement.number}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Atomic Mass</span>
                <span className="text-white font-bold">{selectedElement.mass} u</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800 col-span-2">
                <span className="text-slate-500 block text-[10px]">Electron Configuration</span>
                <span className="text-cyan-400 font-bold">{selectedElement.electronConfig}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Electronegativity</span>
                <span className="text-white font-bold">
                  {selectedElement.electronegativity ? `${selectedElement.electronegativity} Pauling` : 'N/A'}
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Periodic Group / Period</span>
                <span className="text-white font-bold">
                  Gr {selectedElement.group} / Per {selectedElement.period}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
