import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Plus, Minus, Atom } from 'lucide-react';

const ELEMENT_SYMBOLS = [
  '', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
  'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'
];

const ELEMENT_NAMES = [
  '', 'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen',
  'Oxygen', 'Fluorine', 'Neon', 'Sodium', 'Magnesium', 'Aluminum', 'Silicon',
  'Phosphorus', 'Sulfur', 'Chlorine', 'Argon', 'Potassium', 'Calcium',
  'Scandium', 'Titanium', 'Vanadium', 'Chromium', 'Manganese', 'Iron', 'Cobalt',
  'Nickel', 'Copper', 'Zinc'
];

interface AtomBuilderLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const AtomBuilderLab: React.FC<AtomBuilderLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['atom-builder'];

  const [protons, setProtons] = useState(6); // Carbon
  const [neutrons, setNeutrons] = useState(6); // C-12
  const [electrons, setElectrons] = useState(6);

  const massNumber = protons + neutrons;
  const netCharge = protons - electrons;
  const elementSymbol = ELEMENT_SYMBOLS[protons] || `Z=${protons}`;
  const elementName = ELEMENT_NAMES[protons] || `Element ${protons}`;

  // Evaluate nuclear stability via N/Z ratio
  const ratio = protons > 0 ? neutrons / protons : 0;
  let stabilityStatus = 'Stable Nuclide';
  let stabilityTone: 'emerald' | 'amber' | 'rose' = 'emerald';
  let decayMode = 'None (Infinite Half-Life)';

  if (protons === 0) {
    stabilityStatus = 'Isolated Neutron Cloud';
    stabilityTone = 'rose';
    decayMode = 'Free Neutron Decay (t½ ≈ 14 min)';
  } else if (protons === 1 && neutrons === 0) {
    stabilityStatus = 'Protium (Stable)';
    stabilityTone = 'emerald';
    decayMode = 'None';
  } else if (protons === 1 && neutrons === 2) {
    stabilityStatus = 'Tritium (Radioactive)';
    stabilityTone = 'amber';
    decayMode = 'Beta Minus (β⁻) Decay';
  } else if (ratio < 0.9 && protons > 2) {
    stabilityStatus = 'Proton-Rich (Unstable)';
    stabilityTone = 'rose';
    decayMode = 'Positron (β⁺) / Electron Capture';
  } else if (ratio > 1.5 && protons > 2) {
    stabilityStatus = 'Neutron-Rich (Unstable)';
    stabilityTone = 'rose';
    decayMode = 'Beta Minus (β⁻) Decay';
  } else {
    stabilityStatus = 'Stable Valley of Stability';
    stabilityTone = 'emerald';
    decayMode = 'Stable ground state';
  }

  const resetAtom = () => {
    setProtons(6);
    setNeutrons(6);
    setElectrons(6);
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetAtom}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Nuclide': `${elementName}-${massNumber} (${elementSymbol})`,
        'Protons (Z)': protons,
        'Neutrons (N)': neutrons,
        'Electrons': electrons,
        'Mass Number (A)': massNumber,
        'Net Charge': netCharge > 0 ? `+${netCharge}` : `${netCharge}`,
        'Stability': stabilityStatus,
        'Decay Mode': decayMode,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Particle Injector Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Subatomic Particle Injector</span>
              <Atom className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Protons */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-semibold text-rose-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  Protons (+1e charge)
                </span>
                <span className="text-base font-mono font-bold text-white">{protons}</span>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={protons <= 1}
                  onClick={() => setProtons((p) => Math.max(1, p - 1))}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-slate-200 text-xs font-mono flex items-center justify-center gap-1"
                >
                  <Minus className="w-3.5 h-3.5" /> Remove
                </button>
                <button
                  disabled={protons >= 20}
                  onClick={() => setProtons((p) => Math.min(20, p + 1))}
                  className="flex-1 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 rounded text-rose-200 text-xs font-mono flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Inject Proton
                </button>
              </div>
            </div>

            {/* Neutrons */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                  Neutrons (0 charge)
                </span>
                <span className="text-base font-mono font-bold text-white">{neutrons}</span>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={neutrons <= 0}
                  onClick={() => setNeutrons((n) => Math.max(0, n - 1))}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-slate-200 text-xs font-mono flex items-center justify-center gap-1"
                >
                  <Minus className="w-3.5 h-3.5" /> Remove
                </button>
                <button
                  disabled={neutrons >= 26}
                  onClick={() => setNeutrons((n) => Math.min(26, n + 1))}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 text-xs font-mono flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Inject Neutron
                </button>
              </div>
            </div>

            {/* Electrons */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-semibold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                  Electrons (-1e charge)
                </span>
                <span className="text-base font-mono font-bold text-white">{electrons}</span>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={electrons <= 0}
                  onClick={() => setElectrons((e) => Math.max(0, e - 1))}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-slate-200 text-xs font-mono flex items-center justify-center gap-1"
                >
                  <Minus className="w-3.5 h-3.5" /> Ionize (Remove)
                </button>
                <button
                  disabled={electrons >= 20}
                  onClick={() => setElectrons((e) => Math.min(20, e + 1))}
                  className="flex-1 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded text-cyan-200 text-xs font-mono flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Electron
                </button>
              </div>
            </div>

            {/* Isotope Quick Select */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
                Presets (Famous Isotopes)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => { setProtons(1); setNeutrons(0); setElectrons(1); }}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-300 text-center"
                >
                  ¹H Protium
                </button>
                <button
                  onClick={() => { setProtons(1); setNeutrons(1); setElectrons(1); }}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-300 text-center"
                >
                  ²H Deuterium
                </button>
                <button
                  onClick={() => { setProtons(6); setNeutrons(8); setElectrons(6); }}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-amber-300 text-center"
                >
                  ¹⁴C Carbon-14
                </button>
                <button
                  onClick={() => { setProtons(8); setNeutrons(8); setElectrons(8); }}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-300 text-center"
                >
                  ¹⁶O Oxygen-16
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Quantum Potential Well Visualization */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            {/* Standard Isotope Symbol Box */}
            <div className="absolute top-4 left-4 bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg flex items-center font-mono">
              <div className="flex flex-col text-right text-xs mr-1 text-slate-400">
                <span>{massNumber}</span>
                <span>{protons}</span>
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">{elementSymbol}</span>
              {netCharge !== 0 && (
                <span className="text-xs font-bold text-cyan-400 self-start ml-1">
                  {netCharge > 0 ? `+${netCharge}` : `${netCharge}`}
                </span>
              )}
            </div>

            {/* Orbitals & Nucleus Canvas */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              {/* Shell 1 Ring */}
              <div className="absolute w-28 h-28 rounded-full border border-dashed border-cyan-800/40 pointer-events-none" />
              {/* Shell 2 Ring */}
              {electrons > 2 && (
                <div className="absolute w-48 h-48 rounded-full border border-dashed border-cyan-700/30 pointer-events-none" />
              )}
              {/* Shell 3 Ring */}
              {electrons > 10 && (
                <div className="absolute w-64 h-64 rounded-full border border-dashed border-cyan-600/20 pointer-events-none" />
              )}

              {/* Nucleus Clustered Sphere */}
              <div className="relative w-16 h-16 rounded-full bg-slate-950/60 border border-slate-700/50 flex flex-wrap items-center justify-center p-1 overflow-hidden z-10 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                {Array.from({ length: Math.min(protons + neutrons, 36) }).map((_, i) => {
                  const isProton = i < protons;
                  return (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full -m-0.5 shadow-sm ${
                        isProton ? 'bg-rose-500' : 'bg-slate-400'
                      }`}
                      title={isProton ? 'Proton' : 'Neutron'}
                    />
                  );
                })}
              </div>

              {/* Orbiting Electrons in Quantized Shells */}
              {Array.from({ length: electrons }).map((_, eIdx) => {
                let shellRadius = 56;
                let shellCapacity = 2;
                let indexInShell = eIdx;

                if (eIdx >= 2 && eIdx < 10) {
                  shellRadius = 96;
                  shellCapacity = 8;
                  indexInShell = eIdx - 2;
                } else if (eIdx >= 10) {
                  shellRadius = 128;
                  shellCapacity = 8;
                  indexInShell = eIdx - 10;
                }

                const angle = (indexInShell / shellCapacity) * 2 * Math.PI;
                const x = shellRadius * Math.cos(angle);
                const y = shellRadius * Math.sin(angle);

                return (
                  <div
                    key={eIdx}
                    className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] transition-all"
                    style={{
                      left: `calc(50% + ${x}px - 4px)`,
                      top: `calc(50% + ${y}px - 4px)`,
                    }}
                  />
                );
              })}
            </div>

            <div className="text-center font-mono mt-3">
              <span className="text-sm font-bold text-white block">{elementName}</span>
              <span className="text-xs text-slate-400">
                {netCharge === 0 ? 'Neutral Atom' : netCharge > 0 ? `Cation (+${netCharge})` : `Anion (${netCharge})`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Nuclear Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Mass Number (A = Z + N)"
            value={massNumber}
            unit="u"
            subValue={`${protons} Protons + ${neutrons} Neutrons`}
            tone="default"
          />

          <MetricCard
            label="Net Ionic Charge"
            value={netCharge === 0 ? '0' : netCharge > 0 ? `+${netCharge}` : `${netCharge}`}
            unit="e"
            subValue={netCharge === 0 ? 'Electrical Neutrality' : 'Ionized State'}
            tone={netCharge === 0 ? 'emerald' : 'cyan'}
          />

          <MetricCard
            label="Nuclear Stability Status"
            value={stabilityStatus}
            subValue={decayMode}
            tone={stabilityTone}
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Strong Nuclear Force & Coulomb Repulsion
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              Protons mutually repel each other through electrostatic forces. Neutrons provide attractive residual strong force without adding repulsion.
            </p>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] text-cyan-300">
              N/Z Ratio: {ratio.toFixed(2)}<br />
              Stable Zone: ~1.0 (light) to ~1.5 (heavy)
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
