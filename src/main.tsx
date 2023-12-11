import React from "react";
import ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import UserPage from "./UserPage";
import AddMedicPage from "./AddMedicPage";
import MedicDetailPage from "./MedicDetailPage";
import MemberPage from "./MemberPage";
import NotiManagePage from "./NotiManagePage";

const router = createBrowserRouter([
  {
    path: "UserPage",
    element: <UserPage />
  },
  {
    path: "AddMedicPage",
    element: <AddMedicPage />
  },
  {
    path: "MedicDetailPage",
    element: <MedicDetailPage />
  },
  {
    path: "MemberPage",
    element: <MemberPage />
  },
  {
    path: "NotiManagePage",
    element: <NotiManagePage />
  }
])

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);
