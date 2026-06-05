import React from 'react';
import { useServices } from '../hooks/useServices';
import { useIncidents } from '../hooks/useIncidents';
import { useAlerts } from '../hooks/useAlerts';
import { useDeployments } from '../hooks/useDeployments';
import { Service, Incident, Alert, Deployment } from '../types';
import MetricCard from '../components/MetricCard';
import ServiceCard from '../components/ServiceCard';
import IncidentCard from '../components/IncidentCard';
import StatusBadge from '../components/StatusBadge';

const Dashboard: React.FC = () => {
  const { data: services = [] } = useServices();
  const { data: incidents = [] } = useIncidents();
  const { data: alerts = [] } = useAlerts();
  const { data: deployments = [] } = useDeployments();

  const operationalServices = services.filter((s: Service) => s.status === 'operational').length;
  const openIncidents = incidents.filter((i: Incident) => i.status !== 'resolved').length;
  const activeAlerts = alerts.filter((a: Alert) => a.status === 'active').length;
  const recentDeployments = deployments.slice(0, 3);
  const recentIncidents = incidents.slice(0, 3);

  const avgUptime = services.length
    ? (services.reduce((sum: number, s: Service) => sum + Number(s.uptime), 0) / services.length).toFixed(2)
    : '100.00';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time overview of your infrastructure</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs font-medium">All systems operational</span>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <MetricCard
          title="Services Online"
          value={`${operationalServices}/${services.length}`}
          subtitle="All services monitored"
          icon="⚙️"
          color="green"
        />
        <MetricCard
          title="Open Incidents"
          value={openIncidents}
          subtitle="Requires attention"
          icon="🚨"
          color={openIncidents > 0 ? 'red' : 'green'}
        />
        <MetricCard
          title="Active Alerts"
          value={activeAlerts}
          subtitle="Triggered alerts"
          icon="🔔"
          color={activeAlerts > 0 ? 'yellow' : 'green'}
        />
        <MetricCard
          title="Avg Uptime"
          value={`${avgUptime}%`}
          subtitle="Across all services"
          icon="📈"
          color="blue"
        />
      </div>

      {/* Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Services</h2>
          <span className="text-gray-500 text-xs">{services.length} monitored</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {services.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent incidents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Incidents</h2>
            <span className="text-gray-500 text-xs">{openIncidents} open</span>
          </div>
          <div className="space-y-3">
            {recentIncidents.length === 0 ? (
              <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-8 text-center">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-gray-400 text-sm">No incidents reported</p>
              </div>
            ) : (
              recentIncidents.map((incident: Incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))
            )}
          </div>
        </div>

        {/* Recent deployments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Deployments</h2>
            <span className="text-gray-500 text-xs">{deployments.length} total</span>
          </div>
          <div className="space-y-3">
            {recentDeployments.length === 0 ? (
              <div className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-8 text-center">
                <p className="text-2xl mb-2">🚀</p>
                <p className="text-gray-400 text-sm">No deployments found</p>
              </div>
            ) : (
              recentDeployments.map((deployment: Deployment) => (
                <div key={deployment.id} className="bg-gray-800/40 border border-gray-700/40 rounded-2xl p-4 hover:bg-gray-800/60 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium text-sm">{deployment.service_name}</p>
                        <span className="text-gray-500 text-xs font-mono">{deployment.version}</span>
                      </div>
                      {deployment.notes && (
                        <p className="text-gray-500 text-xs mt-1 truncate">{deployment.notes}</p>
                      )}
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <StatusBadge status={deployment.status} type="deployment" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;