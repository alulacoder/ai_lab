import React, { useState, useEffect } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Sun, Leaf, Droplets } from 'lucide-react';

interface PhotosynthesisLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const PhotosynthesisLab: React.FC<PhotosynthesisLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['photosynthesis-sim'];

  const [lightIntensityLux, setLightIntensityLux] = useState(1200); // 0 to 2000
  const [lightColor, setLightColor] = useState<'white' | 'blue' | 'red' | 'green'>('white');
  const [co2Ppm, setCo2Ppm] = useState(400); // 0 to 1000 ppm
  const [temperatureC, setTemperatureC] = useState(25); // 10 to 45°C
  const [bubbleTick, setBubbleTick] = useState(0);

  // Wavelength absorption coefficient
  const absorptionCoeff = {
    blue: 0.95, // Chlorophyll peak
    red: 0.90, // Chlorophyll peak
    white: 0.85,
    green: 0.15, // Reflects green!
  }[lightColor];

  // Temperature response curve (Rubisco optimal at 25-30°C, denatures above 40°C)
  let tempFactor = 1.0;
  if (temperatureC < 25) {
    tempFactor = 0.5 + (temperatureC - 10) * 0.033;
  } else if (temperatureC <= 32) {
    tempFactor = 1.0;
  } else if (temperatureC > 32) {
    tempFactor = Math.max(0, 1.0 - (temperatureC - 32) * 0.08); // drops to 0 at ~44°C
  }

  // Bubble rate per minute
  const maxRate = 60; // bubbles per minute
  const lightFactor = Math.min(1.0, lightIntensityLux / 1500) * absorptionCoeff;
  const co2Factor = Math.min(1.0, co2Ppm / 600);
  const bubbleRatePerMin = Math.round(maxRate * lightFactor * co2Factor * tempFactor);
  const oxygenProductionUmol = (bubbleRatePerMin * 0.42).toFixed(1);
  const glucoseMgPerHour = (bubbleRatePerMin * 1.25).toFixed(1);

  // Bubble stream animation
  useEffect(() => {
    if (bubbleRatePerMin <= 0) return;
    const intervalMs = Math.max(100, Math.round(60000 / Math.max(1, bubbleRatePerMin)));
    const timer = setInterval(() => {
      setBubbleTick((t) => t + 1);
    }, Math.min(intervalMs, 400));
    return () => clearInterval(timer);
  }, [bubbleRatePerMin]);

  const resetPhotosynthesis = () => {
    setLightIntensityLux(1200);
    setLightColor('white');
    setCo2Ppm(400);
    setTemperatureC(25);
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetPhotosynthesis}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Light Intensity': `${lightIntensityLux} Lux`,
        'Light Spectrum': lightColor.toUpperCase(),
        'Dissolved CO2': `${co2Ppm} ppm`,
        'Water Temperature': `${temperatureC} °C`,
        'O2 Bubble Rate': `${bubbleRatePerMin} bubbles/min`,
        'Oxygen Yield': `${oxygenProductionUmol} µmol/min`,
        'Glucose Production': `${glucoseMgPerHour} mg/hr`,
        'Limiting Factor':
          temperatureC > 40
            ? 'Enzyme Denaturation (Excess Heat)'
            : lightIntensityLux < 400
            ? 'Light Intensity'
            : co2Ppm < 200
            ? 'CO2 Substrate Depletion'
            : lightColor === 'green'
            ? 'Wavelength (Chlorophyll Reflects Green)'
            : 'Optimal Light-Saturated State',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Controls Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Environmental Variables</span>
              <Sun className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Light Spectrum Color */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                LED Illumination Wavelength:
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setLightColor('white')}
                  className={`p-2 rounded border text-center transition-colors ${
                    lightColor === 'white'
                      ? 'bg-slate-800 border-white text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  White
                </button>
                <button
                  onClick={() => setLightColor('blue')}
                  className={`p-2 rounded border text-center transition-colors ${
                    lightColor === 'blue'
                      ? 'bg-blue-950/70 border-blue-400 text-blue-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Blue 450nm
                </button>
                <button
                  onClick={() => setLightColor('red')}
                  className={`p-2 rounded border text-center transition-colors ${
                    lightColor === 'red'
                      ? 'bg-rose-950/70 border-rose-400 text-rose-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Red 660nm
                </button>
                <button
                  onClick={() => setLightColor('green')}
                  className={`p-2 rounded border text-center transition-colors ${
                    lightColor === 'green'
                      ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Green 530nm
                </button>
              </div>
            </div>

            {/* Light Intensity Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Light Intensity:</span>
                <span className="text-cyan-400 font-bold">{lightIntensityLux} Lux</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={lightIntensityLux}
                onChange={(e) => setLightIntensityLux(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Dissolved CO2 Concentration */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Dissolved CO₂ (Sodium Bicarbonate):</span>
                <span className="text-white font-bold">{co2Ppm} ppm</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="25"
                value={co2Ppm}
                onChange={(e) => setCo2Ppm(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Water Temperature Slider */}
            <div className="mb-2">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Water Bath Temperature:</span>
                <span className={temperatureC > 38 ? 'text-rose-400 font-bold' : 'text-white font-bold'}>
                  {temperatureC} °C
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                step="1"
                value={temperatureC}
                onChange={(e) => setTemperatureC(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>10°C (Slow)</span>
                <span className="text-emerald-400">28°C (Optimal)</span>
                <span className="text-rose-400">45°C (Denaturation)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Aquatic Plant Chamber Viewport */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            {/* Illumination Glow Over Chamber */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-500"
              style={{
                backgroundColor:
                  lightColor === 'white'
                    ? `rgba(255, 255, 255, ${lightIntensityLux / 8000})`
                    : lightColor === 'blue'
                    ? `rgba(59, 130, 246, ${lightIntensityLux / 6000})`
                    : lightColor === 'red'
                    ? `rgba(244, 63, 94, ${lightIntensityLux / 6000})`
                    : `rgba(34, 197, 94, ${lightIntensityLux / 6000})`,
              }}
            />

            {/* Chamber Glassware SVG */}
            <svg className="w-56 h-72" viewBox="0 0 200 260">
              {/* Outer Water Tank Beaker */}
              <rect x="20" y="40" width="160" height="200" rx="8" fill="rgba(14, 165, 233, 0.15)" stroke="#38bdf8" strokeWidth="2" />

              {/* Inverted Funnel & Graduated Gas Collection Tube */}
              <path d="M 50 200 L 90 120 L 90 20 L 110 20 L 110 120 L 150 200 Z" fill="rgba(241, 245, 249, 0.25)" stroke="#94a3b8" strokeWidth="2" />

              {/* Trapped Oxygen Gas Pocket at top of tube */}
              <rect
                x="91"
                y="21"
                width="18"
                height={Math.min(45, 10 + (bubbleRatePerMin / 2))}
                fill="rgba(255, 255, 255, 0.7)"
              />
              <text x="100" y="16" fill="#38bdf8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                O₂ GAS
              </text>

              {/* Submerged Elodea Aquatic Plant Sprig */}
              <g transform="translate(100, 210)">
                {/* Central green stem */}
                <path d="M 0 0 Q -5 -30 0 -60" fill="none" stroke="#16a34a" strokeWidth="4" />
                {/* Plant whorl leaves */}
                <ellipse cx="-12" cy="-15" rx="10" ry="4" fill="#22c55e" transform="rotate(-25 -12 -15)" />
                <ellipse cx="12" cy="-20" rx="10" ry="4" fill="#22c55e" transform="rotate(25 12 -20)" />
                <ellipse cx="-12" cy="-35" rx="10" ry="4" fill="#22c55e" transform="rotate(-20 -12 -35)" />
                <ellipse cx="12" cy="-40" rx="10" ry="4" fill="#22c55e" transform="rotate(20 12 -40)" />
              </g>

              {/* Rising Oxygen Bubbles */}
              {bubbleRatePerMin > 0 && (
                <g>
                  <circle cx="98" cy={110 - (bubbleTick % 8) * 10} r="2.5" fill="#ffffff" opacity="0.8" />
                  <circle cx="102" cy={90 - ((bubbleTick + 3) % 8) * 10} r="3" fill="#ffffff" opacity="0.85" />
                  <circle cx="99" cy={70 - ((bubbleTick + 5) % 8) * 10} r="2" fill="#ffffff" opacity="0.75" />
                </g>
              )}
            </svg>

            {/* Photosynthesis Chemical Formula Banner */}
            <div className="mt-2 w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-center font-mono text-xs">
              <span className="text-cyan-300 font-bold">
                6 CO₂ + 6 H₂O + Photons ⟶ C₆H₁₂O₆ (Glucose) + 6 O₂ ↑
              </span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Oxygen Bubble Rate"
            value={bubbleRatePerMin}
            unit="bubbles/min"
            subValue={bubbleRatePerMin > 0 ? 'Active O₂ Evolution' : 'Photosynthesis Stalled'}
            tone={bubbleRatePerMin > 25 ? 'emerald' : bubbleRatePerMin > 0 ? 'cyan' : 'rose'}
          />

          <MetricCard
            label="Oxygen Generation Rate"
            value={oxygenProductionUmol}
            unit="µmol/min"
            subValue="Thylakoid Photolysis"
            tone="default"
          />

          <MetricCard
            label="Glucose Synthesis Rate"
            value={glucoseMgPerHour}
            unit="mg/hr"
            subValue="Calvin Cycle Output"
            tone="default"
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Limiting Factors (Blackman's Law)
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              Photosynthetic rate is limited by whichever critical variable (Light, CO₂, or Temperature) is in shortest supply.
            </p>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] text-cyan-300">
              Chlorophyll Absorption:<br />
              Blue: 95% · Red: 90% · Green: 15%
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
