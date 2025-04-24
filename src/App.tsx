import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./Pages/Auth/context";
import router from "./Router";
import { antdConfig } from "./utils";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ConfigProvider {...antdConfig}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
