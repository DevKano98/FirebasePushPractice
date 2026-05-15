import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAqUi_q3QfbqK8vo4fr__4O-zwuPASmwCs",
  authDomain: "message-b05e4.firebaseapp.com",
  projectId: "message-b05e4",
  storageBucket: "message-b05e4.firebasestorage.app",
  messagingSenderId: "828209427256",
  appId: "1:828209427256:web:dbc67d8d0ee23a72e687cd"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
