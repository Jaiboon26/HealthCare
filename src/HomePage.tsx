import React from "react";

function HomePage() {
  return (
    <div style={{ margin: '20px'}}>
      <a href="/UserPage">UserPage</a><br />
      <a href="/AddMedicPage">AddMedicPage</a><br />
      <a href="/MedicDetailPage">MedicDetailPage</a><br />
      <a href="/MemberPage">MemberPage</a><br />
      <a href="/NotiManagePage">NotiManagePage</a><br />
      <br /><br /><br /><br /><br /><br /><br />
      <a href="/testQuery">TestAPI_Query</a><br />
      <a href="/ConnectDB">ConnectDB</a><br />
      <a href="/TestModule">TestModule</a><br />
      <a href="/MemberPage/AddMember">testQR</a><br />
      {/* <a href="/TestR2">testR2</a><br />
      <a href="/TestFirebase">TestFirebase</a><br />
      <a href="/TestAddmedic">TestAddmedic</a><br /> */}
    </div>
  );
}
export default HomePage;
