import api from './api';

export const analyseIncident = async (incidentId: string) => {
  const response = await api.post(`/ai/analyse/${incidentId}`);
  return response.data;
};

export const getAnalysis = async (incidentId: string) => {
  const response = await api.get(`/ai/analysis/${incidentId}`);
  return response.data;
};