import React from 'react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Services', path: '/services', icon: '⚙️' },
  { name: 'Incidents', path: '/incidents', icon: '🚨' },
  { name: 'Alerts', path: '/alerts', icon: '🔔' },
  { name: 'Logs', path: '/logs', icon: '📋' },
  { name: 'Deployments', path: '/deployments', icon: '🚀' },
  { name: 'Simulator', path: '/simulator', icon: '⚡' },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700/50 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">CloudOps AI</h1>
            <p className="text-gray-500 text-xs">Operations Centre</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-xs">All systems operational</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;