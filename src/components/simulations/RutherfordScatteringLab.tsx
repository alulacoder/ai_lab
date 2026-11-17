import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Target, Play, RotateCcw } from 'lucide-react';

interface RutherfordScatteringLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const RutherfordScatteringLab: React.FC<RutherfordScatteringLabProps> = ({
  onAskAi,
  onLogObservation,
}) => {
  const experiment = EXPERIMENT_DETAILS['rutherford-scattering'];

  const [alphaEnergyMev, setAlphaEnergyMev] = useState(5.5); // 5.5 MeV radium alpha
  const [impactParameterFm, setImpactParameterFm] = useState(25); // femtometers (10^-15 m)
  const [targetElement, setTargetElement] = useState<'Au' | 'Ag' | 'Al'>('Au');
  const [modelType, setModelType] = useState<'rutherford' | 'thomson'>('rutherford');
  const [isFiring, setIsFiring] = useState(false);

  // Z atomic number
  const Z = targetElement === 'Au' ? 79 : targetElement === 'Ag' ? 47 : 13;
  const z = 2; // alpha particle has 2 protons

  // Classical Rutherford Scattering Angle: cot(theta/2) = (4*pi*eps0 * 2*E) / (z * Z * e^2) * b
  // Simplified scaled formula for theta in degrees:
  let deflectionAngleDeg = 0;

  if (modelType === 'thomson') {
    // Plum pudding: diffused positive cloud, max deflection < 1 degree!
    deflectionAngleDeg = (0.2 * (Z / 79)) / alphaEnergyMev;
  } else {
    // Nuclear model: Coulomb point charge hyperbolic trajectory
    // b in fm, E in MeV
    const k = (1.44 * z * Z) / (2 * alphaEnergyMev); // characteristic distance in fm
    const cotHalfTheta = impactParameterFm / k;
    const halfThetaRad = Math.atan(1 / Math.max(0.001, cotHalfTheta));
    deflectionAngleDeg = (2 * halfThetaRad * 180) / Math.PI;
  }

  const isBackscatter = deflectionAngleDeg > 90;

  const resetScattering = () => {
    setAlphaEnergyMev(5.5);
    setImpactParameterFm(25);
    setTargetElement('Au');
    setModelType('rutherford');
    setIsFiring(false);
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetScattering}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Target Nucleus': `${targetElement} (Z=${Z})`,
        'Atomic Model': modelType === 'rutherford' ? 'Rutherford Nuclear Model' : 'Thomson Plum Pudding Model',
        'Alpha Energy': `${alphaEnergyMev.toFixed(1)} MeV`,
        'Impact Parameter (b)': `${impactParameterFm} fm`,
        'Deflection Scattering Angle (θ)': `${deflectionAngleDeg.toFixed(1)}°`,
        'Backscattering Event': isBackscatter ? 'YES (θ > 90°)' : 'NO (Forward Scatter)',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Control Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Alpha Collimator & Target</span>
              <Target className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Atomic Model Toggle */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Atomic Hypothesis Model:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setModelType('rutherford')}
                  className={`p-2 rounded font-medium transition-colors ${
                    modelType === 'rutherford'
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-800/60'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Nuclear Model (1911)
                </button>
                <button
                  onClick={() => setModelType('thomson')}
                  className={`p-2 rounded font-medium transition-colors ${
                    modelType === 'thomson'
                      ? 'bg-slate-800 text-amber-300 border border-amber-800/60'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Plum Pudding (1904)
                </button>
              </div>
            </div>

            {/* Target Metal Foil */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Target Foil Element:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  onClick={() => setTargetElement('Au')}
                  className={`p-2 rounded border text-center transition-colors ${
                    targetElement === 'Au'
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Gold (Z=79)
                </button>
                <button
                  onClick={() => setTargetElement('Ag')}
                  className={`p-2 rounded border text-center transition-colors ${
                    targetElement === 'Ag'
                      ? 'bg-slate-800 border-slate-400 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Silver (Z=47)
                </button>
                <button
                  onClick={() => setTargetElement('Al')}
                  className={`p-2 rounded border text-center transition-colors ${
                    targetElement === 'Al'
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Aluminum (Z=13)
                </button>
              </div>
            </div>

            {/* Impact Parameter Slider b */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Impact Parameter (b):</span>
                <span className="text-cyan-400 font-bold">{impactParameterFm} fm</span>
              </div>
              <input
                type="range"
                min="2"
                max="80"
                step="2"
                value={impactParameterFm}
                onChange={(e) => setImpactParameterFm(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span className="text-rose-400">2 fm (Head-on recoil)</span>
                <span>40 fm</span>
                <span className="text-slate-400">80 fm (Grazing pass)</span>
              </div>
            </div>

            {/* Alpha Kinetic Energy Slider */}
            <div className="mb-2">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Alpha Particle Energy (E_k):</span>
                <span className="text-white font-bold">{alphaEnergyMev.toFixed(1)} MeV</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="9.0"
                step="0.5"
                value={alphaEnergyMev}
                onChange={(e) => setAlphaEnergyMev(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Center Trajectory Canvas */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              COULOMB REPULSION SCATTERING TRAJECTORY
            </div>

            {/* Hyperbolic Orbit SVG */}
            <svg className="w-full max-w-[420px] aspect-[4/3] bg-slate-950/90 rounded-xl border border-slate-800 p-2" viewBox="0 0 400 300">
              {/* Circular Zinc Sulfide Detector Screen Ring */}
              <circle cx="200" cy="150" r="120" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
              <text x="200" y="25" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                ZnS SCINTILLATION DETECTOR
              </text>

              {/* Target Nucleus or Plum Pudding at Center */}
              {modelType === 'rutherford' ? (
                // Compact dense nucleus
                <g>
                  <circle cx="200" cy="150" r="8" fill="#f59e0b" className="filter drop-shadow-[0_0_10px_#f59e0b]" />
                  <text x="200" y="172" fill="#f59e0b" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                    {targetElement} Nucleus (+{Z}e)
                  </text>
                </g>
              ) : (
                // Diffuse Plum Pudding Cloud
                <g>
                  <circle cx="200" cy="150" r="60" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="200" y="145" fill="#f59e0b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    Diffuse +Charge Cloud
                  </text>
                  <circle cx="180" cy="130" r="3" fill="#38bdf8" />
                  <circle cx="220" cy="140" r="3" fill="#38bdf8" />
                  <circle cx="195" cy="165" r="3" fill="#38bdf8" />
                </g>
              )}

              {/* Alpha Particle Trajectory Path */}
              {(() => {
                const startX = 30;
                const startY = 150 - impactParameterFm * 1.2;

                // Deflected trajectory calculation
                const rad = (deflectionAngleDeg * Math.PI) / 180;
                const turnX = 175;
                const turnY = startY;

                // Calculate end point on circle
                const endLength = 140;
                const endX = turnX + endLength * Math.cos(rad);
                const endY = turnY - endLength * Math.sin(rad);

                return (
                  <>
                    {/* Beam Line */}
                    <path
                      d={`M ${startX} ${startY} Q ${turnX} ${turnY} ${endX} ${endY}`}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="filter drop-shadow-[0_0_6px_#f43f5e]"
                    />

                    {/* Scintillation Flash where it hits ZnS screen */}
                    <circle cx={endX} cy={endY} r="5" fill="#22c55e" className="filter drop-shadow-[0_0_8px_#22c55e] animate-ping" />

                    {/* Alpha particle label */}
                    <text x={startX + 10} y={startY - 6} fill="#f43f5e" fontSize="9" fontFamily="monospace">
                      α (He²⁺)
                    </text>
                  </>
                );
              })()}

              {/* Collimator Emitter on Left */}
              <rect x="15" y="125" width="20" height="50" rx="3" fill="#1e293b" stroke="#475569" />
              <text x="25" y="188" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                RADIUM
              </text>
            </svg>

            {/* Rutherford Differential Scattering Formula */}
            <div className="mt-3 w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center font-mono text-xs">
              <span className="text-slate-500 mr-2">Scattering Cross Section:</span>
              <span className="text-cyan-300 font-bold">
                dσ/dΩ ∝ 1 / sin⁴(θ / 2) ⟹ Deflection θ = {deflectionAngleDeg.toFixed(1)}°
              </span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Deflection Angle (θ)"
            value={`${deflectionAngleDeg.toFixed(1)}°`}
            subValue={isBackscatter ? 'Extreme Backscatter Event!' : 'Forward Small-Angle Scatter'}
            tone={isBackscatter ? 'rose' : 'cyan'}
          />

          <MetricCard
            label="Scattering Event Class"
            value={isBackscatter ? 'Large Angle Deflection' : 'Transmission'}
            subValue={modelType === 'thomson' ? 'Plum Pudding Prediction (<1°)' : 'Rutherford Nuclear Scattering'}
            tone={isBackscatter ? 'amber' : 'default'}
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Historic Landmark Discovery
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              If Thomson was right, alpha particles would fly straight through with negligible deflection. Geiger and Marsden saw 1 in 8,000 bounce back, proving all positive charge resides in a tiny atomic nucleus!
            </p>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] text-cyan-300">
              Gold Foil: 400 nm thin leaf<br />
              Nucleus Size: ~10⁻¹⁵ m vs Atom: ~10⁻¹⁰ m
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
