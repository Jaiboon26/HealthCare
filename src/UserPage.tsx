import { useEffect, useState } from "react";
import liff from "@line/liff";

function UserPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [displayName, setDisplayName] = useState("");

  const initializeLiff = async () => {
    try {
      await liff.init({
        liffId: import.meta.env.VITE_LIFF_ID
      });

      //setMessage("LIFF init succeeded.");

      // login
      if (!liff.isLoggedIn()) {
        try {
          await liff.login();
        } catch (error) {
          console.error(error);
        }
      } else {
        const accessToken = liff.getIDToken();
        console.log(accessToken);
      }

      // Fetch user profile
      fetchUserProfile();
    } catch (e) {
      setMessage("LIFF init failed.");
      setError(`${e}`);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await liff.getProfile();
      const userProfile = profile.userId;
      const userDisplayName = profile.displayName;
      const statusMessage = profile.statusMessage;
      const userPictureUrl = profile.pictureUrl;

      
      setDisplayName(userDisplayName);
      setPictureUrl(userPictureUrl ?? "");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    initializeLiff();
  }, []);

  return (
    <div className="App">
      <h1>Profile</h1>
      {message && <p>{message}</p>}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
      <h2>{displayName}</h2>
      <div>
        <img src={pictureUrl} alt="profile" style={{ width: '350px', height: '350px' }} />
      </div>
      <div style={{ marginTop: '20px', }}>
        <button onClick={() => {
          liff.logout();
          window.location.reload();
        }}>Log out</button>
      </div>
    </div>
  );
}

export default UserPage;
