import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApps } from '../contexts/AppContext';
import {
  LayoutDashboard,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  BookOpen,
  HelpCircle,
  LogOut,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const { apps } = useApps();
  const location = useLocation();
  const navigate = useNavigate();
  const [projectsOpen, setProjectsOpen] = useState(false);

  // Open projects dropdown if we're on a project detail page or projects page
  useEffect(() => {
    const isProjectPage = location.pathname.startsWith('/dashboard/') && 
           location.pathname !== '/dashboard/overview' && 
           location.pathname !== '/dashboard/setup-guide' &&
           location.pathname !== '/dashboard/docs';
    if (isProjectPage) {
      setProjectsOpen(true);
    }
  }, [location.pathname]);

  const getAppSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard/overview') {
      return location.pathname === '/dashboard/overview' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Overview',
      path: '/dashboard/overview',
    },
  ];

  const handleProjectsClick = () => {
    if (location.pathname === '/dashboard/projects') {
      setProjectsOpen(!projectsOpen);
    } else {
      navigate('/dashboard/projects');
      setProjectsOpen(true);
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-apple-gray-900 border-r border-apple-gray-200 dark:border-apple-gray-800 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-apple-gray-200 dark:border-apple-gray-800">
        <Link to="/dashboard/overview" className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-apple-blue/10 dark:bg-apple-blue/20 rounded-[14px] flex items-center justify-center shadow-apple">
            <span className="text-apple-blue dark:text-apple-blueLight font-semibold text-sm">S</span>
          </div>
          <span className="font-semibold text-lg text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">
            Scanara AI
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-apple transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue dark:text-apple-blueLight shadow-apple'
                  : 'text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Projects Dropdown */}
        <div>
          <button
            onClick={handleProjectsClick}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-apple transition-all duration-200 ${
              isActive('/dashboard/projects') || (location.pathname.startsWith('/dashboard/') && location.pathname !== '/dashboard/overview' && location.pathname !== '/dashboard/setup-guide' && location.pathname !== '/dashboard/docs')
                ? 'bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue dark:text-apple-blueLight shadow-apple'
                : 'text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              <FolderOpen size={20} />
              <span className="font-medium">Projects</span>
            </div>
            {projectsOpen ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
          {projectsOpen && apps.length > 0 && (
            <div className="mt-1 ml-4 space-y-1">
              <Link
                to="/dashboard/projects"
                className={`block px-4 py-2 rounded-apple text-sm transition-all duration-200 ${
                  location.pathname === '/dashboard/projects'
                    ? 'bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue dark:text-apple-blueLight font-medium'
                    : 'text-apple-gray-600 dark:text-apple-gray-400 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
                }`}
              >
                All Projects
              </Link>
              {apps.map((app) => {
                const slug = getAppSlug(app.name);
                const isProjectActive = location.pathname === `/dashboard/${slug}`;
                return (
                  <Link
                    key={app.id}
                    to={`/dashboard/${slug}`}
                    className={`block px-4 py-2 rounded-apple text-sm transition-all duration-200 ${
                      isProjectActive
                        ? 'bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue dark:text-apple-blueLight font-medium'
                        : 'text-apple-gray-600 dark:text-apple-gray-400 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
                    }`}
                  >
                    {app.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Setup Guide */}
        <Link
          to="/dashboard/setup-guide"
          className={`flex items-center space-x-3 px-4 py-3 rounded-apple transition-all duration-200 ${
            isActive('/dashboard/setup-guide')
              ? 'bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue dark:text-apple-blueLight shadow-apple'
              : 'text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
          }`}
        >
          <HelpCircle size={20} />
          <span className="font-medium">Setup Guide</span>
        </Link>

        {/* Docs */}
        <Link
          to="/dashboard/docs"
          className={`flex items-center space-x-3 px-4 py-3 rounded-apple transition-all duration-200 ${
            isActive('/dashboard/docs')
              ? 'bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue dark:text-apple-blueLight shadow-apple'
              : 'text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
          }`}
        >
          <BookOpen size={20} />
          <span className="font-medium">Docs</span>
        </Link>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-apple-gray-200 dark:border-apple-gray-800 space-y-1">
        <Link
          to="/settings"
          className={`flex items-center space-x-3 px-4 py-3 rounded-apple transition-all duration-200 ${
            isActive('/settings')
              ? 'bg-apple-blue/10 dark:bg-apple-blue/20 text-apple-blue dark:text-apple-blueLight shadow-apple'
              : 'text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-800'
          }`}
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-apple text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-red/10 dark:hover:bg-apple-red/20 hover:text-apple-red transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

