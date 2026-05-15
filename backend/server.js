const express = require("express");
const bodyParser = require("body-parser");
const admin = require("./firebaseAdmin");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/send-notification", async (req, res) => {
  const { fcmToken, title, body } = req.body;

  if (!fcmToken || !title || !body) {
    return res.status(400).json({
      success: false,
      error: "fcmToken, title, and body are required.",
    });
  }

  const message = {
    token: fcmToken,
    notification: {
      title,
      body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    return res.json({ success: true, messageId: response });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
