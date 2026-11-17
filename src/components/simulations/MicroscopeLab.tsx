import React, { useState } from 'react';
import { SimulationFrame } from '../common/SimulationFrame';
import { MetricCard } from '../common/MetricCard';
import { EXPERIMENT_DETAILS } from '../../data/departmentsData';
import { ObservationLog } from '../../types/laboratory';
import { Eye, ZoomIn, Sliders, Move } from 'lucide-react';

interface SlideSpecimen {
  id: string;
  name: string;
  category: string;
  stain: string;
  features: string;
  renderType: 'onion' | 'cheek' | 'blood' | 'euglena' | 'bacteria' | 'neuron';
}

const SPECIMENS: SlideSpecimen[] = [
  { id: 'onion', name: 'Allium Cepa (Onion) Epidermis', category: 'Plant Cytology', stain: 'Lugol’s Iodine Solution', features: 'Rigid cellulose cell walls, large central vacuole, prominent dark nucleus', renderType: 'onion' },
  { id: 'cheek', name: 'Human Buccal (Cheek) Epithelium', category: 'Animal Histology', stain: 'Methylene Blue', features: 'Flat irregular polygonal squamous cells, distinct nuclear membrane', renderType: 'cheek' },
  { id: 'blood', name: 'Human Peripheral Blood Smear', category: 'Hematology', stain: 'Wright-Giemsa Stain', features: 'Enucleated biconcave erythrocytes, granulocytes with multilobed nuclei', renderType: 'blood' },
  { id: 'euglena', name: 'Pond Water (Euglena Gracilis)', category: 'Protistology', stain: 'Live Wet Mount (No Stain)', features: 'Motile unicellular flagellate, green chloroplasts, red stigma eyespot', renderType: 'euglena' },
  { id: 'bacteria', name: 'Bacillus Subtilis Bacterial Culture', category: 'Bacteriology', stain: 'Gram Positive Crystal Violet', features: 'Cylindrical bacilli chains, endospore formation capability', renderType: 'bacteria' },
  { id: 'neuron', name: 'Mammalian Cerebral Cortex Neuron', category: 'Neuroanatomy', stain: 'Golgi Silver Impregnation', features: 'Pyramidal soma cell body, branching dendritic arbor, long axon', renderType: 'neuron' },
];

interface MicroscopeLabProps {
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
}

