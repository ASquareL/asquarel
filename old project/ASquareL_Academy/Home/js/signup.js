// js/signup.js

// 1. Import your auth configuration from the central file
import { auth } from './firebase-config.js';
// 2. Import the specific Firebase function to create a user
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Grab DOM Elements
const signupForm = document.querySelector('#signup-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const errorBox = document.querySelector('#error-box');
const submitBtn = document.querySelector('#submit-btn');

signupForm.addEventListener('submit', (e) => {
    // Stop the page from refreshing!
    e.preventDefault();

    // Get the values the user typed
    const email = emailInput.value;
    const password = passwordInput.value;

    // Optional: Change button text so user knows it's working
    submitBtn.textContent = "Creating Account...";

    // Ask Firebase to create the user in the cloud
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // SUCCESS!
            console.log("User successfully created:", userCredential.user);
            
            // Redirect them to the dashboard or login page
            window.location.href = "login.html"; 
        })
        .catch((error) => {
            // FAILURE (e.g. Email already exists, password too short)
            console.error("Error creating user:", error);
            
            // Show the exact error message to the user in the UI
            errorBox.style.display = "block";
            errorBox.textContent = error.message.replace("Firebase:", "").trim();
            
            // Reset button text
            submitBtn.textContent = "Create Account";
        });
});