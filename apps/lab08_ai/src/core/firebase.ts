import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXUY4i-F0A5PIw6knXmEpL9NrwPCw5AAE",
  authDomain: "mobileappautehn2568.firebaseapp.com",
  projectId: "mobileappautehn2568",
  storageBucket: "mobileappautehn2568.firebasestorage.app",
  messagingSenderId: "460009144120",
  appId: "1:460009144120:web:a1f797ca8451a5d9a84bcd",
  measurementId: "G-XDKWSDHB6Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);