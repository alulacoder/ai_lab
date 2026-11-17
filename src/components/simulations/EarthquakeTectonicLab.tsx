import React, { useState, useEffect } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Activity, Play, RotateCcw } from 'lucide-react';

interface EarthquakeTectonicLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const EarthquakeTectonicLab: React.FC<EarthquakeTectonicLabProps> = ({
  onAskAi,
  onLogObservation,
}) => {
  const experiment = EXPERIMENT_DETAILS['earthquake-sim'];

  const [faultType, setFaultType] = useState<'strike-slip' | 'convergent' | 'divergent'>('strike-slip');
  const [accumulatedStrain, setAccumulatedStrain] = useState(40); // 0 to 100%
  const [frictionLimit, setFrictionLimit] = useState(75); // rock strength
  const [isQuaking, setIsQuaking] = useState(false);
  const [magnitudeMw, setMagnitudeMw] = useState(6.4);
  const [seismoWaveform, setSeismoWaveform] = useState<number[]>([]);

  // Trigger earthquake rupture
  const triggerRupture = (strainVal: number) => {
    setIsQuaking(true);
    const calculatedMag = 5.0 + (strainVal / 100) * 3.8; // Mag 5.0 to 8.8
    setMagnitudeMw(Number(calculatedMag.toFixed(1)));

    // Generate waveform
    const waveform: number[] = [];
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        waveform.push(0); // Quiet baseline
      } else if (i < 25) {
        // P-wave (faster, smaller amplitude)
        waveform.push(Math.sin(i * 1.5) * 8);
      } else {
        // S-wave & Surface wave (high amplitude)
        const decay = Math.exp(-(i - 25) * 0.08);
        waveform.push(Math.sin(i * 0.8) * 35 * decay);
      }
    }
    setSeismoWaveform(waveform);

    setTimeout(() => {
      setIsQuaking(false);
      setAccumulatedStrain(10); // stress released
    }, 2500);
  };

  const handleStrainChange = (val: number) => {
    setAccumulatedStrain(val);
    if (val >= frictionLimit && !isQuaking) {
      triggerRupture(val);
    }
  };

  const resetEarthquake = () => {
    setFaultType('strike-slip');
    setAccumulatedStrain(40);
    setFrictionLimit(75);
    setIsQuaking(false);
    setSeismoWaveform([]);
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetEarthquake}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Fault Boundary Type': faultType.toUpperCase(),
        'Accumulated Tectonic Strain': `${accumulatedStrain}%`,
        'Rock Friction Limit': `${frictionLimit}%`,
        'Rupture State': isQuaking ? 'FAULT SLIP IN PROGRESS' : 'Elastic Strain Accumulating',
        'Moment Magnitude': `Mw ${magnitudeMw}`,
        'P-Wave Velocity (Vp)': '6.2 km/s',
        'S-Wave Velocity (Vs)': '3.5 km/s',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Controls Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Tectonic Plate Boundary</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Fault Boundary Selector */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Geological Fault Type:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setFaultType('strike-slip')}
                  className={`p-2 rounded border text-center transition-colors ${
                    faultType === 'strike-slip'
                      ? 'bg-slate-800 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Strike-Slip
                </button>
                <button
                  onClick={() => setFaultType('convergent')}
                  className={`p-2 rounded border text-center transition-colors ${
                    faultType === 'convergent'
                      ? 'bg-slate-800 border-amber-400 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Subduction
                </button>
                <button
                  onClick={() => setFaultType('divergent')}
                  className={`p-2 rounded border text-center transition-colors ${
                    faultType === 'divergent'
                      ? 'bg-slate-800 border-purple-400 text-purple-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Rift Zone
                </button>
              </div>
            </div>

            {/* Accumulated Tectonic Strain Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Elastic Strain Accumulation:</span>
                <span className={accumulatedStrain > frictionLimit - 10 ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>
                  {accumulatedStrain}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="2"
                value={accumulatedStrain}
                onChange={(e) => handleStrainChange(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0% (Relaxed)</span>
                <span className="text-amber-400">Slip Threshold ({frictionLimit}%)</span>
                <span>100% (Rupture)</span>
              </div>
            </div>

            {/* Rock Friction Threshold */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Fault Asperity Friction Strength:</span>
                <span className="text-white font-bold">{frictionLimit}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={frictionLimit}
                onChange={(e) => setFrictionLimit(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Manual Rupture Trigger */}
            <button
              onClick={() => triggerRupture(accumulatedStrain)}
              disabled={isQuaking}
              className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              <Activity className="w-4 h-4" />
              <span>{isQuaking ? 'EARTHQUAKE SLIPPING...' : 'Trigger Immediate Fault Slip'}</span>
            </button>
          </div>
        </div>

        {/* Center Crustal Blocks & Seismograph Canvas */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div
            className={`bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden transition-transform ${
              isQuaking ? 'animate-bounce' : ''
            }`}
          >
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              {isQuaking ? 'SEISMIC RUPTURE OCCURRING!' : 'CRUSTAL FAULT BLOCKS'}
            </div>

            {/* Fault Block 3D-ish Isometric SVG */}
            <svg className="w-full max-w-[400px] h-48" viewBox="0 0 360 180">
              {/* Left Crust Block */}
              <polygon
                points="40,90 140,50 180,90 80,130"
                fill="#334155"
                stroke="#475569"
                strokeWidth="2"
                transform={isQuaking ? 'translate(-8, 4)' : 'translate(0, 0)'}
              />
              <polygon
                points="80,130 180,90 180,140 80,180"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
                transform={isQuaking ? 'translate(-8, 4)' : 'translate(0, 0)'}
              />

              {/* Right Crust Block (offset by fault) */}
              <polygon
                points="185,90 285,50 325,90 225,130"
                fill="#475569"
                stroke="#64748b"
                strokeWidth="2"
                transform={isQuaking ? 'translate(8, -4)' : 'translate(0, 0)'}
              />
              <polygon
                points="225,130 325,90 325,140 225,180"
                fill="#0f172a"
                stroke="#64748b"
                strokeWidth="2"
                transform={isQuaking ? 'translate(8, -4)' : 'translate(0, 0)'}
              />

              {/* Fault line crack with red tension indicator */}
              <line x1="182" y1="70" x2="182" y2="150" stroke={isQuaking ? '#ef4444' : '#f59e0b'} strokeWidth="4" />
            </svg>

            {/* Rotary Drum Seismograph Record Waveform */}
            <div className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block mb-1">
                BROADBAND ROTARY DRUM SEISMOGRAPH TRACE
              </span>
              <svg className="w-full h-16" viewBox="0 0 380 60">
                <line x1="0" y1="30" x2="380" y2="30" stroke="#1e293b" strokeWidth="1" />
                {seismoWaveform.length > 0 && (
                  <polyline
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    points={seismoWaveform
                      .map((val, idx) => {
                        const x = (idx / seismoWaveform.length) * 380;
                        const y = 30 + val;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                )}
                {seismoWaveform.length === 0 && (
                  <line x1="0" y1="30" x2="380" y2="30" stroke="#334155" strokeWidth="1.5" />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Moment Magnitude (Mw)"
            value={magnitudeMw}
            subValue={
              magnitudeMw >= 7.0
                ? 'Major Catastrophic Earthquake'
                : magnitudeMw >= 6.0
                ? 'Strong Ground Shaking'
                : 'Moderate Quake'
            }
            tone={magnitudeMw >= 7.0 ? 'rose' : 'amber'}
          />

          <MetricCard
            label="P-Wave Arrival Time"
            value="3.2 s"
            unit="sec"
            subValue="Compressional Velocity Vp = 6.2 km/s"
            tone="default"
          />

          <MetricCard
            label="S-Wave Arrival Time"
            value="5.7 s"
            unit="sec"
            subValue="Shear Velocity Vs = 3.5 km/s"
            tone="cyan"
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Reid's Elastic Rebound Theory
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              Tectonic forces deform rock elastically over decades until shear stress exceeds frictional lock, snapping back and radiating destructive seismic waves.
            </p>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
