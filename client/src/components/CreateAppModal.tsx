import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApps } from '../contexts/AppContext';
import { X, Save, Key, Copy, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface CreateAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAppModal = ({ isOpen, onClose }: CreateAppModalProps) => {
  const { createApp, apps } = useApps();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    repositoryUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string>('');
  const [newProjectSlug, setNewProjectSlug] = useState<string>('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newApp = await createApp({
        name: formData.name,
        description: formData.description,
        repositoryUrl: formData.repositoryUrl || undefined,
      });

      // Generate slug for navigation
      const appSlug = formData.name.toLowerCase().replace(/\s+/g, '-');
      setNewProjectSlug(appSlug);

      // Reset form
      setFormData({ name: '', description: '', repositoryUrl: '' });
      setIsSubmitting(false);
      
      // Show API key popup
      setNewApiKey(newApp.apiKey);
      setShowApiKey(true);
    } catch (error) {
      console.error('Error creating app:', error);
      setIsSubmitting(false);
    }
  };

  const handleCloseApiKey = () => {
    setShowApiKey(false);
    onClose();
    setTimeout(() => {
      navigate(`/dashboard/${newProjectSlug}`);
    }, 100);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(newApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen && !showApiKey) return null;

  // Show API Key Modal
  if (showApiKey) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={handleCloseApiKey} />
        <div className="relative apple-card shadow-apple-xl w-full max-w-2xl animate-scale-in">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-apple-green/10 dark:bg-apple-green/20 rounded-full flex items-center justify-center shadow-apple-lg">
                <Key size={40} className="text-apple-green" />
              </div>
            </div>
            <h2 className="text-3xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-4 tracking-tight text-center">
              Project Created Successfully!
            </h2>
            <p className="text-center text-apple-gray-600 dark:text-apple-gray-400 mb-8 text-lg">
              Your API key has been generated. Save it securely - you'll need it to configure your CLI tool.
            </p>

            <div className="bg-apple-gray-100 dark:bg-apple-gray-800 rounded-apple-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-apple-gray-900 dark:text-apple-gray-100">
                  Your API Key
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="p-2 hover:bg-apple-gray-200 dark:hover:bg-apple-gray-700 rounded-apple transition-all duration-200"
                    title={apiKeyVisible ? 'Hide' : 'Show'}
                  >
                    {apiKeyVisible ? (
                      <EyeOff size={18} className="text-apple-gray-600 dark:text-apple-gray-400" />
                    ) : (
                      <Eye size={18} className="text-apple-gray-600 dark:text-apple-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={handleCopyApiKey}
                    className="p-2 hover:bg-apple-gray-200 dark:hover:bg-apple-gray-700 rounded-apple transition-all duration-200"
                    title="Copy"
                  >
                    {copied ? (
                      <CheckCircle2 size={18} className="text-apple-green" />
                    ) : (
                      <Copy size={18} className="text-apple-gray-600 dark:text-apple-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <code className="block text-sm font-mono text-apple-gray-900 dark:text-apple-gray-100 bg-white dark:bg-apple-gray-900 px-4 py-3 rounded-apple border border-apple-gray-200 dark:border-apple-gray-700">
                {apiKeyVisible ? newApiKey : newApiKey.substring(0, 8) + '•'.repeat(Math.max(0, newApiKey.length - 8))}
              </code>
            </div>

            <div className="bg-apple-blue/5 dark:bg-apple-blue/10 border border-apple-blue/20 dark:border-apple-blue/30 rounded-apple-lg p-6 mb-6">
              <h3 className="font-semibold text-apple-blue dark:text-apple-blueLight mb-3 text-lg">Next Steps:</h3>
              <ol className="space-y-2 text-sm text-apple-gray-700 dark:text-apple-gray-300">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">1.</span>
                  <span>Install the CLI: <code className="bg-apple-gray-900 dark:bg-apple-gray-800 text-apple-green px-2 py-1 rounded font-mono">npm install -g scanara</code></span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">2.</span>
                  <span>Configure with your API key in your config.js file</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">3.</span>
                  <span>Return to your project page to run your first audit</span>
                </li>
              </ol>
            </div>

            <button
              onClick={handleCloseApiKey}
              className="w-full apple-button-primary shadow-apple-lg"
            >
              Continue to Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show Create Form
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative apple-card shadow-apple-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 apple-card border-b border-apple-gray-200 dark:border-apple-gray-800 px-8 py-6 flex items-center justify-between rounded-t-apple-lg z-10">
          <h2 className="text-3xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 rounded-apple transition-all duration-200"
          >
            <X size={22} className="text-apple-gray-500 dark:text-apple-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-7">
          <div>
            <label className="block text-sm font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3">
              Project Name <span className="text-apple-red">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Healthcare Project"
              required
              className="apple-input"
            />
            <p className="text-xs text-apple-gray-500 dark:text-apple-gray-500 mt-2">
              This will be used to identify your project
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your application..."
              rows={3}
              className="apple-input resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3">
              Repository URL
            </label>
            <input
              type="url"
              value={formData.repositoryUrl}
              onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
              placeholder="https://github.com/username/repo"
              className="apple-input"
            />
            <p className="text-xs text-apple-gray-500 dark:text-apple-gray-500 mt-2">
              Optional: Your repository URL for reference
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="apple-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="apple-button-primary shadow-apple-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center space-x-2">
                <Save size={18} />
                <span>{isSubmitting ? 'Creating...' : 'Create Project'}</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppModal;
