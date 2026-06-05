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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">AI Assistant</h1>
        <p className="text-gray-400 text-sm mt-1">
          Analyse incidents using Claude AI for root cause analysis and recommendations
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-lg">🤖</span>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Powered by Claude</p>
          <p className="text-gray-400 text-xs mt-0.5">
            Analyses real incident data, logs, service health and deployment history to provide actionable insights
          </p>
        </div>
      </div>

      {/* Incident selector */}
      <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4">Select an Incident to Analyse</h2>

        {openIncidents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-3">✅</p>
            <p className="text-gray-400 text-sm">No open incidents to analyse</p>
          </div>
        ) : (
          <div className="space-y-2">
            {openIncidents.map((incident: Incident) => (
              <div
                key={incident.id}
                onClick={() => setSelectedIncident(incident.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedIncident === incident.id
                    ? 'border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/5'
                    : 'border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm truncate">{incident.title}</p>
                    {incident.service_name && (
                      <p className="text-gray-500 text-xs mt-0.5">Service: {incident.service_name}</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
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
          className={`mt-4 w-full py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            !selectedIncident || loading
              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analysing with Claude...
            </>
          ) : (
            <>
              🤖 Analyse with AI
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-red-400 text-xl flex-shrink-0">❌</span>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Analysis result */}
      {result && result.analysis && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">Analysis Results</h2>
            {selectedIncidentData && (
              <span className="text-gray-500 text-sm">— {selectedIncidentData.title}</span>
            )}
          </div>

          {/* Root cause */}
          <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                <span>🔍</span>
              </div>
              <h3 className="text-white font-semibold">Root Cause</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {result.analysis.root_cause}
            </p>
          </div>

          {/* Contributing factors */}
          {result.analysis.contributing_factors?.length > 0 && (
            <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center">
                  <span>⚠️</span>
                </div>
                <h3 className="text-white font-semibold">Contributing Factors</h3>
              </div>
              <ul className="space-y-2.5">
                {result.analysis.contributing_factors.map((factor: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm leading-relaxed">{factor}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended actions */}
          {result.analysis.recommended_actions?.length > 0 && (
            <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center">
                  <span>✅</span>
                </div>
                <h3 className="text-white font-semibold">Recommended Actions</h3>
              </div>
              <ul className="space-y-2.5">
                {result.analysis.recommended_actions.map((action: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-300 text-sm leading-relaxed">{action}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Severity and resolution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.analysis.severity_assessment && (
              <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center">
                    <span>📊</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm">Severity Assessment</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{result.analysis.severity_assessment}</p>
              </div>
            )}

            {result.analysis.estimated_resolution_time && (
              <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
                    <span>⏱️</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm">Estimated Resolution</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{result.analysis.estimated_resolution_time}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;