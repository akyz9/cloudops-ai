import React from 'react';
import { useDeployments } from '../hooks/useDeployments';
import { Deployment } from '../types';
import StatusBadge from '../components/StatusBadge';

const Deployments: React.FC = () => {
  const { data: deployments = [], isLoading, error } = useDeployments();

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const statusIcon: Record<string, string> = {
    success: '✅',
    failed: '❌',
    pending: '⏳',
    in_progress: '🔄',
    rolled_back: '↩️',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
          Loading deployments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-red-400">Failed to load deployments</p>
        </div>
      </div>
    );
  }

  const successCount = deployments.filter((d: Deployment) => d.status === 'success').length;
  const failedCount = deployments.filter((d: Deployment) => d.status === 'failed').length;
  const pendingCount = deployments.filter((d: Deployment) => d.status === 'pending' || d.status === 'in_progress').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Deployments</h1>
        <p className="text-gray-400 text-sm mt-1">Track deployment history and status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{successCount}</p>
          <p className="text-gray-400 text-sm mt-1">Successful</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{failedCount}</p>
          <p className="text-gray-400 text-sm mt-1">Failed</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
          <p className="text-gray-400 text-sm mt-1">In Progress</p>
        </div>
      </div>

      {/* Deployments list */}
      <div className="space-y-3">
        {deployments.length === 0 ? (
          <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-12 text-center">
            <p className="text-3xl mb-3">🚀</p>
            <p className="text-gray-400">No deployments found</p>
          </div>
        ) : (
          deployments.map((deployment: Deployment) => (
            <div
              key={deployment.id}
              className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-5 hover:border-gray-600/60 hover:bg-gray-800/60 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="text-xl flex-shrink-0 mt-0.5">{statusIcon[deployment.status] || '🚀'}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm">{deployment.service_name}</h3>
                      <span className="text-gray-400 text-xs font-mono bg-gray-900/60 px-2 py-0.5 rounded-lg">{deployment.version}</span>
                    </div>
                    {deployment.notes && (
                      <p className="text-gray-400 text-sm">{deployment.notes}</p>
                    )}
                    <p className="text-gray-600 text-xs mt-1.5">{timeAgo(deployment.deployed_at)}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <StatusBadge status={deployment.status} type="deployment" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Deployments;