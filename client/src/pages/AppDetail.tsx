import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApps, type App, type Audit } from '../contexts/AppContext';
import DeleteProjectModal from '../components/DeleteProjectModal';
import api from '../config/api';
import { 
  Terminal, 
  Code, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Play,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Key,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Download
} from 'lucide-react';

const AppDetail = () => {
  const { appName } = useParams<{ appName: string }>();
  const navigate = useNavigate();
  const { getAppByName, updateApp, deleteApp, createAudit, getAuditsByApp, refreshData } = useApps();
  const [app, setApp] = useState<App | undefined>(undefined);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<'cli' | 'extension' | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [_currentAuditId, setCurrentAuditId] = useState<string | null>(null);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [setupStep, setSetupStep] = useState<number>(0); // 0: Start, 1: API Key & Config, 2: Select Method, 3: Run Audit
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; message: string } | null>(null);

  useEffect(() => {
    if (appName) {
      const foundApp = getAppByName(appName);
      if (!foundApp) {
        navigate('/dashboard');
        return;
      }
      setApp(foundApp);
      setSelectedConnection(foundApp.connectionType || null);
      setAudits(getAuditsByApp(foundApp.id));
    }
  }, [appName, getAppByName, getAuditsByApp, navigate]);

  useEffect(() => {
    if (app) {
      setAudits(getAuditsByApp(app.id));
    }
  }, [app, getAuditsByApp]);

  const handleConnectionTypeSelect = async (type: 'cli' | 'extension') => {
    setSelectedConnection(type);
    if (app) {
      await updateApp(app.id, { connectionType: type, isConnected: false });
    }
  };

  const handleCheckConnection = async () => {
    if (!app || !selectedConnection) return;
    
    setIsCheckingConnection(true);
    setConnectionStatus(null);
    
    try {
      // Check connection status from Firestore
      const result = await api.get<{ connected: boolean; message: string }>(`/apps/${app.id}/connection?type=${selectedConnection}`);
      setConnectionStatus(result);
      
      if (result.connected) {
        await updateApp(app.id, { isConnected: true });
      } else {
        await updateApp(app.id, { isConnected: false });
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setConnectionStatus({ connected: false, message: 'Failed to check connection' });
    } finally {
      setIsCheckingConnection(false);
    }
  };

  // Poll for connection status when connection type is selected
  useEffect(() => {
    if (!selectedConnection || !app) return;
    
    const interval = setInterval(async () => {
      try {
        const result = await api.get<{ connected: boolean; message: string }>(`/apps/${app.id}/connection?type=${selectedConnection}`);
        if (result.connected) {
          setConnectionStatus(result);
          await updateApp(app.id, { isConnected: true });
          clearInterval(interval);
        }
      } catch (error) {
        // Silently fail - connection not ready yet
      }
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(interval);
  }, [selectedConnection, app]);

  const handleRunAudit = async () => {
    if (!app || !app.isConnected) return;
    
    setIsRunningAudit(true);
    try {
      // Create audit via backend API
      const auditId = await createAudit(app.id);
      setCurrentAuditId(auditId);
      
      // Backend will handle the audit process
      // For now, we'll poll for updates or use WebSocket in the future
      // Refresh audits after a delay to get updated status
      setTimeout(async () => {
        await refreshData();
        const updatedAudits = getAuditsByApp(app.id);
        setAudits(updatedAudits);
        
        setIsRunningAudit(false);
        setCurrentAuditId(null);
        
        // Navigate to audit report
        navigate(`/audit/${auditId}`);
      }, 2000);
    } catch (error) {
      console.error('Failed to start audit:', error);
      setIsRunningAudit(false);
      setCurrentAuditId(null);
    }
  };



  if (!app) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-apple-blue" />
      </div>
    );
  }

  const currentAudit = audits.find(a => a.status === 'running');
  const completedAudits = audits.filter(a => a.status === 'completed');

  return (
    <div className="animate-fade-in -mt-8 lg:-mt-12 pt-3.5 overflow-hidden">
      {/* Step-by-Step Setup Wizard */}
      {!app.isConnected && (
        <div className="apple-card p-8 lg:p-12 shadow-apple-xl overflow-hidden">
          {/* Project Title */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-apple-gray-200 dark:border-apple-gray-800">
            <div className="flex-1 group">
              <h1 className="text-4xl font-semibold mb-2 tracking-tight text-apple-gray-900 dark:text-apple-gray-100 transition-all duration-300 group-hover:text-apple-blue dark:group-hover:text-apple-blueLight group-hover:scale-[1.02] transform cursor-default">
                {app.name}
              </h1>
              {app.description && (
                <p className="text-apple-gray-600 dark:text-apple-gray-400 text-lg transition-colors duration-300 group-hover:text-apple-gray-700 dark:group-hover:text-apple-gray-300">{app.description}</p>
              )}
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="ml-6 p-2.5 text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-red hover:bg-apple-red/10 dark:hover:bg-apple-red/20 rounded-apple transition-all duration-200"
              title="Delete Project"
            >
              <Trash2 size={20} />
            </button>
          </div>
          {/* Step 0: Start Setup */}
          {setupStep === 0 && (
            <div className="py-8 lg:py-12">
              <div className="text-center mb-10">
                <div className="w-28 h-28 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-apple-xl">
                  <Key size={56} className="text-apple-blue dark:text-apple-blueLight" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-4 tracking-tight">
                  Ready to Get Started?
                </h2>
                <p className="text-apple-gray-600 dark:text-apple-gray-400 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
                  Follow the step-by-step setup to connect your CLI tool or VS Code extension and start scanning your codebase for HIPAA compliance
                </p>
                <button
                  onClick={() => setSetupStep(1)}
                  className="apple-button-primary text-lg px-12 py-6 shadow-apple-lg hover:shadow-apple-xl transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <span>Start Setup</span>
                    <ArrowRight size={20} />
                  </span>
                </button>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-5 mt-10">
                <div className="apple-card p-6 shadow-apple-lg hover:shadow-apple-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-[14px] flex items-center justify-center mb-4 shadow-apple">
                    <Key size={24} className="text-apple-blue dark:text-apple-blueLight" />
                  </div>
                  <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2 tracking-tight">
                    Get Your API Key
                  </h3>
                  <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 leading-relaxed">
                    Copy your unique API key and configure it in your project settings
                  </p>
                </div>

                <div className="apple-card p-6 shadow-apple-lg hover:shadow-apple-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-apple-green/10 dark:bg-apple-green/20 rounded-[14px] flex items-center justify-center mb-4 shadow-apple">
                    <Terminal size={24} className="text-apple-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2 tracking-tight">
                    Choose Your Tool
                  </h3>
                  <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 leading-relaxed">
                    Select between CLI tool for automation or VS Code extension for real-time scanning
                  </p>
                </div>

                <div className="apple-card p-6 shadow-apple-lg hover:shadow-apple-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-apple-purple/10 dark:bg-apple-purple/20 rounded-[14px] flex items-center justify-center mb-4 shadow-apple">
                    <Play size={24} className="text-apple-purple" />
                  </div>
                  <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2 tracking-tight">
                    Run Your First Audit
                  </h3>
                  <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 leading-relaxed">
                    Start scanning your codebase and get instant compliance reports with actionable fixes
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: API Key & Configuration */}
          {setupStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-full flex items-center justify-center shadow-apple flex-shrink-0">
                  <span className="text-apple-blue dark:text-apple-blueLight font-semibold text-lg">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
                    API Key & Configuration
                  </h3>
                  <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 mt-1">
                    Copy your API key and configure it in your project
                  </p>
                </div>
              </div>

              {/* API Key Display */}
              <div className="bg-apple-gray-50 dark:bg-apple-gray-900/50 border border-apple-gray-200 dark:border-apple-gray-800 rounded-apple-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-apple-gray-900 dark:text-apple-gray-100">Your API Key</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setApiKeyVisible(!apiKeyVisible)}
                      className="p-1.5 hover:bg-apple-gray-200 dark:hover:bg-apple-gray-800 rounded-apple transition-all duration-200"
                      title={apiKeyVisible ? 'Hide' : 'Show'}
                    >
                      {apiKeyVisible ? (
                        <EyeOff size={16} className="text-apple-gray-600 dark:text-apple-gray-400" />
                      ) : (
                        <Eye size={16} className="text-apple-gray-600 dark:text-apple-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(app.apiKey);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-1.5 hover:bg-apple-gray-200 dark:hover:bg-apple-gray-800 rounded-apple transition-all duration-200"
                      title="Copy"
                    >
                      {copied ? (
                        <CheckCircle2 size={16} className="text-apple-green" />
                      ) : (
                        <Copy size={16} className="text-apple-gray-600 dark:text-apple-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <code className="block bg-white dark:bg-apple-gray-800 border border-apple-gray-200 dark:border-apple-gray-700 rounded-apple p-3 text-sm font-mono text-apple-gray-900 dark:text-apple-gray-100 select-all">
                  {apiKeyVisible ? app.apiKey : app.apiKey.substring(0, 8) + '•'.repeat(Math.max(0, app.apiKey.length - 8))}
                </code>
              </div>

              {/* Configuration Instructions */}
              <div className="bg-apple-blue/5 dark:bg-apple-blue/10 border border-apple-blue/20 dark:border-apple-blue/30 rounded-apple-lg p-6 space-y-5">
                <div>
                  <h4 className="font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3">1. Install Scanara</h4>
                  <code className="block bg-apple-gray-900 dark:bg-apple-gray-800 text-apple-green px-4 py-3 rounded-apple font-mono text-sm mb-3">
                    npm install -g scanara
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3">2. Create config.js</h4>
                  <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 mb-2">
                    Create a <code className="bg-apple-gray-100 dark:bg-apple-gray-800 px-1.5 py-0.5 rounded text-xs">config.js</code> file in your project root:
                  </p>
                  <code className="block bg-apple-gray-900 dark:bg-apple-gray-800 text-apple-green px-4 py-3 rounded-apple font-mono text-sm whitespace-pre-wrap">
{`module.exports = {
  apiKey: '${app.apiKey}',
  // other config options
};`}
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3">3. Download VS Code Extension</h4>
                  <a
                    href="#"
                    className="inline-flex items-center space-x-2 text-apple-blue dark:text-apple-blueLight hover:underline font-medium"
                  >
                    <Download size={18} />
                    <span>Download Extension</span>
                  </a>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setSetupStep(0)}
                  className="apple-button-secondary flex items-center space-x-2"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setSetupStep(2)}
                  className="apple-button-primary flex items-center space-x-2 shadow-apple-lg"
                >
                  <span>Next</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Connection Method */}
          {setupStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-full flex items-center justify-center shadow-apple flex-shrink-0">
                  <span className="text-apple-blue dark:text-apple-blueLight font-semibold text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
                    Choose Connection Method
                  </h3>
                  <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 mt-1">
                    Select how you want to connect to Scanara AI
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <button
                  onClick={() => handleConnectionTypeSelect('cli')}
                  className={`p-6 rounded-apple-lg border-2 transition-all duration-200 text-left ${
                    selectedConnection === 'cli'
                      ? 'border-apple-blue bg-apple-blue/5 dark:bg-apple-blue/10 shadow-apple'
                      : 'border-apple-gray-200 dark:border-apple-gray-800 hover:border-apple-blue/50 dark:hover:border-apple-blue/50'
                  }`}
                >
                  <Terminal size={32} className={`mb-4 ${selectedConnection === 'cli' ? 'text-apple-blue' : 'text-apple-gray-400'}`} />
                  <h4 className="font-semibold text-lg text-apple-gray-900 dark:text-apple-gray-100 mb-2 tracking-tight">CLI Tool</h4>
                  <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                    Recommended for automation and CI/CD pipelines
                  </p>
                </button>
                <button
                  onClick={() => handleConnectionTypeSelect('extension')}
                  className={`p-6 rounded-apple-lg border-2 transition-all duration-200 text-left ${
                    selectedConnection === 'extension'
                      ? 'border-apple-blue bg-apple-blue/5 dark:bg-apple-blue/10 shadow-apple'
                      : 'border-apple-gray-200 dark:border-apple-gray-800 hover:border-apple-blue/50 dark:hover:border-apple-blue/50'
                  }`}
                >
                  <Code size={32} className={`mb-4 ${selectedConnection === 'extension' ? 'text-apple-blue' : 'text-apple-gray-400'}`} />
                  <h4 className="font-semibold text-lg text-apple-gray-900 dark:text-apple-gray-100 mb-2 tracking-tight">VS Code Extension</h4>
                  <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                    Scan directly from your code editor
                  </p>
                </button>
              </div>

              {/* Check Connection */}
              {app.connectionType && (
                <div className="bg-apple-blue/5 dark:bg-apple-blue/10 border border-apple-blue/20 dark:border-apple-blue/30 rounded-apple-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-1">Check Connection</h4>
                      <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                        Verify that your {app.connectionType === 'cli' ? 'CLI tool' : 'VS Code extension'} is properly configured
                      </p>
                    </div>
                    <button
                      onClick={handleCheckConnection}
                      disabled={isCheckingConnection}
                      className="apple-button-primary shadow-apple-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center space-x-2">
                        {isCheckingConnection ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Checking...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            <span>Check</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                  {connectionStatus && (
                    <div className={`p-3 rounded-apple text-sm ${
                      connectionStatus.connected 
                        ? 'bg-apple-green/10 text-apple-green dark:bg-apple-green/20' 
                        : 'bg-apple-red/10 text-apple-red dark:bg-apple-red/20'
                    }`}>
                      {connectionStatus.message}
                    </div>
                  )}
                  {connectionStatus && connectionStatus.connected && (
                    <div className="mt-4 p-4 bg-apple-green/10 dark:bg-apple-green/20 border border-apple-green/30 dark:border-apple-green/40 rounded-apple-lg">
                      <p className="text-sm text-apple-green font-semibold">
                        ✓ Connection successful! You can now proceed to run audits.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setSetupStep(1)}
                  className="apple-button-secondary flex items-center space-x-2"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                {app.isConnected && (
                  <button
                    onClick={() => setSetupStep(3)}
                    className="apple-button-primary flex items-center space-x-2 shadow-apple-lg"
                  >
                    <span>Continue</span>
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Run Audit */}
          {setupStep === 3 && app.isConnected && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-apple-green/10 dark:bg-apple-green/20 rounded-full flex items-center justify-center shadow-apple flex-shrink-0">
                  <CheckCircle size={24} className="text-apple-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
                    Ready to Run Audit
                  </h3>
                  <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 mt-1">
                    Your {app.connectionType === 'cli' ? 'CLI tool' : 'VS Code extension'} is connected and ready
                  </p>
                </div>
              </div>

              <div className="bg-apple-green/5 dark:bg-apple-green/10 border border-apple-green/20 dark:border-apple-green/30 rounded-apple-lg p-8 text-center">
                <CheckCircle size={48} className="text-apple-green mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2 tracking-tight">
                  All Set!
                </h4>
                <p className="text-apple-gray-600 dark:text-apple-gray-400 mb-6">
                  You're ready to run your first compliance audit
                </p>
                <button
                  onClick={handleRunAudit}
                  disabled={isRunningAudit || !!currentAudit}
                  className="apple-button-primary text-lg px-10 py-5 shadow-apple-lg hover:shadow-apple-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center space-x-2">
                    {isRunningAudit ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        <span>Run Audit</span>
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-start pt-4">
                <button
                  onClick={() => setSetupStep(2)}
                  className="apple-button-secondary flex items-center space-x-2"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audit Section - Only show when connected and not in setup */}
      {app.isConnected && setupStep !== 3 && (
        <div className="apple-card p-8 shadow-apple-xl">
          {/* Project Title */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-apple-gray-200 dark:border-apple-gray-800">
            <div className="flex-1 group">
              <h1 className="text-4xl font-semibold mb-2 tracking-tight text-apple-gray-900 dark:text-apple-gray-100 transition-all duration-300 group-hover:text-apple-blue dark:group-hover:text-apple-blueLight group-hover:scale-[1.02] transform cursor-default">
                {app.name}
              </h1>
              {app.description && (
                <p className="text-apple-gray-600 dark:text-apple-gray-400 text-lg transition-colors duration-300 group-hover:text-apple-gray-700 dark:group-hover:text-apple-gray-300">{app.description}</p>
              )}
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="ml-6 p-2.5 text-apple-gray-500 dark:text-apple-gray-400 hover:text-apple-red hover:bg-apple-red/10 dark:hover:bg-apple-red/20 rounded-apple transition-all duration-200"
              title="Delete Project"
            >
              <Trash2 size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-apple-green/10 dark:bg-apple-green/20 rounded-[14px] flex items-center justify-center shadow-apple">
              <CheckCircle size={28} className="text-apple-green" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
                Ready to Run Audit
              </h2>
              <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 mt-1">
                Your {app.connectionType === 'cli' ? 'CLI tool' : 'VS Code extension'} is connected and ready
              </p>
            </div>
            <button
              onClick={handleRunAudit}
              disabled={isRunningAudit || !!currentAudit}
              className="apple-button-primary shadow-apple-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center space-x-2">
                {isRunningAudit ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    <span>Run Audit</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Current Running Audit */}
      {currentAudit && (
        <div className="apple-card p-6 border-2 border-apple-blue/30 shadow-apple-lg">
          <div className="flex items-center space-x-4 mb-4">
            <Loader2 size={24} className="animate-spin text-apple-blue" />
            <div>
              <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
                Audit in Progress
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 mt-0.5">
                Scanning your codebase for compliance issues...
              </p>
            </div>
          </div>
          <div className="w-full bg-apple-gray-200 dark:bg-apple-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-apple-blue h-2 rounded-full transition-all duration-300 shadow-apple"
              style={{ width: '75%' }}
            />
          </div>
        </div>
      )}

      {/* Audit History */}
      {completedAudits.length > 0 && (
        <div className="apple-card p-8 shadow-apple-lg">
          <h2 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-6 tracking-tight">
            Audit History
          </h2>
          <div className="space-y-3">
            {completedAudits.map((audit) => {
              const criticalCount = audit.findings?.filter(f => f.severity === 'critical' && !f.resolved).length || 0;
              const warningCount = audit.findings?.filter(f => f.severity === 'warning' && !f.resolved).length || 0;
              const totalUnresolved = audit.findings?.filter(f => !f.resolved).length || 0;

              return (
                <div
                  key={audit.id}
                  onClick={() => navigate(`/audit/${audit.id}`)}
                  className="border border-apple-gray-200 dark:border-apple-gray-800 rounded-apple-lg overflow-hidden hover:border-apple-gray-300 dark:hover:border-apple-gray-700 transition-all duration-200 cursor-pointer card-hover group"
                >
                  <div className="w-full p-5 flex items-center justify-between hover:bg-apple-gray-50 dark:hover:bg-apple-gray-800/50 transition-colors duration-200">
                    <div className="flex items-center space-x-4 flex-1">
                      {audit.isCompliant ? (
                        <CheckCircle size={24} className="text-apple-green flex-shrink-0" />
                      ) : (
                        <XCircle size={24} className="text-apple-red flex-shrink-0" />
                      )}
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center space-x-3 flex-wrap gap-2 mb-1">
                          <span className="font-semibold text-base text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
                            {new Date(audit.completedAt || audit.createdAt).toLocaleString()}
                          </span>
                          <span className={`px-2.5 py-1 rounded-apple text-xs font-semibold ${
                            audit.isCompliant 
                              ? 'bg-apple-green/10 text-apple-green dark:bg-apple-green/20'
                              : 'bg-apple-red/10 text-apple-red dark:bg-apple-red/20'
                          }`}>
                            {audit.isCompliant ? 'Compliant' : 'Not Compliant'}
                          </span>
                          <span className="text-sm font-medium text-apple-gray-600 dark:text-apple-gray-400">
                            Score: {audit.score}%
                          </span>
                        </div>
                        <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                          {totalUnresolved} unresolved issue{totalUnresolved !== 1 ? 's' : ''}
                          {criticalCount > 0 && ` • ${criticalCount} critical`}
                          {warningCount > 0 && ` • ${warningCount} warning${warningCount !== 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>
                    <ArrowRight 
                      size={18} 
                      className="text-apple-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 group-hover:text-apple-blue dark:group-hover:text-apple-blueLight"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {completedAudits.length === 0 && !currentAudit && app.isConnected && (
        <div className="apple-card p-12 text-center shadow-apple-lg">
          <p className="text-apple-gray-500 dark:text-apple-gray-500 text-lg">
            No audits completed yet. Run your first audit to get started!
          </p>
        </div>
      )}

      {/* Delete Project Modal */}
      <DeleteProjectModal
        isOpen={showDeleteModal}
        projectName={app.name}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (app) {
            await deleteApp(app.id);
            navigate('/dashboard');
          }
        }}
      />
    </div>
  );
};

export default AppDetail;
