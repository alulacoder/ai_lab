import React, { useState, useEffect } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Zap, ToggleLeft, ToggleRight, Lightbulb, Gauge } from 'lucide-react';

interface CircuitBuilderLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const CircuitBuilderLab: React.FC<CircuitBuilderLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['circuit-builder'];

  const [voltage, setVoltage] = useState(9.0); // 9V DC
  const [resistor1, setResistor1] = useState(20); // 20 Ohms
  const [resistor2, setResistor2] = useState(30); // 30 Ohms
  const [isSwitchClosed, setIsSwitchClosed] = useState(true);
  const [topology, setTopology] = useState<'series' | 'parallel'>('series');
  const [tick, setTick] = useState(0);

  // Compute circuit parameters
  let totalResistance = 0;
  let totalCurrent = 0; // Amperes
  let current1 = 0;
  let current2 = 0;

  if (topology === 'series') {
    totalResistance = resistor1 + resistor2;
    totalCurrent = isSwitchClosed ? voltage / totalResistance : 0;
    current1 = totalCurrent;
    current2 = totalCurrent;
  } else {
    // Parallel
    totalResistance = (resistor1 * resistor2) / (resistor1 + resistor2);
    totalCurrent = isSwitchClosed ? voltage / totalResistance : 0;
    current1 = isSwitchClosed ? voltage / resistor1 : 0;
    current2 = isSwitchClosed ? voltage / resistor2 : 0;
  }

  const powerWatt = isSwitchClosed ? voltage * totalCurrent : 0;
  const bulbBrightness = Math.min(100, Math.round((current1 * current1 * 10) * 100)); // bulb is branch 1

  // Particle animation loop
  useEffect(() => {
    if (!isSwitchClosed || totalCurrent <= 0) return;
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, [isSwitchClosed, totalCurrent]);

  const resetCircuit = () => {
    setVoltage(9.0);
    setResistor1(20);
    setResistor2(30);
    setIsSwitchClosed(true);
    setTopology('series');
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetCircuit}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Circuit Topology': topology.toUpperCase(),
        'Supply Voltage': `${voltage.toFixed(1)} V`,
        'Switch State': isSwitchClosed ? 'CLOSED (Conducting)' : 'OPEN (Interrupted)',
        'Resistor 1 (Bulb)': `${resistor1} Ω`,
        'Resistor 2': `${resistor2} Ω`,
        'Total Equivalent Resistance': `${totalResistance.toFixed(1)} Ω`,
        'Total Circuit Current': `${(totalCurrent * 1000).toFixed(1)} mA`,
        'Total Electrical Power': `${powerWatt.toFixed(2)} W`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Controls Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Circuit Components</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Topology Switch */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Circuit Topology:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setTopology('series')}
                  className={`py-1.5 px-3 text-xs font-mono font-medium rounded transition-colors ${
                    topology === 'series'
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-800/60'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Series Circuit
                </button>
                <button
                  onClick={() => setTopology('parallel')}
                  className={`py-1.5 px-3 text-xs font-mono font-medium rounded transition-colors ${
                    topology === 'parallel'
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-800/60'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Parallel Circuit
                </button>
              </div>
            </div>

            {/* Knife Switch Toggle */}
            <div className="mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-medium text-slate-200 block">
                  SPST Knife Switch
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {isSwitchClosed ? 'Conducting Current' : 'Open Circuit (0 Amps)'}
                </span>
              </div>
              <button
                onClick={() => setIsSwitchClosed(!isSwitchClosed)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  isSwitchClosed
                    ? 'bg-emerald-950/70 border border-emerald-500 text-emerald-300'
                    : 'bg-rose-950/70 border border-rose-500 text-rose-300'
                }`}
              >
                {isSwitchClosed ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" /> CLOSED
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-rose-400" /> OPEN
                  </>
                )}
              </button>
            </div>

            {/* DC Power Supply Voltage */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>DC Source Voltage (V):</span>
                <span className="text-cyan-400 font-bold">{voltage.toFixed(1)} V</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="24.0"
                step="0.5"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>1.5V (AA)</span>
                <span>9V (Transistor)</span>
                <span>24V (Bench)</span>
              </div>
            </div>

            {/* Load 1: Bulb Resistance */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Load 1 (Light Bulb Filament R₁):</span>
                <span className="text-white font-bold">{resistor1} Ω</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={resistor1}
                onChange={(e) => setResistor1(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Load 2: Ceramic Resistor */}
            <div className="mb-2">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Load 2 (Ceramic Resistor R₂):</span>
                <span className="text-white font-bold">{resistor2} Ω</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={resistor2}
                onChange={(e) => setResistor2(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Center Interactive Breadboard / Circuit Schematic */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px]">
            {/* SVG Schematic Workbench */}
            <div className="relative w-full max-w-[420px] aspect-[4/3] bg-slate-950/80 rounded-xl border border-slate-800 p-4 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                {/* Copper Trace Wires */}
                {topology === 'series' ? (
                  <>
                    {/* Series Rectangle Loop */}
                    <path
                      d="M 60 70 L 340 70 L 340 230 L 60 230 Z"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />

                    {/* Animated Electron Drift Particles along path */}
                    {isSwitchClosed && totalCurrent > 0 && (
                      <path
                        d="M 60 70 L 340 70 L 340 230 L 60 230 Z"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        strokeDasharray="6 14"
                        strokeDashoffset={-tick * 2}
                        className="opacity-70"
                      />
                    )}
                  </>
                ) : (
                  <>
                    {/* Parallel Top and Bottom Rails */}
                    <path
                      d="M 60 70 L 340 70 M 60 230 L 340 230 M 60 70 L 60 230 M 200 70 L 200 230 M 340 70 L 340 230"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />

                    {/* Animated Electron Drift Particles for Parallel */}
                    {isSwitchClosed && totalCurrent > 0 && (
                      <path
                        d="M 60 70 L 340 70 M 60 230 L 340 230 M 60 70 L 60 230 M 200 70 L 200 230 M 340 70 L 340 230"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        strokeDasharray="6 14"
                        strokeDashoffset={-tick * 2}
                        className="opacity-70"
                      />
                    )}
                  </>
                )}

                {/* Left Side: Battery */}
                <g transform="translate(45, 130)">
                  <rect x="0" y="0" width="30" height="40" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <text x="15" y="24" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {voltage}V
                  </text>
                  <line x1="15" y1="-10" x2="15" y2="0" stroke="#f43f5e" strokeWidth="4" />
                  <text x="15" y="-12" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">+</text>
                  <line x1="15" y1="40" x2="15" y2="50" stroke="#0284c7" strokeWidth="4" />
                  <text x="15" y="60" fill="#0284c7" fontSize="10" fontWeight="bold" textAnchor="middle">-</text>
                </g>

                {/* Top Wire: Switch */}
                <g transform="translate(130, 50)">
                  <circle cx="10" cy="20" r="4" fill="#38bdf8" />
                  <circle cx="50" cy="20" r="4" fill="#38bdf8" />
                  <line
                    x1="10"
                    y1="20"
                    x2={isSwitchClosed ? '50' : '40'}
                    y2={isSwitchClosed ? '20' : '5'}
                    stroke={isSwitchClosed ? '#10b981' : '#f43f5e'}
                    strokeWidth="3"
                  />
                  <text x="30" y="4" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    {isSwitchClosed ? 'SWITCH CLOSED' : 'SWITCH OPEN'}
                  </text>
                </g>

                {/* Top/Branch 1: Lightbulb */}
                <g transform={topology === 'series' ? 'translate(250, 50)' : 'translate(185, 130)'}>
                  {/* Glowing halo */}
                  {isSwitchClosed && bulbBrightness > 0 && (
                    <circle
                      cx="15"
                      cy="20"
                      r={Math.min(30, 10 + bulbBrightness / 4)}
                      fill="#fef08a"
                      opacity={bulbBrightness / 120}
                      className="filter blur-md"
                    />
                  )}
                  {/* Bulb Icon */}
                  <circle
                    cx="15"
                    cy="20"
                    r="14"
                    fill={isSwitchClosed && bulbBrightness > 0 ? '#fef08a' : '#1e293b'}
                    stroke="#eab308"
                    strokeWidth="2"
                  />
                  <text
                    x="15"
                    y="24"
                    fill={isSwitchClosed && bulbBrightness > 0 ? '#854d0e' : '#94a3b8'}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    💡 {resistor1}Ω
                  </text>
                </g>

                {/* Branch 2 / Bottom: Resistor */}
                <g transform={topology === 'series' ? 'translate(180, 215)' : 'translate(325, 130)'}>
                  <rect x="0" y="0" width="30" height="30" rx="3" fill="#334155" stroke="#f59e0b" strokeWidth="2" />
                  <text x="15" y="19" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {resistor2}Ω
                  </text>
                </g>
              </svg>
            </div>

            {/* Live Ohm's Law Equation Banner */}
            <div className="mt-3 w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center font-mono text-xs">
              <span className="text-slate-500 mr-2">Ohm’s Law:</span>
              <span className="text-cyan-300 font-bold">
                I = V / R = {voltage.toFixed(1)}V / {totalResistance.toFixed(1)}Ω = {(totalCurrent * 1000).toFixed(1)} mA
              </span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Total Circuit Current (I)"
            value={(totalCurrent * 1000).toFixed(1)}
            unit="mA"
            subValue={isSwitchClosed ? 'Active Conduction' : 'Circuit Broken'}
            tone={isSwitchClosed && totalCurrent > 0 ? 'cyan' : 'default'}
          />

          <MetricCard
            label="Equivalent Resistance (R_eq)"
            value={totalResistance.toFixed(1)}
            unit="Ω"
            subValue={topology === 'series' ? 'R_eq = R₁ + R₂' : '1/R_eq = 1/R₁ + 1/R₂'}
            tone="default"
          />

          <MetricCard
            label="Bulb Power Consumption (P)"
            value={powerWatt.toFixed(2)}
            unit="W"
            subValue={`Filament Output: ${bulbBrightness}%`}
            tone={powerWatt > 0 ? 'amber' : 'default'}
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Branch Breakdown
            </span>
            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Branch 1 (Bulb):</span>
                <span className="text-cyan-400 font-bold">{(current1 * 1000).toFixed(1)} mA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Branch 2 (Resistor):</span>
                <span className="text-amber-400 font-bold">{(current2 * 1000).toFixed(1)} mA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Voltage Drop V₁:</span>
                <span>{(current1 * resistor1).toFixed(1)} V</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
