import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  FlaskConical,
  Zap,
  Dna,
  Binary,
  Bug,
  ScanEye,
  Fingerprint,
  HeartPulse,
  Orbit,
  Mountain,
  Leaf,
  Wind,
  Cog,
  Award,
  Brain,
  Search,
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departmentsData';
import { Department, DepartmentId } from '../../types/laboratory';

interface DepartmentDropdownProps {
  onSelectExperiment: (expId: string) => void;
  onSelectDepartment: (deptId: DepartmentId) => void;
}

const DEPT_ICONS: Record<string, React.ReactNode> = {
  chemistry: <FlaskConical className="w-4 h-4 text-amber-400" />,
  physics: <Zap className="w-4 h-4 text-cyan-400" />,
  biology: <Dna className="w-4 h-4 text-emerald-400" />,
  genetics: <Binary className="w-4 h-4 text-purple-400" />,
  microbiology: <Bug className="w-4 h-4 text-teal-400" />,
  microscopy: <ScanEye className="w-4 h-4 text-indigo-400" />,
  forensics: <Fingerprint className="w-4 h-4 text-rose-400" />,
  medical: <HeartPulse className="w-4 h-4 text-red-400" />,
  astronomy: <Orbit className="w-4 h-4 text-sky-400" />,
  'earth-science': <Mountain className="w-4 h-4 text-amber-500" />,
  ecology: <Leaf className="w-4 h-4 text-lime-400" />,
  environmental: <Wind className="w-4 h-4 text-emerald-500" />,
  engineering: <Cog className="w-4 h-4 text-orange-400" />,
  'famous-experiments': <Award className="w-4 h-4 text-yellow-400" />,
  'neuroscience-materials': <Brain className="w-4 h-4 text-fuchsia-400" />,
};

export const DepartmentDropdown: React.FC<DepartmentDropdownProps> = ({
  onSelectExperiment,
  onSelectDepartment,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDept, setActiveDept] = useState<Department>(DEPARTMENTS[0]);
  const [searchFilter, setSearchFilter] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDepts = DEPARTMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.experiments.some((e) => e.title.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button with hover & click support */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap py-1"
      >
        <span>Departments</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`} />
      </button>

      {/* Mega Dropdown Panel */}
      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute top-full left-0 mt-2 w-[720px] max-w-[90vw] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
        >
          {/* Quick Department Search */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 ml-1" />
            <input
              type="text"
              placeholder="Search 15 departments and virtual experiments..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-12 max-h-[460px] overflow-hidden">
            {/* Left 15 Departments List */}
            <div className="col-span-5 border-r border-slate-800 overflow-y-auto p-2 space-y-1 bg-slate-950/60 max-h-[420px]">
              {filteredDepts.map((dept) => {
                const isSelected = activeDept.id === dept.id;
                return (
                  <button
                    key={dept.id}
                    onMouseEnter={() => setActiveDept(dept)}
                    onClick={() => {
                      setActiveDept(dept);
                      onSelectDepartment(dept.id);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {DEPT_ICONS[dept.id] || <FlaskConical className="w-4 h-4 text-cyan-400" />}
                      <span className="truncate">{dept.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-1">
                      {dept.experiments.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Active Department Experiments Submenu */}
            <div className="col-span-7 p-4 overflow-y-auto bg-slate-900/90 max-h-[420px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {DEPT_ICONS[activeDept.id]}
                      {activeDept.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {activeDept.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    Available Virtual Experiments:
                  </span>
                  {activeDept.experiments.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => {
                        onSelectExperiment(exp.id);
                        setIsOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300">
                          {exp.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {exp.difficulty} · {exp.duration}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {exp.brief}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
