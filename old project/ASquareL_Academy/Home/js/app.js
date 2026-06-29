// At the top of your Capstone app.js file

import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 1. The Security Guard
// This checks if the user has a valid Firebase session ticket.
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in! Let them see the app.
    console.log("Access Granted to:", user.email);
  } else {
    // User is NOT logged in! Kick them back to the login page immediately.
    window.location.href = "../../login.html"; // Adjust this path if needed
  }
});

// 2. The Logout Button Logic (Attach this to a "Logout" button in your HTML)
/* document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        // Sign-out successful, the onAuthStateChanged above will catch this and kick them out!
    });
});
*/