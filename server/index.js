import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDb from "./config/db.js";  

dotenv.config(); 

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 5000;

console.log("Starting the application...");

connectDb()
  .then(() => {
    console.log("Database connected successfully.");
    // Uncomment these once your routes are working
    // app.use("/api/auth", authRouter);
    // app.use("/api/", todoRouter);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
