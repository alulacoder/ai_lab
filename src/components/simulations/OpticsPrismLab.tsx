import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Radio, Eye, Sparkles } from 'lucide-react';

interface MaterialOption {
  id: string;
  name: string;
  baseN: number; // Refractive index at 589nm
  dispersionCoeff: number; // Cauchy coefficient
}

const MATERIALS: MaterialOption[] = [
  { id: 'crown-glass', name: 'Crown Glass (BK7)', baseN: 1.517, dispersionCoeff: 0.0042 },
  { id: 'flint-glass', name: 'Dense Flint Glass (SF11)', baseN: 1.785, dispersionCoeff: 0.0125 },
  { id: 'diamond', name: 'Gem Diamond (C)', baseN: 2.417, dispersionCoeff: 0.0180 },
  { id: 'water', name: 'Liquid Water (H₂O)', baseN: 1.333, dispersionCoeff: 0.0031 },
  { id: 'acrylic', name: 'Optical Acrylic (PMMA)', baseN: 1.491, dispersionCoeff: 0.0058 },
];

interface OpticsPrismLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const OpticsPrismLab: React.FC<OpticsPrismLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['optics-prism'];

  const [angleIncidence, setAngleIncidence] = useState(30); // degrees
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(MATERIALS[1]); // Flint glass
  const [lightMode, setLightMode] = useState<'white' | 'mono-green' | 'mono-red' | 'mono-violet'>('white');

  // Snell's Law calculations
  const theta1Rad = (angleIncidence * Math.PI) / 180;
  const n1 = 1.0; // Air
  const n2 = selectedMaterial.baseN;

  // Refraction angle inside prism
  const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;
  const theta2Deg = (Math.asin(Math.max(-0.99, Math.min(0.99, sinTheta2))) * 180) / Math.PI;

  // Critical angle for Total Internal Reflection (TIR)
  const criticalAngleDeg = (Math.asin(1.0 / n2) * 180) / Math.PI;

  // Spectral dispersion bands for white light
  const spectralColors = [
    { name: 'Red (700nm)', hex: '#ef4444', nMod: -0.015 },
    { name: 'Orange (610nm)', hex: '#f97316', nMod: -0.008 },
    { name: 'Yellow (580nm)', hex: '#eab308', nMod: -0.002 },
    { name: 'Green (530nm)', hex: '#22c55e', nMod: 0.005 },
    { name: 'Cyan (490nm)', hex: '#06b6d4', nMod: 0.012 },
    { name: 'Blue (450nm)', hex: '#3b82f6', nMod: 0.020 },
    { name: 'Violet (400nm)', hex: '#a855f7', nMod: 0.032 },
  ];

  const resetOptics = () => {
    setAngleIncidence(30);
    setSelectedMaterial(MATERIALS[1]);
    setLightMode('white');
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetOptics}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Prism Medium': selectedMaterial.name,
        'Refractive Index (n)': n2.toFixed(3),
        'Angle of Incidence (θ₁)': `${angleIncidence}°`,
        'Refraction Angle (θ₂)': `${theta2Deg.toFixed(2)}°`,
        'Critical Angle (θ_crit)': `${criticalAngleDeg.toFixed(2)}°`,
        'Light Mode': lightMode.toUpperCase(),
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Optical Controls Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Laser & Prism Controls</span>
              <Radio className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Light Source Beam Mode */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Incident Light Beam Source:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => setLightMode('white')}
                  className={`p-2 rounded border transition-colors flex items-center justify-center gap-1.5 ${
                    lightMode === 'white'
                      ? 'bg-slate-800 border-cyan-400 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  White Light (Rainbow)
                </button>
                <button
                  onClick={() => setLightMode('mono-green')}
                  className={`p-2 rounded border transition-colors flex items-center justify-center gap-1.5 ${
                    lightMode === 'mono-green'
                      ? 'bg-slate-800 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  532nm Laser
                </button>
                <button
                  onClick={() => setLightMode('mono-red')}
                  className={`p-2 rounded border transition-colors flex items-center justify-center gap-1.5 ${
                    lightMode === 'mono-red'
                      ? 'bg-slate-800 border-rose-400 text-rose-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  650nm Red Laser
                </button>
                <button
                  onClick={() => setLightMode('mono-violet')}
                  className={`p-2 rounded border transition-colors flex items-center justify-center gap-1.5 ${
                    lightMode === 'mono-violet'
                      ? 'bg-slate-800 border-purple-400 text-purple-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  405nm Violet Laser
                </button>
              </div>
            </div>

            {/* Prism Material */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Prism Optical Material:
              </label>
              <select
                value={selectedMaterial.id}
                onChange={(e) => {
                  const m = MATERIALS.find((x) => x.id === e.target.value);
                  if (m) setSelectedMaterial(m);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                {MATERIALS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (n = {m.baseN})
                  </option>
                ))}
              </select>
            </div>

            {/* Angle of Incidence Slider */}
            <div className="mb-2">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Angle of Incidence (θ₁):</span>
                <span className="text-cyan-400 font-bold">{angleIncidence}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="65"
                step="1"
                value={angleIncidence}
                onChange={(e) => setAngleIncidence(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0° (Normal)</span>
                <span>30°</span>
                <span>65° (Grazing)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Optical Bench Canvas */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              OPTICAL GONIOMETER TABLE · λ DISPERSION
            </div>

            {/* Interactive SVG Ray Tracer */}
            <svg className="w-full max-w-[420px] aspect-[4/3] bg-slate-950/90 rounded-xl border border-slate-800 p-2" viewBox="0 0 400 300">
              {/* Triangular Prism (Flint/Crown glass equilateral) */}
              <polygon
                points="200,60 120,220 280,220"
                fill="rgba(56, 189, 248, 0.08)"
                stroke="#38bdf8"
                strokeWidth="2"
                className="filter backdrop-blur-sm"
              />

              {/* Normal line perpendicular to left face */}
              <line x1="120" y1="120" x2="200" y2="160" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />

              {/* Incident Laser Beam */}
              {(() => {
                const startX = 30;
                const startY = 140 - angleIncidence * 1.5;
                const hitX = 160;
                const hitY = 140;

                const beamColor =
                  lightMode === 'white'
                    ? '#ffffff'
                    : lightMode === 'mono-red'
                    ? '#ef4444'
                    : lightMode === 'mono-green'
                    ? '#22c55e'
                    : '#a855f7';

                return (
                  <>
                    <line
                      x1={startX}
                      y1={startY}
                      x2={hitX}
                      y2={hitY}
                      stroke={beamColor}
                      strokeWidth={lightMode === 'white' ? '4' : '2.5'}
                      strokeLinecap="round"
                      className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                    />

                    {/* Dispersed Rays inside and exiting right face */}
                    {lightMode === 'white' ? (
                      spectralColors.map((color, idx) => {
                        const exitX = 240;
                        const exitY = 140 + idx * 4;
                        const screenX = 370;
                        const screenY = 100 + idx * 22 + angleIncidence * 0.4;

                        return (
                          <g key={color.name}>
                            {/* Inside prism */}
                            <line
                              x1={hitX}
                              y1={hitY}
                              x2={exitX}
                              y2={exitY}
                              stroke={color.hex}
                              strokeWidth="1.5"
                              opacity="0.8"
                            />
                            {/* Exiting to detector screen */}
                            <line
                              x1={exitX}
                              y1={exitY}
                              x2={screenX}
                              y2={screenY}
                              stroke={color.hex}
                              strokeWidth="2"
                              className="filter drop-shadow-[0_0_6px_currentColor]"
                            />
                          </g>
                        );
                      })
                    ) : (
                      <>
                        {/* Monochromatic ray inside */}
                        <line x1={hitX} y1={hitY} x2="240" y2="150" stroke={beamColor} strokeWidth="2.5" />
                        {/* Monochromatic ray exiting */}
                        <line x1="240" y1="150" x2="370" y2={130 + angleIncidence * 0.4} stroke={beamColor} strokeWidth="2.5" className="filter drop-shadow-[0_0_8px_currentColor]" />
                      </>
                    )}
                  </>
                );
              })()}

              {/* White Detector Screen on Right */}
              <rect x="370" y="50" width="8" height="200" fill="#334155" rx="2" stroke="#64748b" />
              <text x="374" y="270" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                SCREEN
              </text>
            </svg>

            {/* Snell's Law Live Equation */}
            <div className="mt-3 w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center font-mono text-xs">
              <span className="text-slate-500 mr-2">Snell's Law:</span>
              <span className="text-cyan-300 font-bold">
                n₁ sin(θ₁) = n₂ sin(θ₂) ⟹ 1.000 · sin({angleIncidence}°) = {n2.toFixed(3)} · sin({theta2Deg.toFixed(2)}°)
              </span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Refraction Angle (θ₂)"
            value={`${theta2Deg.toFixed(2)}°`}
            subValue="Inside Prism Medium"
            tone="cyan"
          />

          <MetricCard
            label="Critical Angle (θ_crit)"
            value={`${criticalAngleDeg.toFixed(2)}°`}
            subValue="Total Internal Reflection Limit"
            tone="amber"
          />

          <MetricCard
            label="Refractive Index (n)"
            value={n2.toFixed(3)}
            unit="ratio"
            subValue={selectedMaterial.name}
            tone="default"
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Chromatic Dispersion (Cauchy)
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              Shorter wavelengths (Violet ~400nm) experience higher refractive indices and bend more sharply than longer wavelengths (Red ~700nm).
            </p>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] text-cyan-300">
              n(λ) = A + B / λ²<br />
              Dispersion: Δθ = {lightMode === 'white' ? '~4.2° Spread' : '0° Monochromatic'}
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
