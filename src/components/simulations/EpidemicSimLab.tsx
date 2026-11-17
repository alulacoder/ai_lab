import React, { useState, useEffect } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Activity, ShieldCheck, Play, Pause, RotateCcw } from 'lucide-react';

interface Agent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  state: 'S' | 'I' | 'R';
  daysInfected: number;
}

interface EpidemicSimLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const EpidemicSimLab: React.FC<EpidemicSimLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['epidemic-sim'];

  const [r0, setR0] = useState(2.8); // R0
  const [vaccineCoverage, setVaccineCoverage] = useState(30); // 30%
  const [maskMandate, setMaskMandate] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [day, setDay] = useState(0);

  // Time-series curve data for plotting
  const [historyCurve, setHistoryCurve] = useState<Array<{ day: number; S: number; I: number; R: number }>>([
    { day: 0, S: 210, I: 5, R: 85 },
  ]);

  const totalPop = 300;
  const icuCapacity = 45; // 15% of 300

  // Current active stats
  const currentStat = historyCurve[historyCurve.length - 1] || { day: 0, S: 210, I: 5, R: 85 };

  // SIR Differential step calculation
  useEffect(() => {
    if (!isRunning || currentStat.I === 0) return;

    const timer = setInterval(() => {
      setHistoryCurve((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.I === 0) return prev;

        const effectiveR0 = r0 * (maskMandate ? 0.6 : 1.0);
        const gamma = 0.1; // Recovery rate ~10 days
        const beta = (effectiveR0 * gamma) / totalPop;

        const newInfections = Math.min(last.S, Math.round(beta * last.S * last.I));
        const newRecoveries = Math.min(last.I, Math.round(gamma * last.I));

        const nextS = Math.max(0, last.S - newInfections);
        const nextI = Math.max(0, last.I + newInfections - newRecoveries);
        const nextR = Math.min(totalPop, last.R + newRecoveries);

        setDay((d) => d + 1);
        return [...prev.slice(-35), { day: last.day + 1, S: nextS, I: nextI, R: nextR }];
      });
    }, 450);

    return () => clearInterval(timer);
  }, [isRunning, r0, maskMandate, currentStat.I]);

  const resetEpidemic = () => {
    const vaccinated = Math.round((totalPop * vaccineCoverage) / 100);
    const initialInfected = 5;
    const initialSusceptible = totalPop - vaccinated - initialInfected;
    setDay(0);
    setIsRunning(true);
    setHistoryCurve([{ day: 0, S: initialSusceptible, I: initialInfected, R: vaccinated }]);
  };

  const herdImmunityThreshold = Math.max(0, Math.round((1 - 1 / r0) * 100));

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetEpidemic}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Basic Reproduction Number (R0)': r0.toFixed(1),
        'Vaccine Coverage': `${vaccineCoverage}%`,
        'Mask Mandate': maskMandate ? 'ENFORCED (-40% transmission)' : 'OFF',
        'Active Infections': currentStat.I,
        'Susceptible Population': currentStat.S,
        'Recovered / Immune': currentStat.R,
        'Simulation Day': day,
        'Herd Immunity Threshold': `${herdImmunityThreshold}%`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Public Health Controls Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Epidemiological Parameters</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* R0 Basic Reproduction Number */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Basic Reproduction Number (R₀):</span>
                <span className="text-rose-400 font-bold">{r0.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.2"
                max="5.0"
                step="0.1"
                value={r0}
                onChange={(e) => setR0(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>1.2 (Seasonal Flu)</span>
                <span>2.8 (SARS-CoV-2)</span>
                <span>5.0 (Measles/Polio)</span>
              </div>
            </div>

            {/* Vaccine Coverage % */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Initial Vaccine Coverage:</span>
                <span className="text-emerald-400 font-bold">{vaccineCoverage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={vaccineCoverage}
                onChange={(e) => setVaccineCoverage(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Mask Mandate Toggle */}
            <div className="mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-medium text-slate-200 block">
                  Public Masking & Distancing
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Reduces transmission probability β by 40%
                </span>
              </div>
              <button
                onClick={() => setMaskMandate(!maskMandate)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  maskMandate
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}
              >
                {maskMandate ? 'ACTIVE' : 'INACTIVE'}
              </button>
            </div>

            {/* Play / Pause / Reset Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Resume
                  </>
                )}
              </button>
              <button
                onClick={resetEpidemic}
                className="py-2 px-3 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-200 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restart Outbreak
              </button>
            </div>
          </div>
        </div>

        {/* Center Live Epidemic Curve Graph */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              SIR EPIDEMIOLOGICAL CURVE · DAY {day}
            </div>

            {/* SVG Real-time S-I-R Graph */}
            <svg className="w-full max-w-[420px] aspect-[4/3] bg-slate-950/90 rounded-xl border border-slate-800 p-2" viewBox="0 0 400 240">
              {/* ICU Hospital Capacity Dashed Line */}
              <line x1="30" y1="160" x2="380" y2="160" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
              <text x="375" y="155" fill="#f43f5e" fontSize="9" textAnchor="end" fontFamily="monospace">
                ICU CAPACITY THRESHOLD ({icuCapacity} beds)
              </text>

              {/* Grid Lines */}
              <line x1="30" y1="210" x2="380" y2="210" stroke="#334155" strokeWidth="1" />
              <line x1="30" y1="30" x2="30" y2="210" stroke="#334155" strokeWidth="1" />

              {/* S, I, R Curves */}
              {historyCurve.length > 1 && (
                <>
                  {/* Susceptible Curve (Cyan) */}
                  <polyline
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                    points={historyCurve
                      .map((pt, idx) => {
                        const x = 35 + (idx / Math.max(1, historyCurve.length - 1)) * 340;
                        const y = 210 - (pt.S / totalPop) * 170;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Infected Active Curve (Red) */}
                  <polyline
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    points={historyCurve
                      .map((pt, idx) => {
                        const x = 35 + (idx / Math.max(1, historyCurve.length - 1)) * 340;
                        const y = 210 - (pt.I / totalPop) * 170;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    className="filter drop-shadow-[0_0_8px_#ef4444]"
                  />

                  {/* Recovered / Immune Curve (Emerald) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    points={historyCurve
                      .map((pt, idx) => {
                        const x = 35 + (idx / Math.max(1, historyCurve.length - 1)) * 340;
                        const y = 210 - (pt.R / totalPop) * 170;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </>
              )}

              {/* Legend in corner */}
              <g transform="translate(45, 45)">
                <circle cx="5" cy="5" r="4" fill="#06b6d4" />
                <text x="14" y="8" fill="#cbd5e1" fontSize="9" fontFamily="monospace">Susceptible ({currentStat.S})</text>
                <circle cx="5" cy="20" r="4" fill="#ef4444" />
                <text x="14" y="23" fill="#cbd5e1" fontSize="9" fontFamily="monospace">Infected ({currentStat.I})</text>
                <circle cx="5" cy="35" r="4" fill="#10b981" />
                <text x="14" y="38" fill="#cbd5e1" fontSize="9" fontFamily="monospace">Immune/Recovered ({currentStat.R})</text>
              </g>
            </svg>

            {/* Differential SIR Equation */}
            <div className="mt-2 w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-center font-mono text-xs">
              <span className="text-cyan-300 font-bold">
                dS/dt = -β(SI/N) · dI/dt = β(SI/N) - γI · dR/dt = γI
              </span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Active Infected (I)"
            value={currentStat.I}
            subValue={
              currentStat.I > icuCapacity
                ? 'CRITICAL: ICU OVERFLOW!'
                : 'Healthcare Capacity Stable'
            }
            tone={currentStat.I > icuCapacity ? 'rose' : currentStat.I > 0 ? 'amber' : 'emerald'}
          />

          <MetricCard
            label="Herd Immunity Threshold"
            value={`${herdImmunityThreshold}%`}
            subValue={`H = 1 - (1 / R₀) = ${herdImmunityThreshold}%`}
            tone="cyan"
          />

          <MetricCard
            label="Total Immune Protected"
            value={`${Math.round((currentStat.R / totalPop) * 100)}%`}
            subValue={`${currentStat.R} Individuals`}
            tone={Math.round((currentStat.R / totalPop) * 100) >= herdImmunityThreshold ? 'emerald' : 'default'}
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Flattening the Epidemic Curve
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              Non-pharmaceutical interventions (masks, distancing) lower effective Rₜ, spreading infections over a longer duration and preventing catastrophic hospital ICU collapse.
            </p>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
