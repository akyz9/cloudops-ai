import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Services', path: '/services', icon: '⚙️' },
  { name: 'Incidents', path: '/incidents', icon: '🚨' },
  { name: 'Alerts', path: '/alerts', icon: '🔔' },
  { name: 'Logs', path: '/logs', icon: '📋' },
  { name: 'Deployments', path: '/deployments', icon: '🚀' },
  { name: 'Simulator', path: '/simulator', icon: '⚡' },
  { name: 'AI Assistant', path: '/ai', icon: '🤖' },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700/50 h-full flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">CloudOps AI</h1>
              <p className="text-gray-500 text-xs">Operations Centre</p>
            </div>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/70'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center gap-2 px-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-xs">All systems operational</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;