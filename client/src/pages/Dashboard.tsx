import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApps } from '../contexts/AppContext';
import CreateAppModal from '../components/CreateAppModal';
import { 
  Plus, 
  FolderOpen, 
  ArrowRight, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Key,
  Terminal,
  FileCode,
  FileText,
  Play,
  Shield,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { apps, getAuditsByApp, loading } = useApps();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mx-auto mb-4"></div>
          <p className="text-apple-gray-600 dark:text-apple-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const getAppSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const getLatestAuditStatus = (appId: string) => {
    const audits = getAuditsByApp(appId);
    if (audits.length === 0) return null;
    const latest = audits[0];
    return latest.status === 'completed' ? latest.isCompliant : null;
  };

  // Calculate overall stats
  const totalAudits = apps.reduce((acc, app) => acc + getAuditsByApp(app.id).length, 0);
  const compliantApps = apps.filter(app => {
    const status = getLatestAuditStatus(app.id);
    return status === true;
  }).length;
  const nonCompliantApps = apps.filter(app => {
    const status = getLatestAuditStatus(app.id);
    return status === false;
  }).length;

  if (apps.length === 0) {
    return (
      <div className="min-h-screen bg-apple-gray-50 dark:bg-apple-gray-900">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-full mb-8 animate-fade-in">
              <Sparkles size={16} className="text-apple-blue dark:text-apple-blueLight" />
              <span className="text-sm font-semibold text-apple-blue dark:text-apple-blueLight">
                AI-Powered Compliance Scanning
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-6 tracking-tight leading-tight animate-slide-up">
              Secure Your Healthcare App with{' '}
              <span className="text-apple-blue dark:text-apple-blueLight">AI-Powered</span>{' '}
              Compliance Auditing
            </h1>
            <p className="text-lg md:text-xl text-apple-gray-600 dark:text-apple-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
              Automatically detect compliance violations in your codebase. Get instant reports with actionable fixes to protect patient data and ensure regulatory compliance.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <button
                onClick={() => setShowCreateModal(true)}
                className="apple-button-primary text-lg px-10 py-5 shadow-apple-lg hover:shadow-apple-xl"
              >
                <span className="flex items-center space-x-2">
                  <Plus size={22} />
                  <span>Create Your First App</span>
                  <ArrowRight size={20} />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '99.9%', label: 'Accuracy Rate' },
              { value: '5 min', label: 'Average Scan Time' },
              { value: '1000+', label: 'Compliance Rules' },
              { value: '24/7', label: 'Continuous Monitoring' },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 apple-card shadow-apple animate-slide-up"
                style={{ animationDelay: `${(index + 3) * 50}ms` }}
              >
                <div className="text-4xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 mb-8">
          <div className="apple-card p-10 lg:p-12 shadow-apple-xl">
            <h2 className="text-3xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-8 tracking-tight text-center">
              How Scanara AI Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: Plus,
                  step: '1',
                  title: 'Create Project',
                  description: 'Create a new project to track your codebase',
                },
                {
                  icon: Key,
                  step: '2',
                  title: 'Get API Key',
                  description: 'Receive your unique API key for authentication',
                },
                {
                  icon: Terminal,
                  step: '3',
                  title: 'Install CLI',
                  description: 'Install our CLI tool: npm install -g scanara',
                },
                {
                  icon: Play,
                  step: '4',
                  title: 'Run Audit',
                  description: 'Click audit to scan your codebase with AI',
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="text-center animate-slide-up"
                    style={{ animationDelay: `${(index + 7) * 50}ms` }}
                  >
                    <div className="w-16 h-16 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-[18px] flex items-center justify-center mx-auto mb-4 shadow-apple">
                      <Icon size={32} className="text-apple-blue dark:text-apple-blueLight" />
                    </div>
                    <div className="text-2xl font-bold text-apple-blue dark:text-apple-blueLight mb-2">{item.step}</div>
                    <h3 className="font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2">{item.title}</h3>
                    <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Comprehensive Compliance Scanning',
                description: 'Automatically detect PHI exposure, encryption violations, and access control issues across your entire codebase.',
                color: 'text-apple-blue',
                bgColor: 'bg-apple-blue/10 dark:bg-apple-blue/20',
              },
              {
                icon: Zap,
                title: 'Instant Compliance Reports',
                description: 'Get detailed audit reports in minutes with severity ratings, file locations, and actionable fix recommendations.',
                color: 'text-apple-orange',
                bgColor: 'bg-apple-orange/10 dark:bg-apple-orange/20',
              },
              {
                icon: FileText,
                title: 'Step-by-Step Remediation',
                description: 'Receive clear, code-level guidance with exact file locations, line numbers, and implementation examples.',
                color: 'text-apple-green',
                bgColor: 'bg-apple-green/10 dark:bg-apple-green/20',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="apple-card p-8 shadow-apple-lg animate-slide-up"
                  style={{ animationDelay: `${(index + 11) * 50}ms` }}
                >
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-[18px] flex items-center justify-center mb-4 shadow-apple`}>
                    <Icon size={28} className={feature.color} />
                  </div>
                  <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 mb-8">
          <div className="apple-card border-2 border-dashed border-apple-gray-300 dark:border-apple-gray-700 p-16 text-center animate-slide-up" style={{ animationDelay: '700ms' }}>
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-apple-lg">
                <Plus size={40} className="text-apple-blue dark:text-apple-blueLight" />
              </div>
              <h2 className="text-3xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight">
                Ready to Get Started?
              </h2>
              <p className="text-apple-gray-600 dark:text-apple-gray-400 mb-2 text-lg">
                Create your first app to begin HIPAA compliance scanning
              </p>
              <p className="text-apple-gray-500 dark:text-apple-gray-500 mb-8 text-sm">
                Our AI will analyze your codebase and provide step-by-step guidance to make your software HIPAA compliant
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="apple-button-primary text-lg px-10 py-5 shadow-apple-lg hover:shadow-apple-xl"
              >
                <span className="flex items-center space-x-2">
                  <Plus size={22} />
                  <span>Create Your First App</span>
                  <ArrowRight size={20} />
                </span>
              </button>
            </div>
          </div>
        </section>

        <CreateAppModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner with Stats */}
      <div className="apple-card p-10 lg:p-12 shadow-apple-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-[20px] flex items-center justify-center shadow-apple-lg">
              <Shield size={40} className="text-apple-blue dark:text-apple-blueLight" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold mb-2 tracking-tight text-apple-gray-900 dark:text-apple-gray-100">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-apple-gray-600 dark:text-apple-gray-400 text-lg">
                Manage your HIPAA compliance scanning projects
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="apple-button-primary shadow-apple-lg"
          >
            <span className="flex items-center space-x-2">
              <Plus size={20} />
              <span>New Project</span>
            </span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-apple-gray-100 dark:bg-apple-gray-800 rounded-apple-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium">Total Projects</span>
              <FolderOpen size={20} className="text-apple-gray-400 dark:text-apple-gray-500" />
            </div>
            <div className="text-3xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
              {apps.length}
            </div>
          </div>
          <div className="bg-apple-green/10 dark:bg-apple-green/20 rounded-apple-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium">Compliant</span>
              <CheckCircle size={20} className="text-apple-green" />
            </div>
            <div className="text-3xl font-semibold text-apple-green tracking-tight">
              {compliantApps}
            </div>
          </div>
          <div className="bg-apple-red/10 dark:bg-apple-red/20 rounded-apple-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium">Needs Attention</span>
              <AlertCircle size={20} className="text-apple-red" />
            </div>
            <div className="text-3xl font-semibold text-apple-red tracking-tight">
              {nonCompliantApps}
            </div>
          </div>
          <div className="bg-apple-blue/10 dark:bg-apple-blue/20 rounded-apple-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium">Total Audits</span>
              <TrendingUp size={20} className="text-apple-blue dark:text-apple-blueLight" />
            </div>
            <div className="text-3xl font-semibold text-apple-blue dark:text-apple-blueLight tracking-tight">
              {totalAudits}
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
            Your Projects
          </h2>
          <span className="text-sm text-apple-gray-500 dark:text-apple-gray-500">
            {apps.length} project{apps.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, index) => {
            const latestStatus = getLatestAuditStatus(app.id);
            const audits = getAuditsByApp(app.id);
            const hasAudits = audits.length > 0;
            const latestAudit = audits[0];

            return (
              <div
                key={app.id}
                onClick={() => navigate(`/dashboard/${getAppSlug(app.name)}`)}
                className="apple-card p-7 card-hover cursor-pointer group animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center shadow-apple flex-shrink-0 ${
                      latestStatus === true 
                        ? 'bg-apple-green/10 dark:bg-apple-green/20' 
                        : latestStatus === false
                        ? 'bg-apple-red/10 dark:bg-apple-red/20'
                        : 'bg-apple-blue/10 dark:bg-apple-blue/20'
                    }`}>
                      {latestStatus === true ? (
                        <CheckCircle size={28} className="text-apple-green" />
                      ) : latestStatus === false ? (
                        <XCircle size={28} className="text-apple-red" />
                      ) : (
                        <FolderOpen size={28} className="text-apple-blue dark:text-apple-blueLight" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 group-hover:text-apple-blue transition-colors mb-1 tracking-tight truncate">
                        {app.name}
                      </h3>
                      {app.description && (
                        <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 line-clamp-1">
                          {app.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                {latestStatus !== null && (
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-apple text-xs font-semibold mb-4 ${
                    latestStatus
                      ? 'bg-apple-green/10 text-apple-green dark:bg-apple-green/20'
                      : 'bg-apple-red/10 text-apple-red dark:bg-apple-red/20'
                  }`}>
                    {latestStatus ? (
                      <>
                        <CheckCircle size={14} className="mr-1.5" />
                        <span>HIPAA Compliant</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} className="mr-1.5" />
                        <span>Needs Attention</span>
                      </>
                    )}
                  </div>
                )}

                <div className="space-y-2.5 mb-5">
                  {app.repositoryUrl && (
                    <div className="text-sm text-apple-gray-600 dark:text-apple-gray-400 truncate flex items-center">
                      <FileCode size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{app.repositoryUrl}</span>
                    </div>
                  )}
                  <div className="flex items-center text-xs text-apple-gray-500 dark:text-apple-gray-500">
                    <Calendar size={14} className="mr-2 flex-shrink-0" />
                    <span>Created {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                  {hasAudits && latestAudit && (
                    <div className="flex items-center text-xs text-apple-gray-500 dark:text-apple-gray-500">
                      <Clock size={14} className="mr-2 flex-shrink-0" />
                      <span>Last audit: {new Date(latestAudit.completedAt || latestAudit.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {hasAudits && (
                    <div className="text-xs text-apple-gray-500 dark:text-apple-gray-500">
                      {audits.length} audit{audits.length !== 1 ? 's' : ''} completed
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-apple-gray-200 dark:border-apple-gray-800">
                  <span className="text-sm font-medium text-apple-gray-600 dark:text-apple-gray-400">
                    {app.connectionType ? (
                      <span className="capitalize flex items-center">
                        {app.connectionType === 'cli' ? (
                          <Terminal size={14} className="mr-1.5" />
                        ) : (
                          <FileCode size={14} className="mr-1.5" />
                        )}
                        {app.connectionType}
                      </span>
                    ) : (
                      <span className="flex items-center text-apple-gray-400">
                        <Clock size={14} className="mr-1.5" />
                        Not configured
                      </span>
                    )}
                  </span>
                  <ArrowRight size={18} className="text-apple-gray-400 group-hover:text-apple-blue dark:group-hover:text-apple-blueLight transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CreateAppModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
};

export default Dashboard;
