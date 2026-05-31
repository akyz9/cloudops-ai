import React from 'react';
import { Alert } from '../types';
import StatusBadge from './StatusBadge';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onAcknowledge, onResolve }) => {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const severityIcon: Record<string, string> = {
    low: '🔵',
    medium: '🟡',
    high: '🟠',
    critical: '🔴',
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <span>{severityIcon[alert.severity]}</span>
          <div>
            <h3 className="text-white font-semibold">{alert.title}</h3>
            {alert.service_name && (
              <p className="text-gray-500 text-xs">Service: {alert.service_name}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-4">
          <StatusBadge status={alert.severity} />
          <StatusBadge status={alert.status} type="alert" />
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4">{alert.message}</p>

      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs">{timeAgo(alert.created_at)}</p>

        <div className="flex gap-2">
          {alert.status === 'active' && onAcknowledge && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-md text-xs hover:bg-yellow-500/30 transition-colors"
            >
              Acknowledge
            </button>
          )}
          {alert.status !== 'resolved' && onResolve && (
            <button
              onClick={() => onResolve(alert.id)}
              className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-md text-xs hover:bg-green-500/30 transition-colors"
            >
              Resolve
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;