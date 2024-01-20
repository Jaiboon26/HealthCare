import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useLocation } from "react-router-dom";

let root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

import UserPage from "./UserPage";
import AddMedicPage from "./AddMedicPage";
import MedicDetailPage from "./MedicDetailPage";
import MemberPage from "./MemberPage";
import NotiManagePage from "./NotiManagePage";
import HomePage from "./HomePage";
import ExQueryData from "./ExQueryData";
import CustomizedDialogs from "./DialogModule";
// import ConnectDB from "./connectDB";

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
  },
  // {
  //   path: "/testModule",
  //   element: <CustomizedDialogs open={true} time="กลางวัน" LineID="U41f63ff091fd49143878e89736e3f976"  />
  // },
  // {
  //   path: "/ConnectDB",
  //   element: <ConnectDB />,
  // },
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
