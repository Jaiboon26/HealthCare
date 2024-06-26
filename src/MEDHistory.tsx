import React, { useEffect, useRef, useState } from "react";
import liff from "@line/liff";
import { Box, AppBar, Toolbar, Avatar, Typography, ButtonGroup, Card, CardContent, IconButton, SvgIcon, Checkbox, FormControlLabel, FormGroup, Modal, Skeleton, Stack } from "@mui/material";
import { FindModule } from "./Database_Module/FindModule";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateModulePull } from "./Database_Module/UpdateModulePull";
import { getAccessToken } from "./connectDB";
import axios from "axios";
import { FindModuleMultiple } from "./Database_Module/FindModuleMultiple";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';


function Variants() {
  return (
    <Stack spacing={1}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', margin: '20px', alignItems: 'center' }}>

        <Skeleton variant="rounded" width="100%" height={60} />
        <div className="bodySkeleton" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <Skeleton variant="rounded" width="100%" height={250} />
          <Skeleton variant="rounded" width="100%" height={250} />
          <Skeleton variant="rounded" width="100%" height={250} />

        </div>
      </div>
    </Stack>
  );
}


interface Medic {
  _id: string;
  MedicID: string;
  MedicName: string;
  MedicDate: { [key: string]: boolean }[];
  Morning: boolean;
  Noon: boolean;
  Evening: boolean;
  Night: boolean;
  afbf: string;
  MedicPicture: string;
  stock: Int32List;
  Status: string;
  EditBy: string;
  EditDate: string;
  EditTime: string;
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

function MEDHistory() {

  const [mediclist, setMediclist] = useState<Medic[]>([]); // Initialize as an empty array of type Medic[]
  const { MedicID } = useParams<{ MedicID: any }>();
  const { userID } = useParams<{ userID: any }>();
  const [userPIC, setUserPIC] = useState("");
  const [medicName, setMedicName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [getMedic, setGetMedic] = useState([]);

  const [loading, setLoading] = useState(true);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // setUserID("Uc1e97d3b9701a31fba1f9911852eeb8f");


  // const findMedicine = async () => {
  //   try {
  //     const response = await FindModule({
  //       collection: "MedicDetail",
  //       database: "HealthCare",
  //       filter: { LineID: userID }, //Change to liff
  //     });

  //     // Access the data property from the response
  //     const responseData = response.data;
  //     // console.log(responseData);

  //     if (responseData) {
  //       const medicineList = responseData.document.Medicine || []; // Use empty array if Medicine is undefined
  //       setGetMedic(medicineList);
  //       console.log(getMedic);
  //       // setMediclist(getMedic);
  //     } else {
  //       console.log("Not found");
  //     }

  //     // Continue with your logic here
  //   } catch (error) {
  //     // Handle errors
  //     console.error('Error in findProfile:', error);
  //   }
  // }


  const medicinelist = async () => {
    try {
      const accessToken = await getAccessToken();

      const responseFind = await axios.post(
        'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gcfjf/endpoint/data/v1/action/find',
        {
          collection: 'UpdateHistory',
          database: 'HealthCare',
          dataSource: 'HealthCareDemo',
          filter: { MedicID: MedicID },
          sort: { _id: -1 },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      // Access the data property from the response
      const responseData = responseFind.data;
      // console.log(responseData);

      if (responseData && responseData.documents) {
        console.log(responseData.documents);
        setMediclist(responseData.documents);
        setMedicName(responseData.documents[0].MedicName);
        setLoading(false);
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

  const handleHistory = (medicName: string) => {
    navigate(`/MEDHistory/${medicName}`);
  };

  const handleDelete = (medicID: string, medicName: string, lineID: string) => {
    navigate(`/DeleteMedicPage/${medicID}/${medicName}/${lineID}`)
  };

  // useEffect(() => {
  //   findMedicine();
  //   console.log(userID);
  // }, [userID])

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


  const formatDate = (dateStr: any) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  //Uc1e97d3b9701a31fba1f9911852eeb8f

  if (loading) {
    return <Variants />
  }

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
              ประวัติการแก้ไขยา {medicName}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      {mediclist.map((medic: Medic) => (
        <div key={medic._id} style={{ overflow: 'hidden', border: '2px dashed #a8e3f0' }}>
          <Card sx={{
            display: 'grid',
            gridTemplateRows: 'auto auto', // Two rows of auto height
            gridTemplateColumns: '100px auto',
            height: "auto",
            alignItems: 'center',
            boxShadow: '0px 0px 4px 2px #A8E3F0, 0px 1px 1px 0px #A8E3F0, 0px 1px 3px 0px #A8E3F0',
            minWidth: '310px',
            position: 'relative',
          }}>
            <div className="EditBy" style={{ gridColumn: '1 / span 2', marginLeft: '10px' }}>
              <p>แก้ไขโดย : {medic.EditBy}</p>
              <p>เมื่อวันที่ : {medic.EditDate} เวลา {medic.EditTime}</p>
            </div>
            <div className="MedicIMG" style={{ justifyContent: 'right', display: 'flex' }}>
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
                  sx={{ width: '75px', height: '75px', borderRadius: '0px', border: '1px solid black' }}
                />
              </button>
            </div>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left' }}>
              <CardContent sx={{ flex: '1 0 auto', marginRight: '10px', display: 'flex', flexDirection: 'column', gap: '5px', paddingTop: 0 }}>
                <div className="MedicDetail" style={{ textAlign: 'left' }}>
                  <Typography component="div" variant="h5">
                    {medic.MedicName}
                  </Typography>
                  {medic.afbf === "After" ? (
                    <Typography variant="subtitle2">กินหลังอาหาร</Typography>
                  ) : (
                    <Typography variant="subtitle2">กินก่อนอาหาร</Typography>
                  )}
                  <Typography variant="subtitle2">คงเหลือ {medic.stock} เม็ด</Typography>
                </div>
              </CardContent>
            </Box>
            <div style={{ gridRow: 'span 2', gridColumn: '1 / span 2', margin: '2px', textAlign: 'center' }}>
              <p style={{ margin: '2px' }}>
                วันที่รับประทานยา : {' '}
                {Object.values(medic.MedicDate).filter(value => value).length === 7
                  ? 'กินทุกวัน'
                  : Object.entries(medic.MedicDate)
                    .filter(entry => entry[1]) // Filter out the entries where the value is true
                    .map(([day, _]) => shortDayNames[day]) // Map to the short day names
                    .join(', ') // Join the short day names with comma
                }
              </p>
            </div>
            <div style={{ gridColumn: '1 / span 2' }}>
              <FormGroup style={{ display: "flex", flexDirection: "row", justifyContent: 'center' }}>
                <FormControlLabel control={<Checkbox checked={medic.Morning} />} label="เช้า" />
                <FormControlLabel control={<Checkbox checked={medic.Noon} />} label="กลางวัน" />
                <FormControlLabel control={<Checkbox checked={medic.Evening} />} label="เย็น" />
              </FormGroup>
              <FormGroup style={{ display: "flex", flexDirection: "row", justifyContent: 'center' }}>
                <FormControlLabel control={<Checkbox checked={medic.Night} />} label="ก่อนนอน" />
              </FormGroup>
            </div>
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

export default MEDHistory;
