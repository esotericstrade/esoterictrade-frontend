import Auth from "@/Pages/Auth";
import Dashboard from "@/Pages/Dashboard";
import Users from "@/Pages/Users";
import { RouteObject } from "react-router";

export const PUBLIC_ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <div>Landing Page</div>,
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
