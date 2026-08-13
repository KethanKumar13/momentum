import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from '../context/AuthProvider'
import { AppLayout } from '../layouts/AppLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { ProtectedRoute } from './ProtectedRoute'

import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { SignupPage } from '../pages/SignupPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'

import TodayPage from '../pages/TodayPage.jsx'
import HabitsPage from '../pages/HabitsPage.jsx'
import HabitDetailPage from '../pages/HabitDetailPage.jsx'
import GoalsPage from '../pages/GoalsPage.jsx'
import GoalDetailPage from '../pages/GoalDetailPage.jsx'
import InsightsPage from '../pages/InsightsPage.jsx'
import JournalPage from '../pages/JournalPage.jsx'
import ReviewPage from '../pages/ReviewPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import BillingPage from '../pages/BillingPage.jsx'
import OnboardingPage from '../pages/OnboardingPage.jsx'

import { NotFoundPage } from '../pages/NotFoundPage'
import { UIShowcasePage } from '../pages/dev/UIShowcasePage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage />}
            />
          </Route>

          {/* Onboarding — protected, no AppLayout so it's full-screen */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/today" element={<TodayPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route
              path="/habits/:id"
              element={<HabitDetailPage />}
            />
            <Route path="/goals" element={<GoalsPage />} />
            <Route
              path="/goals/:id"
              element={<GoalDetailPage />}
            />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/settings/billing"
              element={<BillingPage />}
            />
          </Route>

          <Route path="/dev/ui" element={<UIShowcasePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
