// src/Router/Routes.tsx
import Actors from "@/Pages/Actors";
import Auth from "@/Pages/Auth";
import Brokers from "@/Pages/Brokers";
import Dashboard from "@/Pages/Dashboard";
import Strategies from "@/Pages/Strategies";
import Subscription from "@/Pages/Subscription";
import Users from "@/Pages/Users/components/UserList";
import { authService } from "@/utils/api/auth/service";
import { RouteObject } from "react-router";
import { Navigate } from "react-router-dom";

const ConditionalRedirect = () => {
  const isAuthenticated = authService.isAuthenticated();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/auth/signin" replace />;
  }
};

export const PUBLIC_ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <ConditionalRedirect />,
  },
  {
    path: "/auth/*",
    element: <Auth />,
  },
];

export const PRIVATE_ROUTES: RouteObject[] = [
  { path: "/dashboard", element: <Dashboard /> },
  {
    path: "/users/*",
    element: <Users />,
  },
  {
    path: "/subscription/*",
    element: <Subscription />,
  },
  {
    path: "/actors/*",
    element: <Actors />,
  },
  {
    path: "/strategies/*",
    element: <Strategies />,
  },
  {
    path: "/brokers/*",
    element: <Brokers />,
  },
  {
    path: "*",
    element: <div>404</div>,
  },
];
