import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter , Route , Routes } from 'react-router-dom';

import UserPage from "./UserPage";
import AddMedicPage from "./AddMedicPage";
import MedicDetailPage from "./MedicDetailPage";
import MemberPage from "./MemberPage";
import NotiManagePage from "./NotiManagePage";

ReactDOM.render(
  <React.StrictMode>
    <Routes>
      <Route path="/UserPage" element={<UserPage />}/>
      <Route path="/MedicDetailPage" element={<MedicDetailPage />}/>
      <Route path="/MemberPage" element={<MemberPage />}/>
      <Route path="/AddMedicPage" element={<AddMedicPage />}/>
      <Route path="/NotiManagePage" element={<NotiManagePage />}/>
    </Routes>
  </React.StrictMode>,
  document.getElementById("root")
);
