import { Route, Routes } from "react-router-dom";
import UserSubscription from "./components/UserSubscription";

const Subscription = () => {
  return (
    <Routes>
      <Route path=":userId" element={<UserSubscription />} />
    </Routes>
  );
};

export default Subscription;
