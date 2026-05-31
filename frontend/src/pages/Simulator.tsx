import React, { useState } from 'react';
import { useServices } from '../hooks/useServices';
import { useCreateIncident } from '../hooks/useIncidents';
import { useCreateAlert } from '../hooks/useAlerts';
import { useCreateLog } from '../hooks/useLogs';
import { useUpdateServiceStatus } from '../hooks/useServices';

const scenarios = [
  {
    id: 'api_outage',
    name: 'API Outage',
    description: 'Simulates a complete API service outage',
    icon: '🔴',
    severity: 'critical',
    serviceTarget: 'Backend API',
    color: 'red',
  },
  {
    id: 'database_failure',
    name: 'Database Failure',
    description: 'Simulates a database connection failure',
    icon: '💾',
    severity: 'critical',
    serviceTarget: 'Database',
    color: 'red',
  },
  {
    id: 'high_latency',
    name: 'High Latency',
    description: 'Simulates degraded response times across services',
    icon: '🐢',
    severity: 'high',
    serviceTarget: 'Backend API',
    color: 'orange',
  },
  {
    id: 'high_cpu',
    name: 'High CPU Usage',
    description: 'Simulates CPU usage spike on backend service',
    icon: '🔥',
    severity: 'high',
    serviceTarget: 'Backend API',
    color: 'orange',
  },
  {
    id: 'failed_deployment',
    name: 'Failed Deployment',
    description: 'Simulates a failed deployment pipeline',
    icon: '🚫',
    severity: 'medium',
    serviceTarget: 'Frontend',
    color: 'yellow',
  },
  {
    id: 'storage_permission',
    name: 'S3 Permission Issue',
    description: 'Simulates an S3 bucket permission misconfiguration',
    icon: '🔒',
    severity: 'medium',
    serviceTarget: 'Storage',
    color: 'yellow',
  },
  {
    id: 'internal_server_error',
    name: 'Internal Server Errors',
    description: 'Simulates a spike in 500 errors on the API',
    icon: '⚠️',
    severity: 'high',
    serviceTarget: 'Backend API',
    color: 'orange',
  },
];

const colorStyles: Record<string, string> = {
  red: 'border-red-500/30 hover:border-red-500/60 bg-red-500/5',
  orange: 'border-orange-500/30 hover:border-orange-500/60 bg-orange-500/5',
  yellow: 'border-yellow-500/30 hover:border-yellow-500/60 bg-yellow-500/5',
};

const Simulator: React.FC = () => {
  const { data: services = [] } = useServices();
  const createIncident = useCreateIncident();
  const createAlert = useCreateAlert();
  const createLog = useCreateLog();
  const updateServiceStatus = useUpdateServiceStatus();

  const [running, setRunning] = useState<string | null>(null);
  const [results, setResults] = useState<{ scenario: string; message: string; time: string }[]>([]);

  const getServiceId = (serviceName: string) => {
    const service = services.find(s => s.name === serviceName);
    return service?.id;
  };

  const runScenario = async (scenario: typeof scenarios[0]) => {
    setRunning(scenario.id);

    try {
      const serviceId = getServiceId(scenario.serviceTarget);

      // Create incident
      await createIncident.mutateAsync({
        title: `[SIMULATED] ${scenario.name}`,
        description: scenario.description,
        severity: scenario.severity,
        service_id: serviceId,
      });

      // Create alert
      await createAlert.mutateAsync({
        title: `[SIMULATED] ${scenario.name} detected`,
        message: `Automated alert triggered by incident simulator: ${scenario.description}`,
        severity: scenario.severity,
        service_id: serviceId,
      });

      // Create logs
      await createLog.mutateAsync({
        level: 'error',
        message: `[SIMULATED] ${scenario.name}: ${scenario.description}`,
        service_id: serviceId,
      });

      await createLog.mutateAsync({
        level: 'warning',
        message: `[SIMULATED] Health check failing for ${scenario.serviceTarget}`,
        service_id: serviceId,
      });

      // Update service status for outage scenarios
      if (scenario.id === 'api_outage' || scenario.id === 'database_failure') {
        if (serviceId) {
          await updateServiceStatus.mutateAsync({
            id: serviceId,
            data: { status: 'outage' },
          });
        }
      } else if (scenario.id === 'high_latency') {
        if (serviceId) {
          await updateServiceStatus.mutateAsync({
            id: serviceId,
            data: { status: 'degraded', response_time: 2500 },
          });
        }
      }

      setResults(prev => [{
        scenario: scenario.name,
        message: `Successfully simulated ${scenario.name}. Incident, alert and logs created.`,
        time: new Date().toLocaleTimeString(),
      }, ...prev]);

    } catch (error) {
      setResults(prev => [{
        scenario: scenario.name,
        message: `Failed to simulate ${scenario.name}. Please try again.`,
        time: new Date().toLocaleTimeString(),
      }, ...prev]);
    } finally {
      setRunning(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Incident Simulator</h1>
        <p className="text-gray-400 text-sm mt-1">
          Simulate real-world incidents to test your monitoring and alerting systems
        </p>
      </div>

      {/* Warning banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
        <span className="text-yellow-400 text-lg">⚠️</span>
        <div>
          <p className="text-yellow-400 font-medium text-sm">Simulation Mode</p>
          <p className="text-yellow-400/70 text-xs mt-0.5">
            All simulated incidents are tagged with [SIMULATED] and will create real records in the database
          </p>
        </div>
      </div>

      {/* Scenarios grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map(scenario => (
          <div
            key={scenario.id}
            className={`border rounded-xl p-5 transition-all duration-200 ${colorStyles[scenario.color]}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{scenario.icon}</span>
              <div>
                <h3 className="text-white font-semibold text-sm">{scenario.name}</h3>
                <span className={`text-xs capitalize ${
                  scenario.severity === 'critical' ? 'text-red-400' :
                  scenario.severity === 'high' ? 'text-orange-400' :
                  'text-yellow-400'
                }`}>
                  {scenario.severity} severity
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-4">{scenario.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Target: {scenario.serviceTarget}</span>
              <button
                onClick={() => runScenario(scenario)}
                disabled={running === scenario.id}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                  running === scenario.id
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
                }`}
              >
                {running === scenario.id ? 'Running...' : 'Simulate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Results log */}
      {results.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Simulation Results</h2>
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-700/30">
              {results.map((result, index) => (
                <div key={index} className="p-4 flex items-start gap-3">
                  <span className="text-green-400 text-sm">✓</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{result.scenario}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{result.message}</p>
                  </div>
                  <span className="text-gray-500 text-xs">{result.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulator;