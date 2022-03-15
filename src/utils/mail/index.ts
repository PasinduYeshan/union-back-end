"use strict";
require("dotenv").config(); // read .env variables (for development)
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

const senderEmail =
  process.env.EMAIL_ADDRESS;
const emailPassword = process.env.EMAIL_PASSWORD;

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: senderEmail,
    pass: emailPassword,
  },
});

export async function sendEmail(
  email: string,
  subject: string,
  text: string,
  html = ""
) {
  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `From UPTO <${senderEmail}>`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("Email sending error", error);
  }
}

// Send email templates
export async function sendEmailTemplate(
  template: any,
  email: string,
  subject: any,
  payload: any
) {
  try {
    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = {
      from: senderEmail,
      to: email,
      subject: subject,
      html: compiledTemplate(payload),
    };
    await transporter.sendMail(options);
    console.log("Email sent");
  } catch (error) {
    console.log("Sending Template email error : ", error);
  }
}

// Export templates
import templates from "./templates";
export { templates };
