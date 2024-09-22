import express from "express";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./routes/user.js";
import rideRoutes from "./routes/ride.js";
import errorHandler from "./middleware/errorHandler.js";
import { connectDb } from "./config/dbConnection.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));

await connectDb();

app.use(express.json());
const port = process.env.PORT || 3000;

app.use(userRoutes);
app.use(rideRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use("/", (req, res) => {
  res.send("Welcome to the ride-share Server");
});
