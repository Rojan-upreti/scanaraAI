import { BookOpen, FileText, Code, Terminal, Settings } from 'lucide-react';

const Docs = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Getting Started',
      description: 'Learn the basics of Scanara AI and how to set up your first project.',
    },
    {
      icon: Terminal,
      title: 'CLI Reference',
      description: 'Complete documentation for the Scanara CLI tool commands and options.',
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'Detailed API documentation for integrating Scanara AI into your workflow.',
    },
    {
      icon: Settings,
      title: 'Configuration',
      description: 'Configure Scanara AI settings, API keys, and connection methods.',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div>
        <h1 className="text-4xl font-semibold mb-3 tracking-tight text-apple-gray-900 dark:text-apple-gray-100">
          Documentation
        </h1>
        <p className="text-apple-gray-600 dark:text-apple-gray-400 text-lg">
          Everything you need to know about using Scanara AI
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={index}
              className="apple-card p-7 shadow-apple-lg hover:shadow-apple-xl card-hover cursor-pointer group transition-all duration-300"
            >
              <div className="w-14 h-14 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-[18px] flex items-center justify-center mb-5 shadow-apple">
                <Icon size={28} className="text-apple-blue dark:text-apple-blueLight" />
              </div>
              <h3 className="text-xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight group-hover:text-apple-blue transition-colors">
                {section.title}
              </h3>
              <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 leading-relaxed">
                {section.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="apple-card p-8 shadow-apple-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-[14px] flex items-center justify-center shadow-apple">
            <BookOpen size={24} className="text-apple-blue dark:text-apple-blueLight" />
          </div>
          <h2 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
            Quick Links
          </h2>
        </div>
        <div className="space-y-3">
          <a href="#" className="block px-4 py-3 rounded-apple text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 hover:text-apple-blue dark:hover:text-apple-blueLight transition-colors text-sm font-medium">
            Installation Guide
          </a>
          <a href="#" className="block px-4 py-3 rounded-apple text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 hover:text-apple-blue dark:hover:text-apple-blueLight transition-colors text-sm font-medium">
            CLI Commands Reference
          </a>
          <a href="#" className="block px-4 py-3 rounded-apple text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 hover:text-apple-blue dark:hover:text-apple-blueLight transition-colors text-sm font-medium">
            API Authentication
          </a>
          <a href="#" className="block px-4 py-3 rounded-apple text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 hover:text-apple-blue dark:hover:text-apple-blueLight transition-colors text-sm font-medium">
            Troubleshooting
          </a>
        </div>
      </div>
    </div>
  );
};

export default Docs;

