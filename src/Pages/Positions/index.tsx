import { Route, Routes } from "react-router-dom";
import BulkPositions from "./components/BulkPositions";
import UserPosition from "./components/UserPosition";

const Positions = () => {
  return (
    <Routes>
      <Route path=":userName/:userId" element={<UserPosition />} />
      <Route path="*" element={<BulkPositions />} />
    </Routes>
  );
};

export default Positions;
