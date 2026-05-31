import React from 'react';

const Navbar: React.FC = () => {
  const now = new Date().toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="h-14 bg-gray-900 border-b border-gray-700/50 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Last updated:</span>
        <span className="text-gray-300 text-sm">{now}</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs font-medium">Live</span>
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">A</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;