export const MicroscopeLab: React.FC<MicroscopeLabProps> = ({ onAskAi, onLogObservation }) => {
  const experiment = EXPERIMENT_DETAILS['microscope-station'];

  const [selectedSlide, setSelectedSlide] = useState<SlideSpecimen>(SPECIMENS[0]); // Onion
  const [objectivePower, setObjectivePower] = useState<4 | 10 | 40 | 100>(10); // 10x objective
  const [focusOffset, setFocusOffset] = useState(50); // 50 is perfect sharp focus
  const [lightIntensity, setLightIntensity] = useState(80); // 80%
  const [stageX, setStageX] = useState(0); // -40 to +40 px
  const [stageY, setStageY] = useState(0); // -40 to +40 px

  const ocularPower = 10;
  const totalMagnification = ocularPower * objectivePower;

  // Blur is proportional to distance from 50 (focus sweetspot)
  const blurAmount = Math.abs(focusOffset - 50) * 0.22;
  const isSharp = blurAmount < 1.0;

  const resetMicroscope = () => {
    setSelectedSlide(SPECIMENS[0]);
    setObjectivePower(10);
    setFocusOffset(50);
    setLightIntensity(80);
    setStageX(0);
    setStageY(0);
  };

  return (
    <SimulationFrame
      experiment={experiment}
      onReset={resetMicroscope}
      onAskAi={onAskAi}
      onLogObservation={onLogObservation}
      currentData={{
        'Specimen Slide': selectedSlide.name,
        'Biological Category': selectedSlide.category,
        'Chemical Stain': selectedSlide.stain,
        'Ocular Eyepiece': `${ocularPower}x`,
        'Objective Lens': `${objectivePower}x`,
        'Total Magnification': `${totalMagnification}x`,
        'Focus State': isSharp ? 'Crisp (Infocal)' : `Defocused (${blurAmount.toFixed(1)}px blur)`,
        'Illuminator Brightness': `${lightIntensity}%`,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Slide Carousel & Objective Turret */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 flex items-center justify-between">
              <span>Specimen Slide Box</span>
              <Eye className="w-4 h-4 text-cyan-400" />
            </h2>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 mb-4">
              {SPECIMENS.map((slide) => {
                const isSelected = selectedSlide.id === slide.id;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setSelectedSlide(slide)}
                    className={`w-full text-left p-2 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{slide.name}</div>
                      <div className="text-[10px] text-slate-500">{slide.stain}</div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      Slide
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Revolving Objective Turret */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Objective Turret Revolver:
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                {([4, 10, 40, 100] as const).map((pow) => (
                  <button
                    key={pow}
                    onClick={() => setObjectivePower(pow)}
                    className={`p-2 rounded border text-center transition-colors ${
                      objectivePower === pow
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>{pow}x</div>
                    <div className="text-[9px] text-slate-500 font-normal">
                      {pow * 10}x Total
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Micrometer Knobs */}
            <div className="mb-3">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Coarse & Fine Focus Dial:</span>
                <span className={isSharp ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {isSharp ? 'PERFECT FOCUS' : 'BLURRED'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={focusOffset}
                onChange={(e) => setFocusOffset(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>Defocus (-)</span>
                <span className="text-emerald-400">Sweet Spot (50)</span>
                <span>Defocus (+)</span>
              </div>
            </div>

            {/* Substage Illuminator */}
            <div className="mb-1">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Condenser Light Intensity:</span>
                <span className="text-white font-bold">{lightIntensity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={lightIntensity}
                onChange={(e) => setLightIntensity(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Center Circular Microscope Eyepiece Viewport */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            <div className="absolute top-3 left-3 text-xs font-mono text-slate-500">
              BINOCULAR OCULAR FIELD · 10x WF EYEPIECE
            </div>

            {/* Circular Optical Aperture */}
            <div className="relative w-72 h-72 rounded-full border-8 border-slate-800 bg-black overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center">
              {/* Field Illumination Light Background */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  backgroundColor: `rgba(255, 255, 255, ${lightIntensity / 100})`,
                }}
              />

              {/* Specimen Cellular Morphology SVG */}
              <div
                className="relative w-full h-full transition-all duration-200"
                style={{
                  filter: `blur(${blurAmount}px)`,
                  transform: `translate(${stageX}px, ${stageY}px) scale(${objectivePower / 10})`,
                }}
              >
                {selectedSlide.renderType === 'onion' && (
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Plant cell rectangular bricks with cell walls and nuclei */}
                    {[0, 40, 80, 120, 160].map((y) => (
                      <g key={y}>
                        {[0, 60, 120, 180].map((x) => (
                          <g key={x}>
                            <rect
                              x={x}
                              y={y}
                              width="58"
                              height="38"
                              fill="#fef9c3"
                              stroke="#ca8a04"
                              strokeWidth="2"
                              opacity="0.8"
                            />
                            {/* Nucleus stained dark with iodine */}
                            <circle cx={x + 28} cy={y + 18} r="5" fill="#854d0e" />
                          </g>
                        ))}
                      </g>
                    ))}
                  </svg>
                )}

                {selectedSlide.renderType === 'cheek' && (
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Squamous cells irregular edges with methylene blue */}
                    {[
                      { cx: 70, cy: 80, r: 35 },
                      { cx: 130, cy: 110, r: 40 },
                      { cx: 90, cy: 140, r: 32 },
                    ].map((c, i) => (
                      <g key={i}>
                        <ellipse
                          cx={c.cx}
                          cy={c.cy}
                          rx={c.r}
                          ry={c.r * 0.75}
                          fill="rgba(56, 189, 248, 0.4)"
                          stroke="#0284c7"
                          strokeWidth="1.5"
                        />
                        <circle cx={c.cx + 4} cy={c.cy - 2} r="7" fill="#1e3a8a" />
                      </g>
                    ))}
                  </svg>
                )}

                {selectedSlide.renderType === 'blood' && (
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Red blood cells biconcave donuts and 1 leukocyte */}
                    {[
                      [40, 50], [80, 40], [120, 60], [160, 50],
                      [50, 100], [150, 110], [40, 150], [90, 160],
                      [130, 150], [170, 140]
                    ].map(([cx, cy], i) => (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="12" fill="#ef4444" opacity="0.85" />
                        <circle cx={cx} cy={cy} r="5" fill="#fca5a5" opacity="0.9" />
                      </g>
                    ))}
                    {/* White blood cell neutrophil with lobed nucleus */}
                    <circle cx="100" cy="100" r="18" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1.5" />
                    <circle cx="95" cy="95" r="5" fill="#4338ca" />
                    <circle cx="105" cy="96" r="4.5" fill="#4338ca" />
                    <circle cx="100" cy="105" r="5" fill="#4338ca" />
                  </svg>
                )}

                {selectedSlide.renderType === 'euglena' && (
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Spindle shaped green flagellate */}
                    <g transform="translate(70, 60) rotate(25)">
                      <path
                        d="M 10 50 C 10 20, 50 10, 50 10 C 50 10, 90 20, 90 50 C 90 80, 50 120, 50 120 C 50 120, 10 80, 10 50 Z"
                        fill="#22c55e"
                        stroke="#15803d"
                        strokeWidth="2"
                        opacity="0.85"
                      />
                      {/* Flagellum hair */}
                      <path d="M 50 10 Q 40 -20 60 -40" fill="none" stroke="#475569" strokeWidth="1.5" />
                      {/* Red eyespot stigma */}
                      <circle cx="45" cy="22" r="3" fill="#ef4444" />
                      {/* Chloroplast disks */}
                      <circle cx="40" cy="50" r="5" fill="#166534" />
                      <circle cx="60" cy="55" r="5" fill="#166534" />
                      <circle cx="50" cy="75" r="6" fill="#166534" />
                    </g>
                  </svg>
                )}

                {selectedSlide.renderType === 'bacteria' && (
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Gram positive bacilli rods */}
                    {[
                      [40, 50, 20], [80, 70, -30], [120, 60, 45],
                      [60, 120, 10], [110, 130, -15], [150, 140, 60]
                    ].map(([x, y, rot], i) => (
                      <rect
                        key={i}
                        x={x}
                        y={y}
                        width="24"
                        height="8"
                        rx="4"
                        fill="#7c3aed"
                        transform={`rotate(${rot} ${x + 12} ${y + 4})`}
                        opacity="0.9"
                      />
                    ))}
                  </svg>
                )}

                {selectedSlide.renderType === 'neuron' && (
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Pyramidal neuron body and dendrites */}
                    <g transform="translate(100, 100)">
                      {/* Axon */}
                      <line x1="0" y1="15" x2="0" y2="80" stroke="#475569" strokeWidth="2" />
                      {/* Soma */}
                      <polygon points="0,-15 -18,15 18,15" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
                      {/* Apical dendrite */}
                      <path d="M 0 -15 L -20 -60 M 0 -15 L 20 -60 M 0 -15 L 0 -70" stroke="#0ea5e9" strokeWidth="1.5" />
                    </g>
                  </svg>
                )}
              </div>

              {/* Eyepiece Optical Reticle Crosshairs and Micrometer Scale */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#000" strokeWidth="0.5" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#000" strokeWidth="0.5" />
                <circle cx="50%" cy="50%" r="60" fill="none" stroke="#000" strokeWidth="0.5" strokeDasharray="2 2" />
              </div>
            </div>

            {/* Stage Micrometer Joy Controls */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">STAGE PAN:</span>
              <button
                onClick={() => setStageX((x) => Math.max(-40, x - 10))}
                className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700"
              >
                ◀ Left
              </button>
              <button
                onClick={() => setStageX((x) => Math.min(40, x + 10))}
                className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700"
              >
                Right ▶
              </button>
              <button
                onClick={() => setStageY((y) => Math.max(-40, y - 10))}
                className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700"
              >
                ▲ Up
              </button>
              <button
                onClick={() => setStageY((y) => Math.min(40, y + 10))}
                className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700"
              >
                Down ▼
              </button>
            </div>
          </div>
        </div>

        {/* Right Telemetry Column */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <MetricCard
            label="Total Magnification"
            value={`${totalMagnification}x`}
            subValue={`${ocularPower}x Eyepiece × ${objectivePower}x Objective`}
            tone="cyan"
          />

          <MetricCard
            label="Optical Resolution (d)"
            value={(0.61 * 0.55 / (objectivePower === 100 ? 1.25 : 0.65)).toFixed(2)}
            unit="µm"
            subValue="Abbé Resolving Limit (λ = 550nm)"
            tone="default"
          />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Specimen Slide Details
            </span>
            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div>
                <span className="text-slate-500 block">Specimen:</span>
                <span className="text-white font-bold">{selectedSlide.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cytological Features:</span>
                <span className="text-slate-300">{selectedSlide.features}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimulationFrame>
  );
};
