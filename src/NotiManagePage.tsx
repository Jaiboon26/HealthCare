//NotiManagePage.tsx
import { useEffect, useState } from "react";
import liff from "@line/liff";
import React from "react";
import { AppBar, Avatar, Box, Button, ButtonGroup, Card, CardContent, IconButton, SvgIcon, Toolbar, Typography } from "@mui/material";
import CustomizedDialogs from "./DialogModule";
import axios from "axios";
import { getAccessToken } from "./connectDB";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

function Variants() {
  return (
    <Stack spacing={1}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px', alignItems: 'center' }}>

        {/* For variant="text", adjust the height via font-size */}
        {/* <Skeleton variant="text" sx={{ fontSize: '1rem' }} /> */}
        <Skeleton variant="rounded" width="100%" height={60} />

        {/* For other variants, adjust the size with `width` and `height` */}
        {/* <Skeleton variant="circular" width={40} height={40} /> */}
        <Skeleton variant="rectangular" width={210} height={60} sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          width: '200px',
          minHeight: '50px',
          zIndex: '1'
        }} />


        <Skeleton variant="rounded" width={210} height={60} sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          minWidth: '310px',
          position: 'relative',
          top: '-35px',
          minHeight: '100px'
        }} />


        <Skeleton variant="rectangular" width={210} height={60} sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          width: '200px',
          minHeight: '50px',
          zIndex: '1'
        }} />


        <Skeleton variant="rounded" width={210} height={60} sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          minWidth: '310px',
          position: 'relative',
          top: '-35px',
          minHeight: '100px'
        }} />

        <Skeleton variant="rectangular" width={210} height={60} sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          width: '200px',
          minHeight: '50px',
          zIndex: '1'
        }} />


        <Skeleton variant="rounded" width={210} height={60} sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          minWidth: '310px',
          position: 'relative',
          top: '-35px',
          minHeight: '100px'
        }} />

        <Skeleton variant="rectangular" width={210} height={60} sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          width: '200px',
          minHeight: '50px',
          zIndex: '1'
        }} />


        <Skeleton variant="rounded" width={210} height={60} sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          minWidth: '310px',
          position: 'relative',
          top: '-35px',
          minHeight: '100px'
        }} />


      </div>

    </Stack>
  );
}

