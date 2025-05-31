import { Route, Routes } from "react-router-dom";
import TradeReportTable from "./components/TradeReportTable";

const ReportsPage = () => {
  return (
    <Routes>
      <Route path="/trade" element={<TradeReportTable />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default ReportsPage;
