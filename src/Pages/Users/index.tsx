import { UserList } from "@phosphor-icons/react";
import { Route, Routes } from "react-router-dom";

const Users = () => {
  return (
    <Routes>
      <Route path="*" element={<UserList />} />
    </Routes>
  );
};

export default Users;
