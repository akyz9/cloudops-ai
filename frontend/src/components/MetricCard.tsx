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
  green: {
    icon: 'bg-green-500/10 border-green-500/20 text-green-400',
    glow: 'shadow-green-500/5',
    value: 'text-green-400',
  },
  red: {
    icon: 'bg-red-500/10 border-red-500/20 text-red-400',
    glow: 'shadow-red-500/5',
    value: 'text-red-400',
  },
  yellow: {
    icon: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    glow: 'shadow-yellow-500/5',
    value: 'text-yellow-400',
  },
  blue: {
    icon: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    glow: 'shadow-blue-500/5',
    value: 'text-blue-400',
  },
  purple: {
    icon: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    glow: 'shadow-purple-500/5',
    value: 'text-purple-400',
  },
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
}) => {
  const styles = colorStyles[color];

  return (
    <div className={`bg-gray-800/40 border border-gray-700/40 rounded-2xl p-5 hover:border-gray-600/60 hover:bg-gray-800/60 transition-all duration-300 shadow-lg ${styles.glow}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl border text-xl ${styles.icon}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
            trend === 'up' ? 'bg-green-500/10 text-green-400' :
            trend === 'down' ? 'bg-red-500/10 text-red-400' :
            'bg-gray-700/50 text-gray-400'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      <div>
        <p className={`text-3xl font-bold mb-1 ${styles.value}`}>{value}</p>
        <p className="text-gray-300 text-sm font-medium">{title}</p>
        {subtitle && (
          <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;