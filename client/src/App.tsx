import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import LandingPage from './pages/LandingPage';
import Overview from './pages/Overview';
import MyProjects from './pages/MyProjects';
import AppDetail from './pages/AppDetail';
import AuditReport from './pages/AuditReport';
import Settings from './pages/Settings';
import SetupGuide from './pages/SetupGuide';
import Docs from './pages/Docs';
import About from './pages/About';
import Layout from './components/Layout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mx-auto mb-4"></div>
          <p className="text-apple-gray-600 dark:text-apple-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue mx-auto mb-4"></div>
          <p className="text-apple-gray-600 dark:text-apple-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard/overview" replace /> : <LandingPage />} />
      <Route path="/setup-guide" element={<SetupGuide />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard/overview" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/overview"
        element={
          <ProtectedRoute>
            <Layout>
              <Overview />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/projects"
        element={
          <ProtectedRoute>
            <Layout>
              <MyProjects />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:appName"
        element={
          <ProtectedRoute>
            <Layout>
              <AppDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/setup-guide"
        element={
          <ProtectedRoute>
            <Layout>
              <SetupGuide />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/docs"
        element={
          <ProtectedRoute>
            <Layout>
              <Docs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit/:reportId"
        element={
          <ProtectedRoute>
            <Layout>
              <AuditReport />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

