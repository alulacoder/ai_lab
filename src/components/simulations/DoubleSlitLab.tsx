import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Radio, Eye, EyeOff, Sliders } from 'lucide-react';

interface DoubleSlitLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const DoubleSlitLab: React.FC<DoubleSlitLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['double-slit'];

  const [wavelengthNm, setWavelengthNm] = useState(532); // 532nm Green laser
  const [slitSeparationMm, setSlitSeparationMm] = useState(0.25); // 0.25 mm
  const [distanceToScreenM, setDistanceToScreenM] = useState(1.5); // 1.5 meters
  const [observerOn, setObserverOn] = useState(false); // Quantum measurement which-way detector

  // Physics calculation: fringe separation Delta y = (lambda * L) / d
  const lambdaM = wavelengthNm * 1e-9;
  const dM = slitSeparationMm * 1e-3;
  const LM = distanceToScreenM;

  const fringeSpacingMm = ((lambdaM * LM) / dM) * 1e3; // in millimeters

  const resetSimulation = () => {
    setWavelengthNm(532);
    setSlitSeparationMm(0.25);
    setDistanceToScreenM(1.5);
    setObserverOn(false);
  };

  // Convert wavelength to RGB color
  const getLaserColor = (wl: number) => {
    if (wl < 450) return '#8b5cf6'; // violet
    if (wl < 495) return '#3b82f6'; // blue
    if (wl < 570) return '#22c55e'; // green
    if (wl < 590) return '#eab308'; // yellow
    if (wl < 620) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const laserColor = getLaserColor(wavelengthNm);

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetSimulation}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Laser Wavelength': `${wavelengthNm} nm`,
        'Slit Separation (d)': `${slitSeparationMm} mm`,
        'Distance to Screen (L)': `${distanceToScreenM.toFixed(1)} m`,
        'Fringe Spacing (Δy)': observerOn ? 'Collapsed (No Fringes)' : `${fringeSpacingMm.toFixed(2)} mm`,
        'Quantum Detector': observerOn ? 'ACTIVE (Wavefunction Collapsed)' : 'OFF (Pure Wave State)',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Control Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Quantum Interferometer Controls</span>
              <Sliders className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Quantum Observer Toggle */}
            <div className="mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-medium text-slate-200 block">
                  Which-Way Detector
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {observerOn ? 'Observing Particle Path' : 'Unobserved Superposition'}
                </span>
              </div>
              <button
                onClick={() => setObserverOn(!observerOn)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  observerOn
                    ? 'bg-amber-950/70 border border-amber-500 text-amber-300'
                    : 'bg-cyan-950/70 border border-cyan-500 text-cyan-300'
                }`}
              >
                {observerOn ? (
                  <>
                    <Eye className="w-4 h-4 text-amber-400" /> OBSERVER ON
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 text-cyan-400" /> UNMEASURED
                  </>
                )}
              </button>
            </div>

            {/* Wavelength Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Laser Wavelength (λ):</span>
                <span className="font-bold" style={{ color: laserColor }}>
                  {wavelengthNm} nm
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="700"
                step="5"
                value={wavelengthNm}
                onChange={(e) => setWavelengthNm(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span className="text-purple-400">400nm (Violet)</span>
                <span className="text-emerald-400">532nm (Green)</span>
                <span className="text-rose-400">700nm (Red)</span>
              </div>
            </div>

            {/* Slit Separation d */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Slit Separation (d):</span>
                <span className="text-cyan-400 font-bold">{slitSeparationMm.toFixed(2)} mm</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.60"
                step="0.02"
                value={slitSeparationMm}
                onChange={(e) => setSlitSeparationMm(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Distance to Screen L */}
            <div className="mb-2">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Distance to Screen (L):</span>
                <span className="text-cyan-400 font-bold">{distanceToScreenM.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="3.0"
                step="0.1"
                value={distanceToScreenM}
                onChange={(e) => setDistanceToScreenM(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Center Wave vs Screen Visualization */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              {observerOn ? 'WAVEFUNCTION COLLAPSED (2 CLASSICAL BANDS)' : 'COHERENT WAVE INTERFERENCE'}
            </div>

            {/* SVG Wave Simulator */}
            <svg className="w-full max-w-[420px] aspect-[4/3] bg-slate-950/90 rounded-xl border border-slate-800 p-2" viewBox="0 0 400 300">
              {/* Laser Source on Left */}
              <rect x="10" y="140" width="25" height="20" rx="3" fill="#334155" stroke="#475569" />
              <line x1="35" y1="150" x2="80" y2="150" stroke={laserColor} strokeWidth="3" className="filter drop-shadow-[0_0_6px_currentColor]" />

              {/* Double Slit Barrier at x=80 */}
              <line x1="80" y1="30" x2="80" y2="135" stroke="#94a3b8" strokeWidth="6" />
              <line x1="80" y1="145" x2="80" y2="155" stroke="#94a3b8" strokeWidth="6" />
              <line x1="80" y1="165" x2="80" y2="270" stroke="#94a3b8" strokeWidth="6" />

              {/* Slit Markers */}
              <circle cx="80" cy="140" r="2" fill={laserColor} />
              <circle cx="80" cy="160" r="2" fill={laserColor} />

              {/* Propagating Wavefronts or Classical Trajectories */}
              {!observerOn ? (
                // Wave Interference Rings
                [20, 45, 75, 110, 150, 195].map((r, i) => (
                  <g key={i} opacity={0.6 - i * 0.08}>
                    <path
                      d={`M 80 ${140 - r} A ${r} ${r} 0 0 1 80 ${140 + r}`}
                      fill="none"
                      stroke={laserColor}
                      strokeWidth="1.5"
                    />
                    <path
                      d={`M 80 ${160 - r} A ${r} ${r} 0 0 1 80 ${160 + r}`}
                      fill="none"
                      stroke={laserColor}
                      strokeWidth="1.5"
                    />
                  </g>
                ))
              ) : (
                // Collapsed classical photon streams
                <>
                  <line x1="80" y1="140" x2="350" y2="120" stroke={laserColor} strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
                  <line x1="80" y1="140" x2="350" y2="140" stroke={laserColor} strokeWidth="2" strokeDasharray="3 3" opacity="0.9" />
                  <line x1="80" y1="160" x2="350" y2="160" stroke={laserColor} strokeWidth="2" strokeDasharray="3 3" opacity="0.9" />
                  <line x1="80" y1="160" x2="350" y2="180" stroke={laserColor} strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
                </>
              )}

              {/* Detector Screen at x=350 */}
              <rect x="350" y="30" width="10" height="240" fill="#0f172a" stroke="#475569" rx="2" />

              {/* Interference Bright Bands or 2 Slit Gaussian Bands */}
              {!observerOn ? (
                // Multiple interference fringe bands
                Array.from({ length: 9 }).map((_, idx) => {
                  const m = idx - 4; // order m = -4 .. +4
                  const yPos = 150 + m * (fringeSpacingMm * 4.2);
                  if (yPos < 35 || yPos > 265) return null;
                  const intensity = Math.pow(Math.cos((m * Math.PI) / 5), 2);

                  return (
                    <line
                      key={idx}
                      x1="352"
                      y1={yPos}
                      x2="358"
                      y2={yPos}
                      stroke={laserColor}
                      strokeWidth={Math.max(2, 6 * intensity)}
                      opacity={Math.max(0.2, intensity)}
                      className="filter drop-shadow-[0_0_6px_currentColor]"
                    />
                  );
                })
              ) : (
                // Two classical slit bands
                <>
                  <rect x="352" y="125" width="6" height="25" fill={laserColor} opacity="0.9" className="filter drop-shadow-[0_0_8px_currentColor]" />
                  <rect x="352" y="150" width="6" height="25" fill={laserColor} opacity="0.9" className="filter drop-shadow-[0_0_8px_currentColor]" />
                </>
              )}

              {/* Screen Label */}
              <text x="355" y="285" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                SCREEN
              </text>
            </svg>

            {/* Fringe Equation Banner */}
            <div className="mt-3 w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center font-mono text-xs">
              <span className="text-slate-500 mr-2">Fringe Spacing Formula:</span>
              <span className="text-cyan-300 font-bold">
                Δy = (λ · L) / d = ({wavelengthNm}nm · {distanceToScreenM.toFixed(1)}m) / {slitSeparationMm}mm = {fringeSpacingMm.toFixed(2)} mm
              </span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Fringe Spacing (Δy)"
            value={observerOn ? 'N/A' : fringeSpacingMm.toFixed(2)}
            unit={observerOn ? undefined : 'mm'}
            subValue={observerOn ? 'Quantum State Collapsed' : 'Band Separation on Screen'}
            tone={observerOn ? 'amber' : 'cyan'}
          />

          <MetricCard
            label="Wave Phase Coherence"
            value={observerOn ? 'Decoherent' : 'Constructive / Destructive'}
            subValue={observerOn ? 'Classical Particle Path' : 'Spatial Superposition'}
            tone={observerOn ? 'rose' : 'emerald'}
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Wave-Particle Duality
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              In 1801, Thomas Young proved light is a wave. In quantum mechanics, photons travel as probability waves through both slits simultaneously, interfering with themselves.
            </p>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] text-cyan-300">
              d · sin(θ) = m · λ<br />
              Measurement collapses the wave packet into localized particle positions.
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
