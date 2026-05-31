export interface Service {
    id: string;
    name: string;
    description: string;
    url: string;
    status: 'operational' | 'degraded' | 'outage' | 'maintenance';
    response_time: number;
    uptime: number;
    error_count: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Incident {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'investigating' | 'resolved';
    service_id: string;
    service_name: string;
    resolved_at: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface Log {
    id: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    service_id: string;
    service_name: string;
    metadata: Record<string, unknown> | null;
    created_at: string;
  }
  
  export interface Alert {
    id: string;
    title: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'active' | 'acknowledged' | 'resolved';
    service_id: string;
    service_name: string;
    acknowledged_at: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface Deployment {
    id: string;
    version: string;
    service_id: string;
    service_name: string;
    status: 'pending' | 'in_progress' | 'success' | 'failed' | 'rolled_back';
    notes: string;
    deployed_at: string;
    created_at: string;
  }