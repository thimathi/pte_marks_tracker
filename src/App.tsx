import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PteDataProvider } from './context/PteDataContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { PracticePage } from './pages/PracticePage';
import { QuestionAnalyticsPage } from './pages/QuestionAnalyticsPage';
import { MockExamsPage } from './pages/MockExamsPage';
import { ReviewPage } from './pages/ReviewPage';
import { ReportsPage } from './pages/ReportsPage';
import { FinalReportPage } from './pages/FinalReportPage';
import { CalendarPage } from './pages/CalendarPage';
import { SettingsPage } from './pages/SettingsPage';
import { Target } from 'lucide-react';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1020] flex flex-col items-center justify-center text-[#edf2ff] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center animate-pulse shadow-sm">
          <Target className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-semibold text-[#a9b5d0]">Loading your PTE study records...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <PteDataProvider>{children}</PteDataProvider>;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Application Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/analytics/questions" element={<QuestionAnalyticsPage />} />
              <Route path="/mock-exams" element={<MockExamsPage />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route path="/analytics" element={<ReportsPage />} />
              <Route path="/report/final" element={<FinalReportPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
