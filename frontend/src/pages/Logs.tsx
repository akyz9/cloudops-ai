import React, { useState } from 'react';
import { useLogs } from '../hooks/useLogs';
import { Log } from '../types';

const levelStyles: Record<string, string> = {
  info: 'text-blue-400 bg-blue-500/10 border border-blue-500/20',
  warning: 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20',
  error: 'text-red-400 bg-red-500/10 border border-red-500/20',
};

const levelIcons: Record<string, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
};

const Logs: React.FC = () => {
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const { data: logs = [], isLoading, error } = useLogs(
    levelFilter !== 'all' ? { level: levelFilter } : undefined
  );

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
        <div className="text-gray-400">Loading logs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Failed to load logs</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Logs</h1>
        <p className="text-gray-400 text-sm mt-1">Application and infrastructure log stream</p>
      </div>

      <div className="flex gap-2">
        {['all', 'info', 'warning', 'error'].map(level => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              levelFilter === level
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white bg-gray-800/50 border border-gray-700/50'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
          <span className="text-gray-400 text-sm">{logs.length} log entries</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-xs">Live</span>
          </div>
        </div>

        <div className="divide-y divide-gray-700/30">
          {logs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No logs found</p>
            </div>
          ) : (
            logs.map((log: Log) => (
              <div key={log.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-sm mt-0.5">{levelIcons[log.level]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${levelStyles[log.level]}`}>
                        {log.level}
                      </span>
                      {log.service_name && (
                        <span className="text-gray-500 text-xs">{log.service_name}</span>
                      )}
                      <span className="text-gray-600 text-xs ml-auto">{timeAgo(log.created_at)}</span>
                    </div>
                    <p className="text-gray-300 text-sm font-mono">{log.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Logs;