import { useEffect, useState } from "react";
import liff from "@line/liff";
import React from "react";
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Divider, Fab, IconButton, Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SvgIcon from '@mui/material/SvgIcon';

function AddMedicPage() {
  const [morning, setMorning] = useState(false);
  const [noon, setNoon] = useState(false);
  const [evening, setEvening] = useState(false);
  const [afbf, setAfbf] = useState("Before");
  // const [timeeat, setTimeeat] = useState([
  //   { Morning: morning },
  //   { Noon: noon },
  //   { Evening: evening },
  // ]);

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
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                sx={{ width: '36px', height: '36px', marginLeft: '25px' }} />
              <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold', width: '100%' }}>
                เพิ่มข้อมูลยา
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <TextField id="outlined-basic" label="ชื่อยา" variant="outlined" placeholder="กรุณากรอกชื่อยา" required />
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

        <div className="MedPic">
          <Typography component="div" variant="h6" sx={{ color: 'black', fontWeight: 'bold', width: '100%' }}>
            เพิ่มรูปภาพยา
          </Typography>
          <div className="MedPicBorder" style={{ width: '200px', height: '120px' }}>
            <img src="https://placehold.co/600x400.png" alt="MedPic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <Button variant="contained">
              อัพโหลดรูปภาพ
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
export default AddMedicPage;
