import React from 'react';
import { Service } from '../types';
import StatusBadge from './StatusBadge';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">{service.name}</h3>
        <StatusBadge status={service.status} type="service" />
      </div>

      <p className="text-gray-400 text-sm mb-4">{service.description}</p>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">Response</p>
          <p className="text-white font-semibold text-sm">{service.response_time}ms</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">Uptime</p>
          <p className="text-green-400 font-semibold text-sm">{service.uptime}%</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">Errors</p>
          <p className={`font-semibold text-sm ${service.error_count > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {service.error_count}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700/50">
        <p className="text-gray-500 text-xs truncate">{service.url}</p>
      </div>
    </div>
  );
};

export default ServiceCard;