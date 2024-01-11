import React from "react";
import { useEffect, useState } from "react";
import liff from "@line/liff";
//import profile from "./assets/pic/profile.jpg";
import './UserPage.css'
import { Avatar, Box, Typography } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import QRCode from "react-qr-code";
import axios from "axios";
import { getAccessToken } from "./connectDB";

function UserPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userID, setUserID] = useState("");


  const initializeLiff = async () => {
    try {
      await liff.init({
        liffId: "2002106411-BlOzNXLw"
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
      findProfile();
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
      setUserID(userProfile);
      setPictureUrl(userPictureUrl ?? "");
    } catch (err) {
      console.error(err);
    }
  };

  const InsertProfile = async () => {
    try {
      const accessToken = await getAccessToken();
      const responseInsert = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/insertOne', {
        collection: 'User',
        database: 'HealthCare',
        dataSource: 'HealthCareDemo',
        document: {
          LineID: userID,
          Name: displayName,
        },
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = responseInsert.data;
      console.log(data);

    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);

    }
  }

  const findProfile = async () => {

    try {
      const accessToken = await getAccessToken();
      const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/findOne', {
        collection: 'User',
        database: 'HealthCare',
        dataSource: 'HealthCareDemo',
        filter: {
          LineID: userID,
        },
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = responseFind.data;
      console.log(accessToken);

      if (data && data.document) {
        console.log(data);
      } else {
        InsertProfile();
      }
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);

    }
  };

  useEffect(() => {
    initializeLiff();
  },
    []);

  useEffect(() => {
    // Trigger findProfile when userID or displayName changes
    if (userID && displayName) {
      findProfile();
    }
  }, [userID, displayName]);

  return (
    <div>
      {message && <p>{message}</p>}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
      <Typography variant="h3" component="h2" sx={{ textAlign: 'center', margin: '20px' }}>
        สมาชิก
      </Typography>
      <Card sx={{
        display: 'flex',
        height: "200px",
        alignItems: 'center',
        justifyContent: 'center',
        gap: "20px",
        bgcolor: '#A8E3F0',
        margin: '0 20px',
        minWidth: '310px'
      }}>
        <Avatar
          alt={displayName}
          src={pictureUrl}
          sx={{ width: 100, height: 100, marginLeft: '10px' }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto', marginRight: '10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Typography component="div" variant="h5">
              {displayName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              Thailand <br />
              175 Cm <br />
              80 Kg
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <Card sx={{
        //height: '500px'
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 20px',
        flexDirection: 'column',
        gap: '20px',
        minWidth: '310px'
      }}>
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "auto", width: "auto" }}
          value={userID}
          viewBox={`0 0 256 256`}
        />
        <CardContent>
          <Typography variant="h5">
            QR Code สำหรับลงทะเบียน
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserPage;
