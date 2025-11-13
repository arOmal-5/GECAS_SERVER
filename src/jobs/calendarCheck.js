import { CronJob } from "cron";
import { google } from "googleapis";
import dotenv from "dotenv";
import connectDB from "../utils/connectDB.js";
import User from "../models/User.js";
import { sendReminderCall } from "../utils/twilioClient.js";

dotenv.config();

async function checkCalendarEvents() {
  await connectDB();

  const users = await User.find({ phone: { $exists: true } });
  console.log("users:", users);

  for (const user of users) {
    try {
      const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );

      oAuth2Client.setCredentials({
        refresh_token: user.google_refresh_token,
      });

      const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
      const now = new Date();
      const next5Min = new Date(now.getTime() + 5 * 60 * 1000);

      const res = await calendar.events.list({
        calendarId: "primary",
        timeMin: now.toISOString(),
        timeMax: next5Min.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });
    


      const events = res.data.items || [];

      if (events.length > 0) {
        const event = events[0];
        console.log(`Upcoming event for ${user.email}: ${event.summary}`);
        await sendReminderCall(
          user.phone,
          `Reminder: You have an event ${event.summary} starting soon.`
        );
      }
    } catch (error) {
      console.error(`Error checking events for ${user.email}:`, error.message);
    }
  }
}

export const reminderJob = new CronJob("*/10 * * * * *", checkCalendarEvents);

