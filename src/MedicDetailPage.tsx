import React, { useEffect, useRef, useState } from "react";
import liff from "@line/liff";
import { Box, AppBar, Toolbar, Avatar, Typography, ButtonGroup, Card, CardContent, IconButton, SvgIcon, Checkbox, FormControlLabel, FormGroup, Modal } from "@mui/material";
import { FindModule } from "./Database_Module/FindModule";
import { useNavigate } from "react-router-dom";
import { UpdateModulePull } from "./Database_Module/UpdateModulePull";
import { getAccessToken } from "./connectDB";
import axios from "axios";
import { FindModuleMultiple } from "./Database_Module/FindModuleMultiple";


interface Medic {
  MedicID: string;
  MedicName: string;
  MedicDate: { [key: string]: boolean }[];
  Morning: boolean;
  Noon: boolean;
  Evening: boolean;
  afbf: string;
  MedicPicture: string;
  stock: Int32List;
  Status: string;
  // Add other properties as needed
}

interface DeleteParam {
  DataDelete: string;
}

const shortDayNames: { [key: string]: string } = {
  Monday: 'จ',
  Tuesday: 'อ',
  Wednesday: 'พ',
  Thursday: 'พฤ',
  Friday: 'ศ',
  Saturday: 'ส',
  Sunday: 'อา'
};

