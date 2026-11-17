import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  XCircle,
  X,
  Share2,
  Save,
} from 'lucide-react';
import { ExperimentDetail, Challenge, ObservationLog } from '../../types/laboratory';

interface SimulationFrameProps {
  experiment: ExperimentDetail;
  children: React.ReactNode;
  onReset: () => void;
  onAskAi: (promptContext?: string) => void;
  onLogObservation: (log: Omit<ObservationLog, 'id' | 'timestamp'>) => void;
  currentData?: Record<string, string | number | boolean>;
}

export const SimulationFrame: React.FC<SimulationFrameProps> = ({
  experiment,
  children,
  onReset,
  onAskAi,
  onLogObservation,
  currentData = {},
}) => {
  const [showTheory, setShowTheory] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});
  const [logNotes, setLogNotes] = useState('');
  const [logSavedNotice, setLogSavedNotice] = useState(false);

  const currentChallenge: Challenge | undefined = experiment.challenges[selectedChallengeIdx];

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentChallenge) return;
    setHasSubmittedAnswer(true);
    const isCorrect = selectedAnswer === currentChallenge.correctIndex;
    if (isCorrect) {
      setCompletedChallenges((prev) => ({ ...prev, [currentChallenge.id]: true }));
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleNextChallenge = () => {
    setSelectedAnswer(null);
    setHasSubmittedAnswer(false);
    if (selectedChallengeIdx < experiment.challenges.length - 1) {
      setSelectedChallengeIdx((prev) => prev + 1);
    }
  };

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    onLogObservation({
      experimentId: experiment.id,
      experimentTitle: experiment.title,
      notes: logNotes || 'Experimental run completed and logged.',
      parameters: currentData,
      resultSummary: `Data recorded at steady state with ${Object.keys(currentData).length} active parameters.`,
    });
    setLogSavedNotice(true);
    setTimeout(() => {
      setLogSavedNotice(false);
      setShowLogModal(false);
      setLogNotes('');
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100">
      {/* Sub-header / Experiment Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="uppercase">{experiment.departmentName}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">{experiment.category}</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {experiment.title}
              <span className="text-xs font-mono font-normal text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                {experiment.difficulty} · {experiment.duration}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowTheory(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-colors whitespace-nowrap"
            title="View scientific theory and formulas"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Theory & Laws</span>
          </button>

          {experiment.challenges.length > 0 && (
            <button
              onClick={() => {
                setShowChallenge(true);
                setSelectedAnswer(null);
                setHasSubmittedAnswer(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-colors whitespace-nowrap"
              title="Test your understanding"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Quiz Challenge ({Object.keys(completedChallenges).length}/{experiment.challenges.length})
              </span>
            </button>
          )}

          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-colors whitespace-nowrap"
            title="Log observation in notebook"
          >
            <ClipboardList className="w-3.5 h-3.5 text-emerald-400" />
            <span>Record Data</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-colors whitespace-nowrap"
            title="Reset simulation parameters to default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => onAskAi(`I am conducting the experiment "${experiment.title}". Can you explain the scientific phenomenon and what I should look out for?`)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded shadow-sm transition-all whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Ask Dr. Aetheria</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Work Area */}
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-slate-950">
        {children}
      </div>

      {/* Theory & Equations Modal */}
      {showTheory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 relative shadow-2xl overflow-y-auto max-h-[85vh]">
            <button
              onClick={() => setShowTheory(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>SCIENTIFIC PRINCIPLES</span>
              <span>·</span>
              <span>{experiment.category}</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">{experiment.title}</h2>

            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Introduction
                </h3>
                <p className="leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  {experiment.introduction}
                </p>
              </div>

              {experiment.scientificFormula && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Governing Equations & Formulas
                  </h3>
                  <div className="bg-slate-950 p-4 rounded-lg border border-cyan-900/40 font-mono text-cyan-300 text-sm overflow-x-auto">
                    {experiment.scientificFormula}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Theory & Underlying Physics
                </h3>
                <p className="leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  {experiment.theoryExplanation}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Learning Objectives
                </h3>
                <ul className="space-y-1.5 list-disc list-inside bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  {experiment.learningObjectives.map((obj, i) => (
                    <li key={i} className="text-slate-300 text-xs md:text-sm">
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Required Laboratory Equipment
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {experiment.requiredEquipment.map((eq, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-mono bg-slate-800 border border-slate-700 text-slate-300 rounded"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowTheory(false);
                  onAskAi(`Can you elaborate on the theory behind ${experiment.title} and why the equations matter?`);
                }}
                className="px-4 py-2 text-xs font-medium text-cyan-300 hover:text-cyan-200 bg-cyan-950/50 border border-cyan-800/50 rounded-lg transition-colors"
              >
                Deep-Dive with Dr. Aetheria
              </button>
              <button
                onClick={() => setShowTheory(false)}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Quiz Modal */}
      {showChallenge && currentChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowChallenge(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
              <span>
                CHALLENGE QUESTION {selectedChallengeIdx + 1} OF {experiment.challenges.length}
              </span>
              <span>
                {completedChallenges[currentChallenge.id] ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                  </span>
                ) : (
                  'Pending'
                )}
              </span>
            </div>

            <h3 className="text-base md:text-lg font-bold text-white mb-4">
              {currentChallenge.question}
            </h3>

            <div className="space-y-2 mb-4">
              {currentChallenge.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentChallenge.correctIndex;
                let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                if (isSelected) {
                  btnStyle = 'bg-cyan-950/60 border-cyan-500 text-cyan-200';
                }

                if (hasSubmittedAnswer) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasSubmittedAnswer}
                    onClick={() => setSelectedAnswer(idx)}
                    className={`w-full text-left p-3 rounded-lg border text-xs md:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {hasSubmittedAnswer && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {hasSubmittedAnswer && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Hint Box */}
            {hasSubmittedAnswer && (
              <div
                className={`p-3 rounded-lg mb-4 text-xs ${
                  selectedAnswer === currentChallenge.correctIndex
                    ? 'bg-emerald-950/50 border border-emerald-800/60 text-emerald-200'
                    : 'bg-rose-950/50 border border-rose-800/60 text-rose-200'
                }`}
              >
                <div className="font-semibold mb-1">
                  {selectedAnswer === currentChallenge.correctIndex ? 'Correct!' : 'Incorrect.'}
                </div>
                <p className="text-slate-300">{currentChallenge.explanation}</p>
              </div>
            )}

            {!hasSubmittedAnswer && (
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() =>
                    onAskAi(`Give me a subtle hint to solve this question without revealing the answer: "${currentChallenge.question}"`)
                  }
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Need a hint? Ask Mentor
                </button>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <button
                disabled={selectedChallengeIdx === 0}
                onClick={() => {
                  setSelectedChallengeIdx((p) => p - 1);
                  setSelectedAnswer(null);
                  setHasSubmittedAnswer(false);
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {!hasSubmittedAnswer ? (
                  <button
                    disabled={selectedAnswer === null}
                    onClick={handleAnswerSubmit}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 rounded-lg transition-colors"
                  >
                    Submit Answer
                  </button>
                ) : (
                  selectedChallengeIdx < experiment.challenges.length - 1 && (
                    <button
                      onClick={handleNextChallenge}
                      className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Next Question
                    </button>
                  )
                )}
                <button
                  onClick={() => setShowChallenge(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Data / Lab Notebook Entry Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowLogModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>RESEARCH OBSERVATION LOG</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{experiment.title}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Snapshot telemetry and experimental parameters into your persistent scientific lab journal.
            </p>

            {/* Current Parameters Snapshot Preview */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1 mb-4 max-h-36 overflow-y-auto">
              <span className="text-slate-500 uppercase tracking-wider block mb-1">
                Telemetry Snapshot:
              </span>
              {Object.entries(currentData).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-400">{k}:</span>
                  <span className="text-cyan-300 font-semibold">{String(v)}</span>
                </div>
              ))}
              {Object.keys(currentData).length === 0 && (
                <span className="text-slate-600 italic">Default calibration state.</span>
              )}
            </div>

            <form onSubmit={handleSaveObservation}>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Researcher Observations & Notes:
              </label>
              <textarea
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="Record experimental findings, anomalous data points, color changes, or reaction kinetics observed..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs md:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 mb-4"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-mono">
                  {logSavedNotice ? 'Saved to Lab Notebook!' : ''}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-950" />
                    <span>Save Observation</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
