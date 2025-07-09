

import React, { useState } from 'react';
import type { Scenario, CustomAsset } from '../types';

const hazardOptions = ['Furacão', 'Enchentes', 'Ondas de Calor', 'Deslizamentos'];
const climaticScenarios = {
  'ssp1-2.6': 'SSP1-2.6 (Sustentabilidade)',
  'ssp2-4.5': 'SSP2-4.5 (Caminho Intermediário)',
  'ssp5-8.5': 'SSP5-8.5 (Alta Emissão)'
};

interface ControlsMenuProps {
    isOpen: boolean;
    onClose: () => void;
    scenarios: Scenario[];
    selectedScenarioId: string;
    onScenarioChange: (id: string) => void;
    loading: boolean;
    description: string;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const Panel: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="mb-4">
        <label className="text-sm text-emerald-300 block mb-2 font-semibold">{label}</label>
        {children}
    </div>
);

const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="h-3 bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
    </div>
);

export default function ControlsMenu({ 
    isOpen, 
    onClose,
    scenarios,
    selectedScenarioId,
    onScenarioChange,
    loading,
    description
}: ControlsMenuProps) {
    const [selectedHazard, setSelectedHazard] = useState('Furacão');
    const [selectedClimaticScenario, setSelectedClimaticScenario] = useState('ssp2-4.5');

    // State for custom assets
    const [assets, setAssets] = useState<CustomAsset[]>([]);
    const [assetName, setAssetName] = useState('');
    const [assetLat, setAssetLat] = useState('');
    const [assetLon, setAssetLon] = useState('');
    const [assetValue, setAssetValue] = useState('');

    const handleAddAsset = (e: React.FormEvent) => {
        e.preventDefault();
        const lat = parseFloat(assetLat);
        const lon = parseFloat(assetLon);
        const value = parseFloat(assetValue);

        if (assetName && !isNaN(lat) && !isNaN(lon) && !isNaN(value)) {
            const newAsset: CustomAsset = {
                id: Date.now(),
                name: assetName,
                lat,
                lon,
                value
            };
            setAssets([...assets, newAsset]);
            // Reset form
            setAssetName('');
            setAssetLat('');
            setAssetLon('');
            setAssetValue('');
        }
    };

    const handleRemoveAsset = (id: number) => {
        setAssets(assets.filter(asset => asset.id !== id));
    };

    const inputClass = "w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-sky-500 focus:border-sky-500 placeholder-gray-400";

    return (
      <>
        {/* Overlay */}
        <div 
            className={`fixed inset-0 bg-black/60 z-[1500] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
            aria-hidden="true"
        ></div>

        {/* Side Menu */}
        <div 
            className={`fixed top-0 left-0 h-full w-80 bg-gray-800 text-white shadow-2xl z-[1600] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="controls-menu-title"
        >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h2 id="controls-menu-title" className="text-lg font-semibold">Controles do Modelo</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-1 transition-colors"
                    aria-label="Close menu"
                >
                    <CloseIcon />
                </button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
                <Panel label="Hazard">
                    <select
                        value={selectedHazard}
                        onChange={(e) => setSelectedHazard(e.target.value)}
                        className={inputClass}
                    >
                    {hazardOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </Panel>

                <Panel label="Selecione o Cenário">
                    <select
                        id="scenario-select"
                        value={selectedScenarioId}
                        onChange={(e) => onScenarioChange(e.target.value)}
                        disabled={loading}
                        className={`${inputClass} mb-2 disabled:opacity-50`}
                    >
                        {scenarios.map((scenario) => (
                            <option key={scenario.id} value={scenario.id}>
                                {scenario.name}
                            </option>
                        ))}
                    </select>
                    <div className="text-xs text-gray-400 h-8 pt-1">
                        {loading ? <SkeletonLoader /> : <p>{description}</p>}
                    </div>
                </Panel>

                <Panel label="Ativos">
                    <form onSubmit={handleAddAsset} className="space-y-3">
                        <input type="text" placeholder="Nome do Ativo" value={assetName} onChange={e => setAssetName(e.target.value)} className={inputClass} required />
                        <div className="flex gap-2">
                            <input type="number" step="any" placeholder="Latitude" value={assetLat} onChange={e => setAssetLat(e.target.value)} className={inputClass} required />
                            <input type="number" step="any" placeholder="Longitude" value={assetLon} onChange={e => setAssetLon(e.target.value)} className={inputClass} required />
                        </div>
                        <input type="number" placeholder="Valor ($)" value={assetValue} onChange={e => setAssetValue(e.target.value)} className={inputClass} required />
                        <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
                            Adicionar Ativo
                        </button>
                    </form>
                    <div className="mt-4">
                        {assets.length > 0 && <h4 className="text-sm text-gray-300 mb-2">Ativos Adicionados:</h4>}
                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {assets.map(asset => (
                                <li key={asset.id} className="flex justify-between items-start bg-gray-700 p-2 rounded-md text-sm">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-white break-words">{asset.name}</p>
                                        <p className="text-xs text-gray-400">
                                            {`Lat: ${Math.trunc(asset.lat)}, Lon: ${Math.trunc(asset.lon)}`}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Valor: {asset.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                                        </p>
                                    </div>
                                    <button onClick={() => handleRemoveAsset(asset.id)} className="text-red-400 hover:text-red-300 p-1 ml-2 flex-shrink-0">
                                        <TrashIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Panel>

                <Panel label="Cenário Climático">
                    <select
                        value={selectedClimaticScenario}
                        onChange={(e) => setSelectedClimaticScenario(e.target.value)}
                        className={inputClass}
                    >
                    {Object.entries(climaticScenarios).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                    </select>
                </Panel>
            </div>
        </div>
      </>
    );
}