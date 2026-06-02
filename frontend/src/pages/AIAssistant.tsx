import React, { useState } from 'react';
import { useIncidents } from '../hooks/useIncidents';
import { useAI } from '../hooks/useAI';
import { Incident } from '../types';
import StatusBadge from '../components/StatusBadge';

const AIAssistant: React.FC = () => {
  const { data: incidents = [] } = useIncidents();
  const { analyse, loading, error, result } = useAI();
  const [selectedIncident, setSelectedIncident] = useState<string>('');

  const openIncidents = incidents.filter(
    (i: Incident) => i.status !== 'resolved'
  );

  const handleAnalyse = () => {
    if (selectedIncident) {
      analyse(selectedIncident);
    }
  };

  const selectedIncidentData = incidents.find(
    (i: Incident) => i.id === selectedIncident
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
        <p className="text-gray-400 text-sm mt-1">
          Analyse incidents using Claude AI for root cause analysis and recommendations
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center gap-3">
        <span className="text-blue-400 text-lg">🤖</span>
        <div>
          <p className="text-blue-400 font-medium text-sm">Powered by Claude</p>
          <p className="text-blue-400/70 text-xs mt-0.5">
            AI analyses real incident data, logs, service health and deployment history
          </p>
        </div>
      </div>

      {/* Incident selector */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
        <h2 className="text-white font-semibold mb-4">Select an Incident to Analyse</h2>

        {openIncidents.length === 0 ? (
          <p className="text-gray-400 text-sm">No open incidents to analyse</p>
        ) : (
          <div className="space-y-3">
            {openIncidents.map((incident: Incident) => (
              <div
                key={incident.id}
                onClick={() => setSelectedIncident(incident.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedIncident === incident.id
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : 'border-gray-700/50 hover:border-gray-600/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">{incident.title}</p>
                    {incident.service_name && (
                      <p className="text-gray-500 text-xs mt-0.5">Service: {incident.service_name}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge status={incident.severity} />
                    <StatusBadge status={incident.status} type="incident" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleAnalyse}
          disabled={!selectedIncident || loading}
          className={`mt-4 w-full py-3 rounded-xl font-medium transition-all duration-200 ${
            !selectedIncident || loading
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span>
              Analysing with Claude...
            </span>
          ) : (
            '🤖 Analyse with AI'
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Analysis result */}
      {result && result.analysis && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Analysis Results</h2>

          {selectedIncidentData && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Analysed incident</p>
              <p className="text-white font-medium">{selectedIncidentData.title}</p>
            </div>
          )}

          {/* Root cause */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span>🔍</span>
              <h3 className="text-white font-semibold">Root Cause</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {result.analysis.root_cause}
            </p>
          </div>

          {/* Contributing factors */}
          {result.analysis.contributing_factors?.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span>⚠️</span>
                <h3 className="text-white font-semibold">Contributing Factors</h3>
              </div>
              <ul className="space-y-2">
                {result.analysis.contributing_factors.map((factor: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <p className="text-gray-300 text-sm">{factor}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended actions */}
          {result.analysis.recommended_actions?.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span>✅</span>
                <h3 className="text-white font-semibold">Recommended Actions</h3>
              </div>
              <ul className="space-y-2">
                {result.analysis.recommended_actions.map((action: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5 font-bold text-xs">{index + 1}.</span>
                    <p className="text-gray-300 text-sm">{action}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Severity and resolution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.analysis.severity_assessment && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span>📊</span>
                  <h3 className="text-white font-semibold">Severity Assessment</h3>
                </div>
                <p className="text-gray-300 text-sm">{result.analysis.severity_assessment}</p>
              </div>
            )}

            {result.analysis.estimated_resolution_time && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span>⏱️</span>
                  <h3 className="text-white font-semibold">Estimated Resolution</h3>
                </div>
                <p className="text-gray-300 text-sm">{result.analysis.estimated_resolution_time}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;