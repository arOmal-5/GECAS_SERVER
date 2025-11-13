import dotenv from "dotenv";
import { reminderJob } from "./jobs/calendarCheck.js";


dotenv.config();

console.log("🕒 Starting reminder cron job...");
reminderJob.start();
