import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '../config/api';

export interface App {
  id: string;
  name: string;
  description: string;
  repositoryUrl?: string;
  apiKey: string;
  createdAt: string;
  lastAuditAt?: string;
  connectionType?: 'cli' | 'extension' | null;
  isConnected?: boolean;
}

export interface Audit {
  id: string;
  appId: string;
  status: 'running' | 'completed' | 'failed';
  score?: number;
  isCompliant?: boolean;
  createdAt: string;
  completedAt?: string;
  findings?: Finding[];
}

export interface Finding {
  id: string;
  category: string;
  file: string;
  line: number;
  severity: 'critical' | 'warning' | 'info';
  description: string;
  suggestion: string;
  resolved: boolean;
  nextSteps: string[];
}

interface AppContextType {
  apps: App[];
  audits: Audit[];
  loading: boolean;
  createApp: (appData: Omit<App, 'id' | 'apiKey' | 'createdAt'>) => Promise<App>;
  updateApp: (id: string, updates: Partial<App>) => Promise<void>;
  deleteApp: (id: string) => Promise<void>;
  getAppByName: (name: string) => App | undefined;
  createAudit: (appId: string) => Promise<string>;
  updateAudit: (id: string, updates: Partial<Audit>) => Promise<void>;
  getAuditsByApp: (appId: string) => Audit[];
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  // Load apps and audits from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadData();
    } else {
      setApps([]);
      setAudits([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appsData, auditsData] = await Promise.all([
        api.get<App[]>('/apps'),
        api.get<Audit[]>('/audits'),
      ]);
      setApps(appsData);
      setAudits(auditsData);
    } catch (error) {
      console.error('Failed to load data from backend:', error);
      setApps([]);
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const createApp = async (appData: Omit<App, 'id' | 'apiKey' | 'createdAt'>): Promise<App> => {
    const newApp = await api.post<App>('/apps', appData);
    setApps(prev => [...prev, newApp]);
    return newApp;
  };

  const updateApp = async (id: string, updates: Partial<App>): Promise<void> => {
    const updatedApp = await api.put<App>(`/apps/${id}`, updates);
    setApps(prev => prev.map(app => app.id === id ? updatedApp : app));
  };

  const deleteApp = async (id: string): Promise<void> => {
    await api.delete(`/apps/${id}`);
    setApps(prev => prev.filter(app => app.id !== id));
    setAudits(prev => prev.filter(audit => audit.appId !== id));
  };

  const getAppByName = (name: string): App | undefined => {
    return apps.find(app => app.name.toLowerCase().replace(/\s+/g, '-') === name.toLowerCase().replace(/\s+/g, '-'));
  };

  const createAudit = async (appId: string): Promise<string> => {
    const newAudit = await api.post<Audit>('/audits', { appId });
    setAudits(prev => [...prev, newAudit]);
    return newAudit.id;
  };

  const updateAudit = async (id: string, updates: Partial<Audit>): Promise<void> => {
    const updatedAudit = await api.put<Audit>(`/audits/${id}`, updates);
    setAudits(prev => prev.map(audit => audit.id === id ? updatedAudit : audit));
  };

  const getAuditsByApp = (appId: string): Audit[] => {
    return audits.filter(audit => audit.appId === appId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  return (
    <AppContext.Provider
      value={{
        apps,
        audits,
        loading,
        createApp,
        updateApp,
        deleteApp,
        getAppByName,
        createAudit,
        updateAudit,
        getAuditsByApp,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApps = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApps must be used within an AppProvider');
  }
  return context;
};
