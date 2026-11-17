import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Bug, Thermometer, Clock, Ruler } from 'lucide-react';

interface AntibioticDisk {
  id: string;
  code: string;
  name: string;
  potency: string;
  zoneRadiusMm: number; // default radius
  susceptibleThresholdMm: number;
}

const ANTIBIOTICS: AntibioticDisk[] = [
  { id: 'pen', code: 'PEN-10', name: 'Penicillin G', potency: '10 µg', zoneRadiusMm: 26, susceptibleThresholdMm: 22 },
  { id: 'amp', code: 'AMP-10', name: 'Ampicillin', potency: '10 µg', zoneRadiusMm: 18, susceptibleThresholdMm: 17 },
  { id: 'tet', code: 'TET-30', name: 'Tetracycline', potency: '30 µg', zoneRadiusMm: 24, susceptibleThresholdMm: 19 },
  { id: 'ery', code: 'ERY-15', name: 'Erythromycin', potency: '15 µg', zoneRadiusMm: 12, susceptibleThresholdMm: 18 }, // Resistant!
];

interface MicrobiologyPetriLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const MicrobiologyPetriLab: React.FC<MicrobiologyPetriLabProps> = ({
  onAskAi,
  onLogObservation,
}) => {
  const experiment = EXPERIMENT_DETAILS['microbiology-petri'];

  const [incubationHours, setIncubationHours] = useState(24); // 0 to 48 hrs
  const [placedDiscs, setPlacedDiscs] = useState<string[]>(['pen', 'amp', 'tet', 'ery']);
  const [selectedDiscId, setSelectedDiscId] = useState<string>('pen');

  const selectedDisc = ANTIBIOTICS.find((a) => a.id === selectedDiscId) || ANTIBIOTICS[0];

  // Zone diameter calculation based on incubation hours (grows up to 24 hrs)
  const growthFactor = Math.min(1.0, incubationHours / 20);
  const currentDiameterMm = Math.round(selectedDisc.zoneRadiusMm * growthFactor);
  const isSusceptible = currentDiameterMm >= selectedDisc.susceptibleThresholdMm;
  const isResistant = currentDiameterMm < 14;

  const resetPetri = () => {
    setIncubationHours(24);
    setPlacedDiscs(['pen', 'amp', 'tet', 'ery']);
    setSelectedDiscId('pen');
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetPetri}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Bacterial Lawn': 'Staphylococcus aureus (ATCC 25923)',
        'Incubation Time': `${incubationHours} hours at 37°C`,
        'Selected Antibiotic': `${selectedDisc.name} [${selectedDisc.code}]`,
        'Zone of Inhibition': `${currentDiameterMm} mm`,
        'Clinical Susceptibility': isSusceptible ? 'SUSCEPTIBLE (Killed)' : isResistant ? 'RESISTANT (Ineffective)' : 'INTERMEDIATE',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Incubator Controls Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Incubator & Antibiotic Discs</span>
              <Bug className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Incubation Time Slider */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>37°C Microbial Incubation Time:</span>
                <span className="text-cyan-400 font-bold">{incubationHours} Hours</span>
              </div>
              <input
                type="range"
                min="0"
                max="48"
                step="2"
                value={incubationHours}
                onChange={(e) => setIncubationHours(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0h (Fresh Lawn)</span>
                <span className="text-emerald-400">24h (Standard CLSI)</span>
                <span>48h (Overgrown)</span>
              </div>
            </div>

            {/* Antibiotics Selector */}
            <div className="mb-3">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Inspect Antibiotic Caliper Measurement:
              </label>
              <div className="space-y-1.5">
                {ANTIBIOTICS.map((ab) => {
                  const isSelected = selectedDiscId === ab.id;
                  const diam = Math.round(ab.zoneRadiusMm * growthFactor);
                  const status =
                    diam >= ab.susceptibleThresholdMm
                      ? 'Susceptible'
                      : diam < 14
                      ? 'Resistant'
                      : 'Intermediate';

                  return (
                    <button
                      key={ab.id}
                      onClick={() => setSelectedDiscId(ab.id)}
                      className={`w-full text-left p-2 rounded-lg border text-xs font-mono transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-800 border-cyan-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-slate-200">{ab.name}</span>
                        <span className="text-[10px] text-slate-500 ml-1.5">[{ab.code}]</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          status === 'Susceptible'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : status === 'Resistant'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {status} ({diam}mm)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Center Petri Dish Canvas */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              MUELLER-HINTON AGAR PETRI DISH (Ø 100mm)
            </div>

            {/* Circular Petri Dish SVG */}
            <svg className="w-72 h-72" viewBox="0 0 240 240">
              {/* Outer Glass Rim */}
              <circle cx="120" cy="120" r="110" fill="#0f172a" stroke="#475569" strokeWidth="4" />

              {/* Golden Mueller-Hinton Nutrient Agar Lawn */}
              <circle
                cx="120"
                cy="120"
                r="104"
                fill={incubationHours > 4 ? '#d97706' : '#fef3c7'}
                opacity={incubationHours > 4 ? '0.75' : '0.4'}
                className="transition-colors duration-1000"
              />

              {/* Antibiotic Discs and Clear Zones of Inhibition */}
              {[
                { disc: ANTIBIOTICS[0], cx: 80, cy: 80 },
                { disc: ANTIBIOTICS[1], cx: 160, cy: 80 },
                { disc: ANTIBIOTICS[2], cx: 80, cy: 160 },
                { disc: ANTIBIOTICS[3], cx: 160, cy: 160 },
              ].map(({ disc, cx, cy }) => {
                const zoneR = (disc.zoneRadiusMm * growthFactor * 1.5) / 2;
                const isSelected = selectedDiscId === disc.id;

                return (
                  <g key={disc.id}>
                    {/* Clear Halo Zone of Inhibition */}
                    {growthFactor > 0.2 && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={zoneR}
                        fill="#fef3c7"
                        stroke={isSelected ? '#38bdf8' : '#e2e8f0'}
                        strokeWidth={isSelected ? '2' : '1'}
                        strokeDasharray={isSelected ? '3 3' : 'none'}
                        opacity="0.9"
                      />
                    )}

                    {/* Caliper Measurement Marker line if selected */}
                    {isSelected && growthFactor > 0.2 && (
                      <>
                        <line x1={cx - zoneR} y1={cy} x2={cx + zoneR} y2={cy} stroke="#0284c7" strokeWidth="1.5" />
                        <text x={cx} y={cy - 6} fill="#0284c7" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                          {Math.round(disc.zoneRadiusMm * growthFactor)} mm
                        </text>
                      </>
                    )}

                    {/* Paper Filter Disc */}
                    <circle cx={cx} cy={cy} r="10" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                    <text x={cx} y={cy + 3} fill="#0f172a" fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                      {disc.code.split('-')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Measurement HUD */}
            <div className="mt-2 w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-center font-mono text-xs">
              <span className="text-slate-500 mr-2">Digital Caliper:</span>
              <span className="text-cyan-300 font-bold">
                {selectedDisc.name} Halo: {currentDiameterMm} mm Ø (CLSI Breakpoint: {selectedDisc.susceptibleThresholdMm} mm)
              </span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Inhibition Zone Diameter"
            value={currentDiameterMm}
            unit="mm"
            subValue={`Threshold: ≥ ${selectedDisc.susceptibleThresholdMm} mm`}
            tone={isSusceptible ? 'emerald' : isResistant ? 'rose' : 'amber'}
          />

          <MetricCard
            label="Antimicrobial Sensitivity"
            value={isSusceptible ? 'Susceptible' : isResistant ? 'Resistant' : 'Intermediate'}
            subValue={selectedDisc.name}
            tone={isSusceptible ? 'emerald' : isResistant ? 'rose' : 'amber'}
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Kirby-Bauer Antimicrobial Susceptibility
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              Antibiotics diffuse outward into agar. Bacteria cannot grow where the concentration is greater than the Minimum Inhibitory Concentration (MIC).
            </p>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
