import { Route, Routes } from "react-router-dom";
import UserPosition from "./components/UserPosition";

const Positions = () => {
  return (
    <Routes>
      <Route path=":userName/:userId" element={<UserPosition />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default Positions;
