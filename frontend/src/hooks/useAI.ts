import { useState } from 'react';
import { analyseIncident, getAnalysis } from '../services/aiService';

interface Analysis {
  root_cause: string;
  contributing_factors: string[];
  recommended_actions: string[];
  severity_assessment: string;
  estimated_resolution_time: string;
}

interface AIResult {
  incident_id: string;
  analysis: Analysis;
}

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIResult | null>(null);

  const analyse = async (incidentId: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyseIncident(incidentId);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyse incident');
    } finally {
      setLoading(false);
    }
  };

  const fetchExisting = async (incidentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAnalysis(incidentId);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'No previous analysis found');
    } finally {
      setLoading(false);
    }
  };

  return { analyse, fetchExisting, loading, error, result };
};