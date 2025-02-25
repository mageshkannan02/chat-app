const express = require("express");
const authRoute = require("../routes/auth.route");
const messageRoute = require("../routes/message.route");
const cors = require("cors");
const { app, server } = require("../lib/socket");
const { connectDB } = require("../lib/db");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const __dirname = path.resolve(); // Keep only this declaration

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const port = process.env.PORT;

app.use(bodyParser.json());
app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