function MedicDetailPage() {

  const [mediclist, setMediclist] = useState<Medic[]>([]); // Initialize as an empty array of type Medic[]
  const [userID, setUserID] = useState("");
  const [userPIC, setUserPIC] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [getMedic, setGetMedic] = useState([]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // setUserID("Uc1e97d3b9701a31fba1f9911852eeb8f");

  const DeleteMedic = async (medicName: string) => {
    try {
      const accessToken = await getAccessToken();

      const responseFind = await axios.post(
        'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/updateOne',
        {
          collection: "MedicDetail",
          database: "HealthCare",
          dataSource: 'HealthCareDemo',
          filter: {
            "Medicine.MedicName": medicName,
            "LineID": userID
          },
          update: {
            $pull: {
              'Medicine': medicName
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

    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      // You might want to throw the error or handle it differently based on your needs
      throw error;
    }
  }

  const findMedicine = async () => {
    try {
      const response = await FindModule({
        collection: "MedicDetail",
        database: "HealthCare",
        filter: { LineID: userID }, //Change to liff
      });

      // Access the data property from the response
      const responseData = response.data;
      // console.log(responseData);

      if (responseData) {
        const medicineList = responseData.document.Medicine || []; // Use empty array if Medicine is undefined
        setGetMedic(medicineList);
        console.log(getMedic);
        // setMediclist(getMedic);
      } else {
        console.log("Not found");
      }

      // Continue with your logic here
    } catch (error) {
      // Handle errors
      console.error('Error in findProfile:', error);
    }
  }


  const medicinelist = async () => {
    try {
      const response = await FindModuleMultiple({
        collection: "MedicineList",
        database: "HealthCare",
        filter: { MedicID: { $in: getMedic } },
      });

      // Access the data property from the response
      const responseData = response.data;
      // console.log(responseData);

      if (responseData && responseData.documents) {
        console.log(responseData.documents);
        setMediclist(responseData.documents);
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


  const navigate = useNavigate();

  const handleEdit = (medicName: string) => {
    navigate(`/EditMedicPage/${medicName}`);
  };

  const initializeLiff = async () => {
    try {
      await liff.init({
        liffId: "2003049267-WEBrp8Z1"
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
      setUserPIC(userPictureUrl ?? "");


    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    initializeLiff();
    // findMedicine();
    // medicinelist();
  }, [])

  useEffect(() => {
    findMedicine();
    console.log(userID);
  }, [userID])

  useEffect(() => {
    medicinelist();
  }, [getMedic])


  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setModalOpen(false);
    }
  }

  useEffect(() => {
    if (modalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalOpen]);



  //Uc1e97d3b9701a31fba1f9911852eeb8f


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px' }}>
      <Box sx={{ flexGrow: 1 }}>
        {/* <AppBar position="static"
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
            alt="Test"
            src="https://placehold.co/600x400"
            sx={{ width: '36px', height: '36px', marginLeft: '25px' }} />
          <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold', width: '100%' }}>
            ข้อมูลรายการยา
          </Typography>
        </Toolbar>
      </AppBar> */}
        <AppBar position="static" sx={{
          bgcolor: '#A8E3F0', borderRadius: '15px', marginBottom: '25px'
        }}>
          <Toolbar sx={{ justifyContent: 'center' }}> {/* Center content horizontally */}
            <Avatar
              alt={userID}
              src={userPIC}
              sx={{ width: '36px', height: '36px', marginRight: '10px' }} /> {/* Adjust margin if necessary */}
            <Typography variant="h6" component="div" sx={{ color: 'black', fontWeight: 'bold' }}>
              ข้อมูลรายการยา
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      {mediclist.map((medic: Medic) => (
        <div key={medic.MedicID} style={{ overflow: 'hidden', border: '2px dashed #a8e3f0' }}>

          <Card sx={{
            display: 'grid',
            gridTemplateRows: 'auto auto', // Two rows of auto height
            gridTemplateColumns: 'auto auto',
            height: "auto",
            alignItems: 'center',
            justifyContent: 'center',
            // bgcolor: '#A8E3F0',
            boxShadow: '0px 0px 4px 2px #A8E3F0, 0px 1px 1px 0px #A8E3F0, 0px 1px 3px 0px #A8E3F0',
            minWidth: '310px',
            position: 'relative',
          }}>
            <button
              onClick={() => {
                setModalOpen(true); // Open the modal
                setSelectedImage(medic.MedicPicture); // Set the selected image URL
              }}
              style={{ background: 'none', border: 'none', padding: '0', margin: '0', cursor: 'pointer' }}
            >
              <Avatar
                alt={medic.MedicName}
                src={medic.MedicPicture}
                sx={{ width: '75px', height: '75px', marginLeft: '10px', marginTop: '10px', borderRadius: '0px' }}
              />
            </button>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <IconButton aria-label="edit" sx={{ position: 'absolute', top: '0', right: '0' }} onClick={() => handleEdit(medic.MedicID)}>
                <SvgIcon sx={{ bgcolor: '#3B5998', color: 'white', padding: '5px', borderRadius: '100%' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </SvgIcon>
              </IconButton>
              <CardContent sx={{ flex: '1 0 auto', marginRight: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <Typography component="div" variant="h5">
                  {medic.MedicName}
                </Typography>
                {medic.afbf === "After" ? (
                  <Typography variant="subtitle2">กินหลังอาหาร</Typography>
                ) : (
                  <Typography variant="subtitle2">กินก่อนอาหาร</Typography>
                )}

                <Typography variant="subtitle2">คงเหลือ {medic.stock} เม็ด</Typography>
              </CardContent>
            </Box>
            <div style={{ gridRow: 'span 2', gridColumn: '1 / span 2', margin: '2px' }}> {/* Merge second column to 1 row */}
              <p style={{ margin: '2px' }}>วันที่รับประทานยา : {' '}
                {Object.entries(medic.MedicDate)
                  .filter(entry => entry[1]) // Filter out the entries where the value is true
                  .map(([day, _]) => shortDayNames[day]) // Map to the short day names
                  .join(', ') // Join the short day names with comma
                }
              </p>
            </div>

            <FormGroup style={{ display: "flex", flexDirection: "row", gridColumn: '1 / span 2', justifyContent: 'center' }}>
              <FormControlLabel control={<Checkbox checked={medic.Morning} />} label="เช้า" />
              <FormControlLabel control={<Checkbox checked={medic.Noon} />} label="กลางวัน" />
              <FormControlLabel control={<Checkbox checked={medic.Evening} />} label="เย็น" />
            </FormGroup>
          </Card>

        </div>
      ))}
      {/* {modalOpen && selectedImage && (
        <div ref={modalRef} style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
          <div ref={modalRef} style={{ position: 'absolute', top: '25%' }}>
            <img src={selectedImage} alt="Selected Image" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '5px' }} />
            <button onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )} */}

      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setModalOpen(false)} // Close modal when clicking anywhere
        >
          <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '80%', borderRadius: '5px' }}>
            <img src={selectedImage ?? undefined} alt="Selected Image" style={{ width: '100%', height: '100%', borderRadius: '5px' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicDetailPage;
