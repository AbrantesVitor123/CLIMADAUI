import React from 'react';

interface SummaryPanelProps {
    stats: {
        points: number;
        totalValue: number;
        totalEai: number;
    };
    loading: boolean;
}

const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Panel: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="bg-gray-800/70 backdrop-blur-md p-4 rounded-lg shadow-lg border border-gray-700/50 w-80">
        <h3 className="text-base font-semibold text-white mb-3">{title}</h3>
        {children}
    </div>
);

const SkeletonLoader = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-600 rounded w-5/6"></div>
        <div className="h-4 bg-gray-600 rounded w-4/6"></div>
    </div>
);

const SummaryRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}:</span>
        <span className="font-semibold text-white">{value}</span>
    </div>
);


export default function SummaryPanel({ stats, loading }: SummaryPanelProps) {
    return (
        <Panel title="Resumo do Cenário">
            <div className="h-16">
                {loading ? <SkeletonLoader /> : (
                    <div className="space-y-2">
                        <SummaryRow label="Pontos analisados" value={stats.points} />
                        <SummaryRow label="Exposição total" value={formatCurrency(stats.totalValue)} />
                        <SummaryRow label="Perda total esperada" value={formatCurrency(stats.totalEai)} />
                    </div>
                )}
            </div>
        </Panel>
    );
}