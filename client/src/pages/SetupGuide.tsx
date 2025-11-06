import { Terminal, Code, Key, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SetupGuide = () => {
  return (
    <div className="min-h-screen bg-apple-gray-50 dark:bg-apple-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-apple-gray-200/60 dark:border-apple-gray-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-[14px] flex items-center justify-center shadow-apple">
                <span className="text-apple-blue dark:text-apple-blueLight font-semibold text-sm">S</span>
              </div>
              <Link to="/" className="font-semibold text-lg text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
                Scanara AI
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/setup-guide"
                className="text-apple-gray-700 dark:text-apple-gray-300 hover:text-apple-gray-900 dark:hover:text-apple-gray-100 font-medium transition-colors"
              >
                Setup Guide
              </Link>
              <Link
                to="/about"
                className="text-apple-gray-700 dark:text-apple-gray-300 hover:text-apple-gray-900 dark:hover:text-apple-gray-100 font-medium transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="space-y-8 animate-fade-in max-w-4xl">
          <div>
            <h1 className="text-4xl font-semibold mb-2 tracking-tight text-apple-gray-900 dark:text-apple-gray-100">
              Setup Guide
            </h1>
            <p className="text-apple-gray-600 dark:text-apple-gray-400 text-lg">
              Follow these steps to connect your CLI tool or VS Code extension
            </p>
          </div>

          {/* CLI Setup */}
          <div className="apple-card p-8 shadow-apple-xl">
        <div className="flex items-center space-x-3 mb-6">
          <Terminal size={32} className="text-apple-blue dark:text-apple-blueLight" />
          <h2 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
            CLI Tool Setup
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight">
              Step 1: Install CLI
            </h3>
            <code className="block bg-apple-gray-900 dark:bg-apple-gray-800 text-apple-green px-4 py-3 rounded-apple font-mono text-sm">
              npm install -g scanara
            </code>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight">
              Step 2: Configure API Key
            </h3>
            <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 mb-2">
              Get your API key from your project settings, then run:
            </p>
            <code className="block bg-apple-gray-900 dark:bg-apple-gray-800 text-apple-green px-4 py-3 rounded-apple font-mono text-sm">
              scanara config --api-key YOUR_API_KEY
            </code>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight">
              Step 3: Run Your First Audit
            </h3>
            <code className="block bg-apple-gray-900 dark:bg-apple-gray-800 text-apple-green px-4 py-3 rounded-apple font-mono text-sm">
              scanara audit
            </code>
          </div>
        </div>
      </div>

      {/* VS Code Extension Setup */}
      <div className="apple-card p-8 shadow-apple-xl">
        <div className="flex items-center space-x-3 mb-6">
          <Code size={32} className="text-apple-blue dark:text-apple-blueLight" />
          <h2 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
            VS Code Extension Setup
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight">
              Step 1: Install Extension
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-apple-gray-600 dark:text-apple-gray-400">
              <li>Open VS Code</li>
              <li>Go to Extensions (Cmd+Shift+X or Ctrl+Shift+X)</li>
              <li>Search for "Scanara AI"</li>
              <li>Click Install</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight">
              Step 2: Configure API Key
            </h3>
            <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 mb-2">
              Open VS Code Settings and add your API key:
            </p>
            <code className="block bg-apple-gray-900 dark:bg-apple-gray-800 text-apple-green px-4 py-3 rounded-apple font-mono text-sm">
              "scanara.apiKey": "YOUR_API_KEY"
            </code>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight">
              Step 3: Run Audit
            </h3>
            <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400">
              Right-click on your project folder and select "Scanara AI: Run Audit" from the context menu.
            </p>
          </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SetupGuide;

