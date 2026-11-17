import React, { useState, useEffect } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Orbit, Compass, RotateCcw } from 'lucide-react';

interface OrbitalSpaceLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const OrbitalSpaceLab: React.FC<OrbitalSpaceLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['orbital-space'];

  const [altitudeKm, setAltitudeKm] = useState(600); // 200 to 36000 km
  const [velocityKmS, setVelocityKmS] = useState(7.56); // 5 to 12 km/s
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Earth radius R = 6371 km, GM = 398600 km^3/s^2
  const R_earth = 6371;
  const GM = 398600;
  const r = R_earth + altitudeKm;

  // Theoretical velocities
  const v_circular = Math.sqrt(GM / r);
  const v_escape = Math.sqrt((2 * GM) / r);

  // Eccentricity estimate
  const specificEnergy = (velocityKmS * velocityKmS) / 2 - GM / r;
  const h_angular = r * velocityKmS;
  const eccentricity = Math.max(0, Math.sqrt(Math.max(0, 1 + (2 * specificEnergy * h_angular * h_angular) / (GM * GM))));

  let orbitClassification = 'Stable Circular Low Earth Orbit (LEO)';
  if (velocityKmS < v_circular * 0.95) {
    orbitClassification = 'Decaying Sub-Orbital (Atmospheric Reentry Collision)';
  } else if (velocityKmS >= v_escape) {
    orbitClassification = 'Hyperbolic Escape Trajectory (Interplanetary Space)';
  } else if (eccentricity > 0.05) {
    orbitClassification = 'Elliptical Keplerian Orbit';
  }

  // Animation loop
  useEffect(() => {
    const speedMultiplier = Math.max(0.2, (velocityKmS / 7.5) * 1.5);
    const timer = setInterval(() => {
      setOrbitAngle((a) => (a + speedMultiplier) % 360);
    }, 40);
    return () => clearInterval(timer);
  }, [velocityKmS]);

  const resetOrbit = () => {
    setAltitudeKm(600);
    setVelocityKmS(7.56);
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetOrbit}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Orbital Altitude': `${altitudeKm} km`,
        'Current Spacecraft Velocity': `${velocityKmS.toFixed(2)} km/s`,
        'Circular Orbital Velocity (vc)': `${v_circular.toFixed(2)} km/s`,
        'Escape Velocity (vesc)': `${v_escape.toFixed(2)} km/s`,
        'Orbital Eccentricity (e)': eccentricity.toFixed(3),
        'Trajectory State': orbitClassification,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Controls Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Keplerian Orbital Controls</span>
              <Orbit className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Velocity Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Tangential Launch Velocity:</span>
                <span className="text-cyan-400 font-bold">{velocityKmS.toFixed(2)} km/s</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="12.5"
                step="0.05"
                value={velocityKmS}
                onChange={(e) => setVelocityKmS(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span className="text-rose-400">Crash (&lt;7.0)</span>
                <span className="text-emerald-400">Circ ({v_circular.toFixed(1)})</span>
                <span className="text-purple-400">Escape (&gt;{v_escape.toFixed(1)})</span>
              </div>
            </div>

            {/* Altitude Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Orbital Altitude (h):</span>
                <span className="text-white font-bold">{altitudeKm} km</span>
              </div>
              <input
                type="range"
                min="200"
                max="12000"
                step="100"
                value={altitudeKm}
                onChange={(e) => setAltitudeKm(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>400 km (ISS LEO)</span>
                <span>2,000 km (MEO)</span>
                <span>12,000 km (GPS)</span>
              </div>
            </div>

            {/* Presets */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-2">
                Flight Presets:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => { setAltitudeKm(408); setVelocityKmS(7.66); }}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-300 text-center"
                >
                  ISS Space Station
                </button>
                <button
                  onClick={() => { setAltitudeKm(800); setVelocityKmS(v_escape + 0.2); }}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-purple-300 text-center"
                >
                  Mars Escape Burn
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Orbital Canvas */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              N-BODY KEPLERIAN GRAVITATIONAL RADAR
            </div>

            {/* Orbital SVG Canvas */}
            <svg className="w-full max-w-[420px] aspect-[4/3] bg-slate-950/90 rounded-xl border border-slate-800 p-2" viewBox="0 0 400 300">
              {/* Central Planet Earth */}
              <circle cx="200" cy="150" r="32" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" className="filter drop-shadow-[0_0_12px_#0284c7]" />
              <text x="200" y="153" fill="#ffffff" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                EARTH
              </text>

              {/* Orbital Ellipse Trajectory Path */}
              {velocityKmS < v_escape ? (
                <ellipse
                  cx={200 - (eccentricity * 30)}
                  cy="150"
                  rx={32 + (altitudeKm / 12000) * 110 + (eccentricity * 20)}
                  ry={32 + (altitudeKm / 12000) * 110}
                  fill="none"
                  stroke={eccentricity > 0.4 ? '#f59e0b' : '#38bdf8'}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
              ) : (
                // Hyperbolic escape path
                <path d="M 200 80 Q 200 150 400 130" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 4" />
              )}

              {/* Orbiting Satellite Marker */}
              {(() => {
                const rad = (orbitAngle * Math.PI) / 180;
                const rx = 32 + (altitudeKm / 12000) * 110 + (eccentricity * 20);
                const ry = 32 + (altitudeKm / 12000) * 110;
                const satX = 200 - (eccentricity * 30) + rx * Math.cos(rad);
                const satY = 150 + ry * Math.sin(rad);

                return (
                  <g transform={`translate(${satX}, ${satY})`}>
                    <circle cx="0" cy="0" r="4" fill="#ffffff" className="filter drop-shadow-[0_0_6px_#38bdf8]" />
                    {/* Solar panels */}
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#38bdf8" strokeWidth="2" />
                  </g>
                );
              })()}
            </svg>

            {/* Orbit Status Banner */}
            <div className="mt-2 w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-center font-mono text-xs">
              <span className="text-cyan-300 font-bold">{orbitClassification}</span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Circular Speed (v_circ)"
            value={`${v_circular.toFixed(2)}`}
            unit="km/s"
            subValue="Zero Eccentricity Speed"
            tone="cyan"
          />

          <MetricCard
            label="Escape Velocity (v_esc)"
            value={`${v_escape.toFixed(2)}`}
            unit="km/s"
            subValue="Parabolic Escape Threshold"
            tone="amber"
          />

          <MetricCard
            label="Orbital Eccentricity (e)"
            value={eccentricity.toFixed(3)}
            subValue={eccentricity < 0.05 ? 'Circular (e ≈ 0)' : eccentricity < 1.0 ? 'Elliptical' : 'Escape'}
            tone={eccentricity < 0.05 ? 'emerald' : 'default'}
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Newton's Cannonball Thought Experiment
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              An orbit occurs when a projectile's forward horizontal velocity is so fast that the curvature of its downward fall matches the planetary curvature beneath it.
            </p>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
