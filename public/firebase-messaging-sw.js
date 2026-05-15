importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyAqUi_q3QfbqK8vo4fr__4O-zwuPASmwCs",
    authDomain: "message-b05e4.firebaseapp.com",
    projectId: "message-b05e4",
    storageBucket: "message-b05e4.firebasestorage.app",
    messagingSenderId: "828209427256",
    appId: "1:828209427256:web:dbc67d8d0ee23a72e687cd"
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
