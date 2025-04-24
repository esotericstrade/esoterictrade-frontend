import { useAuthContext } from "@/Pages/Auth/context";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spin } from "antd";

const PublicRoutesWrapper = () => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (user) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }
  
  return <Outlet />;
};

export default PublicRoutesWrapper;
