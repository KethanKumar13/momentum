import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";

import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { TodayPage } from "../pages/TodayPage";
import { HabitsPage } from "../pages/HabitsPage";
import { GoalsPage } from "../pages/GoalsPage";
import { JournalPage } from "../pages/JournalPage";
import { ReviewPage } from "../pages/ReviewPage";
import { InsightsPage } from "../pages/InsightsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { UIShowcasePage } from "../pages/dev/UIShowcasePage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={<LandingPage />}
          />
        </Route>

        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/signup"
            element={<SignupPage />}
          />

          <Route
            path="/forgot-password"
            element={<LoginPage />}
          />
        </Route>

        {/* Protected Application Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            path="/today"
            element={<TodayPage />}
          />

          <Route
            path="/habits"
            element={<HabitsPage />}
          />

          <Route
            path="/goals"
            element={<GoalsPage />}
          />

          <Route
            path="/journal"
            element={<JournalPage />}
          />

          <Route
            path="/review"
            element={<ReviewPage />}
          />

          <Route
            path="/insights"
            element={<InsightsPage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />
        </Route>

        {/* Development Routes */}
        <Route
          path="/dev/ui"
          element={<UIShowcasePage />}
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}