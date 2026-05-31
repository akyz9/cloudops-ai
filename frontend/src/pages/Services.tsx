import React from 'react';
import { useServices } from '../hooks/useServices';
import { Service } from '../types';
import ServiceCard from '../components/ServiceCard';

const Services: React.FC = () => {
  const { data: services = [], isLoading, error } = useServices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Failed to load services</div>
      </div>
    );
  }

  const operational = services.filter((s: Service) => s.status === 'operational').length;
  const degraded = services.filter((s: Service) => s.status === 'degraded').length;
  const outage = services.filter((s: Service) => s.status === 'outage').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Services</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor the health of all your services</p>
      </div>

      <div className="flex gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-green-400 text-sm">{operational} Operational</span>
        </div>
        {degraded > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-yellow-400 text-sm">{degraded} Degraded</span>
          </div>
        )}
        {outage > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-red-400 text-sm">{outage} Outage</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: Service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default Services;