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
import axios from "axios";
import Slide from '@mui/material/Slide'
import { FindModule } from "./Database_Module/FindModule";
import { FindModuleMultiple } from "./Database_Module/FindModuleMultiple";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./Database_Module/firebase";
import { v4 } from "uuid";
import { UpdateModule } from "./Database_Module/UpdateModule";

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

const daysOfWeek = [
  ['Sunday', 'วันอาทิตย์ (Sunday)', 'อา'],
  ['Monday', 'วันจันทร์ (Monday)', 'จ'],
  ['Tuesday', 'วันอังคาร (Tuesday)', 'อ'],
  ['Wednesday', 'วันพุธ (Wednesday)', 'พ'],
  ['Thursday', 'วันพฤหัสบดี (Thursday)', 'พฤ'],
  ['Friday', 'วันศุกร์ (Friday)', 'ศ'],
  ['Saturday', 'วันเสาร์ (Saturday)', 'ส'],
];


function EditMedicPage() {
  const { medicID } = useParams<{ medicID: string }>();
  const { username } = useParams<{ username: string }>();
  const { userID } = useParams<{ userID: string }>();

  const [medicName, setMedicName] = useState(medicID);
  const [userPIC, setUserPIC] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [medicDate, setMedicDate] = useState([]);

  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [urlImage, setUrlImage] = useState("");

  const [open, setOpen] = useState(true);

  const [checked, setChecked] = useState(false);
  const [checkedFail, setCheckedFail] = useState(false);

  const [personName, setPersonName] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [allday, setAllday] = useState(false);
  const [checkDay, setCheckDay] = useState<{ [key: string]: boolean }>({});


  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userInList, setUserInList] = useState([]);

  const [eachUser, setEachUser] = useState([]);

  const currentDate = new Date().toLocaleDateString('th-TH');
  const currentTime = new Date().toLocaleTimeString('th-TH');

  const [morning, setMorning] = useState(false);
  const [noon, setNoon] = useState(false);
  const [evening, setEvening] = useState(false);
  const [night, setNight] = useState(false);
  const [afbf, setAfbf] = useState("Before");
  const [halfUnit, setHalfUnit] = useState(false);
  const [stock, setStock] = useState(0);


  const [file, setFile] = useState<File | null>(null);
  // const [test, setTest] = useState(Blob)

  const [previewUrl, setPreviewUrl] = useState("https://placehold.co/600x400.png");

  const navigate = useNavigate();


  useEffect(() => {
    // console.log("Received medicName:", medicName);
  }, [medicName]);

  useEffect(() => {
    findMedic();
  }, [userID])

  const uploadFile = async () => {
    if (imageUpload == null) {
      UpdateMedic(previewUrl)
      insertHistoryMedic(previewUrl)
    }
    else {

      const imageRef = ref(storage, `${userID}/${imageUpload.name + v4()}`);
      try {
        const snapshot = await uploadBytes(imageRef, imageUpload);
        const url = await getDownloadURL(snapshot.ref);
        setImageUrls((prev) => [...prev, url]);
        console.log("Success");
        setUrlImage(url);
        console.log(url); // This will log the updated URL
        if (url != null) {
          UpdateMedic(url);
          insertHistoryMedic(url); // Pass the URL directly to the UpdateMedic function
        } else {
          console.log("Error: Image URL not defined");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const insertHistoryMedic = async (url: string) => {


    let adjustedStock = stock;
    if (halfUnit === true) {
      adjustedStock = stock * 2;
    }
    else {
      adjustedStock = stock / 2;
    }

    try {
      const accessToken = await getAccessToken();
      const responseFind = await axios.post('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/insertOne', {
        collection: 'UpdateHistory',
        database: 'HealthCare',
        dataSource: 'HealthCareDemo',
        document: {
          MedicID: medicID,
          MedicName: medicName,
          MedicDate: checkDay,
          Morning: morning,
          Noon: noon,
          Evening: evening,
          Night: night,
          afbf: afbf,
          HalfUnit: halfUnit,
          stock: adjustedStock,
          MedicPicture: url,
          EditBy: username,
          EditDate: currentDate,
          EditTime: currentTime,
          Status: true
        },
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = responseFind.data;

      console.log("Response from MongoDB update:", data);


    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);

    }
  }


  const UpdateMedic = async (url: string) => {
    try {
      const accessToken = await getAccessToken();

      const newData = {
        MedicName: medicName,
        Morning: morning,
        Noon: noon,
        Evening: evening,
        Night: night,
        afbf: afbf,
        HalfUnit: halfUnit,
        stock: stock,
        MedicPicture: url,
        Status: true
      };

      let adjustedStock = stock;
      if (halfUnit === true) {
        adjustedStock = stock * 2;
      }
      else {
        adjustedStock = stock / 2;
      }

      const responseFind = await axios.post(
        'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/updateOne',
        {
          collection: 'MedicineList',
          database: "HealthCare",
          dataSource: 'HealthCareDemo',
          filter: {
            "MedicID": medicID,
          },
          update: {
            $set: {
              MedicName: medicName,
              MedicDate: checkDay,
              Morning: morning,
              Noon: noon,
              Evening: evening,
              Night: night,
              afbf: afbf,
              HalfUnit: halfUnit,
              stock: adjustedStock,
              MedicPicture: url,
              Status: true
            }
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Response from MongoDB update:", responseFind.data);
      setChecked(true);
      setTimeout(() => {
        setChecked(false);
        // navigate('/MedicDetailPage');
        navigate(-1);
      }, 3000);

    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      throw error;
    }
  };


  const findMedic = async () => {
    try {
      const response = await FindModule({
        collection: "MedicineList",
        database: "HealthCare",
        filter: { "MedicID": medicID }, //Change to liff M-240419212944024-7426856
      });

      // Access the data property from the response
      const responseData = response.data;
      // console.log(responseData);

      if (responseData && responseData.document) {
        // setUserIDManage(responseData.document);
        setMedicName(responseData.document.MedicName);
        setCheckDay(responseData.document.MedicDate);
        setPreviewUrl(responseData.document.MedicPicture);
        setMorning(responseData.document.Morning);
        setNoon(responseData.document.Noon);
        setEvening(responseData.document.Evening);
        setNight(responseData.document.Night);
        setHalfUnit(responseData.document.HalfUnit);
        setAfbf(responseData.document.afbf);
        setStock(responseData.document.stock);
        // console.log(responseData.checkDay);

        const initialSelectedDays = Object.entries(responseData.document.MedicDate)
          .filter(entry => entry[1]) // Filter out the entries where the value is true
          .map(([day, _]) => day); // Map to the day names
        setSelectedDays(initialSelectedDays);


        // console.log(selectedDays);
      } else {
        console.log("Not found");
      }

      // Continue with your logic here
    } catch (error) {
      // Handle errors
      console.error('Error in findProfile:', error);
    }
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

  const EventNight = () => {
    setNight(!night)
  }

  const HandleHalfUnit = () => {
    setHalfUnit(!halfUnit)
  }

  const handleBeforeClick = () => {
    setAfbf('Before');
  };

  const handleAfterClick = () => {
    setAfbf('After');
  };

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

  // useEffect(() => {
  //   console.log(selectedDays);
  //   console.log(checkDay);
  // }, [selectedDays])

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
    // console.log(checkDay)
  }, [selectedDays]);

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
          value={medicName}
          required
          onChange={(e) => { setMedicName(e.target.value) }} />

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
            style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <Button variant={morning === true ? 'contained' : 'outlined'} onClick={EventMorning}>เช้า</Button>
            <Button variant={noon === true ? 'contained' : 'outlined'} onClick={EventNoon}>กลางวัน</Button>
            <Button variant={evening === true ? 'contained' : 'outlined'} onClick={EventEvening}>เย็น</Button>
            <Button variant={night === true ? 'contained' : 'outlined'} onClick={EventNight}>ก่อนนอน</Button>
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

        <div className="HalfUnitGroup" style={{ marginBottom: '20px' }}>
          <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold', width: '100%' }}>
            กินครั้งละ
          </Typography>
          <div className="btgroup" style={{ display: 'flex', flexDirection: 'row', gap: '60px' }}>
            <Button variant={halfUnit === false ? 'contained' : 'outlined'} onClick={HandleHalfUnit}>
              1 เม็ด
            </Button>
            <Button variant={halfUnit === true ? 'contained' : 'outlined'} onClick={HandleHalfUnit}>
              ครึ่งเม็ด <p style={{ color: 'red' }}>*ถ้าเลือกครึ่งเม็ด ยาจะถูก x2</p>
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
        <div className="submitButton" style={{ marginBottom: '100px' }}>
          <Button variant="contained" fullWidth onClick={uploadFile}>
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
export default EditMedicPage;

