import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'service' | 'incident' | 'alert' | 'deployment';
}

const getStatusStyles = (status: string, type: string) => {
  const styles: Record<string, string> = {
    // Service statuses
    operational: 'bg-green-500/20 text-green-400 border border-green-500/30',
    degraded: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    outage: 'bg-red-500/20 text-red-400 border border-red-500/30',
    maintenance: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',

    // Incident statuses
    open: 'bg-red-500/20 text-red-400 border border-red-500/30',
    investigating: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    resolved: 'bg-green-500/20 text-green-400 border border-green-500/30',

    // Alert statuses
    active: 'bg-red-500/20 text-red-400 border border-red-500/30',
    acknowledged: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',

    // Deployment statuses
    pending: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    in_progress: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    failed: 'bg-red-500/20 text-red-400 border border-red-500/30',
    rolled_back: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',

    // Severity
    low: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  return styles[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'service' }) => {
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getStatusStyles(status, type)}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;