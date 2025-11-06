import { Shield, Zap, FileText, Lock, Code, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
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
            <div className="flex items-center space-x-3">
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-full mb-8 animate-fade-in">
            <Sparkles size={16} className="text-apple-blue dark:text-apple-blueLight" />
            <span className="text-sm font-semibold text-apple-blue dark:text-apple-blueLight">
              About Scanara AI
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-6 tracking-tight leading-tight animate-slide-up">
            AI-Powered Compliance{' '}
            <span className="text-apple-blue dark:text-apple-blueLight">Auditing</span>{' '}
            for Healthcare
          </h1>
          <p className="text-lg md:text-xl text-apple-gray-600 dark:text-apple-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            Scanara AI helps healthcare organizations ensure their applications meet HIPAA compliance standards through automated code scanning and intelligent analysis.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 mb-8">
        <div className="apple-card p-10 lg:p-12 shadow-apple-xl">
          <h2 className="text-3xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-6 tracking-tight text-center">
            Our Mission
          </h2>
          <p className="text-lg text-apple-gray-600 dark:text-apple-gray-400 text-center max-w-3xl mx-auto leading-relaxed">
            At Scanara AI, we believe that healthcare applications should be secure by default. Our mission is to make HIPAA compliance accessible, automated, and actionable for developers and organizations of all sizes. We combine advanced AI technology with deep healthcare compliance expertise to help you protect patient data and meet regulatory requirements.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 mb-8">
        <h2 className="text-3xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-8 tracking-tight text-center">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="apple-card p-8 shadow-apple-lg animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
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

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 mb-8">
        <h2 className="text-3xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-8 tracking-tight text-center">
          Why Choose Scanara AI?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="apple-card p-6 shadow-apple-lg animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
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
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 mb-8">
        <div className="apple-card p-12 shadow-apple-xl text-center">
          <h2 className="text-3xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-4 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-apple-gray-600 dark:text-apple-gray-400 mb-8 text-lg">
            Start protecting your healthcare applications today with AI-powered compliance auditing.
          </p>
          <Link
            to="/"
            className="apple-button-primary text-lg px-10 py-5 shadow-apple-lg hover:shadow-apple-xl inline-flex items-center space-x-2"
          >
            <span>Get Started Free</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;

