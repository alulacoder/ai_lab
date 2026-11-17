import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Fingerprint, Droplets, Layers, CheckCircle2 } from 'lucide-react';

interface ForensicsCrimeLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const ForensicsCrimeLab: React.FC<ForensicsCrimeLabProps> = ({
  onAskAi,
  onLogObservation,
}) => {
  const experiment = EXPERIMENT_DETAILS['forensics-crime'];

  const [activeTab, setActiveTab] = useState<'fingerprint' | 'blood' | 'dna'>('blood');

  // Blood serology state
  const [addedAntiA, setAddedAntiA] = useState(false);
  const [addedAntiB, setAddedAntiB] = useState(false);
  const [addedAntiRh, setAddedAntiRh] = useState(false);

  // Gel Electrophoresis state
  const [voltageOn, setVoltageOn] = useState(true);
  const [gelProgress, setGelProgress] = useState(100);

  // Fingerprint selection
  const [inspectedSuspect, setInspectedSuspect] = useState<'A' | 'B' | 'C'>('B');

  const bloodTypeDetermined = addedAntiA && addedAntiB && addedAntiRh ? 'A Positive (A+)' : 'Testing in progress...';

  const resetForensics = () => {
    setAddedAntiA(false);
    setAddedAntiB(false);
    setAddedAntiRh(false);
    setVoltageOn(true);
    setGelProgress(100);
    setInspectedSuspect('B');
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetForensics}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Active Forensic Station': activeTab.toUpperCase(),
        'Crime Scene Blood Type': bloodTypeDetermined,
        'Suspect Fingerprint Inspected': `Suspect ${inspectedSuspect}`,
        'Fingerprint Minutiae Match': inspectedSuspect === 'B' ? 'MATCH CONFIRMED (12 Points)' : 'NON-MATCH (Incompatible Minutiae)',
        'DNA Gel Banding Match': 'Suspect B (Identical Allelic RFLP Bands)',
        'Prime Identified Culprit': 'Suspect B (Empirically Verified by all 3 Forensic Methods)',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Station Selector Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Forensic Laboratory Stations</span>
              <Fingerprint className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Station Tabs */}
            <div className="space-y-2 mb-4">
              <button
                onClick={() => setActiveTab('blood')}
                className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-colors flex items-center justify-between ${
                  activeTab === 'blood'
                    ? 'bg-slate-800 border-rose-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-rose-400" />
                  <span>1. ABO/Rh Blood Agglutination</span>
                </div>
                {addedAntiA && addedAntiB && addedAntiRh && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('fingerprint')}
                className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-colors flex items-center justify-between ${
                  activeTab === 'fingerprint'
                    ? 'bg-slate-800 border-cyan-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-cyan-400" />
                  <span>2. Latent Fingerprint Minutiae</span>
                </div>
                {inspectedSuspect === 'B' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('dna')}
                className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-colors flex items-center justify-between ${
                  activeTab === 'dna'
                    ? 'bg-slate-800 border-purple-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>3. Agarose Gel DNA Electrophoresis</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            {/* Suspect Database Dossier */}
            <div className="pt-3 border-t border-slate-800 text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-400 block mb-2">
                Suspect Profiles on File:
              </span>
              <div className="space-y-1.5 text-slate-300">
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span>Suspect A:</span>
                  <span className="text-slate-400">B+ Blood · Left Loop</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-amber-400 font-bold">Suspect B:</span>
                  <span className="text-amber-300">A+ Blood · Double Whorl</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span>Suspect C:</span>
                  <span className="text-slate-400">O- Blood · Plain Arch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Interactive Forensic Bench */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            {/* Station 1: Blood Typing */}
            {activeTab === 'blood' && (
              <div className="w-full flex flex-col items-center">
                <span className="text-xs font-mono text-slate-400 mb-3">
                  WELL AGGLUTINATION TILE (CRIME SCENE BLOOD)
                </span>

                {/* Porcelain Well Tile with 3 Wells */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {/* Anti-A Well */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-400 mb-1">Well 1: Anti-A</span>
                    <div
                      onClick={() => setAddedAntiA(true)}
                      className="w-20 h-20 rounded-full border-2 border-slate-700 bg-slate-950 cursor-pointer flex items-center justify-center relative overflow-hidden shadow-inner hover:border-slate-500"
                    >
                      {/* Blood droplet */}
                      <div className="w-14 h-14 rounded-full bg-rose-700 flex items-center justify-center">
                        {addedAntiA ? (
                          // Clumped agglutination granules
                          <div className="w-full h-full flex flex-wrap p-2 gap-1 items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-950 shadow" />
                            <div className="w-3 h-3 rounded-full bg-rose-950 shadow" />
                            <div className="w-2 h-2 rounded-full bg-rose-950 shadow" />
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-950 shadow" />
                          </div>
                        ) : (
                          <span className="text-[9px] font-mono text-white/80">Smooth</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 mt-1">
                      {addedAntiA ? 'CLUMPED (+)' : 'Click to add Anti-A'}
                    </span>
                  </div>

                  {/* Anti-B Well */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-400 mb-1">Well 2: Anti-B</span>
                    <div
                      onClick={() => setAddedAntiB(true)}
                      className="w-20 h-20 rounded-full border-2 border-slate-700 bg-slate-950 cursor-pointer flex items-center justify-center relative overflow-hidden shadow-inner hover:border-slate-500"
                    >
                      <div className="w-14 h-14 rounded-full bg-rose-600 flex items-center justify-center">
                        {addedAntiB ? (
                          <span className="text-[9px] font-mono text-white/80">Smooth</span>
                        ) : (
                          <span className="text-[9px] font-mono text-white/80">Smooth</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      {addedAntiB ? 'NO CLUMP (-)' : 'Click to add Anti-B'}
                    </span>
                  </div>

                  {/* Anti-Rh (D) Well */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-400 mb-1">Well 3: Anti-Rh</span>
                    <div
                      onClick={() => setAddedAntiRh(true)}
                      className="w-20 h-20 rounded-full border-2 border-slate-700 bg-slate-950 cursor-pointer flex items-center justify-center relative overflow-hidden shadow-inner hover:border-slate-500"
                    >
                      <div className="w-14 h-14 rounded-full bg-rose-700 flex items-center justify-center">
                        {addedAntiRh ? (
                          <div className="w-full h-full flex flex-wrap p-2 gap-1 items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-950 shadow" />
                            <div className="w-2 h-2 rounded-full bg-rose-950 shadow" />
                            <div className="w-3 h-3 rounded-full bg-rose-950 shadow" />
                          </div>
                        ) : (
                          <span className="text-[9px] font-mono text-white/80">Smooth</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 mt-1">
                      {addedAntiRh ? 'CLUMPED (+)' : 'Click to add Anti-Rh'}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center font-mono text-xs">
                  <span className="text-slate-400">Diagnosis: </span>
                  <span className="text-white font-bold">{bloodTypeDetermined}</span>
                </div>
              </div>
            )}

            {/* Station 2: Fingerprint Minutiae */}
            {activeTab === 'fingerprint' && (
              <div className="w-full flex flex-col items-center">
                <span className="text-xs font-mono text-slate-400 mb-2">
                  SPLIT-SCREEN COMPARISON MICROSCOPE
                </span>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-3">
                  {/* Crime Scene Print */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                    <span className="text-[10px] font-mono text-rose-400 block mb-1">Crime Scene Latent Print</span>
                    <div className="w-28 h-28 mx-auto border border-slate-700 rounded-lg flex items-center justify-center bg-slate-900/60 relative">
                      <Fingerprint className="w-20 h-20 text-rose-300 opacity-80" />
                      {/* Minutiae matching points */}
                      <circle cx="50" cy="45" r="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                      <circle cx="65" cy="70" r="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-1 block">Pattern: Double Whorl</span>
                  </div>

                  {/* Suspect Print */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-mono text-cyan-400">Suspect {inspectedSuspect}</span>
                      <select
                        value={inspectedSuspect}
                        onChange={(e) => setInspectedSuspect(e.target.value as any)}
                        className="bg-slate-900 text-[10px] border border-slate-700 text-white rounded px-1"
                      >
                        <option value="A">Suspect A</option>
                        <option value="B">Suspect B</option>
                        <option value="C">Suspect C</option>
                      </select>
                    </div>
                    <div className="w-28 h-28 mx-auto border border-slate-700 rounded-lg flex items-center justify-center bg-slate-900/60 relative">
                      <Fingerprint
                        className={`w-20 h-20 opacity-80 ${
                          inspectedSuspect === 'B' ? 'text-rose-300' : 'text-slate-400'
                        }`}
                      />
                      {inspectedSuspect === 'B' && (
                        <>
                          <circle cx="50" cy="45" r="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                          <circle cx="65" cy="70" r="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                        </>
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-mono mt-1 block font-bold ${
                        inspectedSuspect === 'B' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {inspectedSuspect === 'B' ? '12 RIDGE MINUTIAE MATCH' : 'NO PATTERN MATCH'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Station 3: DNA Gel Electrophoresis */}
            {activeTab === 'dna' && (
              <div className="w-full flex flex-col items-center">
                <span className="text-xs font-mono text-slate-400 mb-2">
                  BLUE-LIGHT TRANSILLUMINATOR · 1.2% AGAROSE GEL
                </span>

                {/* Gel Chamber SVG */}
                <svg className="w-72 h-56 bg-slate-950 rounded-lg border border-slate-800" viewBox="0 0 280 200">
                  {/* Cathode (-) top, Anode (+) bottom */}
                  <text x="140" y="15" fill="#f43f5e" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    CATHODE (-) TOP
                  </text>
                  <text x="140" y="195" fill="#38bdf8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    ANODE (+) BOTTOM · 100V DC
                  </text>

                  {/* Gel Lanes: Ladder, Scene, Suspect A, Suspect B, Suspect C */}
                  {[
                    { label: 'Ladder', x: 35, bands: [30, 50, 75, 105, 140, 170] },
                    { label: 'Scene', x: 85, bands: [50, 90, 140] },
                    { label: 'Susp A', x: 135, bands: [40, 75, 120] },
                    { label: 'Susp B', x: 185, bands: [50, 90, 140] }, // MATCH!
                    { label: 'Susp C', x: 235, bands: [60, 105, 160] },
                  ].map((lane) => (
                    <g key={lane.label}>
                      {/* Well at top */}
                      <rect x={lane.x - 12} y="25" width="24" height="6" fill="#1e293b" stroke="#475569" />
                      <text x={lane.x} y="40" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                        {lane.label}
                      </text>

                      {/* DNA Fragment Fluorescent Bands */}
                      {lane.bands.map((y, idx) => (
                        <rect
                          key={idx}
                          x={lane.x - 10}
                          y={y}
                          width="20"
                          height="3"
                          rx="1"
                          fill={lane.label === 'Scene' || lane.label === 'Susp B' ? '#38bdf8' : '#22c55e'}
                          className="filter drop-shadow-[0_0_4px_currentColor]"
                        />
                      ))}
                    </g>
                  ))}
                </svg>

                <div className="mt-2 w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-center font-mono text-xs">
                  <span className="text-emerald-400 font-bold">
                    DNA Bands: Suspect B restriction fragments perfectly align with Crime Scene DNA!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Blood Serology Result"
            value={bloodTypeDetermined}
            subValue="ABO / Rh Antigen Status"
            tone={addedAntiA && addedAntiB && addedAntiRh ? 'emerald' : 'default'}
          />

          <MetricCard
            label="Fingerprint Pattern"
            value={inspectedSuspect === 'B' ? 'Matched' : 'Mismatched'}
            subValue={`Suspect ${inspectedSuspect} vs Crime Scene`}
            tone={inspectedSuspect === 'B' ? 'emerald' : 'rose'}
          />

          <MetricCard
            label="Identified Perpetrator"
            value="Suspect B"
            subValue="Conclusive Triple Forensic Corroboration"
            tone="emerald"
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Locard's Exchange Principle
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              "Every contact leaves a trace." Physical evidence (DNA, blood antigen, papillary ridge minutiae) provides indisputable empirical proof.
            </p>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
