import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Menu, X, LogOut, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfileMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-apple-gray-200/60 dark:border-apple-gray-800/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-[14px] flex items-center justify-center shadow-apple transition-transform duration-200 group-hover:scale-105">
              <span className="text-apple-blue dark:text-apple-blueLight font-semibold text-sm">S</span>
            </div>
            <span className="font-semibold text-lg text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
              Scanara AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-apple text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-all duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              className="px-5 py-2.5 rounded-apple text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-all duration-200"
            >
              Settings
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-apple text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-all duration-200"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-apple hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-all duration-200"
              >
                <img
                  src={user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=007AFF&color=fff`}
                  alt={user?.name || 'User'}
                  className="w-9 h-9 rounded-full border-2 border-apple-gray-200 dark:border-apple-gray-800 object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=007AFF&color=fff`;
                  }}
                />
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-3 w-56 apple-card shadow-apple-lg border border-apple-gray-200/80 dark:border-apple-gray-800/80 py-2 z-20 animate-fade-in">
                    <div className="px-4 py-3 border-b border-apple-gray-200 dark:border-apple-gray-800">
                      <p className="text-sm font-semibold text-apple-gray-900 dark:text-apple-gray-100">{user?.name}</p>
                      <p className="text-xs text-apple-gray-600 dark:text-apple-gray-400 mt-0.5">{user?.email}</p>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2.5 text-sm text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-all duration-150"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings size={16} className="mr-3" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-apple-red hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-all duration-150"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-apple text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 transition-all duration-200"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-apple-gray-200 dark:border-apple-gray-800 animate-slide-up">
            <Link
              to="/dashboard"
              className="block px-4 py-3 text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 rounded-apple transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-3 text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 rounded-apple transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 rounded-apple transition-all duration-200"
            >
              {darkMode ? <Sun size={20} className="mr-3" /> : <Moon size={20} className="mr-3" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-apple-red hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800 rounded-apple transition-all duration-200"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
