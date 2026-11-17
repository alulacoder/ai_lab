import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  FlaskConical,
  Zap,
  Dna,
  Bug,
  Orbit,
  Mountain,
  Fingerprint,
  Cog,
  Award,
  Sparkles,
  Package,
  Layers,
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departmentsData';
import { DepartmentId } from '../../types/laboratory';

interface HomeFacilityProps {
  onSelectExperiment: (expId: string) => void;
  onSelectDepartment: (deptId: DepartmentId) => void;
  onOpenEquipment: () => void;
  onOpenAssistant: () => void;
}

export const HomeFacility: React.FC<HomeFacilityProps> = ({
  onSelectExperiment,
  onSelectDepartment,
  onOpenEquipment,
  onOpenAssistant,
}) => {
  const [search, setSearch] = useState('');

  const featuredExperiments = [
    { id: 'chemical-reactions', title: 'Chemical Precipitation', dept: 'Chemistry', icon: <FlaskConical className="w-4 h-4 text-amber-400" /> },
    { id: 'double-slit', title: "Young's Double-Slit", dept: 'Physics', icon: <Zap className="w-4 h-4 text-cyan-400" /> },
    { id: 'dna-builder', title: 'DNA & Codon Translation', dept: 'Genetics', icon: <Dna className="w-4 h-4 text-purple-400" /> },
    { id: 'microscope-station', title: 'High-Power Microscopy', dept: 'Biology', icon: <Package className="w-4 h-4 text-emerald-400" /> },
    { id: 'orbital-space', title: 'Orbital Mechanics', dept: 'Astronomy', icon: <Orbit className="w-4 h-4 text-sky-400" /> },
    { id: 'forensics-crime', title: 'Forensic Crime Lab', dept: 'Forensics', icon: <Fingerprint className="w-4 h-4 text-rose-400" /> },
    { id: 'volcano-sim', title: 'Volcanic Viscosity', dept: 'Earth Science', icon: <Mountain className="w-4 h-4 text-amber-500" /> },
    { id: 'bridge-stress', title: 'Truss Bridge Physics', dept: 'Engineering', icon: <Cog className="w-4 h-4 text-orange-400" /> },
  ];

  const filteredDepts = DEPARTMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      d.experiments.some((e) => e.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-full bg-slate-950 text-slate-100">
      {/* Hero Atrium Banner */}
      <section className="relative px-6 py-16 md:py-24 border-b border-slate-800 overflow-hidden">
        {/* Atrium Background Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_facility_atrium_1794335355790.jpg"
            alt="Aetheria Science Laboratory Research Cleanrooms"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3">
            <span>RESEARCH ATRIUM</span>
            <span aria-hidden="true">·</span>
            <span>15 DEPARTMENTS</span>
            <span aria-hidden="true">·</span>
            <span>REAL-TIME SIMULATION ENGINES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 [text-wrap:balance]">
            Empirical Discovery in an Interactive Virtual Science Facility
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-2xl mb-8 leading-relaxed">
            Conduct hands-on virtual laboratory experiments across quantum mechanics, molecular genetics, organic reactions, seismology, and orbital astrophysics with calibrated equipment and an interactive AI lab mentor.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-xl relative mb-8">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search experiments (e.g. Double Slit, Titration, DNA, Volcano, Circuits)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono shadow-xl"
            />
          </div>

          {/* Quick Experiment Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
            {featuredExperiments.map((f) => (
              <button
                key={f.id}
                onClick={() => onSelectExperiment(f.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
              >
                {f.icon}
                <span>{f.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Research Spotlights with Generated High-Fidelity Visuals */}
      <section className="px-6 py-12 border-b border-slate-800/80 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Featured Research Spotlights
            </h2>
            <p className="text-xs text-slate-400">
              Interactive physics, molecular biotechnology, and cosmic astrodynamics
            </p>
          </div>
          <button
            onClick={onOpenEquipment}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View Equipment Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Microscopy */}
          <div
            onClick={() => onSelectExperiment('microscope-station')}
            className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-cyan-500/50 transition-all shadow-lg flex flex-col"
          >
            <div className="h-44 relative overflow-hidden bg-slate-950">
              <img
                src="/src/assets/images/equipment_microscope_macro_1794335355973.jpg"
                alt="High precision optical microscope"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">
                  Cytology & Optics
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Digital High-Power Microscopy
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Operate 40x to 1000x oil immersion optics. Examine onion epidermal cells, human cheek cells, blood smears, and motile Euglena.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>4 Prepared Slides</span>
                <span className="text-cyan-400 flex items-center gap-1">Launch Lab →</span>
              </div>
            </div>
          </div>

          {/* Card 2: Genetics */}
          <div
            onClick={() => onSelectExperiment('dna-builder')}
            className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-purple-500/50 transition-all shadow-lg flex flex-col"
          >
            <div className="h-44 relative overflow-hidden bg-slate-950">
              <img
                src="/src/assets/images/biotech_dna_crystal_1794335356349.jpg"
                alt="Synthetic DNA macromolecule on microfluidic biochip"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-400 block mb-1">
                  Molecular Bioengineering
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  DNA Helix & Codon Translation
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Synthesize nitrogenous base pairs (A-T, C-G), transcribe into mRNA transcripts, and translate triplets into functional polypeptides.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Central Dogma</span>
                <span className="text-purple-400 flex items-center gap-1">Launch Lab →</span>
              </div>
            </div>
          </div>

          {/* Card 3: Astronomy */}
          <div
            onClick={() => onSelectExperiment('star-lifecycle')}
            className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-amber-500/50 transition-all shadow-lg flex flex-col"
          >
            <div className="h-44 relative overflow-hidden bg-slate-950">
              <img
                src="/src/assets/images/simulation_space_nebula_1794335356035.jpg"
                alt="Deep space nebula and newborn star cluster"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1">
                  Astrophysics
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Stellar Life Cycle & Supernovae
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Trace nuclear fusion core shells from red dwarfs to iron-core collapse supernovae, neutron stars, and event horizon black holes.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>H-R Diagram</span>
                <span className="text-amber-400 flex items-center gap-1">Launch Lab →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15 Departments Directory Grid */}
      <section className="px-6 py-12 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>FULL FACILITY ROSTER</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Scientific Research Departments
          </h2>
          <p className="text-xs text-slate-400">
            Select any department to inspect specialized experiments and launch virtual workbenches
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepts.map((dept) => (
            <div
              key={dept.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    {dept.name}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {dept.experiments.length} Labs
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {dept.shortDescription}
                </p>
              </div>

              {/* Experiments list */}
              <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
                {dept.experiments.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => onSelectExperiment(exp.id)}
                    className="w-full text-left p-2 rounded-lg bg-slate-950/70 hover:bg-slate-800 border border-slate-850 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate group-hover:text-cyan-300 font-medium">
                      {exp.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-1">
                      {exp.duration}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
