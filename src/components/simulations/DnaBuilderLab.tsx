import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Dna, ArrowRight, Play, RotateCcw } from 'lucide-react';

const CODON_TABLE: Record<string, string> = {
  AUG: 'Met (Start)',
  UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu',
  UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser',
  UAU: 'Tyr', UAC: 'Tyr', UAA: 'STOP', UAG: 'STOP',
  UGU: 'Cys', UGC: 'Cys', UGA: 'STOP', UGG: 'Trp',
  CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu',
  CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
  CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln',
  CGU: 'Arg', CGC: 'Arg', CGA: 'Arg', CGG: 'Arg',
  AUU: 'Ile', AUC: 'Ile', AUA: 'Ile',
  ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr',
  AAU: 'Asn', AAC: 'Asn', AAA: 'Lys', AAG: 'Lys',
  AGU: 'Ser', AGC: 'Ser', AGA: 'Arg', AGG: 'Arg',
  GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val',
  GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala',
  GAU: 'Asp', GAC: 'Asp', GAA: 'Glu', GAG: 'Glu',
  GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
};

const BASE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  A: { bg: 'bg-emerald-950/70', text: 'text-emerald-300', border: 'border-emerald-600' },
  T: { bg: 'bg-rose-950/70', text: 'text-rose-300', border: 'border-rose-600' },
  C: { bg: 'bg-blue-950/70', text: 'text-blue-300', border: 'border-blue-600' },
  G: { bg: 'bg-amber-950/70', text: 'text-amber-300', border: 'border-amber-600' },
  U: { bg: 'bg-purple-950/70', text: 'text-purple-300', border: 'border-purple-600' },
};

