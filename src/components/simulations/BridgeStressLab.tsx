import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Hammer, ShieldAlert, RotateCcw } from 'lucide-react';

interface BridgeStressLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const BridgeStressLab: React.FC<BridgeStressLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['bridge-stress'];

  const [appliedLoadKn, setAppliedLoadKn] = useState(65); // 0 to 250 kN
  const [trussType, setTrussType] = useState<'warren' | 'pratt' | 'howe'>('warren');
  const [material, setMaterial] = useState<'steel' | 'titanium' | 'aluminum' | 'timber'>('steel');

  // Material yield strengths (in kN before member failure)
  const yieldLimits = {
    steel: 180,
    titanium: 240,
    aluminum: 110,
    timber: 70,
  };

  const currentYieldLimit = yieldLimits[material];
  const isCollapsed = appliedLoadKn > currentYieldLimit;

  // Maximum stress factor (0 to 1+)
  const stressRatio = appliedLoadKn / currentYieldLimit;

  const resetBridge = () => {
    setAppliedLoadKn(65);
    setTrussType('warren');
    setMaterial('steel');
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetBridge}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Truss Geometry': `${trussType.toUpperCase()} Truss`,
        'Structural Material': material.toUpperCase(),
        'Applied Deck Load': `${appliedLoadKn} kN`,
        'Material Yield Strength': `${currentYieldLimit} kN`,
        'Stress / Yield Ratio': `${(stressRatio * 100).toFixed(1)}%`,
        'Bridge State': isCollapsed ? 'STRUCTURAL COLLAPSE (Buckling Failure)' : 'Elastic Equilibrium (Safe)',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Controls Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Truss Bridge Specifications</span>
              <Hammer className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Truss Type */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Truss Geometry Topology:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                {(['warren', 'pratt', 'howe'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTrussType(t)}
                    className={`p-2 rounded border text-center uppercase font-bold transition-colors ${
                      trussType === t
                        ? 'bg-slate-800 border-cyan-400 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Structural Material */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Structural Beam Material:
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="steel">Structural Carbon Steel (Yield: 180 kN)</option>
                <option value="titanium">Titanium Ti-6Al-4V (Yield: 240 kN)</option>
                <option value="aluminum">Aluminum 6061-T6 (Yield: 110 kN)</option>
                <option value="timber">Glulam Heavy Timber (Yield: 70 kN)</option>
              </select>
            </div>

            {/* Applied Load Slider */}
            <div className="mb-2">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Applied Vertical Hydraulic Load:</span>
                <span className={isCollapsed ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>
                  {appliedLoadKn} kN
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="5"
                value={appliedLoadKn}
                onChange={(e) => setAppliedLoadKn(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0 kN (Unloaded)</span>
                <span className="text-amber-400">Limit ({currentYieldLimit} kN)</span>
                <span className="text-rose-400">250 kN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Truss Bridge SVG & Stress Heatmap */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              {isCollapsed ? 'COLLAPSED BUCKLING FAILURE!' : 'FINITE-ELEMENT TENSION & COMPRESSION VECTORS'}
            </div>

            {/* Truss Bridge SVG */}
            <svg className="w-full max-w-[420px] aspect-[4/3] bg-slate-950/90 rounded-xl border border-slate-800 p-2" viewBox="0 0 400 240">
              {/* Abutment Supports */}
              <polygon points="20,180 50,180 35,220" fill="#334155" />
              <polygon points="350,180 380,180 365,220" fill="#334155" />

              {/* Water Gorge below bridge */}
              <rect x="0" y="210" width="400" height="30" fill="rgba(14, 165, 233, 0.2)" />

              {/* Downward Hydraulic Load Arrow */}
              <g transform="translate(200, 70)">
                <line x1="0" y1="0" x2="0" y2="40" stroke="#f43f5e" strokeWidth="4" />
                <polygon points="0,48 -6,38 6,38" fill="#f43f5e" />
                <text x="0" y="-8" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  ▼ {appliedLoadKn} kN
                </text>
              </g>

              {/* Truss Chords and Struts */}
              <g
                strokeWidth={isCollapsed ? '2' : '4'}
                strokeLinecap="round"
                className="transition-all duration-300"
              >
                {/* Bottom Chord (Tension: Blue) */}
                <line
                  x1="35"
                  y1="180"
                  x2="365"
                  y2={isCollapsed ? '210' : '180'}
                  stroke={isCollapsed ? '#ef4444' : '#38bdf8'}
                />

                {/* Top Chord (Compression: Amber/Red) */}
                <line
                  x1="100"
                  y1={isCollapsed ? '150' : '120'}
                  x2="300"
                  y2={isCollapsed ? '160' : '120'}
                  stroke={isCollapsed ? '#ef4444' : '#f59e0b'}
                />

                {/* Diagonal Web Members */}
                <line x1="35" y1="180" x2="100" y2={isCollapsed ? '150' : '120'} stroke="#f59e0b" />
                <line x1="100" y1={isCollapsed ? '150' : '120'} x2="165" y2={isCollapsed ? '200' : '180'} stroke="#38bdf8" />
                <line x1="165" y1={isCollapsed ? '200' : '180'} x2="235" y2={isCollapsed ? '155' : '120'} stroke="#f59e0b" />
                <line x1="235" y1={isCollapsed ? '155' : '120'} x2="300" y2={isCollapsed ? '160' : '120'} stroke="#f59e0b" />
                <line x1="300" y1={isCollapsed ? '160' : '120'} x2="365" y2="180" stroke="#f59e0b" />
              </g>

              {/* Pinned Joint Nodes */}
              {[[35, 180], [100, 120], [165, 180], [235, 120], [300, 120], [365, 180]].map(([x, y], idx) => (
                <circle key={idx} cx={x} cy={isCollapsed ? y + 15 : y} r="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
              ))}
            </svg>

            {/* Collapse Warning Banner */}
            <div className="mt-2 w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-center font-mono text-xs">
              {isCollapsed ? (
                <span className="text-rose-400 font-bold flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  CRITICAL LOAD EXCEEDED: EULER BUCKLING COLLAPSE!
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">
                  Structure Stable: Static Equilibrium (Safety Factor = {(currentYieldLimit / Math.max(1, appliedLoadKn)).toFixed(2)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Applied Load vs Yield"
            value={`${(stressRatio * 100).toFixed(0)}%`}
            subValue={`Yield Limit: ${currentYieldLimit} kN`}
            tone={isCollapsed ? 'rose' : stressRatio > 0.8 ? 'amber' : 'emerald'}
          />

          <MetricCard
            label="Safety Factor (SF)"
            value={(currentYieldLimit / Math.max(1, appliedLoadKn)).toFixed(2)}
            subValue={stressRatio <= 1 ? 'Design Margin Safe (SF > 1.0)' : 'Structural Failure (SF < 1.0)'}
            tone={isCollapsed ? 'rose' : 'cyan'}
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Tension vs Compression Mechanics
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
                <span className="text-slate-300">Tension (Pulled apart): Bottom Chords</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="text-slate-300">Compression (Pushed together): Top Chords</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
