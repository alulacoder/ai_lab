import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Mountain, Flame, RotateCcw, Play } from 'lucide-react';

interface VolcanoLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const VolcanoLab: React.FC<VolcanoLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['volcano-sim'];

  const [silicaPercent, setSilicaPercent] = useState(52); // 50-75%
  const [gasPressureMpa, setGasPressureMpa] = useState(3.0); // 1-12 MPa
  const [magmaTempC, setMagmaTempC] = useState(1150); // 750-1250°C
  const [isErupting, setIsErupting] = useState(false);

  // Viscosity calculation: log10(eta) increases strongly with silica and inversely with temperature
  const logViscosity = (silicaPercent - 45) * 0.28 + (1250 - magmaTempC) * 0.008;
  const viscosityPaS = Math.pow(10, Math.min(10, Math.max(1, logViscosity)));

  // Explosivity index VEI (0 to 6)
  let vei = 0;
  if (silicaPercent < 55 && gasPressureMpa < 4) {
    vei = 1; // Hawaiian effusive
  } else if (silicaPercent < 62) {
    vei = Math.min(3, Math.round(gasPressureMpa * 0.5)); // Strombolian / Vulcanian
  } else {
    vei = Math.min(6, Math.max(3, Math.round((silicaPercent - 50) * 0.15 + gasPressureMpa * 0.4))); // Plinian
  }

  const plumeHeightKm = isErupting ? (vei === 1 ? 0.8 : (vei * 5.2).toFixed(1)) : 0;
  const eruptionType =
    vei <= 1
      ? 'Effusive Basaltic Hawaiian Flow (Fluid Lava Fountains)'
      : vei <= 3
      ? 'Strombolian / Vulcanian Intermediate Explosive'
      : 'Cataclysmic Plinian Explosive (Stratospheric Ash Plume)';

  const resetVolcano = () => {
    setSilicaPercent(52);
    setGasPressureMpa(3.0);
    setMagmaTempC(1150);
    setIsErupting(false);
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetVolcano}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Silica (SiO2) Concentration': `${silicaPercent}%`,
        'Volatile Gas Pressure': `${gasPressureMpa.toFixed(1)} MPa`,
        'Magma Temperature': `${magmaTempC} °C`,
        'Magma Viscosity': `${viscosityPaS.toExponential(2)} Pa·s`,
        'Volcanic Explosivity Index': `VEI ${vei}`,
        'Eruption Status': isErupting ? eruptionType : 'Dormant Magma Chamber',
        'Ash Plume Altitude': isErupting ? `${plumeHeightKm} km` : '0 km',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Controls Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Magma Chamber Thermodynamics</span>
              <Mountain className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Silica SiO2 Content */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Silica (SiO₂) Concentration:</span>
                <span className="text-white font-bold">{silicaPercent}%</span>
              </div>
              <input
                type="range"
                min="48"
                max="75"
                step="1"
                value={silicaPercent}
                onChange={(e) => setSilicaPercent(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span className="text-amber-400">50% Basaltic (Fluid)</span>
                <span>60% Andesitic</span>
                <span className="text-rose-400">73% Rhyolitic (Viscous)</span>
              </div>
            </div>

            {/* Dissolved Gas Pressure */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Trapped Volatile Gas Pressure (H₂O, CO₂):</span>
                <span className="text-cyan-400 font-bold">{gasPressureMpa.toFixed(1)} MPa</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.5"
                value={gasPressureMpa}
                onChange={(e) => setGasPressureMpa(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Magma Temperature */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Magma Chamber Temperature:</span>
                <span className="text-amber-400 font-bold">{magmaTempC} °C</span>
              </div>
              <input
                type="range"
                min="750"
                max="1250"
                step="25"
                value={magmaTempC}
                onChange={(e) => setMagmaTempC(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>750°C (Felsic)</span>
                <span>1000°C</span>
                <span>1250°C (Mafic Basalt)</span>
              </div>
            </div>

            {/* Trigger Eruption Button */}
            <button
              onClick={() => setIsErupting(!isErupting)}
              className={`w-full py-2.5 px-4 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isErupting
                  ? 'bg-rose-950 border border-rose-500 text-rose-200'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>{isErupting ? 'Quench / Calm Eruption' : 'Trigger Volcanic Eruption'}</span>
            </button>
          </div>
        </div>

        {/* Center Volcano Eruption Canvas */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              CROSS-SECTION · MAGMA CONDUIT & PLUME
            </div>

            {/* Volcano Mountain SVG */}
            <svg className="w-full max-w-[420px] aspect-[4/3] bg-slate-950/90 rounded-xl border border-slate-800 p-2" viewBox="0 0 400 300">
              {/* Sky Background */}
              <rect x="0" y="0" width="400" height="300" fill="#090d16" />

              {/* Stratospheric Ash Plume if Erupting */}
              {isErupting && vei >= 3 && (
                <g className="filter drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                  {/* Plume cloud umbrella top */}
                  <ellipse cx="200" cy="40" rx="90" ry="25" fill="#475569" opacity="0.85" />
                  <ellipse cx="160" cy="35" rx="50" ry="20" fill="#64748b" opacity="0.9" />
                  <ellipse cx="240" cy="35" rx="50" ry="20" fill="#334155" opacity="0.9" />
                  {/* Vertical eruption conduit column */}
                  <path d="M 190 150 L 160 50 L 240 50 L 210 150 Z" fill="#475569" opacity="0.8" />
                  {/* Glowing volcanic lightning spark */}
                  <path d="M 180 60 L 195 85 L 185 110" fill="none" stroke="#38bdf8" strokeWidth="2" className="animate-pulse" />
                </g>
              )}

              {/* Effusive Lava Fountains if VEI <= 2 */}
              {isErupting && vei < 3 && (
                <g>
                  <path d="M 195 150 Q 180 110 160 160" fill="none" stroke="#f97316" strokeWidth="4" />
                  <path d="M 205 150 Q 220 110 240 160" fill="none" stroke="#ef4444" strokeWidth="4" />
                  <circle cx="200" cy="140" r="10" fill="#f59e0b" className="animate-ping" />
                </g>
              )}

              {/* Volcano Mountain Slopes */}
              <polygon
                points="200,150 100,260 300,260"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Glowing Lava flow rivers down slope */}
              {isErupting && (
                <>
                  <path d="M 195 155 Q 170 190 140 260" fill="none" stroke="#f97316" strokeWidth="3" />
                  <path d="M 205 155 Q 230 200 260 260" fill="none" stroke="#ef4444" strokeWidth="3" />
                </>
              )}

              {/* Underground Magma Chamber & Conduit */}
              <line x1="200" y1="150" x2="200" y2="240" stroke="#f97316" strokeWidth="6" />
              <ellipse
                cx="200"
                cy="260"
                rx="40"
                ry="22"
                fill={silicaPercent > 65 ? '#ef4444' : '#f59e0b'}
                className="filter drop-shadow-[0_0_12px_#f97316]"
              />
              <text x="200" y="265" fill="#0f172a" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                MAGMA CHAMBER
              </text>
            </svg>

            {/* Eruption Banner */}
            <div className="mt-2 w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-center font-mono text-xs">
              <span className="text-amber-400 font-bold">{eruptionType}</span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Volcanic Explosivity Index"
            value={`VEI ${vei}`}
            subValue={vei <= 1 ? 'Non-Explosive' : vei >= 4 ? 'Cataclysmic Plinian' : 'Moderate Explosive'}
            tone={vei >= 4 ? 'rose' : vei >= 2 ? 'amber' : 'emerald'}
          />

          <MetricCard
            label="Magma Viscosity (η)"
            value={viscosityPaS.toExponential(1)}
            unit="Pa·s"
            subValue={silicaPercent > 65 ? 'High Polymerization' : 'Fluid Mafic Basalt'}
            tone="default"
          />

          <MetricCard
            label="Ash Column Plume Height"
            value={isErupting ? `${plumeHeightKm}` : '0'}
            unit="km"
            subValue={isErupting ? 'Stratospheric Injection' : 'Dormant Vent'}
            tone={isErupting ? 'cyan' : 'default'}
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Volcanic Geochemistry
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              Silica (SiO₂) polymerizes into molecular chains, trapping expanding volatile gases until internal pressure exceeds overburden rock strength, triggering cataclysmic explosive fragmentation.
            </p>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
