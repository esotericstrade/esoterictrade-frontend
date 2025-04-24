import { useAuthContext } from "@/Pages/Auth/context";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoutesWrapper = () => {
  const { user } = useAuthContext();
  console.log("🚀 ~ PublicRoutesWrapper ~ user:", user);

  if (user) return <Navigate to="/dashboard" />;
  return <Outlet />;
};

export default PublicRoutesWrapper;
