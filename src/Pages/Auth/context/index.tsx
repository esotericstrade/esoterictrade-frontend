import useToaster from "@/components/toaster";
import { apiClient } from "@/utils/api/apiClient";
import { authService } from "@/utils/api/auth/service";
import { userService } from "@/utils/api/user/service";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

type TUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "user";
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type TAuthContext = {
  user: null | TUser;
  setUser: (user: TUser | null) => void;
  loading: boolean;
  onLogout: () => void;
};

const AuthContext = createContext<TAuthContext | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useLocalStorage<TUser | null>("user", null);
  const [loading, setLoading] = useState(true);

  const toaster = useToaster();

  useEffect(() => {
    apiClient.setNotificationInstance(toaster);
  }, [toaster]);

  // Check if user is authenticated on page load
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          // If we have a token, fetch the current user profile
          const currentUser = await userService.getCurrentProfile();
          setUser(currentUser);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // If token is invalid, clear it
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const onLogout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        onLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be within Auth");
  }
  return context;
};
