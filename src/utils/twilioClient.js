import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
console.log("process.env.TWILIO_PHONE,",process.env.TWILIO_PHONE,);

export const sendReminderCall = async (to, message) => {
  try {
    await client.calls.create({
      to: `+91${to}`,
      from: process.env.TWILIO_PHONE,
      twiml: `<Response><Say>${message}</Say></Response>`,
    });
    console.log(`📞 Reminder call sent to ${to}`);
  } catch (err) {
    console.error("Error sending call:", err.message);
  }
};
