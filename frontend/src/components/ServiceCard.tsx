import React from 'react';
import { Service } from '../types';
import StatusBadge from './StatusBadge';

interface ServiceCardProps {
  service: Service;
}

const statusColor = (status: string) => {
  switch (status) {
    case 'operational': return 'bg-green-400';
    case 'degraded': return 'bg-yellow-400';
    case 'outage': return 'bg-red-400';
    default: return 'bg-blue-400';
  }
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-5 hover:border-gray-600/60 hover:bg-gray-800/60 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${statusColor(service.status)} ${service.status === 'operational' ? 'animate-pulse' : ''}`}></div>
          <h3 className="text-white font-semibold">{service.name}</h3>
        </div>
        <StatusBadge status={service.status} type="service" />
      </div>

      <p className="text-gray-400 text-sm mb-4">{service.description}</p>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-900/60 rounded-xl p-3 text-center">
          <p className="text-gray-500 text-xs mb-1">Response</p>
          <p className="text-white font-bold text-sm">{service.response_time}ms</p>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-3 text-center">
          <p className="text-gray-500 text-xs mb-1">Uptime</p>
          <p className="text-green-400 font-bold text-sm">{service.uptime}%</p>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-3 text-center">
          <p className="text-gray-500 text-xs mb-1">Errors</p>
          <p className={`font-bold text-sm ${service.error_count > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {service.error_count}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700/40">
        <p className="text-gray-600 text-xs truncate">{service.url}</p>
      </div>
    </div>
  );
};

export default ServiceCard;