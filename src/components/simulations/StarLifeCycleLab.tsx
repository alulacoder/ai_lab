import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Sparkles, Sun, Flame } from 'lucide-react';

interface StarLifeCycleLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const StarLifeCycleLab: React.FC<StarLifeCycleLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['star-lifecycle'];

  const [initialMassSolar, setInitialMassSolar] = useState(1.0); // in M_sun (0.1 to 35)

  // Lifespan roughly ~ 10^10 * (M_sun / M)^2.5 years
  const lifespanYears = 1e10 * Math.pow(1 / initialMassSolar, 2.5);

  let spectralClass = 'G2V (Yellow Dwarf)';
  let starColor = '#facc15';
  let finalFate = 'Carbon-Oxygen White Dwarf + Planetary Nebula';
  let coreLayers = ['Hydrogen Shell', 'Helium Core'];

  if (initialMassSolar < 0.4) {
    spectralClass = 'M-Dwarf (Red Dwarf)';
    starColor = '#ef4444';
    finalFate = 'Slow convective cooling to Blue/White Dwarf';
    coreLayers = ['Hydrogen-Helium Convection'];
  } else if (initialMassSolar <= 2.0) {
    spectralClass = 'G-Type Main Sequence (Solar Analogue)';
    starColor = '#facc15';
    finalFate = 'Planetary Nebula + White Dwarf (Electron Degeneracy)';
    coreLayers = ['H-Burning Shell', 'He-Burning Shell', 'C-O Core'];
  } else if (initialMassSolar <= 8.0) {
    spectralClass = 'A/B-Type Intermediate Star';
    starColor = '#38bdf8';
    finalFate = 'Thermal Pulse AGB + Massive White Dwarf';
    coreLayers = ['H-Shell', 'He-Shell', 'C-O-Ne Core'];
  } else if (initialMassSolar <= 20.0) {
    spectralClass = 'B-Type Blue Giant';
    starColor = '#60a5fa';
    finalFate = 'Type II Core-Collapse Supernova ⟶ Neutron Star / Pulsar';
    coreLayers = ['H', 'He', 'Carbon', 'Neon', 'Oxygen', 'Silicon', 'Iron (Fe)'];
  } else {
    spectralClass = 'O-Type Massive Blue Supergiant';
    starColor = '#818cf8';
    finalFate = 'Pair-Instability Supernova / Hypernova ⟶ Stellar Black Hole';
    coreLayers = ['H', 'He', 'C', 'Ne', 'O', 'Si', 'Inert Iron Core ⟶ Collapse'];
  }

  const resetStar = () => {
    setInitialMassSolar(1.0);
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetStar}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Stellar Mass': `${initialMassSolar.toFixed(1)} M☉`,
        'Spectral Classification': spectralClass,
        'Main Sequence Lifespan': lifespanYears > 1e11 ? '> 100 Billion Years' : `${(lifespanYears / 1e9).toFixed(2)} Billion Years`,
        'Final Remnant Fate': finalFate,
        'Deepest Core Nuclear Fuel': coreLayers[coreLayers.length - 1],
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Controls Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Stellar Evolution Parameters</span>
              <Sun className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Stellar Mass Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Initial Stellar Mass (M / M☉):</span>
                <span className="text-amber-400 font-bold">{initialMassSolar.toFixed(1)} M☉</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="30.0"
                step="0.5"
                value={initialMassSolar}
                onChange={(e) => setInitialMassSolar(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span className="text-rose-400">0.1 M☉ (Red Dwarf)</span>
                <span className="text-yellow-400">1.0 M☉ (Sun)</span>
                <span className="text-purple-400">30 M☉ (Supernova/Black Hole)</span>
              </div>
            </div>

            {/* Quick Star Mass Presets */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-2">
                Famous Star Archetypes:
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <button
                  onClick={() => setInitialMassSolar(0.12)}
                  className="w-full text-left p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-rose-300 flex justify-between"
                >
                  <span>Proxima Centauri (0.12 M☉)</span>
                  <span className="text-slate-500">Red Dwarf</span>
                </button>
                <button
                  onClick={() => setInitialMassSolar(1.0)}
                  className="w-full text-left p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-amber-300 flex justify-between"
                >
                  <span>Our Sun (1.0 M☉)</span>
                  <span className="text-slate-500">White Dwarf</span>
                </button>
                <button
                  onClick={() => setInitialMassSolar(8.5)}
                  className="w-full text-left p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-cyan-300 flex justify-between"
                >
                  <span>Sirius A (2.1 M☉)</span>
                  <span className="text-slate-500">Planetary Nebula</span>
                </button>
                <button
                  onClick={() => setInitialMassSolar(18.0)}
                  className="w-full text-left p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-indigo-300 flex justify-between"
                >
                  <span>Betelgeuse / Rigel (18 M☉)</span>
                  <span className="text-rose-400 font-bold">Supernova ⟶ Pulsar</span>
                </button>
                <button
                  onClick={() => setInitialMassSolar(30.0)}
                  className="w-full text-left p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-purple-300 flex justify-between"
                >
                  <span>Eta Carinae (30 M☉)</span>
                  <span className="text-purple-400 font-bold">Black Hole</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Stellar Visualization Canvas */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              NUCLEAR FUSION CORE SHELL STRUCTURE
            </div>

            {/* Glowing Star and Concentric Core Shells */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Outer Glow Halo */}
              <div
                className="absolute w-52 h-52 rounded-full filter blur-xl opacity-40 transition-all duration-700"
                style={{ backgroundColor: starColor }}
              />

              {/* Main Stellar Photosphere Circle */}
              <div
                className="relative rounded-full flex items-center justify-center shadow-2xl transition-all duration-700"
                style={{
                  width: `${Math.min(220, 60 + initialMassSolar * 5)}px`,
                  height: `${Math.min(220, 60 + initialMassSolar * 5)}px`,
                  backgroundColor: starColor,
                  boxShadow: `0 0 35px ${starColor}`,
                }}
              >
                {/* Onion skin concentric core fusion layers if high mass */}
                {initialMassSolar >= 8.0 && (
                  <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-white/60 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center">
                      <span className="text-[8px] font-mono font-bold text-white">Fe</span>
                    </div>
                  </div>
                )}
                {initialMassSolar < 8.0 && initialMassSolar > 0.4 && (
                  <div className="w-12 h-12 rounded-full bg-amber-700/60 flex items-center justify-center">
                    <span className="text-[9px] font-mono font-bold text-white">He</span>
                  </div>
                )}
              </div>
            </div>

            {/* Terminal Fate Banner */}
            <div className="mt-3 w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center font-mono text-xs">
              <span className="text-slate-400">Ultimate Cosmic Destiny: </span>
              <span className="text-cyan-300 font-bold">{finalFate}</span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Spectral Class"
            value={spectralClass.split(' ')[0]}
            subValue={spectralClass}
            tone="cyan"
          />

          <MetricCard
            label="Estimated Lifespan"
            value={lifespanYears > 1e11 ? '> 100 Gyr' : `${(lifespanYears / 1e9).toFixed(2)} Gyr`}
            unit="Billion Yrs"
            subValue="Mass-Luminosity Scaling"
            tone="default"
          />

          <MetricCard
            label="Chandrasekhar Limit"
            value="1.44 M☉"
            subValue="Max White Dwarf Mass"
            tone="amber"
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Hydrostatic Equilibrium
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              Stars balance inward gravitational collapse with outward thermonuclear radiation pressure. Massive stars burn hot and die fast in supernovae!
            </p>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
