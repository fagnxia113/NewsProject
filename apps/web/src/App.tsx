import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Feeds from './pages/feeds';
import Login from './pages/login';
import Accounts from './pages/accounts/index';
import AnalysisResults from './pages/analysis/new-results';
import Settings from './pages/settings';
import { BaseLayout } from './layouts/base';
import { TrpcProvider } from './provider/trpc';
import ThemeProvider from './provider/theme';
import { enabledAuthCode } from './utils/env';
import { getAuthCode } from './utils/auth';
import { useEffect, useState } from 'react';
import './styles/modal-fix.css';

function AuthGuard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!enabledAuthCode) {
      setIsAuthenticated(true);
      return;
    }

    const authCode = getAuthCode();
    setIsAuthenticated(!!authCode);
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-gray-500">加载中...</div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter basename="/dash">
      <ThemeProvider>
        <TrpcProvider>
          <div className="h-full w-full">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<AuthGuard />}>
                <Route path="/" element={<BaseLayout />}>
                  <Route index element={<Feeds />} />
                  <Route path="feeds/:id?" element={<Feeds />} />
                  <Route path="accounts" element={<Accounts />} />
                  <Route path="analysis/results" element={<AnalysisResults />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </TrpcProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
