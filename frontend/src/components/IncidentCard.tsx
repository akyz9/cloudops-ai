import React from 'react';
import { Incident } from '../types';
import StatusBadge from './StatusBadge';

interface IncidentCardProps {
  incident: Incident;
  onStatusChange?: (id: string, status: string) => void;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onStatusChange }) => {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">{incident.title}</h3>
          {incident.service_name && (
            <p className="text-gray-500 text-xs">Service: {incident.service_name}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 ml-4">
          <StatusBadge status={incident.severity} />
          <StatusBadge status={incident.status} type="incident" />
        </div>
      </div>

      {incident.description && (
        <p className="text-gray-400 text-sm mb-4">{incident.description}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs">{timeAgo(incident.created_at)}</p>

        {onStatusChange && incident.status !== 'resolved' && (
          <div className="flex gap-2">
            {incident.status === 'open' && (
              <button
                onClick={() => onStatusChange(incident.id, 'investigating')}
                className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-md text-xs hover:bg-yellow-500/30 transition-colors"
              >
                Investigate
              </button>
            )}
            <button
              onClick={() => onStatusChange(incident.id, 'resolved')}
              className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-md text-xs hover:bg-green-500/30 transition-colors"
            >
              Resolve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentCard;