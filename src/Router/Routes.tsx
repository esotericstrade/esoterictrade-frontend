// src/Router/Routes.tsx
import Auth from "@/Pages/Auth";
import Dashboard from "@/Pages/Dashboard";
import Users from "@/Pages/Users";
import { Navigate } from "react-router-dom";
import { authService } from "@/utils/api/auth/service";
import { RouteObject } from "react-router";

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
    path: "/users",
    element: <Users />,
  },
  {
    path: "*",
    element: <div>404</div>,
  },
];