function NotiManagePage() {

  const [open, setOpen] = React.useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loading, setLoading] = useState(true);

  const [selectedTime, setSelectedTime] = React.useState<string>("");
  const [selectedHours, setSelectedHours] = useState<string>("");
  const [selectedMins, setSelectedMins] = useState<string>("");
  const [selectedHours1, setSelectedHours1] = useState<string>("");
  const [selectedMins1, setSelectedMins1] = useState<string>("");
  const [selectedHours2, setSelectedHours2] = useState<string>("");
  const [selectedMins2, setSelectedMins2] = useState<string>("");
  const [selectedHours3, setSelectedHours3] = useState<string>("");
  const [selectedMins3, setSelectedMins3] = useState<string>("");
  const [selectedHours4, setSelectedHours4] = useState<string>("");
  const [selectedMins4, setSelectedMins4] = useState<string>("");
  const Morning = "เช้า";
  const Noon = "กลางวัน";
  const Evening = "เย็น";
  const Night = "ก่อนนอน";

  const handleClickOpen = (time: string, hours: string, mins: string) => {
    setOpen(true);
    setSelectedTime(time);
    setSelectedHours(hours);
    setSelectedMins(mins);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = (hours: string, mins: string) => {
    // Handle the saved data as needed
    if (selectedTime === "เช้า") {
      setSelectedHours1(hours);
      setSelectedMins1(mins);
    }
    else if (selectedTime === "กลางวัน") {
      setSelectedHours2(hours);
      setSelectedMins2(mins);
    }
    else if (selectedTime === "เย็น") {
      setSelectedHours3(hours);
      setSelectedMins3(mins);
    }
    else if (selectedTime === "ก่อนนอน") {
      setSelectedHours4(hours);
      setSelectedMins4(mins);
    }
  };

  // const [message, setMessage] = useState("");
  // const [error, setError] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  // const [displayName, setDisplayName] = useState("");
  const [userID, setUserID] = useState("");


  const initializeLiff = async () => {
    try {
      await liff.init({
        liffId: "2004903683-YjLEAEmQ"
      });

      //setMessage("LIFF init succeeded.");

      // login
      if (!liff.isLoggedIn()) {
        try {
          await liff.login();
          setIsLoggedIn(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        setIsLoggedIn(true);
        const accessToken = liff.getIDToken();
        console.log(accessToken);
      }


      // Fetch user profile
      fetchUserProfile();
    } catch (e) {
      // setMessage("LIFF init failed.");
      // setError(`${e}`);
    }
  };


  const fetchUserProfile = async () => {
    try {
      const profile = await liff.getProfile();
      const userProfile = profile.userId;
      const userDisplayName = profile.displayName;
      const statusMessage = profile.statusMessage;
      const userPictureUrl = profile.pictureUrl;


      // setDisplayName(userDisplayName);
      setUserID(userProfile);
      setPictureUrl(userPictureUrl ?? "");
      // findTime();
    } catch (err) {
      console.error(err);
    }
  };

  const insertTime = async () => {
    if (userID === "") {
      try {
        await liff.login();
      } catch (error) {
        console.error(error);
      }
    }
    else {

      try {
        const accessToken = await getAccessToken();
        const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/insertOne', {
          collection: 'NotifyTime',
          database: 'HealthCare',
          dataSource: 'HealthCareDemo',
          document: {
            LineID: userID,
            Morning: ["08", "30"],
            Noon: ["12", "00"],
            Evening: ["17", "15"],
            Night: ["21", "15"],
          },
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const data = responseFind.data;
      } catch (error) {
        console.error('Error fetching data from MongoDB:', error);

      }
    }
  };

  const findTime = async () => {
    if (userID === "") {
      try {
        await liff.login();
      } catch (error) {
        console.error(error);
      }
    }
    else {
      try {
        const accessToken = await getAccessToken();
        const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/findOne', {
          collection: 'NotifyTime',
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
        // console.log(accessToken);

        if (data && data.document && data.document.LineID === userID) {
          console.log(data);

          setSelectedHours1(data.document.Morning[0]);
          setSelectedMins1(data.document.Morning[1]);

          setSelectedHours2(data.document.Noon[0]);
          setSelectedMins2(data.document.Noon[1]);

          setSelectedHours3(data.document.Evening[0]);
          setSelectedMins3(data.document.Evening[1]);

          setSelectedHours4(data.document.Night[0]);
          setSelectedMins4(data.document.Night[1]);
        } else {
          insertTime();
        }
      } catch (error) {
        console.error('Error fetching data from MongoDB:', error);

      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    initializeLiff();
  },
    []);

  useEffect(() => {
    findTime();
  }, [userID]);

  if (loading) {
    return <Variants />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px', alignItems: 'center' }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#A8E3F0',
            borderRadius: '15px',
            marginBottom: '25px'
          }}>
          <Toolbar sx={{ display: 'flex', gap: '50px', width: '100%', marginLeft: '10px', position: 'relative', }}>
            <Avatar
              alt="Remy Sharp"
              src={pictureUrl}
              sx={{ width: '36px', height: '36px', marginLeft: '5px' }} />
            <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold', width: '100%' }}>
              ตั้งค่าการแจ้งเตือน
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          bgcolor: '#3B5998',
          width: '200px',
          minHeight: '50px',
          zIndex: '1'
        }}>
          <Typography component="div" variant="h4" sx={{ color: 'white' }}>
            {Morning}
          </Typography>
        </Card>

        <Card sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          bgcolor: '#A8E3F0',
          minWidth: '310px',
          position: 'relative',
          top: '-15px',
          minHeight: '100px'

        }}>
          {/* sx={{ flex: '1 0 auto', marginRight: '10px', display: 'flex', flexDirection: 'column'}} */}
          <CardContent sx={{ position: 'relative ' }}>
            <Typography component="div" variant="h5">
              {selectedHours1} : {selectedMins1}
            </Typography>
          </CardContent>
          <SvgIcon onClick={() => handleClickOpen(Morning, selectedHours1, selectedMins1)} sx={{ bgcolor: '#3B5998', color: 'white', padding: '5px', borderRadius: '100%', position: 'absolute', right: '70px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </SvgIcon>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          bgcolor: '#3B5998',
          width: '200px',
          minHeight: '50px',
          zIndex: '1'
        }}>
          <Typography component="div" variant="h4" sx={{ color: 'white' }}>
            {Noon}
          </Typography>
        </Card>

        <Card sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          bgcolor: '#A8E3F0',
          minWidth: '310px',
          position: 'relative',
          top: '-15px',
          minHeight: '100px'

        }}>
          {/* sx={{ flex: '1 0 auto', marginRight: '10px', display: 'flex', flexDirection: 'column'}} */}
          <CardContent sx={{ position: 'relative ' }}>
            <Typography component="div" variant="h5">
              {selectedHours2} : {selectedMins2}
            </Typography>
          </CardContent>
          <SvgIcon onClick={() => handleClickOpen(Noon, selectedHours2, selectedMins2)} sx={{ bgcolor: '#3B5998', color: 'white', padding: '5px', borderRadius: '100%', position: 'absolute', right: '70px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </SvgIcon>
        </Card>
      </div>


      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          bgcolor: '#3B5998',
          width: '200px',
          minHeight: '50px',
          zIndex: '1'
        }}>
          <Typography component="div" variant="h4" sx={{ color: 'white' }}>
            {Evening}
          </Typography>
        </Card>

        <Card sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          bgcolor: '#A8E3F0',
          minWidth: '310px',
          position: 'relative',
          top: '-15px',
          minHeight: '100px'

        }}>
          {/* sx={{ flex: '1 0 auto', marginRight: '10px', display: 'flex', flexDirection: 'column'}} */}
          <CardContent sx={{ position: 'relative ' }}>
            <Typography component="div" variant="h5">
              {selectedHours3 ? selectedHours3 : ""} : {selectedMins3 ? selectedMins3 : ""}
            </Typography>
          </CardContent>
          <SvgIcon onClick={() => handleClickOpen(Evening, selectedHours3, selectedMins3)} sx={{ bgcolor: '#3B5998', color: 'white', padding: '5px', borderRadius: '100%', position: 'absolute', right: '70px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </SvgIcon>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          bgcolor: '#3B5998',
          width: '200px',
          minHeight: '50px',
          zIndex: '1'
        }}>
          <Typography component="div" variant="h4" sx={{ color: 'white' }}>
            {Night}
          </Typography>
        </Card>

        <Card sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          bgcolor: '#A8E3F0',
          minWidth: '310px',
          position: 'relative',
          top: '-15px',
          minHeight: '100px'

        }}>
          {/* sx={{ flex: '1 0 auto', marginRight: '10px', display: 'flex', flexDirection: 'column'}} */}
          <CardContent sx={{ position: 'relative ' }}>
            <Typography component="div" variant="h5">
              {selectedHours4 ? selectedHours4 : ""} : {selectedMins4 ? selectedMins4 : ""}
            </Typography>
          </CardContent>
          <SvgIcon onClick={() => handleClickOpen(Night, selectedHours4, selectedMins4)} sx={{ bgcolor: '#3B5998', color: 'white', padding: '5px', borderRadius: '100%', position: 'absolute', right: '70px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </SvgIcon>
        </Card>
      </div>

      <CustomizedDialogs open={open} onClose={handleClose} time={selectedTime} LineID={userID} hoursprev={selectedHours} minsprev={selectedMins} refreshData={findTime} />
    </div>
  );
}

export default NotiManagePage;
