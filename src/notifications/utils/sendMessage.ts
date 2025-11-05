import nodemailer from "nodemailer";
import 'dotenv/config'
export async function sendMail(userEmail:string,subject:string,text:string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  console.log("📧 Sending email to:", userEmail);
  const info = await transporter.sendMail({
    from: `"Job Engine" <${process.env.MAIL_USER}>`,
    to: userEmail,
    subject: subject,
    text: text,
  });

  console.log("📨 Message sent:", info.messageId);
}
