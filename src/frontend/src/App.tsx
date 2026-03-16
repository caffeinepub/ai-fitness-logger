import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import LogWorkout from "./pages/LogWorkout";
import LoginPage from "./pages/Login";
import ProfilePage from "./pages/Profile";
import Suggestions from "./pages/Suggestions";
import Survey from "./pages/Survey";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: Dashboard,
});

const logRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/log",
  component: LogWorkout,
});

const historyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/history",
  component: History,
});

const suggestionsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/suggestions",
  component: Suggestions,
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const surveyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/survey",
  component: Survey,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    indexRoute,
    logRoute,
    historyRoute,
    suggestionsRoute,
    profileRoute,
    surveyRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
