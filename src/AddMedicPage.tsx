import { useEffect, useState, useRef } from "react";
import liff from "@line/liff";
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Alert, Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { SelectChangeEvent } from '@mui/material/Select';
import { getAccessToken } from "./connectDB";
import axios, { all } from "axios";
import Slide from '@mui/material/Slide'
import { FindModule } from "./Database_Module/FindModule";
import { FindModuleMultiple } from "./Database_Module/FindModuleMultiple";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./Database_Module/firebase";
import { v4 } from "uuid";

interface User {
  LineID: string;
  Picture: string;
  Name: string;
  // Add other properties as needed
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// const days = [
//   'วันอาทิตย์ (Sunday)',
//   'วันจันทร์ (Monday)',
//   'วันอังคาร (Tuesday)',
//   'วันพุธ (Wednesday)',
//   'วันพฤหัสบดี (Thursday)',
//   'วันศุกร์ (Friday)',
//   'วันเสาร์ (Saturday)'
// ];

const daysOfWeek = [
  ['Sunday', 'วันอาทิตย์ (Sunday)', 'อา'],
  ['Monday', 'วันจันทร์ (Monday)', 'จ'],
  ['Tuesday', 'วันอังคาร (Tuesday)', 'อ'],
  ['Wednesday', 'วันพุธ (Wednesday)', 'พ'],
  ['Thursday', 'วันพฤหัสบดี (Thursday)', 'พฤ'],
  ['Friday', 'วันศุกร์ (Friday)', 'ศ'],
  ['Saturday', 'วันเสาร์ (Saturday)', 'ส'],
];

function AddMedicPage() {
  const [userIDChoose, setUserIDChoose] = useState("");
  const [userIDManage, setUserIDManage] = useState("");
  const [userPIC, setUserPIC] = useState("");
  const [medicName, setMedicName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const inputId = generateUniqueId();

  const [personName, setPersonName] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [allday, setAllday] = useState(false);
  const [checkDay, setCheckDay] = useState<{ [key: string]: boolean }>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  });

  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [urlImage, setUrlImage] = useState("");

  const [open, setOpen] = useState(true);

