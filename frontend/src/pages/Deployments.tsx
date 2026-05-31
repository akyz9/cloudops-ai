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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading deployments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Failed to load deployments</div>
      </div>
    );
  }

  const successCount = deployments.filter((d: Deployment) => d.status === 'success').length;
  const failedCount = deployments.filter((d: Deployment) => d.status === 'failed').length;
  const pendingCount = deployments.filter((d: Deployment) => d.status === 'pending' || d.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Deployments</h1>
        <p className="text-gray-400 text-sm mt-1">Track deployment history and status</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{successCount}</p>
          <p className="text-gray-400 text-sm mt-1">Successful</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{failedCount}</p>
          <p className="text-gray-400 text-sm mt-1">Failed</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
          <p className="text-gray-400 text-sm mt-1">In Progress</p>
        </div>
      </div>

      <div className="space-y-3">
        {deployments.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 text-center">
            <p className="text-gray-400">No deployments found</p>
          </div>
        ) : (
          deployments.map((deployment: Deployment) => (
            <div
              key={deployment.id}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-semibold">{deployment.service_name}</h3>
                    <span className="text-gray-400 text-sm font-mono">{deployment.version}</span>
                  </div>
                  {deployment.notes && (
                    <p className="text-gray-400 text-sm">{deployment.notes}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-2">{timeAgo(deployment.deployed_at)}</p>
                </div>
                <StatusBadge status={deployment.status} type="deployment" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Deployments;