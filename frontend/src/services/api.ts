import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Services
export const getServices = async () => {
  const response = await api.get('/services');
  return response.data.services;
};

export const updateServiceStatus = async (id: string, data: object) => {
  const response = await api.patch(`/services/${id}/status`, data);
  return response.data.service;
};

// Incidents
export const getIncidents = async () => {
  const response = await api.get('/incidents');
  return response.data.incidents;
};

export const createIncident = async (data: object) => {
  const response = await api.post('/incidents', data);
  return response.data.incident;
};

export const updateIncidentStatus = async (id: string, status: string) => {
  const response = await api.patch(`/incidents/${id}/status`, { status });
  return response.data.incident;
};

// Logs
export const getLogs = async (params?: object) => {
  const response = await api.get('/logs', { params });
  return response.data.logs;
};

export const createLog = async (data: object) => {
  const response = await api.post('/logs', data);
  return response.data.log;
};

// Alerts
export const getAlerts = async (params?: object) => {
  const response = await api.get('/alerts', { params });
  return response.data.alerts;
};

export const acknowledgeAlert = async (id: string) => {
  const response = await api.patch(`/alerts/${id}/acknowledge`);
  return response.data.alert;
};

export const resolveAlert = async (id: string) => {
  const response = await api.patch(`/alerts/${id}/resolve`);
  return response.data.alert;
};

export const createAlert = async (data: object) => {
  const response = await api.post('/alerts', data);
  return response.data.alert;
};

// Deployments
export const getDeployments = async () => {
  const response = await api.get('/deployments');
  return response.data.deployments;
};

export const createDeployment = async (data: object) => {
  const response = await api.post('/deployments', data);
  return response.data.deployment;
};

export const updateDeploymentStatus = async (id: string, status: string) => {
  const response = await api.patch(`/deployments/${id}/status`, { status });
  return response.data.deployment;
};

export default api;