import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import { StreakProvider } from "./context/StreakContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import AIMentor from "./pages/AIMentor";
import Challenges from "./pages/Challenges";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import LogWorkout from "./pages/LogWorkout";
import LoginPage from "./pages/Login";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSuccess";
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

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccess,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailure,
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

const mentorRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/mentor",
  component: AIMentor,
});

const challengesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/challenges",
  component: Challenges,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  layoutRoute.addChildren([
    indexRoute,
    logRoute,
    historyRoute,
    suggestionsRoute,
    profileRoute,
    surveyRoute,
    mentorRoute,
    challengesRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <SubscriptionProvider>
      <StreakProvider>
        <RouterProvider router={router} />
      </StreakProvider>
    </SubscriptionProvider>
  );
}
