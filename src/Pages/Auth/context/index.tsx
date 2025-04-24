import React, { createContext, useContext } from "react";
import { useLocalStorage } from "usehooks-ts";

type TUser = {
  id: string;
  name: string;
};

type TAuthContext = {
  user: null | TUser;
  onLogout: () => void;
};

const AuthContext = createContext<TAuthContext | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useLocalStorage<TUser | null>("user", {
    id: "1234",
    name: "Girish Sawant",
  });

  const onLogout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
