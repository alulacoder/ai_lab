import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  tone?: 'cyan' | 'amber' | 'emerald' | 'rose' | 'default';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subValue,
  tone = 'default',
}) => {
  const toneClasses = {
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
    rose: 'text-rose-400',
    default: 'text-slate-100',
  }[tone];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
      <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 truncate">
        {label}
      </span>
      <div className="mt-1 flex items-baseline">
        <span className={`text-xl md:text-2xl font-mono font-bold tabular-nums ${toneClasses}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-slate-400 ml-1.5 uppercase">
            {unit}
          </span>
        )}
      </div>
      {subValue && (
        <span className="text-[11px] font-mono text-slate-500 mt-1 truncate">
          {subValue}
        </span>
      )}
    </div>
  );
};
