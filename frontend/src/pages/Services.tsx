import React from 'react';
import { useServices } from '../hooks/useServices';
import { Service } from '../types';
import ServiceCard from '../components/ServiceCard';

const Services: React.FC = () => {
  const { data: services = [], isLoading, error } = useServices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
          Loading services...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-red-400">Failed to load services</p>
        </div>
      </div>
    );
  }

  const operational = services.filter((s: Service) => s.status === 'operational').length;
  const degraded = services.filter((s: Service) => s.status === 'degraded').length;
  const outage = services.filter((s: Service) => s.status === 'outage').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Services</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor the health of all your services</p>
      </div>

      {/* Summary bar */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">{operational} Operational</span>
        </div>
        {degraded > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-yellow-400 text-sm font-medium">{degraded} Degraded</span>
          </div>
        )}
        {outage > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-red-400 text-sm font-medium">{outage} Outage</span>
          </div>
        )}
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {services.map((service: Service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default Services;