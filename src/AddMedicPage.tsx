import { useEffect, useState, useRef } from "react";
import liff from "@line/liff";
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Alert, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { SelectChangeEvent } from '@mui/material/Select';
import { getAccessToken } from "./connectDB";
import axios from "axios";
import Slide from '@mui/material/Slide'

interface User {
  LineID: string;
  Picture: string;
  Name: string;
  // Add other properties as needed
}

function AddMedicPage() {
  const [userID, setUserID] = useState("");
  const [userPIC, setUserPIC] = useState("");
  const [medicName, setMedicName] = useState("");

  const [open, setOpen] = useState(true);

  const [checked, setChecked] = useState(false);
  const [checkedFail, setCheckedFail] = useState(false);


  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userInList, setUserInList] = useState([]);

  const [eachUser, setEachUser] = useState([]);

  // const [image, setImage] = useState<string | null>(null);
  // const [imageURL, setImageURL] = useState<string | undefined>(undefined);
  // const [imageURL, setImageURL] = useState("https://placehold.co/600x400.png");

  const [morning, setMorning] = useState(false);
  const [noon, setNoon] = useState(false);
  const [evening, setEvening] = useState(false);
  const [afbf, setAfbf] = useState("Before");

  // console.log(afbf,morning,noon,evening)
  // const [timeeat, setTimeeat] = useState([
  //   { Morning: morning },
  //   { Noon: noon },
  //   { Evening: evening },
  // ]);
  // console.log(imageURL)


  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("https://placehold.co/600x400.png");

  useEffect(() => {
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    }

    reader.readAsDataURL(file)
  }, [file])

  const initializeLiff = async () => {
    try {
      await liff.init({
        liffId: "2003049267-V26KgWbE"
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
      // const userDisplayName = profile.displayName;
      // const statusMessage = profile.statusMessage;
      // const userPictureUrl = profile.pictureUrl;


      // setDisplayName(userDisplayName);
      setUserID(userProfile);
      setUserPIC(profile.pictureUrl ?? "");
      // setPictureUrl(userPictureUrl ?? "");
    } catch (err) {
      console.error(err);
    }
  };


  const handleUser = (e: SelectChangeEvent) => {
    setUserID(e.target.value as string);
    console.log(userID)
  }

  const EventMorning = () => {
    setMorning(!morning);
  }

  const EventNoon = () => {
    setNoon(!noon)
  }

  const EventEvening = () => {
    setEvening(!evening)
  }

  const handleBeforeClick = () => {
    setAfbf('Before');
  };

  const handleAfterClick = () => {
    setAfbf('After');
  };

  const insertMedic = async () => {
    if (!liff.isLoggedIn()) {
      try {
        await liff.login();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const accessToken = await getAccessToken();
        const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/updateOne', {
          collection: 'MedicDetail',
          database: 'HealthCare',
          dataSource: 'HealthCareDemo',
          filter: {
            LineID: userID,
          },
          update: {
            $push: {
              'Medicine': {
                MedicName: medicName,
                Morning: morning,
                Noon: noon,
                Evening: evening,
                afbf: afbf,
                MedicPicture: previewUrl
              }
            }
          }
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const data = responseFind.data;
        console.log(data);
        setMedicName("");
        setAfbf("Before");
        setMorning(false);
        setNoon(false);
        setEvening(false);
        setPreviewUrl("https://placehold.co/600x400.png");
        setChecked(true);
        setTimeout(() => {
          setChecked(false);
        }, 3000);

      } catch (error) {
        console.error('Error fetching data from MongoDB:', error);

      }
    }
  }

  // const updateMedic = async () => {
  //   try {
  //     const accessToken = await getAccessToken();
  //     const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/updateOne', {
  //       collection: 'MedicDetail',
  //       database: 'HealthCare',
  //       dataSource: 'HealthCareDemo',
  //       filter: {
  //         LineID: "U41f63ff091fd49143878e89736e3f976",
  //         'Medicine.MedicName': medicName
  //       },
  //       update: {
  //         $set: {
  //           'Medicine.$.Morning': morning,
  //           'Medicine.$.Noon': noon,
  //           'Medicine.$.Evening': evening,
  //           'Medicine.$.afbf': afbf,
  //           'Medicine.$.MedicPicture': previewUrl,
  //           // 'Medicine.$.Morning': false,
  //         }
  //       }
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Access-Control-Request-Headers': '*',
  //         'Authorization': `Bearer ${accessToken}`,
  //       },
  //     });

  //     const data = responseFind.data;
  //     console.log(data);

  //   } catch (error) {
  //     console.error('Error fetching data from MongoDB:', error);

  //   }
  // }

  const insertData = async () => {
    try {
      const accessToken = await getAccessToken();
      const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/insertOne', {
        collection: 'MedicDetail',
        database: 'HealthCare',
        dataSource: 'HealthCareDemo',
        document: {
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

      console.log(data)


    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);

    }
  }

  const listUser = async () => {
    try {
      const accessToken = await getAccessToken();
      const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/findOne', {
        collection: 'ManageUser',
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

      if (data && data.document && data.document.User) {
        setUserInList(data.document.User);
        console.log(data.document.User);
        // updateMedic();
        // console.log(Object.keys(data.document.User).length);
      } else {
        console.log("Not found , Insert Will run");
        // insertMedic();
      }
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);

    }
  }

  const getUser = async () => {
    try {
      // const userIds = userInList.map((userlists) => userlists);

      const accessToken = await getAccessToken();
      const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/find', {
        collection: 'User',
        database: 'HealthCare',
        dataSource: 'HealthCareDemo',
        filter: {
          LineID: { $in: [userID, ...userInList] }
        },
        // sort: { "LineID": 1 },
        // limit: 10
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = responseFind.data;
      // console.log(accessToken);

      if (data && data.documents) {
        console.log(data.documents);
        setEachUser(data.documents);

      } else {
        console.log("Not found");
        console.log(userInList);
      }
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);

    }
  }


  const findUser = async () => {

    try {
      const accessToken = await getAccessToken();
      const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/findOne', {
        collection: 'MedicDetail',
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

      if (data && data.document) {
        console.log(data);

      } else {
        console.log("Not found , Insert Will run");
        insertData();
      }
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);

    }
  };

  useEffect(() => {
    initializeLiff();
    // console.log(userInList);
  }, [])

  useEffect(() => {
    findUser();
    listUser();
  }, [userID])

  useEffect(() => {
    getUser();
  }, [userInList]);



  function handleSubmit(): void {
    // throw new Error("Function not implemented.");
    console.log(medicName, "\n", morning, "\n", noon, "\n", evening, "\n", afbf, '\n', previewUrl, '\n', userID)

    if (medicName != "") {
      insertMedic();
    }
    else {
      setCheckedFail(true);
      setTimeout(() => {
        setCheckedFail(false);
      }, 3000);
    }
  }

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
            <Toolbar sx={{ display: 'flex', gap: '50px', width: '100%', }}>
              <Avatar
                alt={userID}
                src={userPIC}
                sx={{ width: '36px', height: '36px', marginLeft: '25px' }} />
              <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold', width: '100%' }}>
                เพิ่มข้อมูลยา
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <TextField
          id="outlined-basic"
          label="ชื่อยา"
          variant="outlined"
          placeholder="กรุณากรอกชื่อยา"
          required
          value={medicName}
          onChange={(e) => {
            setMedicName(e.target.value)
          }} />
        <div className="eventgroup" style={{ marginBottom: '20px' }}>
          <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold', width: '100%' }}>
            ช่วงเวลาที่กิน
          </Typography>
          <div className="btgroup"
            style={{ display: 'flex', flexDirection: 'row', gap: '60px' }}>
            <Button variant={morning === true ? 'contained' : 'outlined'} onClick={EventMorning}>เช้า</Button>
            <Button variant={noon === true ? 'contained' : 'outlined'} onClick={EventNoon}>กลางวัน</Button>
            <Button variant={evening === true ? 'contained' : 'outlined'} onClick={EventEvening}>เย็น</Button>
          </div>
        </div>

        <div className="BfAfGroup" style={{ marginBottom: '20px' }}>
          <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold', width: '100%' }}>
            ก่อนหรือหลังอาหาร
          </Typography>
          <div className="btgroup" style={{ display: 'flex', flexDirection: 'row', gap: '60px' }}>
            <Button variant={afbf === 'Before' ? 'contained' : 'outlined'} onClick={handleBeforeClick}>
              ก่อนอาหาร
            </Button>
            <Button variant={afbf === 'After' ? 'contained' : 'outlined'} onClick={handleAfterClick}>
              หลังอาหาร
            </Button>
          </div>
        </div>

        <div className="MedPic" style={{ marginBottom: '50px' }}>
          <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold', width: '100%' }}>
            เพิ่มรูปภาพยา
          </Typography>
          <div className="MedPicBorder" style={{ width: '200px', height: '120px' }}>
            {/* <img src={imageURL} alt="MedPic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
            {previewUrl && <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];

                if (selectedFile) {
                  setFile(selectedFile);
                }
              }} />
            <Button variant="contained" onClick={() => fileInputRef.current?.click()}>
              อัพโหลดรูปภาพ
            </Button>
          </div>
        </div>

        <div className="selectUser" style={{ marginBottom: '25px', marginLeft: '-9px', marginRight: '8px' }}>
          <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">ผู้ป่วยที่ต้องการบักทึก</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={userID}
              onChange={handleUser}
              label="selectUser"
              required
              defaultValue={userID}
            >
              {eachUser.map((users: User) => (
                <MenuItem key={users.LineID} value={users.LineID}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt="User Avatar" src={users.Picture} sx={{ width: '25px', height: '25px', marginRight: '10px' }} />
                    {users.Name}
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="submitButton" style={{ marginBottom: '100px' }}>
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            ยืนยัน
          </Button>
        </div>
        <Box sx={{
          width: '100%',
          position: 'fixed',
          bottom: '0',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          {/* <FormControlLabel
            control={<Switch checked={checked} onChange={handleChange} />}
            label="Show"
          /> */}
          <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setChecked(false);
                  }}
                >
                  X
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              บันทึกข้อมูลสำเร็จ
            </Alert>
          </Slide>

          <Slide direction="up" in={checkedFail} mountOnEnter unmountOnExit>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setCheckedFail(false);
                  }}
                >
                  X
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              กรุณากรอกข้อมูลให้ครบ
            </Alert>
          </Slide>

          {/* <Button
            disabled={open}
            variant="outlined"
            onClick={() => {
              setOpen(true);
            }}
          >
            Re-open
          </Button> */}
        </Box>
      </div>
    </>
  );
}
export default AddMedicPage;
