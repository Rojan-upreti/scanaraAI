import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApps } from '../contexts/AppContext';
import CreateAppModal from '../components/CreateAppModal';
import {
  Shield,
  Zap,
  FileText,
  ArrowRight,
  Lock,
  Code,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Plus
} from 'lucide-react';

const Overview = () => {
  const { user } = useAuth();
  const { apps, getAuditsByApp } = useApps();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const features = [
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
  ];

  const stats = [
    { value: apps.length.toString(), label: 'Total Projects' },
    { value: apps.reduce((acc, app) => acc + getAuditsByApp(app.id).length, 0).toString(), label: 'Total Audits' },
    { value: '99.9%', label: 'Accuracy Rate' },
    { value: '5 min', label: 'Average Scan Time' },
  ];

  const benefits = [
    {
      icon: Lock,
      title: 'Protect Patient Data',
      description: 'Ensure PHI is never exposed through logs, errors, or unencrypted storage.',
    },
    {
      icon: Code,
      title: 'Code-Level Guidance',
      description: 'Get specific file and line number references for every compliance issue.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Compliance',
      description: 'Monitor your codebase automatically and catch issues before they reach production.',
    },
    {
      icon: AlertCircle,
      title: 'Risk Prioritization',
      description: 'Focus on critical issues first with severity-based prioritization.',
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto py-8">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-full mb-6 animate-fade-in">
          <Sparkles size={16} className="text-apple-blue dark:text-apple-blueLight" />
          <span className="text-sm font-semibold text-apple-blue dark:text-apple-blueLight">
            AI-Powered Compliance Scanning
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-4 tracking-tight leading-tight animate-slide-up">
          Welcome back, <span className="text-apple-blue dark:text-apple-blueLight">{user?.name?.split(' ')[0]}</span>!
        </h1>
        <p className="text-lg text-apple-gray-600 dark:text-apple-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
          Secure your healthcare applications with AI-powered compliance auditing. Get instant reports with actionable fixes to protect patient data.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <button
            onClick={() => setShowCreateModal(true)}
            className="apple-button-primary text-lg px-10 py-5 shadow-apple-lg hover:shadow-apple-xl"
          >
            <span className="flex items-center space-x-2">
              <Plus size={22} />
              <span>Create New Project</span>
              <ArrowRight size={20} />
            </span>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="apple-card p-6 shadow-apple-lg animate-slide-up"
            style={{ animationDelay: `${(index + 3) * 50}ms` }}
          >
            <div className="text-3xl md:text-4xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-1.5 tracking-tight">
              {stat.value}
            </div>
            <div className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-6 tracking-tight">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="apple-card p-7 shadow-apple-lg hover:shadow-apple-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${(index + 7) * 50}ms` }}
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-[18px] flex items-center justify-center mb-5 shadow-apple`}>
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
      </div>

      {/* Benefits Section */}
      <div>
        <h2 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-6 tracking-tight">
          Why Choose Scanara AI?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="apple-card p-6 shadow-apple-lg hover:shadow-apple-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${(index + 10) * 50}ms` }}
              >
                <div className="w-12 h-12 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-[14px] flex items-center justify-center mb-4 shadow-apple">
                  <Icon size={24} className="text-apple-blue dark:text-apple-blueLight" />
                </div>
                <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2 tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <CreateAppModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
};

export default Overview;

