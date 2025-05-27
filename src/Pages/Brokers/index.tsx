
import { Route, Routes } from "react-router-dom";
import BrokerList from "./components/BrokerList";

const Brokers = () => {
  return (
    <Routes>
      <Route path="*" element={<BrokerList />} />
    </Routes>
  );
};

export default Brokers;
