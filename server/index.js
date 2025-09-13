const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const todoRouter = require("./routes/todoRouter");
const authRouter = require("./routes/authRouter");
const connectDb = require("./config/db");

// Enable CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies and credentials
  })
);

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For URL-encoded data (e.g., form submissions)

// Database connection
connectDb()
  .then(() => {
    // Register routes
    app.use("/api/auth", authRouter);
    app.use("/api/", todoRouter);

    // Start the server
    app.listen(port, () => {
      console.log(`> Server is up and running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
