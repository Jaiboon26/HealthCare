
import { initializeApp } from "firebase/app";
import { getApp } from "firebase/app";
// import { getStorage , ref} from "firebase/storage";
import { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL, FirebaseStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA9oqtCkii8m8T9jCEr3_W9qGgr_zQddxY",
  authDomain: "imagedb-5540c.firebaseapp.com",
  projectId: "imagedb-5540c",
  storageBucket: "imagedb-5540c.appspot.com",
  messagingSenderId: "12976604691",
  appId: "1:12976604691:web:6af9acfe011d16bec221e6"
};


// Create a reference to the file we want to download
const firebaseApp = getApp();
const storage = getStorage();
const starsRef = ref(storage, '3ed70db43d62bc08720584e6b668ccaf.jpg');

// Get the download URL
getDownloadURL(starsRef)
  .then((url) => {
    // Insert url into an <img> tag to "download"
  })
  .catch((error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        break;
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
    }
  });

