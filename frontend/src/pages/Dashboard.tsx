import React from 'react';
import { useServices } from '../hooks/useServices';
import { useIncidents } from '../hooks/useIncidents';
import { useAlerts } from '../hooks/useAlerts';
import { useDeployments } from '../hooks/useDeployments';
import { Service, Incident, Alert, Deployment } from '../types';
import MetricCard from '../components/MetricCard';
import ServiceCard from '../components/ServiceCard';
import IncidentCard from '../components/IncidentCard';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time overview of your infrastructure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Incidents</h2>
          <div className="space-y-3">
            {recentIncidents.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 text-center">
                <p className="text-gray-400 text-sm">No incidents reported</p>
              </div>
            ) : (
              recentIncidents.map((incident: Incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Deployments</h2>
          <div className="space-y-3">
            {recentDeployments.length === 0 ? (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 text-center">
                <p className="text-gray-400 text-sm">No deployments found</p>
              </div>
            ) : (
              recentDeployments.map((deployment: Deployment) => (
                <div key={deployment.id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">{deployment.service_name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{deployment.version}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      deployment.status === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      deployment.status === 'failed' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {deployment.status}
                    </span>
                  </div>
                  {deployment.notes && (
                    <p className="text-gray-500 text-xs mt-2">{deployment.notes}</p>
                  )}
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