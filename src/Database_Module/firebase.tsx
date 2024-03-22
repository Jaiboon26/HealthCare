import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA9oqtCkii8m8T9jCEr3_W9qGgr_zQddxY",
    authDomain: "imagedb-5540c.firebaseapp.com",
    projectId: "imagedb-5540c",
    storageBucket: "imagedb-5540c.appspot.com",
    messagingSenderId: "12976604691",
    appId: "1:12976604691:web:6af9acfe011d16bec221e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);