import MainLayout from "@/components/MainLayout";
import { useAuthContext } from "@/Pages/Auth/context";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutesWrapper = () => {
  const { user } = useAuthContext();
  console.log("🚀 ~ PrivateRoutesWrapper ~ user:", user);

  const redirect = window.location.pathname;

  if (!user)
    return <Navigate to={`/auth?redirect=${encodeURIComponent(redirect)}`} />;

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default PrivateRoutesWrapper;
