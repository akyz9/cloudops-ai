import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'red' | 'yellow' | 'blue' | 'purple';
}

const colorStyles = {
  green: 'text-green-400 bg-green-500/10 border-green-500/20',
  red: 'text-red-400 bg-red-500/10 border-red-500/20',
  yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
}) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <span className={`text-xl p-2 rounded-lg border ${colorStyles[color]}`}>
          {icon}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        {trend && (
          <span className={`text-sm ${
            trend === 'up' ? 'text-green-400' :
            trend === 'down' ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricCard;