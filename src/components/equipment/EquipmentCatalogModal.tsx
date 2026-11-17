import React, { useState } from 'react';
import { X, Search, ShieldCheck, Cpu, Microscope, Gauge, Radio, Layers, FlaskConical, Flame, Scale, Activity, Compass, Crosshair, ThermometerSnowflake } from 'lucide-react';
import { EQUIPMENT_CATALOG } from '../../data/equipmentData';
import { EquipmentItem, DepartmentId } from '../../types/laboratory';

interface EquipmentCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExperimentForEquipment?: (deptId: DepartmentId) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Microscope: <Microscope className="w-5 h-5 text-cyan-400" />,
  Gauge: <Gauge className="w-5 h-5 text-emerald-400" />,
  Cpu: <Cpu className="w-5 h-5 text-amber-400" />,
  Radio: <Radio className="w-5 h-5 text-purple-400" />,
  Layers: <Layers className="w-5 h-5 text-indigo-400" />,
  FlaskConical: <FlaskConical className="w-5 h-5 text-rose-400" />,
  Flame: <Flame className="w-5 h-5 text-orange-400" />,
  Scale: <Scale className="w-5 h-5 text-teal-400" />,
  Activity: <Activity className="w-5 h-5 text-cyan-400" />,
  Compass: <Compass className="w-5 h-5 text-blue-400" />,
  Crosshair: <Crosshair className="w-5 h-5 text-amber-400" />,
  ThermometerSnowflake: <ThermometerSnowflake className="w-5 h-5 text-sky-400" />,
};

export const EquipmentCatalogModal: React.FC<EquipmentCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectExperimentForEquipment,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<EquipmentItem>(EQUIPMENT_CATALOG[0]);

  if (!isOpen) return null;

  const categories = ['All', 'Optics', 'Glassware', 'Thermal & Measurement', 'Electronics', 'Biological', 'Analytical'];

  const filtered = EQUIPMENT_CATALOG.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.operatingPrinciple.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || eq.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
              Aetheria Research Facility
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Shared Virtual Laboratory Equipment Inventory
              <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {EQUIPMENT_CATALOG.length} Certified Instruments
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search equipment by name or operating principle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto text-xs font-mono">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'text-slate-400 hover:text-white bg-slate-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Split Master-Detail Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Equipment List */}
          <div className="md:col-span-5 border-r border-slate-800 overflow-y-auto p-3 space-y-2 bg-slate-950/40">
            {filtered.map((item) => {
              const isSelected = activeItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 text-white shadow'
                      : 'bg-slate-900/70 border-slate-800/80 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                    {ICON_MAP[item.icon] || <Cpu className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-slate-200 truncate">{item.name}</div>
                    <div className="text-[10px] font-mono text-cyan-400 mt-0.5">{item.category}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-1">{item.safetyRating}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Equipment Detail Panel */}
          <div className="md:col-span-7 p-6 overflow-y-auto bg-slate-900/80 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                    {activeItem.category} Class Equipment
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{activeItem.name}</h3>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  {ICON_MAP[activeItem.icon] || <Cpu className="w-6 h-6 text-cyan-400" />}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Technical Specifications & Calibration:
                </span>
                <p className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 leading-relaxed">
                  {activeItem.specs}
                </p>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Operating Principle & Physics:
                </span>
                <p className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {activeItem.operatingPrinciple}
                </p>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Safety Protocols & Certification:
                </span>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{activeItem.safetyRating}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                  Integrated Across Research Departments:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeItem.usedInDepartments.map((deptId) => (
                    <span
                      key={deptId}
                      className="px-2 py-0.5 text-xs font-mono bg-slate-800 border border-slate-700 text-slate-300 rounded uppercase"
                    >
                      {deptId}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