interface DnaBuilderLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const DnaBuilderLab: React.FC<DnaBuilderLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['dna-builder'];

  // Leading template DNA strand (5' -> 3')
  const [dnaStrand, setDnaStrand] = useState<string[]>(['T', 'A', 'C', 'C', 'C', 'T', 'G', 'A', 'A', 'A', 'C', 'T']);
  const [isTranscribed, setIsTranscribed] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);

  // Complementary DNA strand (3' -> 5')
  const compDnaStrand = dnaStrand.map((b) => (b === 'A' ? 'T' : b === 'T' ? 'A' : b === 'C' ? 'G' : 'C'));

  // mRNA transcript (5' -> 3', T -> A, A -> U, C -> G, G -> C)
  const mrnaStrand = dnaStrand.map((b) => (b === 'T' ? 'A' : b === 'A' ? 'U' : b === 'C' ? 'G' : 'C'));

  // Translation triplets into amino acids
  const aminoAcids: string[] = [];
  if (isTranslated) {
    for (let i = 0; i < mrnaStrand.length - 2; i += 3) {
      const codon = mrnaStrand.slice(i, i + 3).join('');
      aminoAcids.push(CODON_TABLE[codon] || 'Unknown');
    }
  }

  const handleAddBase = (base: 'A' | 'T' | 'C' | 'G') => {
    if (dnaStrand.length >= 15) return;
    setDnaStrand((prev) => [...prev, base]);
    setIsTranscribed(false);
    setIsTranslated(false);
  };

  const handleRemoveBase = () => {
    if (dnaStrand.length <= 3) return;
    setDnaStrand((prev) => prev.slice(0, -1));
    setIsTranscribed(false);
    setIsTranslated(false);
  };

  const resetDna = () => {
    setDnaStrand(['T', 'A', 'C', 'C', 'C', 'T', 'G', 'A', 'A', 'A', 'C', 'T']);
    setIsTranscribed(false);
    setIsTranslated(false);
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetDna}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'DNA Template (3\'-5\')': dnaStrand.join(''),
        'Complementary Strand': compDnaStrand.join(''),
        'mRNA Transcript': isTranscribed ? mrnaStrand.join('') : 'Not Transcribed',
        'Peptide Sequence': isTranslated ? aminoAcids.join(' - ') : 'Not Translated',
        'Total Base Pairs': dnaStrand.length,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Nucleotide Dispenser Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Nucleotide Synthesizer</span>
              <Dna className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Nitrogenous Base Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => handleAddBase('A')}
                className="p-3 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600 rounded-lg text-left transition-colors"
              >
                <div className="text-base font-bold font-mono text-emerald-300">Adenine (A)</div>
                <div className="text-[10px] text-slate-400">Purine · 2 H-Bonds with T</div>
              </button>

              <button
                onClick={() => handleAddBase('T')}
                className="p-3 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-600 rounded-lg text-left transition-colors"
              >
                <div className="text-base font-bold font-mono text-rose-300">Thymine (T)</div>
                <div className="text-[10px] text-slate-400">Pyrimidine · Pairs with A</div>
              </button>

              <button
                onClick={() => handleAddBase('C')}
                className="p-3 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-600 rounded-lg text-left transition-colors"
              >
                <div className="text-base font-bold font-mono text-blue-300">Cytosine (C)</div>
                <div className="text-[10px] text-slate-400">Pyrimidine · 3 H-Bonds with G</div>
              </button>

              <button
                onClick={() => handleAddBase('G')}
                className="p-3 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-600 rounded-lg text-left transition-colors"
              >
                <div className="text-base font-bold font-mono text-amber-300">Guanine (G)</div>
                <div className="text-[10px] text-slate-400">Purine · Pairs with C</div>
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={handleRemoveBase}
                className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded"
              >
                Delete Last Base
              </button>
              <button
                onClick={resetDna}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded"
              >
                Reset
              </button>
            </div>

            {/* Central Dogma Action Stepper */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsTranscribed(true)}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors ${
                  isTranscribed
                    ? 'bg-purple-950 border border-purple-500 text-purple-200'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Step 1: Transcribe to mRNA (RNA Polymerase)</span>
              </button>

              <button
                disabled={!isTranscribed}
                onClick={() => setIsTranslated(true)}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors ${
                  !isTranscribed
                    ? 'opacity-40 bg-slate-800 text-slate-500'
                    : isTranslated
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-200'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Step 2: Translate to Peptide (Ribosome)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Double Helix & Codons Visualizer */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="w-full space-y-5">
              {/* Strand 1: DNA Leading Strand (3' -> 5') */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                  <span>DNA TEMPLATE STRAND (3' ⟶ 5')</span>
                  <span>{dnaStrand.length} Nucleotides</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {dnaStrand.map((b, i) => (
                    <div
                      key={i}
                      className={`w-8 h-10 rounded border flex items-center justify-center font-mono font-bold text-sm ${BASE_COLORS[b].bg} ${BASE_COLORS[b].text} ${BASE_COLORS[b].border}`}
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hydrogen Bonds Connecting Strands */}
              <div className="flex gap-1.5 overflow-x-auto pl-1">
                {dnaStrand.map((b, i) => (
                  <div key={i} className="w-8 flex flex-col items-center justify-center text-[10px] font-mono text-slate-600">
                    <span>{b === 'A' || b === 'T' ? '||' : '|||'}</span>
                  </div>
                ))}
              </div>

              {/* Strand 2: DNA Complementary Strand (5' -> 3') */}
              <div>
                <div className="text-[10px] font-mono text-slate-400 mb-1">
                  DNA COMPLEMENTARY STRAND (5' ⟶ 3')
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {compDnaStrand.map((b, i) => (
                    <div
                      key={i}
                      className={`w-8 h-10 rounded border flex items-center justify-center font-mono font-bold text-sm ${BASE_COLORS[b].bg} ${BASE_COLORS[b].text} ${BASE_COLORS[b].border}`}
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              {/* mRNA Transcript Strand */}
              {isTranscribed && (
                <div className="pt-3 border-t border-slate-800">
                  <div className="text-[10px] font-mono text-purple-400 mb-1">
                    SINGLE-STRANDED mRNA TRANSCRIPT (5' ⟶ 3') [URACIL REPLACES THYMINE]
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {mrnaStrand.map((b, i) => (
                      <div
                        key={i}
                        className={`w-8 h-10 rounded border flex items-center justify-center font-mono font-bold text-sm ${BASE_COLORS[b].bg} ${BASE_COLORS[b].text} ${BASE_COLORS[b].border}`}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Translated Peptide Chain */}
              {isTranslated && (
                <div className="pt-3 border-t border-slate-800">
                  <div className="text-[10px] font-mono text-emerald-400 mb-1">
                    POLYPEPTIDE AMINO ACID SEQUENCE (N-TERMINUS ⟶ C-TERMINUS)
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {aminoAcids.map((aa, i) => (
                      <React.Fragment key={i}>
                        <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-mono font-bold">
                          {aa}
                        </div>
                        {i < aminoAcids.length - 1 && (
                          <span className="text-slate-600 font-mono">─</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Strand Length"
            value={dnaStrand.length}
            unit="bp"
            subValue="Base Pairs"
            tone="default"
          />

          <MetricCard
            label="Hydrogen Bonds Count"
            value={dnaStrand.reduce((acc, b) => acc + (b === 'A' || b === 'T' ? 2 : 3), 0)}
            unit="bonds"
            subValue="Thermal Stability"
            tone="cyan"
          />

          <MetricCard
            label="Codons Count"
            value={Math.floor(dnaStrand.length / 3)}
            unit="triplets"
            subValue={`${Math.floor(dnaStrand.length / 3)} Amino Acids`}
            tone="emerald"
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Central Dogma of Molecular Biology
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              DNA stores genetic information, transcribed into messenger RNA by RNA Polymerase, and translated into proteins at the ribosome.
            </p>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] text-cyan-300">
              Universal Start Codon: AUG (Methionine)<br />
              Stop Codons: UAA, UAG, UGA
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
