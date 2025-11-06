import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SignInModal from '../components/SignInModal';
import SignUpModal from '../components/SignUpModal';
import { 
  Shield, 
  Zap, 
  FileText, 
  ArrowRight, 
  Lock,
  Code,
  TrendingUp,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      // Navigation will happen automatically via auth state change
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
    { value: '99.9%', label: 'Accuracy Rate' },
    { value: '5 min', label: 'Average Scan Time' },
    { value: '1000+', label: 'Compliance Rules' },
    { value: '24/7', label: 'Continuous Monitoring' },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Connect Your Repository',
      description: 'Link your GitHub, GitLab, or Bitbucket repository. Our CLI tool or IDE/VS Code extension makes integration seamless.',
    },
    {
      step: '02',
      title: 'AI-Powered Analysis',
      description: 'Our advanced AI scans your codebase for compliance violations, checking encryption, data handling, and access controls.',
    },
    {
      step: '03',
      title: 'Get Actionable Insights',
      description: 'Receive detailed reports with prioritized findings, exact locations, and step-by-step remediation guides.',
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
              <span className="font-semibold text-lg text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
                Scanara AI
              </span>
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
              <button
                onClick={() => setShowSignInModal(true)}
                className="apple-button-secondary shadow-apple-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowSignUpModal(true)}
                className="apple-button-primary shadow-apple-lg"
              >
                Sign Up
              </button>
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
              AI-Powered Compliance Scanning
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-6 tracking-tight leading-tight animate-slide-up">
            Secure Your Healthcare App with{' '}
            <span className="text-apple-blue dark:text-apple-blueLight">AI-Powered</span>{' '}
            Compliance Auditing
          </h1>
          <p className="text-xl md:text-2xl text-apple-gray-600 dark:text-apple-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            Automatically detect compliance violations in your codebase. Get instant reports with actionable fixes to protect patient data and ensure regulatory compliance.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {error && (
              <div className="w-full max-w-md mx-auto p-4 bg-apple-red/10 dark:bg-apple-red/20 border border-apple-red/30 dark:border-apple-red/40 rounded-apple-lg text-apple-red text-sm animate-slide-up">
                {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
              <button
                onClick={() => setShowSignUpModal(true)}
                className="apple-button-primary text-lg px-10 py-5 shadow-apple-lg hover:shadow-apple-xl w-full sm:w-auto"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Get Started Free</span>
                  <ArrowRight size={20} />
                </span>
              </button>
              <button
                onClick={() => setShowSignInModal(true)}
                className="apple-button-secondary text-lg px-10 py-5 w-full sm:w-auto"
              >
                Sign In
              </button>
            </div>
            <div className="flex items-center w-full max-w-md">
              <div className="flex-1 border-t border-apple-gray-300 dark:border-apple-gray-700"></div>
              <span className="px-4 text-sm text-apple-gray-500 dark:text-apple-gray-500">or</span>
              <div className="flex-1 border-t border-apple-gray-300 dark:border-apple-gray-700"></div>
            </div>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="apple-button-secondary text-lg px-10 py-5 w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <Lock size={20} className="animate-pulse" />
                    <span>Signing in with Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </span>
            </button>
            <button
              onClick={() => window.scrollTo({ top: document.getElementById('features')?.offsetTop || 0, behavior: 'smooth' })}
              className="apple-button-secondary text-lg px-10 py-5"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 apple-card shadow-apple animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
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

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-4 tracking-tight">
            Everything You Need for Compliance Scanning
          </h2>
          <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 max-w-2xl mx-auto">
            Comprehensive scanning, instant reporting, and actionable remediation guidance
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="apple-card p-8 card-hover animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-[18px] flex items-center justify-center mb-6 shadow-apple`}>
                  <Icon size={32} className={feature.color} />
                </div>
                <h3 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-apple-gray-600 dark:text-apple-gray-400 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 bg-apple-gray-100 dark:bg-apple-gray-900/50 rounded-apple-xl my-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {howItWorks.map((step, index) => (
            <div
              key={index}
              className="relative animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="apple-card p-8 h-full">
                <div className="text-5xl font-bold text-apple-blue/20 dark:text-apple-blue/30 mb-4 tracking-tight">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-4 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-apple-gray-600 dark:text-apple-gray-400 leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
              {index < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-apple-gray-300 dark:bg-apple-gray-700 transform -translate-y-1/2">
                  <ArrowRight size={16} className="absolute right-0 top-1/2 transform -translate-y-1/2 text-apple-gray-400 dark:text-apple-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-4 tracking-tight">
            Why Choose Scanara AI?
          </h2>
          <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 max-w-2xl mx-auto">
            Protect patient data, ensure compliance, and build trust with confidence
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="apple-card p-6 card-hover animate-slide-up"
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
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="apple-card rounded-apple-xl p-16 lg:p-20 text-center shadow-apple-xl">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-6 tracking-tight">
              Ready to Secure Your Healthcare Application?
            </h2>
            <p className="text-xl text-apple-gray-600 dark:text-apple-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers who trust Scanara AI to protect patient data and ensure regulatory compliance.
            </p>
            <div className="flex flex-col items-center justify-center gap-4">
              {error && (
                <div className="w-full max-w-md mx-auto p-4 bg-apple-red/10 dark:bg-apple-red/20 border border-apple-red/30 dark:border-apple-red/40 rounded-apple-lg text-apple-red text-sm">
                  {error}
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
                <button
                  onClick={() => setShowSignUpModal(true)}
                  className="apple-button-primary text-lg px-10 py-5 shadow-apple-lg hover:shadow-apple-xl w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Get Started Free</span>
                    <ArrowRight size={20} />
                  </span>
                </button>
                <button
                  onClick={() => setShowSignInModal(true)}
                  className="apple-button-secondary text-lg px-10 py-5 w-full sm:w-auto"
                >
                  Sign In
                </button>
              </div>
              <p className="text-sm text-apple-gray-500 dark:text-apple-gray-500">
                No credit card required • Free forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 lg:px-8 py-12 border-t border-apple-gray-200 dark:border-apple-gray-800 mt-20">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-lg flex items-center justify-center">
              <span className="text-apple-blue dark:text-apple-blueLight font-semibold text-sm">S</span>
            </div>
            <span className="font-semibold text-lg text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
              Scanara AI
            </span>
          </div>
          <p className="text-sm text-apple-gray-500 dark:text-apple-gray-500">
            © 2024 Scanara AI. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)}
        onSwitchToSignUp={() => {
          setShowSignInModal(false);
          setShowSignUpModal(true);
        }}
      />
      <SignUpModal 
        isOpen={showSignUpModal} 
        onClose={() => setShowSignUpModal(false)}
        onSwitchToSignIn={() => {
          setShowSignUpModal(false);
          setShowSignInModal(true);
        }}
      />
    </div>
  );
};

export default LandingPage;
