import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBn4hmH0x583sKwfdRRrl0-IyVd4PLEH-4",
    authDomain: "datanyx-2e035.firebaseapp.com",
    projectId: "datanyx-2e035",
    storageBucket: "datanyx-2e035.firebasestorage.app",
    messagingSenderId: "506700731752",
    appId: "1:506700731752:web:f49499d78b6e417256f2dd"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 