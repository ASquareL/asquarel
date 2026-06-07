// js/firebase-config.js

// 1. Import the core Firebase App tool
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// 2. Import the Firebase Authentication tool
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your exact A Square L Innovate keys
const firebaseConfig = {
  apiKey: "AIzaSyBXS2cWTKwvRItYdxyah7AfIXkJEJ3Ue7Y",
  authDomain: "a-square-l-innovate.firebaseapp.com",
  projectId: "a-square-l-innovate",
  storageBucket: "a-square-l-innovate.firebasestorage.app",
  messagingSenderId: "450051153397",
  appId: "1:450051153397:web:7c735320a3716aa67bd4bc",
  measurementId: "G-EM193KWQ0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the "auth" service so your other files can use it!
export const auth = getAuth(app);