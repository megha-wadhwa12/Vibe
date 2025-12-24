import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBnUw31BmWZPdtqj49nTVjxvcZjW3GHRjs",
  authDomain: "vibe-1609c.firebaseapp.com",
  projectId: "vibe-1609c",
  storageBucket: "vibe-1609c.firebasestorage.app",
  messagingSenderId: "633495489990",
  appId: "1:633495489990:web:309d606d7ebbf3202af6c7",
  measurementId: "G-F79YPD92Y9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);