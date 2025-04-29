import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import ToasterProvider from "./components/toaster";
import AuthProvider from "./Pages/Auth/context";
import router from "./Router";
import { antdConfig } from "./utils/antd";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ConfigProvider {...antdConfig}>
      <ToasterProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </ToasterProvider>
    </ConfigProvider>
  );
};

export default App;
