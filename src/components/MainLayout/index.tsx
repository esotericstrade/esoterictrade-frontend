import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { ReactNode } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Layout className="grid grid-rows-[auto_1fr] grid-cols-[auto,1fr] max-h-dvh overflow-hidden bg-white">
      <Header />
      <Sidebar />
      <Content className="p-6 overflow-y-auto rounded-tl-xl bg-zinc-100">
        {children}
      </Content>
    </Layout>
  );
};

export default MainLayout;
