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
import CustomizedDialogs from "./DialogModule";
import QrReader from "./QrReader";
import EditMedicPage from "./EditMedicPage";
import DeleteConfirmPage from "./ConfirmDeletePage";
import MedicDetailPage_client from "./MedicDetailPage_client";
import NotiManagePage_client from "./NotiManagePage_client";
import MedicineLogs from "./MedicineLogs";
import MedicineLogsByDate from "./MedicineLogsByDate";
import MedicineLogs_client from "./MedicineLogs_client";
import MEDHistory from "./MEDHistory";
// import TestR2 from "./Database_Module/TestAWSModule";
// import { FirebaseApp } from "./Database_Module/FirebaseApp";
// import AddMedicPageCopy from "./AddMedicPage copy";
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
  {
    path: "/MemberPage/AddMember/:userID",
    element: <QrReader />
  },
  {
    path: "/firebase",
    element: <QrReader />
  },
  {
    path: "/EditMedicPage/:medicID",
    element: <EditMedicPage />
  },
  {
    path: "/DeleteMedicPage/:medicID/:medicName/:lineID",
    element: <DeleteConfirmPage />
  },
  {
    path: "/MemberPage/MedicDetailPage/:client_id/:client_pic/:client_name",
    element: <MedicDetailPage_client />
  },
  {
    path: "/MemberPage/NotiManagePage/:client_id/:client_pic/:client_name",
    element: <NotiManagePage_client />
  },
  {
    path: "/MedicineLogs",
    element: <MedicineLogs />
  },
  {
    path: "/MedicineLogs/:userID/:date",
    element: <MedicineLogsByDate />
  },
  {
    path: "/MedicineLogs/member/:userID/",
    element: <MedicineLogs_client />
  },
  {
    path: "/MEDHistory/:MedicID/:userID",
    element: <MEDHistory />
  },

  // {
  //   path: "/MedicDetailPageCopy",
  //   element: <MedicDetailPageCopy />
  // },
  // {
  //   path: "/TestR2",
  //   element: <TestR2 />,
  // },
  // {
  //   path: "/TestFirebase",
  //   element: <FirebaseApp />,
  // },
  // {
  //   path: "/TestAddmedic",
  //   element: <AddMedicPageCopy />,
  // },
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
