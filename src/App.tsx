import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, message } from "antd";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./Pages/Auth/context";
import router from "./Router";
import { antdConfig } from "./utils/antd";

const queryClient = new QueryClient();

const App = () => {
  const [, contextHolder] = message.useMessage();

  return (
    <ConfigProvider {...antdConfig}>
      {contextHolder}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
