import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Gauge, Droplet, Plus, Minus } from 'lucide-react';

interface HouseholdLiquid {
  id: string;
  name: string;
  basePH: number;
  color: string; // liquid hex
  indicatorColor: string; // litmus color
  description: string;
  category: 'Acidic' | 'Neutral' | 'Basic';
}

const LIQUIDS: HouseholdLiquid[] = [
  { id: 'lemon', name: 'Fresh Lemon Juice', basePH: 2.2, color: '#fef08a', indicatorColor: '#ef4444', description: 'Rich in citric acid (C₆H₈O₇)', category: 'Acidic' },
  { id: 'vinegar', name: 'Distilled White Vinegar', basePH: 2.8, color: '#f8fafc', indicatorColor: '#f97316', description: '5% acetic acid solution (CH₃COOH)', category: 'Acidic' },
  { id: 'coffee', name: 'Black Drip Coffee', basePH: 5.0, color: '#78350f', indicatorColor: '#eab308', description: 'Chlorogenic and quinic acids', category: 'Acidic' },
  { id: 'milk', name: 'Cow Milk', basePH: 6.6, color: '#ffffff', indicatorColor: '#84cc16', description: 'Lactic acid and calcium caseinate buffer', category: 'Neutral' },
  { id: 'water', name: 'Pure Deionized Water', basePH: 7.0, color: '#e0f2fe', indicatorColor: '#10b981', description: 'Auto-ionization Kw = 1.0 × 10⁻¹⁴ at 25°C', category: 'Neutral' },
  { id: 'blood', name: 'Human Blood Plasma', basePH: 7.4, color: '#ef4444', indicatorColor: '#06b6d4', description: 'Strictly buffered by carbonic acid-bicarbonate', category: 'Neutral' },
  { id: 'baking-soda', name: 'Baking Soda Solution', basePH: 8.5, color: '#f1f5f9', indicatorColor: '#3b82f6', description: 'Sodium bicarbonate (NaHCO₃)', category: 'Basic' },
  { id: 'magnesia', name: 'Milk of Magnesia', basePH: 10.5, color: '#f8fafc', indicatorColor: '#6366f1', description: 'Magnesium hydroxide antacid suspension', category: 'Basic' },
  { id: 'ammonia', name: 'Household Ammonia Cleaner', basePH: 11.5, color: '#e0e7ff', indicatorColor: '#8b5cf6', description: 'Aqueous ammonium hydroxide (NH₄OH)', category: 'Basic' },
  { id: 'bleach', name: 'Chlorine Bleach', basePH: 12.6, color: '#fef9c3', indicatorColor: '#a855f7', description: 'Sodium hypochlorite (NaOCl)', category: 'Basic' },
  { id: 'drain-cleaner', name: 'Lye Drain Opener', basePH: 13.8, color: '#fed7aa', indicatorColor: '#701a75', description: 'Concentrated sodium hydroxide (NaOH)', category: 'Basic' },
];

