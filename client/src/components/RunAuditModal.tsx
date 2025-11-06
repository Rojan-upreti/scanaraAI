import { useState } from 'react';
import { X, Loader2, CheckCircle2, Clock, Search, Brain, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RunAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RunAuditModal = ({ isOpen, onClose }: RunAuditModalProps) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [scope, setScope] = useState('full');
  const [modelVersion, setModelVersion] = useState('gpt-4.1');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const navigate = useNavigate();

  const stages = [
    { name: 'Queueing', icon: Clock },
    { name: 'Scanning', icon: Search },
    { name: 'AI Review', icon: Brain },
    { name: 'Report Ready', icon: CheckCircle2 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    setCurrentStage(0);

    // Simulate progress through stages
    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStage(i + 1);
    }

    // Generate a mock report ID and navigate
    const reportId = `audit-${Date.now()}`;
    setTimeout(() => {
      setIsRunning(false);
      onClose();
      navigate(`/audit/${reportId}`);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Run Compliance Audit
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {!isRunning ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Repository URL
                </label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Branch
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scope
                </label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="full">Full Audit</option>
                  <option value="data-storage">Data Storage Only</option>
                  <option value="encryption">Encryption Only</option>
                  <option value="logging">Logging Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Model Version
                </label>
                <select
                  value={modelVersion}
                  onChange={(e) => setModelVersion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="gpt-4.1">GPT-4.1</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/25"
                >
                  Run Audit
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Running Audit...
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This may take a few moments
                </p>
              </div>

              <div className="space-y-3">
                {stages.map((stage, index) => {
                  const Icon = stage.icon;
                  const isActive = currentStage > index;
                  const isCurrent = currentStage === index + 1;

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all ${
                        isActive
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : isCurrent
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isActive
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {isCurrent && !isActive ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Icon size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{stage.name}</p>
                        {isCurrent && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Processing...
                          </p>
                        )}
                      </div>
                      {isActive && (
                        <CheckCircle2 size={20} className="text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RunAuditModal;

