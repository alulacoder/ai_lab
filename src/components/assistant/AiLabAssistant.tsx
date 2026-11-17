import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Minimize2, Maximize2, Bot, HelpCircle, Lightbulb, BookOpen, ChevronRight } from 'lucide-react';
import { AssistantMessage, ExperimentDetail } from '../../types/laboratory';

interface AiLabAssistantProps {
  currentExperiment: ExperimentDetail | null;
  currentExperimentData?: Record<string, string | number | boolean>;
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const AiLabAssistant: React.FC<AiLabAssistantProps> = ({
  currentExperiment,
  currentExperimentData = {},
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Greetings, Researcher! I am Dr. Aetheria, your laboratory mentor. I can explain experimental mechanics, give hints on challenges, interpret your telemetry data, or recommend follow-up investigations. What are you observing?",
      timestamp: 'Now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<'guided' | 'advanced'>('guided');
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle external initial prompt if passed
  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const sendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputText.trim();
    if (!text || isLoading) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/lab-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          currentExperiment: currentExperiment
            ? {
                id: currentExperiment.id,
                title: currentExperiment.title,
                department: currentExperiment.departmentName,
                description: currentExperiment.introduction,
                currentData: currentExperimentData,
              }
            : null,
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const modelMsg: AssistantMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.text || 'Observation logged. Let us analyze this further.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Error contacting lab assistant:', err);
      const fallbackMsg: AssistantMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `Regarding ${currentExperiment?.title || 'your observation'}: When examining this experiment, pay close attention to how input variables drive equilibrium. If you observe an unexpected shift, try testing boundary conditions to see if the reaction rate or field equations behave linearly or exponentially!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
        isMinimized
          ? 'w-80 h-14'
          : 'w-[94vw] sm:w-[440px] h-[580px] max-h-[85vh]'
      }`}
    >
      {/* Top Assistant Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Bot className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-wide">Dr. Aetheria</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/60">
                AI Lab Mentor
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]">
              {currentExperiment ? currentExperiment.title : 'Research Facility Overview'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:text-white rounded hover:bg-slate-800"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:text-white rounded hover:bg-slate-800"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Expertise Level Switcher */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950 border-b border-slate-800 text-[11px] font-mono">
            <span className="text-slate-400">Pedagogical Mode:</span>
            <div className="flex gap-1 bg-slate-900 p-0.5 rounded border border-slate-800">
              <button
                onClick={() => setDifficulty('guided')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  difficulty === 'guided'
                    ? 'bg-cyan-950 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Guided Learner
              </button>
              <button
                onClick={() => setDifficulty('advanced')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  difficulty === 'advanced'
                    ? 'bg-purple-950 text-purple-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Advanced Academic
              </button>
            </div>
          </div>

          {/* Quick Context Prompt Chips */}
          {currentExperiment && (
            <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 flex gap-1.5 overflow-x-auto text-[10px] font-mono text-slate-300 whitespace-nowrap">
              <button
                onClick={() => sendMessage(`Can you explain the underlying scientific mechanics of "${currentExperiment.title}"?`)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3 text-cyan-400" />
                Explain Science
              </button>
              <button
                onClick={() => sendMessage(`Give me a subtle hint to solve the challenges for "${currentExperiment.title}" without spoiling the answers.`)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3 text-amber-400" />
                Give Hint
              </button>
              <button
                onClick={() => sendMessage(`Looking at my current parameters: ${JSON.stringify(currentExperimentData)}, can you interpret what these numbers mean?`)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3 text-emerald-400" />
                Interpret Data
              </button>
              <button
                onClick={() => sendMessage(`What is a fascinating real-world experiment related to ${currentExperiment.category} that I should investigate next?`)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1"
              >
                <ChevronRight className="w-3 h-3 text-purple-400" />
                Next Experiment
              </button>
            </div>
          )}

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/90 text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 mb-1 text-[10px] font-mono text-slate-500">
                    <span>{isUser ? 'Researcher' : 'Dr. Aetheria'}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[88%] p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-cyan-600 text-white rounded-br-none shadow'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-inner'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 p-2">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Dr. Aetheria is analyzing experimental data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* User Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask Dr. Aetheria about ${currentExperiment ? currentExperiment.title : 'science'}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold rounded-lg disabled:opacity-40 transition-colors shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
