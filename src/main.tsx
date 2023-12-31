import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

let root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

import UserPage from "./UserPage";
import AddMedicPage from "./AddMedicPage";
import MedicDetailPage from "./MedicDetailPage";
import MemberPage from "./MemberPage";
import NotiManagePage from "./NotiManagePage";
import HomePage from "./HomePage";
import ExQueryData from "./ExQueryData";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/UserPage",
    element: <UserPage />
  },
  {
    path: "/AddMedicPage",
    element: <AddMedicPage />
  },
  {
    path: "/MedicDetailPage",
    element: <MedicDetailPage />
  },
  {
    path: "/MemberPage",
    element: <MemberPage />
  },
  {
    path: "/NotiManagePage",
    element: <NotiManagePage />
  },
  {
    path: "/testQuery",
    element: <ExQueryData />
  }
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
