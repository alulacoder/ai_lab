import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeFacility } from './components/home/HomeFacility';
import { EquipmentCatalogModal } from './components/equipment/EquipmentCatalogModal';
import { LabNotebookModal } from './components/notebook/LabNotebookModal';
import { AiLabAssistant } from './components/assistant/AiLabAssistant';

// Virtual Experiment Simulators
import { ChemistryLab } from './components/simulations/ChemistryLab';
import { PHTesterLab } from './components/simulations/PHTesterLab';
import { PeriodicTableLab } from './components/simulations/PeriodicTableLab';
import { AtomBuilderLab } from './components/simulations/AtomBuilderLab';
import { CircuitBuilderLab } from './components/simulations/CircuitBuilderLab';
import { OpticsPrismLab } from './components/simulations/OpticsPrismLab';
import { DoubleSlitLab } from './components/simulations/DoubleSlitLab';
import { RutherfordScatteringLab } from './components/simulations/RutherfordScatteringLab';
import { MicroscopeLab } from './components/simulations/MicroscopeLab';
import { PhotosynthesisLab } from './components/simulations/PhotosynthesisLab';
import { DnaBuilderLab } from './components/simulations/DnaBuilderLab';
import { GeneticsCreatureLab } from './components/simulations/GeneticsCreatureLab';
import { MicrobiologyPetriLab } from './components/simulations/MicrobiologyPetriLab';
import { EpidemicSimLab } from './components/simulations/EpidemicSimLab';
import { VolcanoLab } from './components/simulations/VolcanoLab';
import { EarthquakeTectonicLab } from './components/simulations/EarthquakeTectonicLab';
import { ForensicsCrimeLab } from './components/simulations/ForensicsCrimeLab';
import { OrbitalSpaceLab } from './components/simulations/OrbitalSpaceLab';
import { StarLifeCycleLab } from './components/simulations/StarLifeCycleLab';
import { BridgeStressLab } from './components/simulations/BridgeStressLab';

import { EXPERIMENT_DETAILS, DEPARTMENTS } from './data/departmentsData';
import { ObservationLog, DepartmentId } from './types/laboratory';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home'); // 'home' or experiment id
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState<string | undefined>(undefined);

  // Persistent Lab Notebook Logs
  const [notebookLogs, setNotebookLogs] = useState<ObservationLog[]>(() => {
    try {
      const saved = localStorage.getItem('aetheria_lab_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aetheria_lab_logs', JSON.stringify(notebookLogs));
    } catch {
      // safe fallback
    }
  }, [notebookLogs]);

  const handleLogObservation = (logData: Omit<ObservationLog, 'id' | 'timestamp'>) => {
    const newLog: ObservationLog = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setNotebookLogs((prev) => [newLog, ...prev]);
  };

  const handleClearLogs = () => {
    setNotebookLogs([]);
  };

  const handleAskAi = (promptContext?: string) => {
    setAssistantInitialPrompt(promptContext);
    setIsAssistantOpen(true);
  };

  const activeExpDetail = currentView !== 'home' ? EXPERIMENT_DETAILS[currentView] || null : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased font-sans">
      {/* Top Bar Header */}
      <Header
        onNavigateHome={() => setCurrentView('home')}
        onOpenEquipment={() => setIsEquipmentOpen(true)}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onToggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)}
        onSelectExperiment={(id) => {
          setCurrentView(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectDepartment={(deptId) => {
          const dept = DEPARTMENTS.find((d) => d.id === deptId);
          if (dept && dept.experiments.length > 0) {
            setCurrentView(dept.experiments[0].id);
          }
        }}
        notebookLogsCount={notebookLogs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <HomeFacility
            onSelectExperiment={(id) => {
              setCurrentView(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectDepartment={(deptId) => {
              const dept = DEPARTMENTS.find((d) => d.id === deptId);
              if (dept && dept.experiments.length > 0) {
                setCurrentView(dept.experiments[0].id);
              }
            }}
            onOpenEquipment={() => setIsEquipmentOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        )}

        {/* Dynamic Virtual Experiment Views */}
        {currentView === 'chemical-reactions' && (
          <ChemistryLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'ph-testing' && (
          <PHTesterLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'periodic-table' && (
          <PeriodicTableLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'atom-builder' && (
          <AtomBuilderLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'circuit-builder' && (
          <CircuitBuilderLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'optics-prism' && (
          <OpticsPrismLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'double-slit' && (
          <DoubleSlitLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'rutherford-scattering' && (
          <RutherfordScatteringLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'microscope-station' && (
          <MicroscopeLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'photosynthesis-sim' && (
          <PhotosynthesisLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'dna-builder' && (
          <DnaBuilderLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'genetics-creature' && (
          <GeneticsCreatureLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'microbiology-petri' && (
          <MicrobiologyPetriLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'epidemic-sim' && (
          <EpidemicSimLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'volcano-sim' && (
          <VolcanoLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'earthquake-sim' && (
          <EarthquakeTectonicLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'forensics-crime' && (
          <ForensicsCrimeLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'orbital-space' && (
          <OrbitalSpaceLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'star-lifecycle' && (
          <StarLifeCycleLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
        {currentView === 'bridge-stress' && (
          <BridgeStressLab onAskAi={handleAskAi} onLogObservation={handleLogObservation} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectDepartment={(deptId) => {
          const dept = DEPARTMENTS.find((d) => d.id === deptId);
          if (dept && dept.experiments.length > 0) {
            setCurrentView(dept.experiments[0].id);
          }
        }}
        onOpenEquipment={() => setIsEquipmentOpen(true)}
      />

      {/* Modals & Docked Assistant */}
      <EquipmentCatalogModal
        isOpen={isEquipmentOpen}
        onClose={() => setIsEquipmentOpen(false)}
      />

      <LabNotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        logs={notebookLogs}
        onClearLogs={handleClearLogs}
      />

      <AiLabAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentExperiment={activeExpDetail}
        initialPrompt={assistantInitialPrompt}
      />
    </div>
  );
}
