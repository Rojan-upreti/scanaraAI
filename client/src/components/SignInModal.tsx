import { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

const SignInModal = ({ isOpen, onClose, onSwitchToSignUp }: SignInModalProps) => {
  const { signInWithEmail, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmail(formData.email, formData.password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative apple-card shadow-apple-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 apple-card border-b border-apple-gray-200 dark:border-apple-gray-800 px-6 py-4 flex items-center justify-between rounded-t-apple-lg z-10">
          <h2 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
            Sign In
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 rounded-apple transition-all duration-200"
          >
            <X size={20} className="text-apple-gray-500 dark:text-apple-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-apple-red/10 dark:bg-apple-red/20 border border-apple-red/30 dark:border-apple-red/40 rounded-apple text-apple-red text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@example.com"
                required
                className="apple-input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="apple-input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
              className="w-full apple-button-primary shadow-apple-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
            
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-apple-gray-300 dark:border-apple-gray-700"></div>
              <span className="px-4 text-sm text-apple-gray-500 dark:text-apple-gray-500">or</span>
              <div className="flex-1 border-t border-apple-gray-300 dark:border-apple-gray-700"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting || isGoogleLoading}
              className="w-full apple-button-secondary shadow-apple-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center space-x-2">
                {isGoogleLoading ? (
                  <>
                    <Lock size={18} className="animate-pulse" />
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

            <div className="text-center text-sm text-apple-gray-600 dark:text-apple-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-apple-blue dark:text-apple-blueLight hover:underline font-semibold"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;

