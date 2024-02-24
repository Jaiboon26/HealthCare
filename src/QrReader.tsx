import { useEffect, useRef, useState } from "react";

// Styles
import "./components/QrStyles.css";

// Qr Scanner
import QrScanner from "qr-scanner";
import { Slide, Button, Dialog, AppBar, Toolbar, IconButton, Typography, List, ListItemButton, ListItemText, Divider, Box } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { FindModule } from "./Database_Module/FindModule";
import { InsertModule } from "./Database_Module/InsertModule";
import { UpdateModule } from "./Database_Module/UpdateModule";

import { useNavigate } from "react-router-dom";


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface FullScreenDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  DataResult: any;
}

const QrReader = () => {
  // QR States
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  const [open, setOpen] = React.useState<boolean>(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    // 🖨 Print the "result" to browser console.
    console.log(result);
    // ✅ Handle success.
    // 😎 You can do whatever you want with the scanned result.
    setScannedResult(result?.data);
    setOpen(true)
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div style={{ height: '100vh', backgroundColor: 'rgb(63, 61, 61)' }}>

      <div className="qr-reader">
        {/* QR */}
        <video ref={videoEl}></video>
        <div ref={qrBoxEl} className="qr-box">
          {/* <img
          // src={QrFrame}
          alt="Qr Frame"
          width={256}
          height={256}
          className="qr-frame"
        /> */}
        </div>

        {/* Show Data Result if scan is success */}
        {scannedResult && (
          <p
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 99999,
              color: "white",
            }}
          >
            Scanned Result: {scannedResult}
          </p>
        )}

        <h1 style={{
          position: 'relative',
          color: 'black',
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '20px',
          fontSize: '20px',
        }}>กรุณาวางกล้องให้ตรงกับ QR Code</h1>
      </div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button> */}
      <FullScreenDialog isOpen={open} handleClose={handleClose} DataResult={scannedResult} />
    </div>


  );
};

function FullScreenDialog({ isOpen, handleClose, DataResult }: FullScreenDialogProps) {

  const [displayName, setDisplayName] = useState("")
  const [pictureUrl, setPictureUrl] = useState("")

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/MemberPage`;
    navigate(path);
  }


  const findManageUser = async () => {
    try {
      const response = await FindModule({
        collection: "User",
        database: "HealthCare",
        filter: { LineID: DataResult },
      });

      // Access the data property from the response
      const responseData = response.data;
      console.log(responseData);

      if (responseData && responseData.document) {
        console.log(responseData.document);
        setDisplayName(responseData.document.Name)
        setPictureUrl(responseData.document.Picture)

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

  const UpdateUser = async () => {
    try {
      const response = await UpdateModule({
        collection: "ManageUser",
        database: "HealthCare",
        filter: { LineID: "Uc1e97d3b9701a31fba1f9911852eeb8f" },
        data: DataResult,
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

      routeChange();
    } catch (error) {
      // Handle errors
      console.error('Error in findProfile:', error);
    }
  }

  useEffect(() => {
    findManageUser();
  }, [isOpen])

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              {/* <CloseIcon /> */}X
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              ข้อมูลสมาชิกที่แสกน
            </Typography>
            {/* <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button> */}
          </Toolbar>
        </AppBar>
        <Box
          height={200}
          width={200}
          my={4}
          display="flex"
          alignItems="center"
          alignSelf="center"
          flexDirection="column"
          gap={4}
          // p={2}
          sx={{ border: '2px solid grey' }}
        >

          <img src={pictureUrl} alt={displayName} width={"100%"} height={"100%"} />
          <h1>{displayName}</h1>

          <Button variant="contained" style={{ position: 'absolute', bottom: '15%' }} onClick={UpdateUser}>เพิ่มสมาชิก</Button>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}

export default QrReader;