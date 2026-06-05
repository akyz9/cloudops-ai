import React from 'react';
import { Alert } from '../types';
import StatusBadge from './StatusBadge';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
}

const severityIcon: Record<string, string> = {
  low: '🔵',
  medium: '🟡',
  high: '🟠',
  critical: '🔴',
};

const severityBorder: Record<string, string> = {
  low: 'border-l-blue-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-orange-500',
  critical: 'border-l-red-500',
};

const AlertCard: React.FC<AlertCardProps> = ({ alert, onAcknowledge, onResolve }) => {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className={`bg-gray-800/40 border border-gray-700/40 border-l-2 ${severityBorder[alert.severity]} rounded-2xl p-5 hover:border-gray-600/60 hover:bg-gray-800/60 transition-all duration-300`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-lg mt-0.5 flex-shrink-0">{severityIcon[alert.severity]}</span>
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-sm">{alert.title}</h3>
            {alert.service_name && (
              <p className="text-gray-500 text-xs mt-0.5">Service: {alert.service_name}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 ml-3 flex-shrink-0">
          <StatusBadge status={alert.severity} />
          <StatusBadge status={alert.status} type="alert" />
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-3 ml-8">{alert.message}</p>

      <div className="flex items-center justify-between ml-8">
        <p className="text-gray-600 text-xs">{timeAgo(alert.created_at)}</p>

        <div className="flex gap-2">
          {alert.status === 'active' && onAcknowledge && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg text-xs font-medium hover:bg-yellow-500/20 transition-colors"
            >
              Acknowledge
            </button>
          )}
          {alert.status !== 'resolved' && onResolve && (
            <button
              onClick={() => onResolve(alert.id)}
              className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-colors"
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