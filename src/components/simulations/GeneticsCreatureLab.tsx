import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Sparkles, Dna, Shuffle } from 'lucide-react';

interface CreatureTraits {
  antennaGlow: 'BB' | 'Bb' | 'bb'; // B = Cyan Glow, b = Amber Glow
  wings: 'WW' | 'Ww' | 'ww'; // W = Wings, w = Wingless
  bodyColor: 'CC' | 'Cc' | 'cc'; // C = Emerald, c = Violet
}

interface HatchedCreature {
  id: string;
  name: string;
  genotype: CreatureTraits;
  phenotype: {
    glowColor: string;
    glowName: string;
    hasWings: boolean;
    bodyHex: string;
    bodyName: string;
  };
}

interface GeneticsCreatureLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const GeneticsCreatureLab: React.FC<GeneticsCreatureLabProps> = ({
  onAskAi,
  onLogObservation,
}) => {
  const experiment = EXPERIMENT_DETAILS['genetics-creature'];

  // Maternal & Paternal genotypes
  const [motherGenotype, setMotherGenotype] = useState<CreatureTraits>({
    antennaGlow: 'Bb',
    wings: 'Ww',
    bodyColor: 'Cc',
  });

  const [fatherGenotype, setFatherGenotype] = useState<CreatureTraits>({
    antennaGlow: 'Bb',
    wings: 'ww',
    bodyColor: 'CC',
  });

  const [offspringList, setOffspringList] = useState<HatchedCreature[]>([
    {
      id: 'xenobio-1',
      name: 'Alpha Offspring',
      genotype: { antennaGlow: 'Bb', wings: 'Ww', bodyColor: 'CC' },
      phenotype: {
        glowColor: '#06b6d4',
        glowName: 'Bioluminescent Cyan',
        hasWings: true,
        bodyHex: '#10b981',
        bodyName: 'Emerald Green Scales',
      },
    },
  ]);

  const [selectedOffspring, setSelectedOffspring] = useState<HatchedCreature>(offspringList[0]);

  // Cross one gene pair using Punnett square
  const crossGene = (m: string, f: string): string => {
    const mAlleles = m.split('');
    const fAlleles = f.split('');
    const mPick = mAlleles[Math.floor(Math.random() * 2)];
    const fPick = fAlleles[Math.floor(Math.random() * 2)];
    const pair = [mPick, fPick].sort(); // Dominant uppercase first
    if (pair[0].toLowerCase() === pair[0] && pair[1].toUpperCase() === pair[1]) {
      return pair[1] + pair[0];
    }
    return pair.join('');
  };

  const handleBreed = () => {
    const childGlow = crossGene(motherGenotype.antennaGlow, fatherGenotype.antennaGlow) as 'BB' | 'Bb' | 'bb';
    const childWings = crossGene(motherGenotype.wings, fatherGenotype.wings) as 'WW' | 'Ww' | 'ww';
    const childColor = crossGene(motherGenotype.bodyColor, fatherGenotype.bodyColor) as 'CC' | 'Cc' | 'cc';

    const hasDominantGlow = childGlow.includes('B');
    const hasWings = childWings.includes('W');
    const hasDominantColor = childColor.includes('C');

    const newChild: HatchedCreature = {
      id: `xenobio-${Date.now()}`,
      name: `Xenobio Gen-${offspringList.length + 1}`,
      genotype: {
        antennaGlow: childGlow,
        wings: childWings,
        bodyColor: childColor,
      },
      phenotype: {
        glowColor: hasDominantGlow ? '#06b6d4' : '#f59e0b',
        glowName: hasDominantGlow ? 'Bioluminescent Cyan (Dominant)' : 'Amber Warm (Recessive)',
        hasWings: hasWings,
        bodyHex: hasDominantColor ? '#10b981' : '#8b5cf6',
        bodyName: hasDominantColor ? 'Emerald Scales (Dominant)' : 'Violet Obsidian (Recessive)',
      },
    };

    setOffspringList((prev) => [newChild, ...prev.slice(0, 7)]);
    setSelectedOffspring(newChild);
  };

  const resetGenetics = () => {
    setMotherGenotype({ antennaGlow: 'Bb', wings: 'Ww', bodyColor: 'Cc' });
    setFatherGenotype({ antennaGlow: 'Bb', wings: 'ww', bodyColor: 'CC' });
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetGenetics}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Selected Offspring': selectedOffspring.name,
        'Antenna Genotype': selectedOffspring.genotype.antennaGlow,
        'Wing Genotype': selectedOffspring.genotype.wings,
        'Color Genotype': selectedOffspring.genotype.bodyColor,
        'Antenna Phenotype': selectedOffspring.phenotype.glowName,
        'Wing Phenotype': selectedOffspring.phenotype.hasWings ? 'Winged' : 'Wingless',
        'Body Phenotype': selectedOffspring.phenotype.bodyName,
        'Total Hatched': offspringList.length,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Parent Genotypes Selection */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Parental Genotypes</span>
              <Dna className="w-4 h-4 text-cyan-400" />
            </h2>

            {/* Maternal Parent Controls */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-3">
              <span className="text-xs font-mono font-bold text-rose-300 block mb-2">
                ♀ Maternal Parent (Mother)
              </span>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Antenna:</span>
                  <select
                    value={motherGenotype.antennaGlow}
                    onChange={(e) =>
                      setMotherGenotype((prev) => ({ ...prev, antennaGlow: e.target.value as any }))
                    }
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                  >
                    <option value="BB">BB (Homozygous Dominant)</option>
                    <option value="Bb">Bb (Heterozygous)</option>
                    <option value="bb">bb (Homozygous Recessive)</option>
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Wings:</span>
                  <select
                    value={motherGenotype.wings}
                    onChange={(e) =>
                      setMotherGenotype((prev) => ({ ...prev, wings: e.target.value as any }))
                    }
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                  >
                    <option value="WW">WW (Winged)</option>
                    <option value="Ww">Ww (Winged)</option>
                    <option value="ww">ww (Wingless)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Paternal Parent Controls */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-4">
              <span className="text-xs font-mono font-bold text-blue-300 block mb-2">
                ♂ Paternal Parent (Father)
              </span>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Antenna:</span>
                  <select
                    value={fatherGenotype.antennaGlow}
                    onChange={(e) =>
                      setFatherGenotype((prev) => ({ ...prev, antennaGlow: e.target.value as any }))
                    }
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                  >
                    <option value="BB">BB (Homozygous Dominant)</option>
                    <option value="Bb">Bb (Heterozygous)</option>
                    <option value="bb">bb (Homozygous Recessive)</option>
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Wings:</span>
                  <select
                    value={fatherGenotype.wings}
                    onChange={(e) =>
                      setFatherGenotype((prev) => ({ ...prev, wings: e.target.value as any }))
                    }
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                  >
                    <option value="WW">WW (Winged)</option>
                    <option value="Ww">Ww (Winged)</option>
                    <option value="ww">ww (Wingless)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Breed Action Button */}
            <button
              onClick={handleBreed}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Shuffle className="w-4 h-4" />
              <span>Cross Parents & Hatch Offspring</span>
            </button>
          </div>
        </div>

        {/* Center Live Hatched Creature SVG & Incubator */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              BIO-INCUBATOR POD · {selectedOffspring.name}
            </div>

            {/* Interactive Fictional Xenobio Creature SVG */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Creature Wings if present */}
                {selectedOffspring.phenotype.hasWings && (
                  <g opacity="0.85">
                    {/* Left draconic wing */}
                    <path
                      d="M 90 90 Q 20 40 10 70 Q 30 110 85 105 Z"
                      fill="rgba(56, 189, 248, 0.4)"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    {/* Right draconic wing */}
                    <path
                      d="M 110 90 Q 180 40 190 70 Q 170 110 115 105 Z"
                      fill="rgba(56, 189, 248, 0.4)"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* Creature Body (Scales color based on genotype) */}
                <ellipse
                  cx="100"
                  cy="115"
                  rx="45"
                  ry="50"
                  fill={selectedOffspring.phenotype.bodyHex}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                />

                {/* Big expressive bioluminescent alien eyes */}
                <circle cx="82" cy="105" r="12" fill="#ffffff" />
                <circle cx="82" cy="105" r="7" fill="#0f172a" />
                <circle cx="85" cy="102" r="3" fill="#ffffff" />

                <circle cx="118" cy="105" r="12" fill="#ffffff" />
                <circle cx="118" cy="105" r="7" fill="#0f172a" />
                <circle cx="121" cy="102" r="3" fill="#ffffff" />

                {/* Friendly mouth */}
                <path d="M 92 130 Q 100 138 108 130" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

                {/* Bioluminescent Antenna with Glow Bulb */}
                <path d="M 100 65 Q 90 40 100 25" fill="none" stroke="#64748b" strokeWidth="3" />
                <circle
                  cx="100"
                  cy="25"
                  r="10"
                  fill={selectedOffspring.phenotype.glowColor}
                  className="filter drop-shadow-[0_0_12px_currentColor] animate-pulse"
                />
              </svg>
            </div>

            {/* Hatched Generation Pedigree Chips */}
            <div className="w-full mt-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                Recent Hatched Offspring Pedigree:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {offspringList.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedOffspring(c)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap border transition-colors ${
                      selectedOffspring.id === c.id
                        ? 'bg-slate-800 border-cyan-400 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Antenna Genotype"
            value={selectedOffspring.genotype.antennaGlow}
            subValue={selectedOffspring.phenotype.glowName}
            tone={selectedOffspring.genotype.antennaGlow.includes('B') ? 'cyan' : 'amber'}
          />

          <MetricCard
            label="Wing Genotype"
            value={selectedOffspring.genotype.wings}
            subValue={selectedOffspring.phenotype.hasWings ? 'Winged Phenotype' : 'Wingless'}
            tone={selectedOffspring.phenotype.hasWings ? 'cyan' : 'default'}
          />

          <MetricCard
            label="Body Color Genotype"
            value={selectedOffspring.genotype.bodyColor}
            subValue={selectedOffspring.phenotype.bodyName}
            tone="default"
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Mendelian Punnett Ratios
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-2">
              Crossing two heterozygotes (Bb × Bb) produces a 1:2:1 genotypic ratio (1 BB : 2 Bb : 1 bb) and a 3:1 dominant phenotypic ratio.
            </p>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