  const [checked, setChecked] = useState(false);
  const [checkedFail, setCheckedFail] = useState(false);


  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userInList, setUserInList] = useState([]);

  const [eachUser, setEachUser] = useState([]);

  const [morning, setMorning] = useState(false);
  const [noon, setNoon] = useState(false);
  const [evening, setEvening] = useState(false);
  const [afbf, setAfbf] = useState("Before");
  const [stock, setStock] = useState(0);


  const [file, setFile] = useState<File | null>(null);
  // const [test, setTest] = useState(Blob)

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

  const [userID, setUserID] = useState("");

  const uploadFile = async () => {
    if (imageUpload == null) {
      updateMedic();
      insertMedic();
    }
    else {
      const imageRef = ref(storage, `${userIDChoose}/${imageUpload.name + v4()}`);
      try {
        const snapshot = await uploadBytes(imageRef, imageUpload);
        const url = await getDownloadURL(snapshot.ref);
        setImageUrls((prev) => [...prev, url]);
        console.log("Success");
        console.log(url);
        setUrlImage(url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    updateMedic();
    insertMedic();
  }, [urlImage])


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImageUpload(selectedFile);
      // setUserid("Test");
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  const initializeLiff = async () => {
    try {
      await liff.init({
        liffId: "2004903683-QpWDzDk1"
      });

      if (!liff.isLoggedIn()) {
        await liff.login();
      }

      fetchUserProfile();
    } catch (error) {
      console.error("LIFF initialization failed:", error);
      // You can set an error state here or display an error message
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
      setUserIDChoose(userProfile);
      setUserPIC(userPictureUrl ?? "");
    } catch (err) {
      console.error(err);
    }
  }


  const handleUser = (e: SelectChangeEvent) => {
    setUserIDChoose(e.target.value as string);
    // console.log(userID)
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

  function generateUniqueId() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Extract the last two digits of the year
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure month is two digits
    const day = ('0' + date.getDate()).slice(-2); // Ensure day is two digits
    const hours = ('0' + date.getHours()).slice(-2); // Ensure hours is two digits
    const minutes = ('0' + date.getMinutes()).slice(-2); // Ensure minutes is two digits
    const seconds = ('0' + date.getSeconds()).slice(-2); // Ensure seconds is two digits
    const milliseconds = ('00' + date.getMilliseconds()).slice(-3); // Ensure milliseconds is three digits

    const randomNumber = Math.floor(1000000 + Math.random() * 9000000); // Generates a random number between 1000000 and 9999999
    const uniqueId = `M-${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}-${randomNumber}`; // Concatenate the parts

    return uniqueId;
  }

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setSelectedDays(value as string[]);

    // Update the checkDay state based on the selected days
    const updatedCheckDay: { [key: string]: boolean } = {};
    daysOfWeek.forEach((day) => {
      updatedCheckDay[day[0]] = (value as string[]).includes(day[0]);
    });
    setCheckDay(updatedCheckDay);
  };


  const handleToggleAllDays = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllday(event.target.checked);
  };

  useEffect(() => {
    console.log(selectedDays);
    console.log(checkDay);
  }, [selectedDays])

  useEffect(() => {
    if (allday === false) {
      // setSelectedDays([]);
      if (selectedDays.length === 7) {
        setSelectedDays([]);
        setCheckDay({
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false,
          Sunday: false
        });
      }
      else { return }
    } else {
      setSelectedDays([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ]);
      setCheckDay({
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: true,
        Sunday: true
      });
    }
  }, [allday]);

  useEffect(() => {
    if (selectedDays.length !== 7) {
      setAllday(false);
    }
    else if (selectedDays.length === 7) {
      setAllday(true);
    }
  }, [selectedDays]);



  const updateMedic = async () => {
    if (!liff.isLoggedIn()) {
      try {
        await liff.login();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const accessToken = await getAccessToken();
        // uploadFile();
        const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/updateOne', {
          collection: 'MedicDetail',
          database: 'HealthCare',
          dataSource: 'HealthCareDemo',
          filter: {
            LineID: userIDChoose,
          },
          update: {
            $push: {
              'Medicine': inputId
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
        setSelectedDays([]);
        setMedicName("");
        setAfbf("Before");
        setMorning(false);
        setNoon(false);
        setEvening(false);
        setPreviewUrl("https://placehold.co/600x400.png");
        setChecked(true);
        setStock(0);
        setTimeout(() => {
          setChecked(false);

        }, 3000);

      } catch (error) {
        console.error('Error fetching data from MongoDB:', error);

      }
    }
  }

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
        const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/insertOne', {
          collection: 'MedicineList',
          database: 'HealthCare',
          dataSource: 'HealthCareDemo',
          document: {
            MedicID: inputId,
            MedicName: medicName,
            MedicDate: checkDay,
            Morning: morning,
            Noon: noon,
            Evening: evening,
            afbf: afbf,
            stock: stock,
            MedicPicture: urlImage,
            Status: "Enable"
          },
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const data = responseFind.data;

        // console.log(data)


      } catch (error) {
        console.error('Error fetching data from MongoDB:', error);

      }
    }
  }


  const insertData = async () => {
    try {
      const accessToken = await getAccessToken();
      const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/insertOne', {
        collection: 'MedicDetail',
        database: 'HealthCare',
        dataSource: 'HealthCareDemo',
        document: {
          LineID: userID,
          Medicine: [],
        },
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = responseFind.data;

      // console.log(data)


    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);

    }
  }

  const initialUser = async () => {
    try {
      const accessToken = await getAccessToken();
      const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/insertOne', {
        collection: 'ManageUser',
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

      // console.log(data)


    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);

    }
  }

  const listUser = async () => {
    try {
      const response = await FindModule({
        collection: "ManageUser",
        database: "HealthCare",
        filter: {
          LineID: userID,
        },
      });

      // Access the data property from the response
      const responseData = response.data;
      console.log(responseData);

      if (responseData && responseData.document) {
        setUserInList(responseData.document.User);
        setUserIDManage(responseData.document.LineID);
        console.log(responseData.document.userID);
        // updateMedic();
        // console.log(Object.keys(data.document.User).length);
      } else {
        console.log("Not found");
        // insertMedic();
        initialUser();
      }
      // Continue with your logic here
    } catch (error) {
      // Handle errors
      console.error('Error in findProfile:', error);
    }
  }

  const getUser = async () => {
    try {
      const filterLineIDs = [userID, ...userInList];

      const response = await FindModuleMultiple({
        collection: "User",
        database: "HealthCare",
        filter: {
          LineID: { $in: filterLineIDs }
        },
      });

      // Access the data property from the response
      const responseData = response.data;
      console.log(responseData);

      if (responseData && responseData.documents) {
        console.log(responseData.documents);
        setEachUser(responseData.documents);

      } else {
        console.log("Not found");
        console.log(userID);
      }
    } catch (error) {
      // Handle errors
      console.error('Error in findProfile:', error);
    }
  }

  const findUser = async () => {
    try {
      const response = await FindModule({
        collection: "MedicDetail",
        database: "HealthCare",
        filter: {
          LineID: userID,
        },
      });

      // Access the data property from the response
      const responseData = response.data;
      console.log(responseData);

      if (responseData && responseData.document) {
        // console.log(data);

      } else {
        // console.log("Not found , Insert Will run");
        insertData();
      }
    } catch (error) {
      // Handle errors
      console.error('Error in findProfile:', error);
    }
  }

  useEffect(() => {
    initializeLiff();
    // console.log(userInList);
    findUser();
    listUser();
    getUser();
  }, [])

  useEffect(() => {
    findUser();
    listUser();
    getUser();
  }, [userID])

  useEffect(() => {
    getUser();
  }, [userInList]);



  async function handleSubmit(): Promise<void> {
    // throw new Error("Function not implemented.");

    if (medicName != "") {
      // insertMedic();
      uploadFile();
      await console.log(medicName, "\n", morning, "\n", noon, "\n", evening, "\n", afbf, '\n', imageUrls, '\n', userIDChoose)
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
      {message + error}
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
        {/* <InputLabel id="demo-multiple-checkbox-label" ></InputLabel> */}
        <div className="dateInput" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>วันที่รับประทานยา</Typography>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedDays}
            onChange={handleChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) =>
              (selected as string[]).map((day) => {
                const dayTranslation = daysOfWeek.find((d) => d[0] === day);
                return dayTranslation ? dayTranslation[2] : '';
              }).join(', ')
            }
            MenuProps={MenuProps}

          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day[0]} value={day[0]}>
                <Checkbox checked={selectedDays.indexOf(day[0]) > -1} />
                <ListItemText primary={day[1]} />
              </MenuItem>
            ))}
          </Select>
          <FormControlLabel
            control={<Checkbox checked={allday} onChange={handleToggleAllDays} />}
            label="กินทุกวัน"
            labelPlacement="end"
          />
        </div>
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

        <div className="stock" style={{}}>
          <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold', width: '100%' }}>
            จำนวนยา
          </Typography>
          <div style={{ display: 'flex' }}>

            <TextField
              type="number"
              // label=""
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                hideStepper: true, // Hide the step buttons
              }}
            />
            <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold', width: '100%', marginLeft: '5px', display: 'flex', alignItems: 'center' }}>
              เม็ด
            </Typography>
          </div>
        </div>

        <div className="MedPic" style={{ marginBottom: '50px' }}>
          <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold', width: '100%' }}>
            เพิ่มรูปภาพยา
          </Typography>
          <div className="MedPicBorder" style={{ width: '200px', height: '120px' }}>
            {/* <img src={imageURL} alt="MedPic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            {/* {imageUrls.map((url, index) => (
              <img key={index} src={url} alt={`Image ${index}`} />
            ))} */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button variant="contained" onClick={handleButtonClick}>
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
              value={userIDChoose}
              onChange={handleUser}
              label="selectUser"
              required
              defaultValue={userID}
            >
              {eachUser.map((users: User) => (
                <MenuItem key={users.LineID} value={users.LineID}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={users.Name} src={users.Picture} sx={{ width: '25px', height: '25px', marginRight: '10px' }} />
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
        </Box>
      </div>
    </>
  );
}
export default AddMedicPage;

