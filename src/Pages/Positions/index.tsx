// src/Pages/Positions/index.tsx
import { useAuthContext } from "@/Pages/Auth/context";
import { Route, Routes } from "react-router-dom";
import BulkPositions from "./components/BulkPositions";
import UserPosition from "./components/UserPosition";

const Positions = () => {
  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return <BulkPositions />;
  }

  return (
    <Routes>
      <Route path=":userName/:userId" element={<UserPosition />} />
      <Route path="*" element={<BulkPositions />} />
    </Routes>
  );
};

export default Positions;