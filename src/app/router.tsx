import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Banner from "@/components/Banner";
import ErrorPage from "./routes/ErrorPage";
import SearchPage from "./routes/SearchPage";

const router = createBrowserRouter([
  {
    element: (
      <>
        <Banner />
        <Outlet />
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <SearchPage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />
}
