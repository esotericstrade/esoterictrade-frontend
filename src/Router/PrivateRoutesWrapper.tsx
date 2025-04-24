import MainLayout from "@/components/MainLayout";
import { useAuthContext } from "@/Pages/Auth/context";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spin } from "antd";

const PrivateRoutesWrapper = () => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate 
        to="/auth/signin" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default PrivateRoutesWrapper;
