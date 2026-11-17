import React, { useState, useEffect } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Thermometer, Droplets, RotateCcw, AlertTriangle } from 'lucide-react';

interface Reagent {
  id: string;
  name: string;
  formula: string;
  color: string; // CSS color
  solutionColor: string; // rgba
  pH: number;
  initialTemp: number; // °C
}

const REAGENTS: Reagent[] = [
  { id: 'agno3', name: 'Silver Nitrate (0.1M)', formula: 'AgNO₃', color: '#e2e8f0', solutionColor: 'rgba(226, 232, 240, 0.25)', pH: 5.5, initialTemp: 21.0 },
  { id: 'nacl', name: 'Sodium Chloride (0.1M)', formula: 'NaCl', color: '#f8fafc', solutionColor: 'rgba(248, 250, 252, 0.2)', pH: 7.0, initialTemp: 21.0 },
  { id: 'cuso4', name: 'Copper(II) Sulfate (0.2M)', formula: 'CuSO₄', color: '#38bdf8', solutionColor: 'rgba(56, 189, 248, 0.65)', pH: 4.2, initialTemp: 21.0 },
  { id: 'naoh', name: 'Sodium Hydroxide (1.0M)', formula: 'NaOH', color: '#e0e7ff', solutionColor: 'rgba(224, 231, 255, 0.3)', pH: 13.8, initialTemp: 21.0 },
  { id: 'ki', name: 'Potassium Iodide (0.5M)', formula: 'KI', color: '#fef08a', solutionColor: 'rgba(254, 240, 138, 0.25)', pH: 7.0, initialTemp: 21.0 },
  { id: 'pbno32', name: 'Lead(II) Nitrate (0.2M)', formula: 'Pb(NO₃)₂', color: '#cbd5e1', solutionColor: 'rgba(203, 213, 225, 0.25)', pH: 4.5, initialTemp: 21.0 },
  { id: 'hcl', name: 'Hydrochloric Acid (1.0M)', formula: 'HCl', color: '#fed7aa', solutionColor: 'rgba(254, 215, 170, 0.2)', pH: 0.1, initialTemp: 21.0 },
  { id: 'nahco3', name: 'Sodium Bicarbonate (1.0M)', formula: 'NaHCO₃', color: '#e2e8f0', solutionColor: 'rgba(226, 232, 240, 0.35)', pH: 8.4, initialTemp: 21.0 },
];

