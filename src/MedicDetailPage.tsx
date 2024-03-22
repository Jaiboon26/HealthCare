import { useEffect, useState } from "react";
import liff from "@line/liff";
import React from "react";
import { Box, AppBar, Toolbar, Avatar, Typography, ButtonGroup, Card, CardContent, IconButton, SvgIcon, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { FindModule } from "./Database_Module/FindModule";

interface Medic {
  MedicName: string;
  Morning: boolean;
  Noon: boolean;
  Evening: boolean;
  afbf: string;
  MedicPicture: string;
  Status: string;
  // Add other properties as needed
}

function MedicDetailPage() {
  const [mediclist, setMediclist] = useState([]);

  const findMedicine = async () => {
    try {
      const response = await FindModule({
        collection: "MedicDetail",
        database: "HealthCare",
        filter: { LineID: "Uc1e97d3b9701a31fba1f9911852eeb8f" }, //Change to liff
      });

      // Access the data property from the response
      const responseData = response.data;
      // console.log(responseData);

      if (responseData && responseData.document) {
        setMediclist(responseData.document.Medicine);
        console.log(mediclist);
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

  useEffect(() => {
    findMedicine();
  }, [])



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
        <AppBar position="static" sx={{ bgcolor: '#A8E3F0', borderRadius: '15px', marginBottom: '25px' }}>
          <Toolbar sx={{ justifyContent: 'center' }}> {/* Center content horizontally */}
            <Avatar
              alt="Test"
              src="https://placehold.co/600x400"
              sx={{ width: '36px', height: '36px', marginRight: '10px' }} /> {/* Adjust margin if necessary */}
            <Typography variant="h6" component="div" sx={{ color: 'black', fontWeight: 'bold' }}>
              ข้อมูลรายการยา
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      {mediclist.map((medic: Medic) => (
        <Card sx={{
          display: 'flex',
          height: "auto",
          alignItems: 'center',
          justifyContent: 'center',
          gap: "20px",
          // bgcolor: '#A8E3F0',
          boxShadow: '0px 0px 4px 2px #A8E3F0, 0px 1px 1px 0px #A8E3F0, 0px 1px 3px 0px #A8E3F0',
          minWidth: '310px',
        }}>
          <Avatar
            alt={medic.MedicName}
            src={medic.MedicPicture}
            sx={{ width: '48px', height: '48px', marginLeft: '10px', borderRadius: '0px' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '250px', position: 'relative' }}>
            <IconButton aria-label="edit" sx={{ position: 'absolute', top: '0', right: '0' }}>
              <SvgIcon sx={{ bgcolor: '#3B5998', color: 'white', padding: '5px', borderRadius: '100%' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </SvgIcon>
            </IconButton>
            <CardContent sx={{ flex: '1 0 auto', marginRight: '10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Typography component="div" variant="h5">
                {medic.MedicName}
              </Typography>
            </CardContent>
            <FormGroup style={{ display: "flex", flexDirection: "row" }}>
              <FormControlLabel control={<Checkbox checked={medic.Morning} />} label="เช้า" />
              <FormControlLabel control={<Checkbox checked={medic.Noon} />} label="กลางวัน" />
              <FormControlLabel control={<Checkbox checked={medic.Evening} />} label="เย็น" />
            </FormGroup>
          </Box>
        </Card>
      ))}
    </div>
  );
}

export default MedicDetailPage;
