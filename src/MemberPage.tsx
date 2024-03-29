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


  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/MemberPage/AddMember`;
    navigate(path);
  }

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
    initializeLiff();
  }, []);

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
                <IconButton aria-label="delete">
                  <SvgIcon sx={{ bgcolor: '#3B5998', color: 'white', padding: '5px', borderRadius: '100%' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </SvgIcon>
                </IconButton>


                <IconButton aria-label="delete">
                  <SvgIcon sx={{ bgcolor: '#3B5998', color: 'white', padding: '5px', borderRadius: '100%' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
                    </svg>
                  </SvgIcon>
                </IconButton>


                <IconButton aria-label="delete" onClick={() => DeleteUser({ DataDelete: users.LineID })}>
                  <SvgIcon sx={{ color: 'red' }}>
                    {/* credit: plus icon from https://heroicons.com/ */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </SvgIcon>
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
        <Fab color="primary" aria-label="add" onClick={routeChange}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Fab>
      </Box>
    </>
  );
}

export default MemberPage;
