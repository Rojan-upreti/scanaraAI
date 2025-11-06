import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApps } from '../contexts/AppContext';
import CreateAppModal from '../components/CreateAppModal';
import {
  Plus,
  FolderOpen,
  ArrowRight,
  Calendar,
  CheckCircle,
  XCircle,
  FileCode,
  Clock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const MyProjects = () => {
  const { apps, getAuditsByApp, loading } = useApps();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold mb-2 tracking-tight text-apple-gray-900 dark:text-apple-gray-100">
            My Projects
          </h1>
          <p className="text-apple-gray-600 dark:text-apple-gray-400 text-lg">
            Manage your HIPAA compliance scanning projects
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="apple-button-primary shadow-apple-lg hover:shadow-apple-xl"
        >
          <span className="flex items-center space-x-2">
            <Plus size={20} />
            <span>New Project</span>
          </span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="apple-card p-6 shadow-apple-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium">Total Projects</span>
            <div className="w-10 h-10 bg-apple-gray-100 dark:bg-apple-gray-800 rounded-[12px] flex items-center justify-center">
              <FolderOpen size={20} className="text-apple-gray-500 dark:text-apple-gray-400" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
            {apps.length}
          </div>
        </div>
        <div className="apple-card p-6 shadow-apple-lg border border-apple-green/20 dark:border-apple-green/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium">Compliant</span>
            <div className="w-10 h-10 bg-apple-green/10 dark:bg-apple-green/20 rounded-[12px] flex items-center justify-center">
              <CheckCircle size={20} className="text-apple-green" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-apple-green tracking-tight">
            {compliantApps}
          </div>
        </div>
        <div className="apple-card p-6 shadow-apple-lg border border-apple-red/20 dark:border-apple-red/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium">Needs Attention</span>
            <div className="w-10 h-10 bg-apple-red/10 dark:bg-apple-red/20 rounded-[12px] flex items-center justify-center">
              <AlertCircle size={20} className="text-apple-red" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-apple-red tracking-tight">
            {nonCompliantApps}
          </div>
        </div>
        <div className="apple-card p-6 shadow-apple-lg border border-apple-blue/20 dark:border-apple-blue/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium">Total Audits</span>
            <div className="w-10 h-10 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-[12px] flex items-center justify-center">
              <TrendingUp size={20} className="text-apple-blue dark:text-apple-blueLight" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-apple-blue dark:text-apple-blueLight tracking-tight">
            {totalAudits}
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

        {apps.length === 0 ? (
          <div className="apple-card p-20 text-center shadow-apple-xl">
            <div className="w-20 h-20 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-apple-lg">
              <FolderOpen size={40} className="text-apple-blue dark:text-apple-blueLight" />
            </div>
            <h3 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight">
              No Projects Yet
            </h3>
            <p className="text-apple-gray-600 dark:text-apple-gray-400 mb-8 text-lg">
              Create your first project to start scanning for HIPAA compliance
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="apple-button-primary shadow-apple-lg hover:shadow-apple-xl"
            >
              <span className="flex items-center space-x-2">
                <Plus size={20} />
                <span>Create Your First Project</span>
              </span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {apps.map((app, index) => {
              const latestStatus = getLatestAuditStatus(app.id);
              const audits = getAuditsByApp(app.id);
              const hasAudits = audits.length > 0;
              const latestAudit = audits[0];

              return (
                <div
                  key={app.id}
                  onClick={() => navigate(`/dashboard/${getAppSlug(app.name)}`)}
                  className="apple-card p-6 card-hover cursor-pointer group animate-slide-up shadow-apple-lg hover:shadow-apple-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center shadow-apple flex-shrink-0 ${
                        latestStatus === true
                          ? 'bg-apple-green/10 dark:bg-apple-green/20 border border-apple-green/20 dark:border-apple-green/30'
                          : latestStatus === false
                          ? 'bg-apple-red/10 dark:bg-apple-red/20 border border-apple-red/20 dark:border-apple-red/30'
                          : 'bg-apple-blue/10 dark:bg-apple-blue/20 border border-apple-blue/20 dark:border-apple-blue/30'
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
                        ? 'bg-apple-green/10 text-apple-green dark:bg-apple-green/20 border border-apple-green/20 dark:border-apple-green/30'
                        : 'bg-apple-red/10 text-apple-red dark:bg-apple-red/20 border border-apple-red/20 dark:border-apple-red/30'
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

                  <div className="flex items-center justify-between pt-4 border-t border-apple-gray-200 dark:border-apple-gray-800">
                    <span className="text-sm font-medium text-apple-gray-600 dark:text-apple-gray-400">
                      {app.connectionType ? (
                        <span className="capitalize flex items-center">
                          {app.connectionType === 'cli' ? (
                            <FileCode size={14} className="mr-1.5" />
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
        )}
      </div>

      <CreateAppModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
};

export default MyProjects;

