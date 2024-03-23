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
import { FindModule } from "./Database_Module/FindModule";
import { FindModuleMultiple } from "./Database_Module/FindModuleMultiple";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./Database_Module/firebase";
import { v4 } from "uuid";
import { UpdateModule } from "./Database_Module/UpdateModule";


function EditMedicPage() {
  const { medicName } = useParams<{ medicName: string }>();
  const { userID } = useParams<{ userID: string }>();


  const [medicNameNew, setMedicNameNew] = useState(medicName);
  const [userPIC, setUserPIC] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  const navigate = useNavigate();


  useEffect(() => {
    console.log("Received medicName:", medicName);
  }, [medicName]);

  useEffect(() => {
    findMedic();
  }, [userID])

  const uploadFile = async () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `${userID}/${imageUpload.name + v4()}`);
    try {
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);
      setImageUrls((prev) => [...prev, url]);
      console.log("Success");
      setUrlImage(url);
      console.log(urlImage);
      if (urlImage != null) {
        UpdateMedic();
      }
      else {
        console.log("Error image not defind");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };



  const UpdateMedic = async () => {
    try {
      const accessToken = await getAccessToken();

      const newData = {
        MedicName: medicNameNew,
        Morning: morning,
        Noon: noon,
        Evening: evening,
        afbf: afbf,
        stock: stock,
        MedicPicture: urlImage,
        Status: "Enable"
      };

      const responseFind = await axios.post(
        'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/updateOne',
        {
          collection: 'MedicDetail',
          database: "HealthCare",
          dataSource: 'HealthCareDemo',
          filter: {
            "Medicine.MedicName": medicName,
            "LineID": userID
          },
          update: {
            $set: {
              'Medicine.$': newData
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
        navigate('/MedicDetailPage');
      }, 3000);

    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      throw error;
    }
  }

  const findMedic = async () => {
    try {
      const response = await FindModule({
        collection: "MedicDetail",
        database: "HealthCare",
        filter: { "Medicine.MedicName": medicName, "LineID": userID }, //Change to liff
      });

      // Access the data property from the response
      const responseData = response.data;
      // console.log(responseData);

      if (responseData && responseData.document) {
        // setUserIDManage(responseData.document);
        console.log(responseData.document);
        setPreviewUrl(responseData.document.Medicine[0].MedicPicture);
        setMorning(responseData.document.Medicine[0].Morning);
        setNoon(responseData.document.Medicine[0].Noon);
        setEvening(responseData.document.Medicine[0].Evening);
        setAfbf(responseData.document.Medicine[0].afbf);
        setStock(responseData.document.Medicine[0].stock);
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
          value={medicNameNew}
          required
          onChange={(e) => { setMedicNameNew(e.target.value) }} />
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

