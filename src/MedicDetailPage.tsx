import React, { useEffect, useState } from "react";
import liff from "@line/liff";
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
  const [mediclist, setMediclist] = useState<Medic[]>([]); // Initialize as an empty array of type Medic[]
  const [userID, setUserID] = useState("");
  const [userPIC, setUserPIC] = useState("");

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
    findMedicine();
    initializeLiff();
  }, [])



  //Uc1e97d3b9701a31fba1f9911852eeb8f


  return (
    { userID }
  );
}

export default MedicDetailPage;
