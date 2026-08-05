/**
 * Single source of truth for all application routes.
 * Sidebar, Topbar, MobileTabBar, and CommandPalette are
 * all driven by this config - never hardcoded separately.
 */
export const routes = [
  {
    path: "/today",
    label: "Today",
    icon: "Sunrise",
    layout: "app",
    showInSidebar: true,
    showInMobileTab: true,
  },
  {
    path: "/habits",
    label: "Habits",
    icon: "Repeat2",
    layout: "app",
    showInSidebar: true,
    showInMobileTab: true,
  },
  {
    path: "/goals",
    label: "Goals",
    icon: "Target",
    layout: "app",
    showInSidebar: true,
    showInMobileTab: false,
  },
  {
    path: "/journal",
    label: "Journal",
    icon: "BookOpen",
    layout: "app",
    showInSidebar: true,
    showInMobileTab: true,
  },
  {
    path: "/review",
    label: "Review",
    icon: "Sparkles",
    layout: "app",
    showInSidebar: true,
    showInMobileTab: false,
  },
  {
    path: "/insights",
    label: "Insights",
    icon: "BarChart3",
    layout: "app",
    showInSidebar: true,
    showInMobileTab: true,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: "Settings",
    layout: "app",
    showInSidebar: true,
    showInMobileTab: false,
  },
];

export const publicRoutes = [
  {
    path: "/",
    label: "Home",
    layout: "public",
  },
  {
    path: "/login",
    label: "Login",
    layout: "auth",
  },
  {
    path: "/signup",
    label: "Sign up",
    layout: "auth",
  },
  {
    path: "/forgot-password",
    label: "Reset password",
    layout: "auth",
  },
  {
    path: "/pricing",
    label: "Pricing",
    layout: "public",
  },
];