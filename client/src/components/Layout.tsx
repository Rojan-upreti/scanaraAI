import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-apple-gray-50 dark:bg-apple-gray-900 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
