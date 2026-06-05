import React, { useState } from 'react';
import { useIncidents, useUpdateIncidentStatus } from '../hooks/useIncidents';
import { Incident } from '../types';
import IncidentCard from '../components/IncidentCard';

const Incidents: React.FC = () => {
  const { data: incidents = [], isLoading, error } = useIncidents();
  const updateStatus = useUpdateIncidentStatus();
  const [filter, setFilter] = useState<string>('all');

  const filteredIncidents = incidents.filter((i: Incident) => {
    if (filter === 'all') return true;
    return i.status === filter;
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
          Loading incidents...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-red-400">Failed to load incidents</p>
        </div>
      </div>
    );
  }

  const openCount = incidents.filter((i: Incident) => i.status === 'open').length;
  const investigatingCount = incidents.filter((i: Incident) => i.status === 'investigating').length;
  const resolvedCount = incidents.filter((i: Incident) => i.status === 'resolved').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Incidents</h1>
        <p className="text-gray-400 text-sm mt-1">Track and manage infrastructure incidents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{openCount}</p>
          <p className="text-gray-400 text-sm mt-1">Open</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">{investigatingCount}</p>
          <p className="text-gray-400 text-sm mt-1">Investigating</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{resolvedCount}</p>
          <p className="text-gray-400 text-sm mt-1">Resolved</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'open', 'investigating', 'resolved'].map(status => (
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

      {/* Incidents list */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-12 text-center">
            <p className="text-3xl mb-3">✅</p>
            <p className="text-gray-400">No incidents found</p>
          </div>
        ) : (
          filteredIncidents.map((incident: Incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Incidents;