import { createBrowserRouter } from "react-router-dom";
import PrivateRoutesWrapper from "./PrivateRoutesWrapper";
import PublicRoutesWrapper from "./PublicRoutesWrapper";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "./Routes";

const router = createBrowserRouter([
  {
    element: <PublicRoutesWrapper />,
    children: PUBLIC_ROUTES,
  },
  {
    element: <PrivateRoutesWrapper />,
    children: PRIVATE_ROUTES,
  },
]);

export default router;
