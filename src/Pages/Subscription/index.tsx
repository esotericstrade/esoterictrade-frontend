import { Route, Routes } from "react-router-dom";
import UserSubscription from "./components/UserSubscription";

const Subscription = () => {
  return (
    <Routes>
      <Route path=":userName/:userId" element={<UserSubscription />} />
    </Routes>
  );
};

export default Subscription;
