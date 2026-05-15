import { useState } from "react";
import { messaging } from "./firebase";
import { getToken, isSupported } from "firebase/messaging";
import "./App.css";

const VAPID_KEY = "BPkLotODTrh5DA2Svd0UUcXOG73_jFQB3L_xDcMGh2Kk0gF3-4452zyapQ0tzMRJJg4s-DMIhqlie_5-xGU6_Q0";
const API_BASE_URL = "http://localhost:3000";

function App() {
  const [permission, setPermission] = useState(Notification.permission);
  const [fcmToken, setFcmToken] = useState("");
  const [title, setTitle] = useState("Hello from Messaging App");
  const [body, setBody] = useState("This is a test push notification.");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const ensurePushReady = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      throw new Error("Browser does not support notifications/service workers.");
    }

    const supported = await isSupported();
    if (!supported) {
      throw new Error("Firebase Messaging is not supported in this browser.");
    }

    const updatedPermission = await Notification.requestPermission();
    setPermission(updatedPermission);
    if (updatedPermission !== "granted") {
      throw new Error("Notification permission was not granted.");
    }

    await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    return navigator.serviceWorker.ready;
  };

  const handleGetToken = async () => {
    setBusy(true);
    setStatus("");
    try {
      const registration = await ensurePushReady();
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        throw new Error("FCM token not returned.");
      }

      setFcmToken(token);
      setStatus("Token generated.");
    } catch (error) {
      setStatus(`Token error: ${error.message}`);
    } finally {
      setBusy(false);
    }
  };

  const handleSendNotification = async () => {
    if (!fcmToken) {
      setStatus("Generate token first.");
      return;
    }

    setBusy(true);
    setStatus("");
    try {
      const response = await fetch(`${API_BASE_URL}/send-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fcmToken,
          title: title.trim(),
          body: body.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send notification.");
      }

      setStatus("Notification sent.");
    } catch (error) {
      setStatus(`Send error: ${error.message}`);
    } finally {
      setBusy(false);
    }
  };

  const checkBackend = async () => {
    setStatus("");
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      const data = await res.json();
      if (!res.ok) throw new Error("Backend health check failed.");
      setStatus(`Backend: ${data.status}`);
    } catch (error) {
      setStatus(`Backend unavailable: ${error.message}`);
    }
  };

  return (
    <main className="app">
      <h1>Push Notification Tester</h1>
      <p className="muted">Permission: {permission}</p>
      <p className="status">{status}</p>

      <div className="actions">
        <button type="button" onClick={checkBackend} disabled={busy}>Check Backend</button>
        <button type="button" onClick={handleGetToken} disabled={busy}>Generate FCM Token</button>
      </div>

      <label>FCM Token</label>
      <textarea value={fcmToken} readOnly rows={4} />

      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>Body</label>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} />

      <button type="button" onClick={handleSendNotification} disabled={busy}>Send Push Notification</button>
    </main>
  );
}

export default App;