interface PHTesterLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const PHTesterLab: React.FC<PHTesterLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['ph-testing'];

  const [selectedLiquid, setSelectedLiquid] = useState<HouseholdLiquid>(LIQUIDS[0]); // Lemon juice
  const [probeSubmerged, setProbeSubmerged] = useState(true);
  const [litmusDipped, setLitmusDipped] = useState(false);
  const [acidDrops, setAcidDrops] = useState(0); // Drops of 0.1M HCl
  const [baseDrops, setBaseDrops] = useState(0); // Drops of 0.1M NaOH

  // Compute live adjusted pH with buffering titration effect
  const netDrops = baseDrops - acidDrops;
  const currentPH = Math.max(0.5, Math.min(14.0, selectedLiquid.basePH + netDrops * 0.18));
  const hydroniumConcentration = Math.pow(10, -currentPH);
  const hydroxideConcentration = Math.pow(10, -(14 - currentPH));

  const resetSimulation = () => {
    setSelectedLiquid(LIQUIDS[0]);
    setProbeSubmerged(true);
    setLitmusDipped(false);
    setAcidDrops(0);
    setBaseDrops(0);
  };

  const getLitmusCurrentColor = () => {
    if (!litmusDipped) return '#cbd5e1'; // undipped off-white paper
    if (currentPH <= 3) return '#ef4444'; // Red
    if (currentPH <= 5) return '#f97316'; // Orange
    if (currentPH <= 6.5) return '#eab308'; // Yellow
    if (currentPH <= 7.5) return '#10b981'; // Green (Neutral)
    if (currentPH <= 9) return '#06b6d4'; // Cyan
    if (currentPH <= 11) return '#3b82f6'; // Blue
    if (currentPH <= 12.5) return '#8b5cf6'; // Violet
    return '#581c87'; // Deep Purple
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetSimulation}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Liquid Tested': selectedLiquid.name,
        'Base pH': selectedLiquid.basePH,
        'Measured pH': currentPH.toFixed(2),
        '[H3O+] Concentration': `${hydroniumConcentration.toExponential(2)} M`,
        '[OH-] Concentration': `${hydroxideConcentration.toExponential(2)} M`,
        'HCl Added': `${acidDrops} drops`,
        'NaOH Added': `${baseDrops} drops`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Liquids Selector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Household Liquid Samples</span>
              <Droplet className="w-4 h-4 text-cyan-400" />
            </h2>

            <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
              {LIQUIDS.map((liq) => {
                const isSelected = selectedLiquid.id === liq.id;
                return (
                  <button
                    key={liq.id}
                    onClick={() => {
                      setSelectedLiquid(liq);
                      setAcidDrops(0);
                      setBaseDrops(0);
                      setLitmusDipped(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-200">{liq.name}</div>
                      <div className="text-[11px] text-slate-400">{liq.description}</div>
                    </div>
                    <span
                      className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                        liq.category === 'Acidic'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                          : liq.category === 'Basic'
                          ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/50'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                      }`}
                    >
                      pH {liq.basePH}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Micro-Titration Titrant Droppers */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Titration Adjustment (0.1M Acid / Base)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAcidDrops((p) => p + 1)}
                className="p-2.5 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/60 rounded-lg text-xs text-rose-200 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add 1 Drop HCl</span>
              </button>

              <button
                onClick={() => setBaseDrops((p) => p + 1)}
                className="p-2.5 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/60 rounded-lg text-xs text-indigo-200 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add 1 Drop NaOH</span>
              </button>
            </div>

            {(acidDrops > 0 || baseDrops > 0) && (
              <div className="mt-2.5 flex justify-between items-center text-xs font-mono text-slate-400">
                <span>Added: {acidDrops} HCl · {baseDrops} NaOH</span>
                <button
                  onClick={() => {
                    setAcidDrops(0);
                    setBaseDrops(0);
                  }}
                  className="text-cyan-400 hover:underline"
                >
                  Reset Drops
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center Visual Testing Stage */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px]">
            {/* Beaker with Sample */}
            <div className="relative w-64 h-72 flex flex-col items-center justify-end">
              {/* Digital Electrode Probe hanging down */}
              <div
                className={`absolute top-0 z-10 flex flex-col items-center transition-all duration-500 ${
                  probeSubmerged ? 'translate-y-20' : '-translate-y-4'
                }`}
              >
                <div className="w-2.5 h-32 bg-slate-700 rounded-t border-x border-slate-600 shadow" />
                <div className="w-4 h-8 bg-cyan-950 border border-cyan-500 rounded-b shadow flex items-center justify-center">
                  <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-pulse" />
                </div>
                <span className="text-[9px] font-mono text-cyan-400 bg-slate-900/90 px-1 rounded mt-1 border border-slate-700">
                  pH Electrode
                </span>
              </div>

              {/* Litmus Strip Dipper */}
              <div
                onClick={() => setLitmusDipped(true)}
                className={`absolute top-2 right-4 z-10 w-4 h-44 rounded border border-slate-500 cursor-pointer shadow-lg transition-transform hover:scale-105 ${
                  litmusDipped ? 'translate-y-24' : 'translate-y-6'
                }`}
                style={{
                  backgroundColor: getLitmusCurrentColor(),
                }}
                title="Click to dip universal litmus paper strip into sample"
              >
                <span className="text-[8px] font-mono text-slate-900 block rotate-90 mt-4 font-bold select-none">
                  LITMUS
                </span>
              </div>

              {/* Glass Beaker */}
              <div className="w-52 h-56 border-b-4 border-l-4 border-r-4 border-slate-400/40 rounded-b-3xl bg-slate-950/40 backdrop-blur-sm overflow-hidden flex flex-col justify-end shadow-inner relative">
                {/* Liquid Volume */}
                <div
                  className="w-full transition-all duration-700 ease-out"
                  style={{
                    height: '65%',
                    backgroundColor: selectedLiquid.color,
                    opacity: 0.85,
                  }}
                />
              </div>

              {/* Lab Bench Mat */}
              <div className="w-60 h-4 bg-slate-800 rounded shadow border-t border-slate-700 mt-1" />
            </div>

            {/* Probe and Litmus Toggle Controls */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setProbeSubmerged(!probeSubmerged)}
                className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
              >
                {probeSubmerged ? '▲ Lift Glass Electrode' : '▼ Submerge Glass Electrode'}
              </button>
              <button
                onClick={() => setLitmusDipped(!litmusDipped)}
                className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
              >
                {litmusDipped ? 'Dry Litmus Strip' : 'Dip Litmus Paper'}
              </button>
            </div>
          </div>

          {/* Universal pH Color Spectrum Scale */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
              Universal Indicator Color Spectrum (0 → 14)
            </span>
            <div className="h-6 w-full rounded flex overflow-hidden border border-slate-700">
              <div className="flex-1 bg-red-600 flex items-center justify-center text-[9px] font-mono text-white">0-2</div>
              <div className="flex-1 bg-orange-500 flex items-center justify-center text-[9px] font-mono text-white">3-4</div>
              <div className="flex-1 bg-yellow-400 flex items-center justify-center text-[9px] font-mono text-slate-900">5-6</div>
              <div className="flex-1 bg-emerald-500 flex items-center justify-center text-[9px] font-mono text-white">7</div>
              <div className="flex-1 bg-cyan-500 flex items-center justify-center text-[9px] font-mono text-slate-900">8-9</div>
              <div className="flex-1 bg-blue-600 flex items-center justify-center text-[9px] font-mono text-white">10-11</div>
              <div className="flex-1 bg-purple-600 flex items-center justify-center text-[9px] font-mono text-white">12</div>
              <div className="flex-1 bg-fuchsia-900 flex items-center justify-center text-[9px] font-mono text-white">14</div>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Digital pH Readout"
            value={probeSubmerged ? currentPH.toFixed(2) : '--.--'}
            unit="pH"
            subValue={
              currentPH < 6.5
                ? 'Strong Acidic Environment'
                : currentPH > 7.5
                ? 'Alkaline Base'
                : 'Neutral Aqueous'
            }
            tone={currentPH < 6.5 ? 'rose' : currentPH > 7.5 ? 'cyan' : 'emerald'}
          />

          <MetricCard
            label="Hydronium [H₃O⁺]"
            value={probeSubmerged ? hydroniumConcentration.toExponential(2) : '--'}
            unit="mol/L"
            subValue="Hydrogen Ion Activity"
            tone="default"
          />

          <MetricCard
            label="Hydroxide [OH⁻]"
            value={probeSubmerged ? hydroxideConcentration.toExponential(2) : '--'}
            unit="mol/L"
            subValue="Base Counter-Ion"
            tone="default"
          />

          {/* Scientific Info Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Logarithmic Scale Mechanics
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              Every single 1.0 unit drop in pH represents a <strong className="text-white">10× increase</strong> in hydrogen ions.
            </p>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] text-cyan-300">
              pH = -log₁₀[H⁺]<br />
              pOH = 14.00 - pH
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
