import express from "express";
import dotenv from "dotenv";
import { reminderJob } from "./jobs/calendarCheck.js";

dotenv.config();

const app = express();

// Start cron
reminderJob.start();
console.log("Cron job started");

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port", process.env.PORT || 5000);
});
