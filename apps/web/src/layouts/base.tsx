import { Toaster } from 'sonner';
import { Outlet } from 'react-router-dom';

import Nav from '../components/Nav';

export function BaseLayout() {
  return (
    <main className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex flex-col max-w-[1400px] w-full mx-auto p-4 md:p-6">
        <Nav />
        <div className="mt-4 md:mt-6 flex-1 overflow-hidden rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
          <Outlet />
        </div>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            padding: '18px',
          },
        }}
      />
    </main>
  );
}
