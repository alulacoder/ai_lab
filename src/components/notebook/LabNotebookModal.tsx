import React, { useState } from 'react';
import { X, ClipboardList, Trash2, Download, Clock, Check } from 'lucide-react';
import { ObservationLog } from '../../types/laboratory';

interface LabNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ObservationLog[];
  onClearLogs: () => void;
}

export const LabNotebookModal: React.FC<LabNotebookModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aetheria-lab-journal-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyClipboard = () => {
    const text = logs
      .map(
        (l) =>
          `[${l.timestamp}] ${l.experimentTitle}\nNotes: ${l.notes}\nTelemetry: ${JSON.stringify(l.parameters, null, 2)}\n`
      )
      .join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full h-[75vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Researcher's Laboratory Journal</h2>
              <div className="text-xs font-mono text-slate-400">
                {logs.length} Recorded Scientific Observations
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <>
                <button
                  onClick={handleCopyClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ClipboardList className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
                <button
                  onClick={handleExportJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={onClearLogs}
                  className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-slate-800"
                  title="Clear all logs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Logs Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/60">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 font-mono">
              <ClipboardList className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-400 mb-1">No Journal Entries Recorded Yet</p>
              <p className="text-xs max-w-sm">
                While exploring virtual experiments, click "Record Data" in the top bar to snapshot your findings and parameters into this permanent journal.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-sm">{log.experimentTitle}</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 block mb-1">
                    Researcher Notes:
                  </span>
                  <p className="text-slate-200 bg-slate-950 p-2.5 rounded border border-slate-800/80 leading-relaxed font-sans text-xs">
                    {log.notes}
                  </p>
                </div>

                {Object.keys(log.parameters).length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block mb-1">
                      Experimental Telemetry State:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded border border-slate-800/80">
                      {Object.entries(log.parameters).map(([k, v]) => (
                        <div key={k} className="text-[11px]">
                          <span className="text-slate-500 truncate block">{k}:</span>
                          <span className="text-cyan-300 font-semibold">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
