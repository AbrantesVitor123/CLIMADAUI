import React, { useState, useEffect, useMemo } from 'react';
import { scenarios } from './constants';
import type { Scenario } from './types';
import Header from './components/Header';
import MapWrapper from './components/MapWrapper';
import InfoModal from './components/InfoModal';
import SummaryPanel from './components/SummaryPanel';
import LegendPanel from './components/LegendPanel';
import ControlsMenu from './components/ControlsMenu';

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

export default function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0].id);
  const [currentScenario, setCurrentScenario] = useState<Scenario>(scenarios[0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [isControlsMenuOpen, setControlsMenuOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const newScenario = scenarios.find(s => s.id === selectedScenarioId);
    if (newScenario) {
        // Simulate network delay for a better user experience
        setTimeout(() => {
            setCurrentScenario(newScenario);
            setLoading(false);
        }, 500);
    }
  }, [selectedScenarioId]);

  const summaryStats = useMemo(() => {
    if (!currentScenario.data || currentScenario.data.features.length === 0) {
      return { points: 0, totalValue: 0, totalEai: 0 };
    }
    const points = currentScenario.data.features.length;
    const totalValue = currentScenario.data.features.reduce((sum, f) => sum + f.properties.value, 0);
    const totalEai = currentScenario.data.features.reduce((sum, f) => sum + f.properties.eai, 0);
    return { points, totalValue, totalEai };
  }, [currentScenario]);


  return (
    <div className="h-screen w-screen bg-gray-800 text-white flex flex-col font-sans">
      <Header onMenuToggle={() => setControlsMenuOpen(true)} />
      <main className="flex-grow relative">
        <MapWrapper scenario={currentScenario} />
        
        <ControlsMenu 
            isOpen={isControlsMenuOpen} 
            onClose={() => setControlsMenuOpen(false)}
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onScenarioChange={setSelectedScenarioId}
            loading={loading}
            description={currentScenario.description}
        />

        {/* Top-Right Panels */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end gap-4">
            <SummaryPanel stats={summaryStats} loading={loading} />
            <button
              onClick={() => setShowInfo(true)}
              className="flex items-center bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200"
            >
              <InfoIcon />
              Sobre este modelo
            </button>
        </div>

        {/* Bottom-Right Panel */}
        <div className="absolute bottom-4 right-4 z-[1000]">
            <LegendPanel />
        </div>

        <InfoModal show={showInfo} onClose={() => setShowInfo(false)} />
        {showInfo && <div className="absolute inset-0 bg-black/50 z-[1999]" onClick={() => setShowInfo(false)}></div>}
      </main>
    </div>
  );
}