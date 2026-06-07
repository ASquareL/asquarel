// js/login.js

import { auth } from './firebase-config.js';
// We use 'signIn' instead of 'createUser'
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginForm = document.querySelector('#login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const errorBox = document.querySelector('#error-box');
const submitBtn = document.querySelector('#submit-btn');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    submitBtn.textContent = "Authenticating...";

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // SUCCESS! The user is verified.
            console.log("Logged in as:", userCredential.user.email);
            
            // Redirect them to the protected Capstone App (or dashboard)
            window.location.href = "courses/web-development/day24-app-logic.html"; 
        })
        .catch((error) => {
            // FAILURE (Wrong password, user doesn't exist, etc.)
            errorBox.style.display = "block";
            errorBox.textContent = "Invalid email or password.";
            submitBtn.textContent = "Secure Login";
        });
});