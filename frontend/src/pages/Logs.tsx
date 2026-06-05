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

const levelDot: Record<string, string> = {
  info: 'bg-blue-400',
  warning: 'bg-yellow-400',
  error: 'bg-red-400',
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
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
          Loading logs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-red-400">Failed to load logs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Logs</h1>
        <p className="text-gray-400 text-sm mt-1">Application and infrastructure log stream</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'info', 'warning', 'error'].map(level => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
              levelFilter === level
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white bg-gray-800/50 border border-gray-700/50'
            }`}
          >
            {level !== 'all' && (
              <div className={`w-1.5 h-1.5 rounded-full ${levelDot[level]}`}></div>
            )}
            {level}
          </button>
        ))}
      </div>

      {/* Log stream */}
      <div className="bg-gray-900/60 border border-gray-700/40 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-700/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            </div>
            <span className="text-gray-400 text-sm font-mono">log stream</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-xs">{logs.length} entries</span>
          </div>
        </div>

        <div className="divide-y divide-gray-800/60 max-h-[600px] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-3xl mb-3">📋</p>
              <p className="text-gray-400">No logs found</p>
            </div>
          ) : (
            logs.map((log: Log) => (
              <div key={log.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-sm mt-0.5 flex-shrink-0">{levelIcons[log.level]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-medium uppercase ${levelStyles[log.level]}`}>
                        {log.level}
                      </span>
                      {log.service_name && (
                        <span className="text-gray-500 text-xs bg-gray-800 px-2 py-0.5 rounded-lg">{log.service_name}</span>
                      )}
                      <span className="text-gray-600 text-xs ml-auto">{timeAgo(log.created_at)}</span>
                    </div>
                    <p className="text-gray-300 text-sm font-mono leading-relaxed break-words">{log.message}</p>
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