import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";

let root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

import UserPage from "./UserPage";
import AddMedicPage from "./AddMedicPage";
import MedicDetailPage from "./MedicDetailPage";
import MemberPage from "./MemberPage";
import NotiManagePage from "./NotiManagePage";
import HomePage from "./HomePage";

const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "UserPage",
        element: <UserPage />,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
