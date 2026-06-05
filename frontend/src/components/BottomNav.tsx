import React from 'react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Incidents', path: '/incidents', icon: '🚨' },
  { name: 'Simulator', path: '/simulator', icon: '⚡' },
  { name: 'Alerts', path: '/alerts', icon: '🔔' },
  { name: 'AI', path: '/ai', icon: '🤖' },
];

const BottomNav: React.FC = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="text-xs font-medium truncate">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;