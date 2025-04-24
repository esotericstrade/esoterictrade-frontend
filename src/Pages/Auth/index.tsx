import { Route, Routes } from "react-router-dom";
import { authRoutes } from "./Routes";

const Auth = () => {
  return (
    <div
      className="min-h-screen font-poppins"
      style={{
        backgroundImage: "url('/bg-image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#00030E",
      }}
    >
      <Routes>
        {authRoutes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={route.element} 
          />
        ))}
      </Routes>
    </div>
  );
};

export default Auth;
