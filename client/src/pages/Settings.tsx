import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-apple-gray-100 dark:bg-apple-gray-800 rounded-[14px] flex items-center justify-center shadow-apple">
          <SettingsIcon size={24} className="text-apple-gray-900 dark:text-apple-gray-100" />
        </div>
        <div>
          <h1 className="text-4xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">Settings</h1>
          <p className="text-apple-gray-600 dark:text-apple-gray-400 mt-1">Manage your account preferences</p>
        </div>
      </div>

      {/* Settings Content */}
      <div className="apple-card p-10 lg:p-12 shadow-apple-xl">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-apple-gray-100 dark:bg-apple-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-apple">
            <SettingsIcon size={40} className="text-apple-gray-400 dark:text-apple-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight">
            Settings Coming Soon
          </h2>
          <p className="text-apple-gray-600 dark:text-apple-gray-400 text-lg max-w-md mx-auto">
            Account settings and preferences will be available here soon.
          </p>
          <p className="text-apple-gray-500 dark:text-apple-gray-500 text-sm mt-4">
            For now, manage your API keys and connection settings from individual app pages.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