interface ChemistryLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const ChemistryLab: React.FC<ChemistryLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['chemical-reactions'];

  const [tube1Reagent, setTube1Reagent] = useState<Reagent | null>(REAGENTS[0]); // AgNO3
  const [tube2Reagent, setTube2Reagent] = useState<Reagent | null>(REAGENTS[1]); // NaCl
  const [isMixed, setIsMixed] = useState(false);
  const [stirringSpeed, setStirringSpeed] = useState(2);
  const [temperature, setTemperature] = useState(21.0);
  const [currentPH, setCurrentPH] = useState(7.0);
  const [precipitateYield, setPrecipitateYield] = useState(0); // grams
  const [precipitateType, setPrecipitateType] = useState<string | null>(null);
  const [reactionEquation, setReactionEquation] = useState<string>('Select two reagents to mix');
  const [effervescence, setEffervescence] = useState(false);

  const resetSimulation = () => {
    setIsMixed(false);
    setTemperature(21.0);
    setCurrentPH(7.0);
    setPrecipitateYield(0);
    setPrecipitateType(null);
    setEffervescence(false);
    setReactionEquation('Awaiting reagent combination');
  };

  const handleMix = () => {
    if (!tube1Reagent || !tube2Reagent) return;
    setIsMixed(true);

    const ids = [tube1Reagent.id, tube2Reagent.id].sort().join('+');

    if (ids === 'agno3+nacl') {
      // Silver chloride white precipitate
      setPrecipitateType('Silver Chloride (AgCl) - Curdy White Precipitate');
      setReactionEquation('AgNO₃ (aq) + NaCl (aq) → AgCl (s) ↓ + NaNO₃ (aq)');
      setPrecipitateYield(1.43);
      setTemperature(24.5);
      setCurrentPH(6.1);
      setEffervescence(false);
    } else if (ids === 'cuso4+naoh') {
      // Copper hydroxide bright blue gelatinous precipitate
      setPrecipitateType('Copper(II) Hydroxide (Cu(OH)₂) - Royal Blue Gel');
      setReactionEquation('CuSO₄ (aq) + 2 NaOH (aq) → Cu(OH)₂ (s) ↓ + Na₂SO₄ (aq)');
      setPrecipitateYield(0.98);
      setTemperature(26.8);
      setCurrentPH(11.2);
      setEffervescence(false);
    } else if (ids === 'ki+pbno32') {
      // Lead iodide bright golden yellow precipitate
      setPrecipitateType('Lead(II) Iodide (PbI₂) - Dazzling Golden Yellow');
      setReactionEquation('Pb(NO₃)₂ (aq) + 2 KI (aq) → PbI₂ (s) ↓ + 2 KNO₃ (aq)');
      setPrecipitateYield(2.31);
      setTemperature(22.4);
      setCurrentPH(6.2);
      setEffervescence(false);
    } else if (ids === 'hcl+nahco3') {
      // Carbon dioxide effervescence endothermic
      setPrecipitateType('No precipitate (Vigorous CO₂ gas bubbling)');
      setReactionEquation('HCl (aq) + NaHCO₃ (aq) → NaCl (aq) + H₂O (l) + CO₂ (g) ↑');
      setPrecipitateYield(0);
      setTemperature(17.8); // Endothermic cooling!
      setCurrentPH(4.5);
      setEffervescence(true);
    } else if (ids === 'hcl+naoh') {
      // Classic strong acid strong base neutralization
      setPrecipitateType('No precipitate (Neutralization to Saltwater)');
      setReactionEquation('HCl (aq) + NaOH (aq) → NaCl (aq) + H₂O (l) + Heat');
      setPrecipitateYield(0);
      setTemperature(33.2); // Strongly exothermic!
      setCurrentPH(7.0);
      setEffervescence(false);
    } else {
      setPrecipitateType('No insoluble precipitate formed (Spectator Ions)');
      setReactionEquation('Ions remain dissociated in aqueous solution');
      setPrecipitateYield(0);
      setTemperature(21.2);
      setCurrentPH(((tube1Reagent.pH + tube2Reagent.pH) / 2));
      setEffervescence(false);
    }
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetSimulation}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Reagent A': tube1Reagent?.name || 'None',
        'Reagent B': tube2Reagent?.name || 'None',
        'Mixed State': isMixed ? 'Reacted' : 'Unmixed',
        'Solution Temperature': `${temperature.toFixed(1)} °C`,
        'pH Value': currentPH.toFixed(2),
        'Precipitate Mass': `${precipitateYield.toFixed(2)} g`,
        'Reaction': reactionEquation,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Reagent Selector Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Reagent Dispenser</span>
              <Droplets className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Tube 1 Reagent Select */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Flask A Solution:
              </label>
              <select
                disabled={isMixed}
                value={tube1Reagent?.id || ''}
                onChange={(e) => {
                  const r = REAGENTS.find((x) => x.id === e.target.value);
                  setTube1Reagent(r || null);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {REAGENTS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} [{r.formula}]
                  </option>
                ))}
              </select>
            </div>

            {/* Tube 2 Reagent Select */}
            <div className="mb-5">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Flask B Solution:
              </label>
              <select
                disabled={isMixed}
                value={tube2Reagent?.id || ''}
                onChange={(e) => {
                  const r = REAGENTS.find((x) => x.id === e.target.value);
                  setTube2Reagent(r || null);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {REAGENTS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} [{r.formula}]
                  </option>
                ))}
              </select>
            </div>

            {/* Magnetic Stirrer Speed */}
            <div className="mb-5">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>Magnetic Stirrer Speed:</span>
                <span className="text-cyan-400 font-semibold">{stirringSpeed * 250} RPM</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={stirringSpeed}
                onChange={(e) => setStirringSpeed(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!isMixed ? (
                <button
                  onClick={handleMix}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Droplets className="w-4 h-4" />
                  <span>Combine & React</span>
                </button>
              ) : (
                <button
                  onClick={resetSimulation}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Wash & Reset Reaction Beaker</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Reaction Presets */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Landmark Reaction Presets:
            </span>
            <div className="space-y-1.5">
              <button
                disabled={isMixed}
                onClick={() => {
                  setTube1Reagent(REAGENTS[0]); // AgNO3
                  setTube2Reagent(REAGENTS[1]); // NaCl
                }}
                className="w-full text-left px-3 py-1.5 text-xs bg-slate-950 hover:bg-slate-800 rounded border border-slate-800/80 text-slate-300 flex justify-between"
              >
                <span>AgNO₃ + NaCl</span>
                <span className="text-slate-500 font-mono">White AgCl ↓</span>
              </button>
              <button
                disabled={isMixed}
                onClick={() => {
                  setTube1Reagent(REAGENTS[2]); // CuSO4
                  setTube2Reagent(REAGENTS[3]); // NaOH
                }}
                className="w-full text-left px-3 py-1.5 text-xs bg-slate-950 hover:bg-slate-800 rounded border border-slate-800/80 text-slate-300 flex justify-between"
              >
                <span>CuSO₄ + NaOH</span>
                <span className="text-sky-400 font-mono">Blue Gel Cu(OH)₂ ↓</span>
              </button>
              <button
                disabled={isMixed}
                onClick={() => {
                  setTube1Reagent(REAGENTS[5]); // Pb(NO3)2
                  setTube2Reagent(REAGENTS[4]); // KI
                }}
                className="w-full text-left px-3 py-1.5 text-xs bg-slate-950 hover:bg-slate-800 rounded border border-slate-800/80 text-slate-300 flex justify-between"
              >
                <span>Pb(NO₃)₂ + KI</span>
                <span className="text-yellow-400 font-mono">Golden Rain PbI₂ ↓</span>
              </button>
              <button
                disabled={isMixed}
                onClick={() => {
                  setTube1Reagent(REAGENTS[6]); // HCl
                  setTube2Reagent(REAGENTS[7]); // NaHCO3
                }}
                className="w-full text-left px-3 py-1.5 text-xs bg-slate-950 hover:bg-slate-800 rounded border border-slate-800/80 text-slate-300 flex justify-between"
              >
                <span>HCl + NaHCO₃</span>
                <span className="text-teal-400 font-mono">CO₂ Effervescence ↑</span>
              </button>
              <button
                disabled={isMixed}
                onClick={() => {
                  setTube1Reagent(REAGENTS[6]); // HCl
                  setTube2Reagent(REAGENTS[3]); // NaOH
                }}
                className="w-full text-left px-3 py-1.5 text-xs bg-slate-950 hover:bg-slate-800 rounded border border-slate-800/80 text-slate-300 flex justify-between"
              >
                <span>HCl + NaOH (Neutralization)</span>
                <span className="text-amber-400 font-mono">Exothermic ΔH</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Reaction Chamber Canvas & Glassware */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              LABORATORY HOOD #04 · EXHAUST ACTIVE
            </div>

            {/* Glassware Visualization */}
            <div className="relative w-64 h-80 flex flex-col items-center justify-end">
              {/* Beaker Outline */}
              <div className="relative w-48 h-60 border-b-4 border-l-4 border-r-4 border-slate-400/40 rounded-b-3xl bg-slate-950/40 backdrop-blur-sm overflow-hidden flex flex-col justify-end shadow-inner">
                {/* Graduated markings */}
                <div className="absolute right-2 top-6 flex flex-col gap-6 text-[10px] font-mono text-slate-600">
                  <span>- 200 mL</span>
                  <span>- 150 mL</span>
                  <span>- 100 mL</span>
                  <span>- 50 mL</span>
                </div>

                {/* Liquid in Beaker */}
                <div
                  className="w-full transition-all duration-1000 ease-out relative flex items-end justify-center"
                  style={{
                    height: isMixed ? '70%' : '35%',
                    backgroundColor: isMixed
                      ? precipitateType?.includes('Golden')
                        ? 'rgba(234, 179, 8, 0.75)'
                        : precipitateType?.includes('Blue')
                        ? 'rgba(14, 165, 233, 0.8)'
                        : precipitateType?.includes('White')
                        ? 'rgba(241, 245, 249, 0.6)'
                        : 'rgba(56, 189, 248, 0.3)'
                      : tube1Reagent?.solutionColor || 'rgba(226, 232, 240, 0.2)',
                  }}
                >
                  {/* Stirring vortex or bubbles */}
                  {isMixed && stirringSpeed > 0 && (
                    <div
                      className="absolute inset-0 opacity-40 bg-gradient-to-t from-transparent via-white/20 to-transparent"
                      style={{
                        animation: `spin ${2 / stirringSpeed}s linear infinite`,
                      }}
                    />
                  )}

                  {/* Effervescence Bubbles */}
                  {effervescence && (
                    <div className="absolute inset-0 flex justify-around items-end overflow-hidden pb-2">
                      <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce delay-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/70 animate-bounce delay-200" />
                      <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce delay-500" />
                      <div className="w-1 h-1 rounded-full bg-white/70 animate-bounce delay-75" />
                    </div>
                  )}

                  {/* Precipitate sediment at bottom */}
                  {precipitateYield > 0 && (
                    <div
                      className="w-full transition-all duration-1000 rounded-b-2xl"
                      style={{
                        height: `${Math.min(precipitateYield * 12, 40)}px`,
                        backgroundColor: precipitateType?.includes('Golden')
                          ? '#eab308'
                          : precipitateType?.includes('Blue')
                          ? '#0284c7'
                          : '#f1f5f9',
                        boxShadow: '0 -2px 10px rgba(0,0,0,0.3)',
                      }}
                    />
                  )}
                </div>

                {/* Magnetic stir bar at base */}
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-200 rounded-full shadow"
                  style={{
                    transform:
                      stirringSpeed > 0
                        ? `translateX(-50%) rotate(${Date.now() % 360}deg)`
                        : 'translateX(-50%)',
                  }}
                />
              </div>

              {/* Magnetic Stirrer Base */}
              <div className="w-56 h-8 bg-slate-800 border border-slate-700 rounded-t-lg shadow-lg flex items-center justify-between px-4">
                <span className="text-[10px] font-mono text-cyan-400">CERAMIC HOTPLATE</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {stirringSpeed > 0 ? 'STIRRING' : 'IDLE'}
                </span>
              </div>
            </div>

            {/* Live Balanced Equation Banner */}
            <div className="mt-4 w-full bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-0.5">
                Observed Chemical Reaction Equation
              </span>
              <span className="text-xs md:text-sm font-mono font-semibold text-cyan-300">
                {reactionEquation}
              </span>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Solution Temperature"
            value={temperature.toFixed(1)}
            unit="°C"
            subValue={
              temperature > 22
                ? 'Exothermic (ΔH < 0)'
                : temperature < 20
                ? 'Endothermic (ΔH > 0)'
                : 'Ambient Equilibrium'
            }
            tone={temperature > 22 ? 'amber' : temperature < 20 ? 'cyan' : 'default'}
          />

          <MetricCard
            label="Solution pH Level"
            value={currentPH.toFixed(2)}
            unit="pH"
            subValue={
              currentPH < 6.5 ? 'Acidic' : currentPH > 7.5 ? 'Basic / Alkaline' : 'Neutral'
            }
            tone={currentPH < 6.5 ? 'rose' : currentPH > 7.5 ? 'cyan' : 'emerald'}
          />

          <MetricCard
            label="Precipitate Yield"
            value={precipitateYield.toFixed(2)}
            unit="g"
            subValue={precipitateType || 'Soluble Solution'}
            tone={precipitateYield > 0 ? 'emerald' : 'default'}
          />

          {/* Qualitative Observations Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Physical Observations
            </span>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Phase:</span>
                <span>{precipitateYield > 0 ? 'Solid Precipitate + Supernatant' : effervescence ? 'Liquid + Gas Evolution' : 'Homogeneous Solution'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Thermodynamics:</span>
                <span className={temperature > 21.5 ? 'text-amber-400' : temperature < 20.5 ? 'text-cyan-400' : 'text-slate-300'}>
                  {temperature > 21.5 ? 'Heat Released' : temperature < 20.5 ? 'Heat Absorbed' : 'Neutral'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ionic Solubility:</span>
                <span>{precipitateYield > 0 ? 'Ksp Exceeded (Insoluble)' : 'Fully Hydrated'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
