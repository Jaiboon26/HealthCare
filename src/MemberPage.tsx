import { useEffect, useState, useRef } from "react";
import liff from "@line/liff";
import React from "react";
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Divider, Fab, IconButton } from "@mui/material";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SvgIcon from '@mui/material/SvgIcon';
import { FindModule } from "./Database_Module/FindModule";
import { FindModuleMultiple } from "./Database_Module/FindModuleMultiple";
import { useNavigate } from "react-router-dom";
import { UpdateModulePull } from "./Database_Module/UpdateModulePull";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddCircleIcon from '@mui/icons-material/AddCircle';



const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
};

interface User {
  LineID: string;
  Picture: string;
  Name: string;
  // Add other properties as needed
}

interface DeleteParam {
  DataDelete: string;
}


function MemberPage() {
  // const [userIDManage, setUserIDManage] = useState([])
  const [userIDManage, setUserIDManage] = useState<string[]>([]); // Explicitly specify string[] type
  const [eachUser, setEachUser] = useState([])

  const [pictureUrl, setPictureUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userID, setUserID] = useState("");


  const initializeLiff = async () => {
    try {
      await liff.init({
        liffId: "2003049267-Ory1R5Kd"
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


      setDisplayName(userDisplayName);
      setUserID(userProfile);
      setPictureUrl(userPictureUrl ?? "");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    initializeLiff();
  }, []);


  let navigate = useNavigate();
  // const routeChange = () => {
  //   let path = `/MemberPage/AddMember`;
  //   navigate(path);
  // }

  const routeChange = (userID: string) => {
    // if (userID === null) {
    //   return
    // }
    // else {
    //   navigate(`/MemberPage/AddMember/${userID}`);
    // }
    navigate(`/MemberPage/AddMember/${userID}`);
  };


  const handleEdit = (client_id: string, client_pic: string, client_name: string) => {
    const encodedPic = encodeURIComponent(client_pic);
    navigate(`/MemberPage/MedicDetailPage/${client_id}/${encodedPic}/${client_name}`);
  };

  const NotiEdit = (client_id: string, client_pic: string, client_name: string) => {
    const encodedPic = encodeURIComponent(client_pic);
    navigate(`/MemberPage/NotiManagePage/${client_id}/${encodedPic}/${client_name}`);
  };



  const findProfile = async () => {
    try {
      const response = await FindModule({
        collection: "ManageUser",
        database: "HealthCare",
        filter: { LineID: userID }, //Change to liff
      });

      // Access the data property from the response
      const responseData = response.data;
      // console.log(responseData);

      if (responseData && responseData.document) {
        setUserIDManage(responseData.document.User);
        console.log(userIDManage);
        // updateMedic();
        // console.log(Object.keys(data.document.User).length);
      } else {
        console.log("Not found");
        // insertMedic();
        // initialUser();
      }

      // Continue with your logic here
    } catch (error) {
      // Handle errors
      console.error('Error in findProfile:', error);
    }
  }

  const DeleteUser = async ({ DataDelete }: DeleteParam) => {
    try {
      const response = await UpdateModulePull({
        collection: "ManageUser",
        database: "HealthCare",
        filter: { LineID: userID },
        data: DataDelete,
      });

      // Access the data property from the response
      const responseData = response.data;
      console.log(responseData);

      if (responseData && responseData.documents) {
        console.log(responseData.documents);
        // setEachUser(responseData.documents);

      } else {
        console.log("Not found");
        // console.log(userID);
      }
      // Continue with your logic here
      findProfile();
    } catch (error) {
      // Handle errors
      console.error('Error in findProfile:', error);
    }
  }


  const findManageUser = async () => {
    try {
      const response = await FindModuleMultiple({
        collection: "User",
        database: "HealthCare",
        filter: { LineID: { $in: userIDManage } },
      });

      // Access the data property from the response
      const responseData = response.data;
      console.log(responseData);

      if (responseData && responseData.documents) {
        console.log(responseData.documents);
        setEachUser(responseData.documents);

      } else {
        console.log("Not found");
        // console.log(userID);
      }
      // Continue with your logic here
    } catch (error) {
      // Handle errors
      console.error('Error in findProfile:', error);
    }
  }


  useEffect(() => {
    findProfile();
  }, [userID])


  useEffect(() => {
    findManageUser();
  }, [userIDManage])

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px' }}>
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
            <Toolbar sx={{ display: 'flex', gap: '50px' }}>
              <Avatar
                alt={displayName}
                src={pictureUrl}
                sx={{ width: '36px', height: '36px' }} />
              <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                ดูข้อมูลสมาชิกที่ดูแล
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>

        {eachUser.map((users: User) => (
          <Card sx={{
            display: 'flex',
            height: "auto",
            alignItems: 'center',
            justifyContent: 'center',
            gap: "20px",
            bgcolor: '#A8E3F0',
            minWidth: '310px',
          }}>
            <Avatar
              alt={users.Name}
              src={users.Picture}
              sx={{ width: '48px', height: '48px', marginLeft: '10px' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '250px', }}>
              <CardContent sx={{ flex: '1 0 auto', marginRight: '10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Typography component="div" variant="subtitle1">
                  {users.Name}
                </Typography>
              </CardContent>
              <ButtonGroup variant="text" aria-label="text button group"
                sx={{ marginBottom: '20px' }}>
                <IconButton aria-label="delete" onClick={() => handleEdit(users.LineID, users.Picture, users.Name)}>
                  <EditIcon sx={{ bgcolor: '#3B5998', color: 'white', padding: '5px', borderRadius: '100%' }} />
                </IconButton>


                <IconButton aria-label="delete" onClick={() => NotiEdit(users.LineID, users.Picture, users.Name)}>
                  <NotificationsIcon sx={{ bgcolor: '#3B5998', color: 'white', padding: '5px', borderRadius: '100%' }} />
                </IconButton>


                <IconButton aria-label="delete" onClick={() => DeleteUser({ DataDelete: users.LineID })}>
                  <DeleteIcon sx={{ bgcolor: 'red', color: 'white', padding: '5px', borderRadius: '100%' }} />
                </IconButton>
              </ButtonGroup>
            </Box>
          </Card>
        ))}

      </div>
      <Box sx={{
        '& > :not(style)': { m: 1 },
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
      }}>
        {userID !== "" && (
          <Fab color="primary" sx={{ padding: '20px' }} aria-label="add" onClick={() => { routeChange(userID) }}>
            <AddCircleIcon sx={{ fontSize: '50px' }} />
          </Fab>
        )}
      </Box>
    </>
  );
}

export default MemberPage;
