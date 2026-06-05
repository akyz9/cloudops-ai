import React, { useState } from 'react';
import { useAlerts, useAcknowledgeAlert, useResolveAlert } from '../hooks/useAlerts';
import { Alert } from '../types';
import AlertCard from '../components/AlertCard';

const Alerts: React.FC = () => {
  const { data: alerts = [], isLoading, error } = useAlerts();
  const acknowledgeAlert = useAcknowledgeAlert();
  const resolveAlert = useResolveAlert();
  const [filter, setFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter((a: Alert) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
          Loading alerts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-red-400">Failed to load alerts</p>
        </div>
      </div>
    );
  }

  const activeCount = alerts.filter((a: Alert) => a.status === 'active').length;
  const acknowledgedCount = alerts.filter((a: Alert) => a.status === 'acknowledged').length;
  const resolvedCount = alerts.filter((a: Alert) => a.status === 'resolved').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Alerts</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor and respond to system alerts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{activeCount}</p>
          <p className="text-gray-400 text-sm mt-1">Active</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">{acknowledgedCount}</p>
          <p className="text-gray-400 text-sm mt-1">Acknowledged</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{resolvedCount}</p>
          <p className="text-gray-400 text-sm mt-1">Resolved</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'active', 'acknowledged', 'resolved'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200 whitespace-nowrap ${
              filter === status
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white bg-gray-800/50 border border-gray-700/50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-12 text-center">
            <p className="text-3xl mb-3">🔔</p>
            <p className="text-gray-400">No alerts found</p>
          </div>
        ) : (
          filteredAlerts.map((alert: Alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={(id) => acknowledgeAlert.mutate(id)}
              onResolve={(id) => resolveAlert.mutate(id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;